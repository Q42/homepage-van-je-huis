import { AddressRecord } from "./apiSchema/addressRecord";
import { PastData } from "./apiSchema/past";
import { AgendaItem, PresentData } from "./apiSchema/present";
import { crawlerConfigs, csvIngestSources, devMode, pipelineConfig as pc, pipelineConfig } from "./pipelineConfig";
import { DuckDBService } from "./src/lib/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";
import { queries } from "./src/lib/queries";

import { generateAddressID, assembleApiRecord, getMinMaxRangeFromPastData } from "./src/utils/api";

import { checkFilePaths, createDirectory, measureExecutionTime, writeObjectToJsonFile } from "./src/utils/general";
import { stringLibrary } from "./src/lib/strings";
import { CrawlerConfig, CsvIngestSource, EnrichedDBAddress } from "./src/lib/types";

const duckDBService = new DuckDBService();

async function generateAPI() {
    await duckDBService.initDb({ dbLocation: ":memory:" });
    await duckDBService.enableSpatialExtension();

    const sources: (CsvIngestSource | CrawlerConfig)[] = [
        ...Object.values(csvIngestSources),
        ...Object.values(crawlerConfigs)
    ];

    const sourcePaths = sources.map(
        (source) => `${pipelineConfig.intermediateOutputDirectory}/${source.outputTableName}.parquet`
    );
    checkFilePaths(sourcePaths);

    for (const source of sources) {
        await duckDBService.loadIntermediateSource(source, true);
    }

    const baseAdressList = (await duckDBService.runQuery(queries.getBaseTable)) as EnrichedDBAddress[];

    createDirectory(pc.apiOutputDirectory);

    const eventCalendar = (await duckDBService.runQuery(queries.getEventCalendar)) as calendarEvent[];
    const events: AgendaItem[] = eventCalendar.map((event) => ({
        title: event.Name_event,
        description: event.Description ?? stringLibrary.eventNoDescription,
        date: event.Date_start,
        dateEnd:
            event.Date_end && event.Date_end.toUTCString() !== event.Date_start.toUTCString()
                ? event.Date_end
                : undefined
    }));

    for (const address of baseAdressList) {
        const addressPresent: PresentData = {
            distanceRangeStart: 0,
            distanceRangeEnd: 0,
            slider: [],
            agenda: events
        };

        const addressPast: PastData = {
            timeRangeStart: 0,
            timeRangeEnd: 0,
            timeline: [],
            stories: []
        };

        // This is where all the data gets added to the api files
        if (address?.straatnaamBeschrijving) {
            addressPast.stories.push({
                title: stringLibrary.streetNameOrigin,
                contents: address.straatnaamBeschrijving.trim()
            });
        }

        // This is where the record gets finalized
        if (addressPast.timeline.length > 0) {
            const pastStartEnd = getMinMaxRangeFromPastData(addressPast);
            addressPast.timeRangeStart = pastStartEnd.timeRangeStart;
            addressPast.timeRangeEnd = pastStartEnd.timeRangeEnd;
        }

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);
        writeObjectToJsonFile(
            addressRecord,
            `${pc.apiOutputDirectory}/${generateAddressID(addressRecord.address)}.json`,
            devMode.enabled
        );
    }
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

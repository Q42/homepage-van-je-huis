import { AddressRecord } from "./apiSchema/addressRecord";
import { PastData } from "./apiSchema/past";
import { AgendaItem, PresentData } from "./apiSchema/present";
import { crawlerConfigs, csvIngestSources, devMode, pipelineConfig as pc, pipelineConfig } from "./pipelineConfig";
import { DuckDBService } from "./src/lib/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";
import { queries } from "./src/lib/queries";
import cliProgress from "cli-progress";

import {
    generateAddressID,
    assembleApiRecord,
    getMinMaxRangeFromPastData,
    getMinMaxRangeFromPresentData
} from "./src/utils/api";

import { checkFilePaths, createDirectory, measureExecutionTime, writeObjectToJsonFile } from "./src/utils/general";
import { stringLibrary } from "./src/lib/strings";
import { CrawlerConfig, CsvIngestSource, EnrichedDBAddress } from "./src/lib/types";
import { getPublicArt } from "./src/apiGenerators.ts/getPublicArt";

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
    const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    console.log("starting api generation");
    statusBar.start(baseAdressList.length, 0);
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
        const publicArt = await getPublicArt(duckDBService, address.identificatie);
        addressPresent.slider.push(...publicArt);

        // This is where the record gets finalized
        if (addressPast.timeline.length > 0) {
            const pastStartEnd = getMinMaxRangeFromPastData(addressPast);
            addressPast.timeRangeStart = pastStartEnd.timeRangeStart;
            addressPast.timeRangeEnd = pastStartEnd.timeRangeEnd;
        }

        if (addressPresent.slider.length > 0) {
            const presentStartEnd = getMinMaxRangeFromPresentData(addressPresent);
            addressPresent.distanceRangeStart = presentStartEnd.distanceRangeStart;
            addressPresent.distanceRangeEnd = presentStartEnd.distanceRangeEnd;
        }

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);
        writeObjectToJsonFile(
            addressRecord,
            `${pc.apiOutputDirectory}/${generateAddressID(addressRecord.address)}.json`,
            devMode.enabled
        );
        statusBar.increment();
    }
    statusBar.stop();
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

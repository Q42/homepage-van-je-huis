import { AddressRecord } from "./apiSchema/addressRecord";
import { PastData } from "./apiSchema/past";
import { AgendaItem, PresentData } from "./apiSchema/present";
import { csvIngestSources, devMode, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";
import { queries } from "./src/queries";
import { EnrichedDBAddress } from "./src/types";
import { generateAddressID, assembleApiRecord, getMinMaxRangeFromPastData } from "./src/utils/api";

import {
    checkFilePaths,
    createDirectory,
    getIntermediateTableRefsFromSource,
    measureExecutionTime,
    writeObjectToJsonFile
} from "./src/utils/general";

const duckDBService = new DuckDBService();

async function generateAPI() {
    await duckDBService.initDb({ dbLocation: ":memory:" });

    const intermediateRefs = getIntermediateTableRefsFromSource(csvIngestSources, pc);
    checkFilePaths(intermediateRefs.map((ref) => ref.fileLocation));

    await duckDBService.loadTablesFromIntermediateRefs(intermediateRefs);

    const baseAdressList = (await duckDBService.runQuery(queries.getBaseTable)) as EnrichedDBAddress[];

    createDirectory(pc.apiOutputDirectory);

    const eventCalendar = (await duckDBService.runQuery(queries.getEventCalendar)) as calendarEvent[];
    const events: AgendaItem[] = eventCalendar.map((event) => ({
        title: event.Name_event,
        description: event.Description ?? "Dit evenement heeft nog geen omschrijving.",
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
                title: "Hier komt je straatnaam vandaan.",
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

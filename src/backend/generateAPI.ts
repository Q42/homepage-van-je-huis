import { AddressRecord } from "./apiSchema/addressRecord";
import { PastData } from "./apiSchema/past";
import { PresentData } from "./apiSchema/present";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { queries } from "./src/queries";
import { EnrichedDBAddress } from "./src/types";
import { generateAddressID, assembleApiRecord, mapAddressIndexRefsToAddressIndex } from "./src/utils/api";

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
    const apiOutput: AddressRecord[] = [];

    for (const address of baseAdressList) {
        const addressPresent: PresentData = {
            distanceRangeStart: 0,
            distanceRangeEnd: 0,
            slider: [],
            agenda: []
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

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);
        writeObjectToJsonFile(
            addressRecord,
            `${pc.apiOutputDirectory}/${generateAddressID(addressRecord.address)}.json`
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

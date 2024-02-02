import { AddressRecord } from "./apiSchema/addressRecord";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { queries } from "./src/queries";
import { BaseDBAddress } from "./src/types";
import { generateAddressID, generateBaseApiRecord, mapAddressIndexRefsToAddressIndex } from "./src/utils/api";

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

    const baseAdressList = (await duckDBService.runQuery(queries.getBaseTable)) as BaseDBAddress[];

    createDirectory(pc.apiOutputDirectory);
    const apiOutput: AddressRecord[] = [];

    for (const address of baseAdressList) {
        const addressRecord: AddressRecord = generateBaseApiRecord(address);

        // this is where all the api building magic goes

        writeObjectToJsonFile(
            addressRecord,
            `${pc.apiOutputDirectory}/${generateAddressID(addressRecord.address)}.json`
        );
    }

    apiOutput.forEach((output) => {});
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { queries } from "./src/queries";
import {
    checkFilePaths,
    createDirectory,
    generateShortId,
    getIntermediateTableRefsFromSource,
    measureExecutionTime,
    writeObjectToJsonFile
} from "./src/utils";

const duckDBService = new DuckDBService();

async function generateAPI() {
    await duckDBService.initDb({ dbLocation: ":memory:" });

    const intermediateRefs = getIntermediateTableRefsFromSource(csvIngestSources, pc);
    checkFilePaths(intermediateRefs.map((ref) => ref.fileLocation));

    await duckDBService.loadTablesFromIntermediateRefs(intermediateRefs);

    // const addressOutput = await duckDBService.runQuery(
    //     queries.selectDistinct(ingestSources.adressen.tableName, "ligtAan:BAG.ORE.naamHoofdadres", "straat")
    // );

    const addressDescriptionOutput = await duckDBService.runQuery(
        'SELECT huisnummerHoofdadres AS huisnummer, "ligtAan:BAG.ORE.naamHoofdadres" as straatnaam, beschrijving FROM adressen JOIN straatNaamOmschrijving ON (adressen."ligtAan:BAG.ORE.identificatieHoofdadres" = straatNaamOmschrijving.identificatie) LIMIT 100'
    );

    createDirectory(pc.apiOutputDirectory + "/adressen");
    addressDescriptionOutput.forEach((row) => {
        writeObjectToJsonFile(
            row,
            `${pc.apiOutputDirectory}/adressen/${row.straatnaam}-${row.huisnummer}-${generateShortId()}.json`
        );
    });
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

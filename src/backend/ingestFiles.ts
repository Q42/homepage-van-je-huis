import {
    checkFilePaths,
    createDirectory,
    getColumnKeysFromSourceDef,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils";
import { DuckDBService } from "./src/duckDBService";
import { ingestSources, pipelineConfig as pc } from "./pipelineConfig";

const duckDBService = new DuckDBService();

async function normalizeFileSources() {
    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(ingestSources));
    await duckDBService.initDb({ dbLocation: ":memory:" });
    createDirectory(pc.intermediateOutputDirectory);

    // create intermediary table files
    await duckDBService.ingestCSV(ingestSources.adressen);
    await duckDBService.exportTable(
        ingestSources.adressen.tableName,
        `${pc.intermediateOutputDirectory}/${ingestSources.adressen.tableName}`,
        getColumnKeysFromSourceDef(ingestSources.adressen),
        pc.intermediateOutputFormat
    );

    await duckDBService.dropTable(ingestSources.adressen.tableName);

    await duckDBService.ingestCSV(ingestSources.straatOmschrijving);
    await duckDBService.exportTable(
        ingestSources.straatOmschrijving.tableName,
        `${pc.intermediateOutputDirectory}/${ingestSources.straatOmschrijving.tableName}`,
        getColumnKeysFromSourceDef(ingestSources.straatOmschrijving),
        pc.intermediateOutputFormat
    );
}
async function dbProcessRunner() {
    try {
        return normalizeFileSources();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

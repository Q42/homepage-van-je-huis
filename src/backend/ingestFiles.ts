import {
    checkFilePaths,
    createDirectory,
    getColumnKeysFromSourceDef,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils";
import { DuckDBService } from "./src/duckDBService";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";

const duckDBService = new DuckDBService();

async function normalizeFileSources() {
    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(csvIngestSources));
    await duckDBService.initDb({ dbLocation: ":memory:" });
    createDirectory(pc.intermediateOutputDirectory);

    // create intermediary table files
    await duckDBService.ingestCSV(csvIngestSources.adressen);
    await duckDBService.exportTable(
        csvIngestSources.adressen.tableName,
        `${pc.intermediateOutputDirectory}/${csvIngestSources.adressen.tableName}`,
        getColumnKeysFromSourceDef(csvIngestSources.adressen),
        pc.intermediateOutputFormat
    );

    await duckDBService.dropTable(csvIngestSources.adressen.tableName);

    await duckDBService.ingestCSV(csvIngestSources.straatOmschrijving);
    await duckDBService.exportTable(
        csvIngestSources.straatOmschrijving.tableName,
        `${pc.intermediateOutputDirectory}/${csvIngestSources.straatOmschrijving.tableName}`,
        getColumnKeysFromSourceDef(csvIngestSources.straatOmschrijving),
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

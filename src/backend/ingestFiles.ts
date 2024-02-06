import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getColumnKeysFromSourceDef,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils/general";
import { loadFileToParquet } from "./src/utils/db";
import { DuckDBService } from "./src/lib/duckDBService";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";

const duckDBService = new DuckDBService();

async function ingestFileSources() {
    const sessionName = generateSessionName("csv-ingest-run");
    const dbDir = `${pc.intermediateOutputDirectory}/db`;

    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(csvIngestSources));
    createDirectory(pc.intermediateOutputDirectory);
    createDirectory(dbDir);

    await duckDBService.initDb({ dbLocation: `${dbDir}/${sessionName}.duckdb` });
    await duckDBService.enableSpatialExtension();

    // create intermediary table files
    await loadFileToParquet(duckDBService, csvIngestSources.adressen, pc);

    await loadFileToParquet(duckDBService, csvIngestSources.straatOmschrijving, pc);

    await loadFileToParquet(duckDBService, csvIngestSources.artPlaceholder, pc);
    await loadFileToParquet(duckDBService, csvIngestSources.eventsPlaceholder, pc);
}

async function dbProcessRunner() {
    try {
        return ingestFileSources();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

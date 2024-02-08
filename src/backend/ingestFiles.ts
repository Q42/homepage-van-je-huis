import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils/general";
import { loadFileToParquet } from "./src/utils/db";
import { DuckDBService } from "./src/lib/duckDBService";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";
import { duckDBTransformLatLongGeoToRD } from "./src/utils/rijksdriehoek";

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

    // create intermediary table files
    for (const source of Object.values(csvIngestSources)) {
        console.log(`Ingesting ${source.ingestSourcePath}`);
        await loadFileToParquet(duckDBService, source, pc);
    }
}

async function dbProcessRunner() {
    try {
        return ingestFileSources();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

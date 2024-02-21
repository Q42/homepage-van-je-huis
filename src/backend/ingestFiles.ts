import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils/general";
import { loadFileToParquet } from "./src/utils/db";
import { DuckDBService } from "./src/lib/duckDBService";
import { pipelineConfig as pc } from "./configs/pipelineConfig";
import { csvIngestSources } from "./configs/csvSourceConfigs";

const duckDBService = new DuckDBService();

async function ingestFileSources() {
    const sessionName = generateSessionName("csv-ingest-run");
    const dbDir = `${pc.outputDirs.root + pc.outputDirs.intermediateDbs}/db`;

    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(csvIngestSources));
    createDirectory(pc.outputDirs.root + pc.outputDirs.intermediateDbs);
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

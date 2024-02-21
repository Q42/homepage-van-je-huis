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
const intermediateDbDir = pc.outputDirs.root + pc.outputDirs.intermediateDbs;
const duckDbDir = `${intermediateDbDir}/duckDb`;
const directoriesToBeCreated: string[] = [pc.outputDirs.root, intermediateDbDir, duckDbDir];

async function ingestFileSources() {
    const sessionName = generateSessionName("csv-ingest-run");

    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(csvIngestSources));

    directoriesToBeCreated.forEach((dir) => createDirectory(dir));

    await duckDBService.initDb({ dbLocation: `${duckDbDir}/${sessionName}.duckdb` });

    // create intermediary table files
    for (const source of Object.values(csvIngestSources)) {
        console.log(`Ingesting ${source.ingestSourcePath}`);
        await loadFileToParquet({
            dbService: duckDBService,
            csvIngestSource: source,
            pc: pc,
            outputDir: intermediateDbDir,
            dropTableAfterExport: true
        });
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

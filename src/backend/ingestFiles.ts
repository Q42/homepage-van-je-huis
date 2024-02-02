import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getColumnKeysFromSourceDef,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils/general";
import { DuckDBService } from "./src/duckDBService";
import { csvIngestSources, pipelineConfig as pc } from "./pipelineConfig";

const duckDBService = new DuckDBService();

async function ingestFileSources() {
    const sessionName = generateSessionName("csv-ingest-run");

    console.log("starting");
    // system initialization

    checkFilePaths(getIngestFilePathsFromSources(csvIngestSources));
    createDirectory(pc.intermediateOutputDirectory);
    await duckDBService.initDb({ dbLocation: `${pc.intermediateOutputDirectory}/${sessionName}.duckdb` });
    await duckDBService.enableSpatialExtension();

    // create intermediary table files
    await duckDBService.ingestCSV(csvIngestSources.adressen);
    await duckDBService.exportTable(
        csvIngestSources.adressen.tableName,
        `${pc.intermediateOutputDirectory}/${csvIngestSources.adressen.tableName}`,
        getColumnKeysFromSourceDef(csvIngestSources.adressen),
        pc.intermediateOutputFormat
    );

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
        return ingestFileSources();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

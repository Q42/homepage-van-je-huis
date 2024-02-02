import { PipelineConfig } from "../../pipelineConfig";
import { DuckDBService } from "../duckDBService";
import { CsvIngestSource } from "../types";
import { getColumnKeysFromSourceDef } from "./general";

export async function loadFileToParquet(
    dbService: DuckDBService,
    csvIngestSource: CsvIngestSource,
    pc: PipelineConfig
) {
    await dbService.ingestCSV(csvIngestSource);
    return await dbService.exportTable(
        csvIngestSource.tableName,
        `${pc.intermediateOutputDirectory}/${csvIngestSource.tableName}`,
        getColumnKeysFromSourceDef(csvIngestSource),
        pc.intermediateOutputFormat
    );
}

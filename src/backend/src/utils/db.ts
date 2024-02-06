import { PipelineConfig } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { CsvIngestSource } from "../lib/types";
import { getColumnKeysFromSourceDef } from "./general";

export async function loadFileToParquet(
    dbService: DuckDBService,
    csvIngestSource: CsvIngestSource,
    pc: PipelineConfig,
    dropTableAfterExport?: boolean
) {
    await dbService.ingestCSV(csvIngestSource);
    await dbService.exportTable(
        csvIngestSource.tableName,
        `${pc.intermediateOutputDirectory}/${csvIngestSource.tableName}`,
        getColumnKeysFromSourceDef(csvIngestSource),
        pc.intermediateOutputFormat
    );
    if (dropTableAfterExport) {
        await dbService.dropTable(csvIngestSource.tableName);
    }
}

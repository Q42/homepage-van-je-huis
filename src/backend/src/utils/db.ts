import { PipelineConfig } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { ColumnDefenitions, CsvIngestSource } from "../lib/types";

export function getExportSelectQuery(
    tableName: string,
    inputColumns: ColumnDefenitions,
    outputColumns?: string[]
): string {
    const parsedColumns = (outputColumns ?? Object.keys(inputColumns)).map((column) => {
        if (inputColumns[column].toLowerCase() === "geometry") {
            // also enclose the column name in double quotes to avoid issues with special characters in the column name
            return `ST_AsText("${column}") as "${column}"`;
        } else {
            return `"${column}"`;
        }
    });

    return `(SELECT ${parsedColumns.join(", ")} FROM ${tableName})`;
}

export async function loadFileToParquet(
    dbService: DuckDBService,
    csvIngestSource: CsvIngestSource,
    pc: PipelineConfig,
    dropTableAfterExport?: boolean
) {
    await dbService.ingestCSV(csvIngestSource);

    await dbService.exportTable({
        tableName: csvIngestSource.tableName,
        outputFile: `${pc.intermediateOutputDirectory}/${csvIngestSource.tableName}`,
        outputColumns: csvIngestSource.outputColumns,
        columnDefenitions: csvIngestSource.inputColumns,
        outputFormat: "parquet"
    });

    if (dropTableAfterExport) {
        await dbService.dropTable(csvIngestSource.tableName);
    }
}

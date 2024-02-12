import { PipelineConfig } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { ColumnDefenitions, CsvIngestSource } from "../lib/types";
import { DBAddress } from "../models/adresses";

export function getExportSelectQuery(
    tableName: string,
    inputColumns: ColumnDefenitions,
    outputColumns?: string[]
): string {
    const parsedColumns = (outputColumns ?? Object.keys(inputColumns)).map((column) => {
        if (inputColumns[column] && inputColumns[column].toLowerCase() === "geometry") {
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

    if (csvIngestSource.geoTransformColumn !== undefined) {
        await dbService.transformGeometryFormat({
            tableName: csvIngestSource.outputTableName,
            sourceColumnName: csvIngestSource.geoTransformColumn,
            targetColumnName: pc.rdColumnPrefix + csvIngestSource.outputTableName,
            sourceEpsg: "EPSG:4326",
            targetEpsg: "EPSG:28992"
        });

        // add the newly generated column to the output columns and column defenitions
        csvIngestSource.outputColumns.push(pc.rdColumnPrefix + csvIngestSource.outputTableName);
        csvIngestSource.inputColumns[pc.rdColumnPrefix + csvIngestSource.outputTableName] = "GEOMETRY";
    }

    await dbService.exportTable({
        tableName: csvIngestSource.outputTableName,
        outputFile: `${pc.intermediateOutputDirectory}/${csvIngestSource.outputTableName}`,
        outputColumns: csvIngestSource.outputColumns,
        columnDefenitions: csvIngestSource.inputColumns,
        outputFormat: "parquet"
    });

    if (dropTableAfterExport) {
        await dbService.dropTable(csvIngestSource.outputTableName);
    }
}

export function generateAddresResolveSchema(addresses: DBAddress[]) {
    const baseList: Record<string, string[]> = {};

    addresses.forEach((address) => {
        const streetname = address["ligtAan:BAG.ORE.naamHoofdadres"];
        if (!streetname) {
            return;
        }
        const houseNumber =
            address.huisnummerHoofdadres +
            (address.huisnummertoevoegingHoofdadres ?? "") +
            (address.huisletterHoofdadres ?? "");

        if (!baseList[streetname]) {
            baseList[streetname] = [];
        }
        baseList[streetname].push(houseNumber);
    });
    return baseList;
}

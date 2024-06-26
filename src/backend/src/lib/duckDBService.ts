import { Database } from "duckdb-async";
import { pipelineConfig as pc } from "../../configs/pipelineConfig";
import { getExportSelectQuery } from "../utils/db";
import { parseValueForDbInsert } from "../utils/general";
import { queries } from "./queries/queries";
import { BaseApiResponse, ColumnDefenitions, CrawlerConfig, CsvIngestSource, IntermediateOutputFormats } from "./types";

type DuckDBConfig = {
    dbLocation?: string;
};

type ExportTableOptions = {
    tableName: string;
    outputFile: string;
    columnDefenitions: ColumnDefenitions;
    outputColumns?: string[];
    outputFormat?: IntermediateOutputFormats;
};

const dbNotInitializedError = new Error("Database has not been initialized");

export class DuckDBService {
    public db: Database | undefined;
    public spatialEnabled: boolean = false;

    constructor() {
        this.db = undefined;
    }
    public async initDb({ dbLocation = ":memory:" }: DuckDBConfig): Promise<void> {
        this.db = await Database.create(dbLocation);
        await this.enableSpatialExtension();
    }

    protected async enableSpatialExtension(): Promise<void> {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        await this.db.exec("INSTALL spatial; LOAD spatial;");
        this.spatialEnabled = true;
    }

    public async teardown(): Promise<void> {
        return await this.db?.close();
    }

    public async runQuery(querystring: string) {
        if (!this.db) {
            throw dbNotInitializedError;
        }
        return await this.db.all(querystring);
    }
    public async ingestCSV(source: CsvIngestSource) {
        const ingestArgs = [`'${source.ingestSourcePath}'`, "header=true", "delim=';'"];
        if (!this.db) {
            throw dbNotInitializedError;
        }

        if (source.inputColumns) {
            const columnTypesArg = "columns=" + JSON.stringify(source.inputColumns);
            ingestArgs.push(columnTypesArg);
        }

        const querystring = `CREATE TABLE ${source.outputTableName} AS FROM read_csv(${ingestArgs.join(", ")})`;
        await this.runQuery(querystring);
    }

    public async exportTable({ tableName, outputFile, outputColumns, columnDefenitions }: ExportTableOptions) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        let selectStatement = tableName;

        selectStatement = getExportSelectQuery(tableName, columnDefenitions, outputColumns);

        outputFile += ".parquet";

        const queryToRun = `COPY ${selectStatement} TO '${outputFile}' (FORMAT PARQUET)`;

        return this.runQuery(queryToRun);
    }

    public async dropTable(tableName: string) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        return this.runQuery(`DROP TABLE ${tableName}`);
    }

    public async loadIntermediateSource(
        source: CsvIngestSource | CrawlerConfig,
        intermediateDir: string,
        tempTable?: boolean
    ) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        const parquetFile = `${intermediateDir}/${source.outputTableName}.parquet`;
        console.log(`loading intermediate source: ${parquetFile} into table ${source.outputTableName}`);

        const querystring = `CREATE ${tempTable ? "TEMP " : ""}TABLE ${source.outputTableName} AS FROM read_parquet('${parquetFile}')`;

        await this.runQuery(querystring);

        let columnNames: string[] = [];
        let columnDefenitions: ColumnDefenitions = {};

        if ("inputColumns" in source) {
            // it's a CsvIngestSource
            columnNames = source.outputColumns;
            columnDefenitions = source.inputColumns;

            if (source.geoTransformColumn !== undefined) {
                columnNames.push(pc.rdColumnPrefix + source.outputTableName);
                columnDefenitions[pc.rdColumnPrefix + source.outputTableName] = "GEOMETRY";
            }
        }

        if (!("inputColumns" in source)) {
            // it's a CrawlerConfig
            columnNames = Object.keys(source.outputColumns);
            columnDefenitions = source.outputColumns;
        }

        const geometryColumns = columnNames.filter((column) => columnDefenitions[column].toLowerCase() === "geometry");

        for (const geometryColumn of geometryColumns) {
            console.log(`parsing geometry colum ${geometryColumn} from table ${source.outputTableName}`);
            const querystring = `ALTER TABLE ${source.outputTableName} alter "${geometryColumn}" type GEOMETRY USING ST_GeomFromText("${geometryColumn}")`;
            await this.runQuery(querystring);
        }
    }

    public async createTableFromDefinition(
        tableName: string,
        columnDefinitions: ColumnDefenitions,
        tempTable?: boolean
    ) {
        if (!this.db) {
            throw dbNotInitializedError;
        }
        let querystring = `CREATE ${tempTable ? "TEMP" : ""} TABLE ${tableName} (`;
        Object.entries(columnDefinitions).forEach(([columnName, columnType]) => {
            querystring += `"${columnName}" ${columnType}, `;
        });
        querystring = querystring += ");";
        return await this.runQuery(querystring);
    }

    public async insertIntoTable<T extends BaseApiResponse>(tableName: string, records: T[]) {
        if (!this.db) {
            throw dbNotInitializedError;
        }
        if (records.length === 0) {
            return;
        }

        const columnNames = Object.keys(records[0]);

        const valuesArray = records.map((record) => {
            return `(${Object.values(record)
                .map((value) => parseValueForDbInsert(value))
                .join(",")})`;
        });

        const querystring = `INSERT INTO ${tableName}(${columnNames.join(", ")}) VALUES ${valuesArray.join(", ")} `;

        return await this.runQuery(querystring);
    }

    public async columnExists(tableName: string, columnName: string): Promise<boolean> {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        const querystring = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}' AND column_name = '${columnName}'`;

        const result = await this.runQuery(querystring);

        return result.length > 0;
    }

    /**
     * Transforms the geometry format of a column in a table and inserts the outcome as a new column.
     *
     * @param tableName - The name of the table.
     * @param sourceColumnName - The name of the source column.
     * @param targetColumnName - The name of the target column.
     * @param sourceEpsg - The EPSG code of the source geometry format.
     * @param targetEpsg - The EPSG code of the target geometry format.
     * @param invertedSourceLatLong - If the source geometry uses POINT(long lat) instead of the regular way of lat long.
     *
     * @throws Error if the spatial extension is not enabled in the DuckDB instance.
     * @throws Error if the source column does not exist in the table.
     * @throws Error if the target column already exists in the table.
     * @returns A promise that resolves when the transformation is complete.
     */
    public async transformGeometryFormat({
        tableName,
        sourceColumnName,
        targetColumnName,
        sourceEpsg,
        targetEpsg,
        invertedSourceLatLong
    }: {
        tableName: string;
        sourceColumnName: string;
        targetColumnName?: string;
        sourceEpsg: string;
        targetEpsg: string;
        invertedSourceLatLong?: boolean;
    }) {
        if (!this.spatialEnabled) {
            throw new Error("This operation requires that the spatial extension is enabled in the DuckDB instance.");
        }

        if (!(await this.columnExists(tableName, sourceColumnName))) {
            throw new Error(`The column ${sourceColumnName} does not exist in the table ${tableName}.`);
        }

        if (
            targetColumnName !== undefined &&
            targetColumnName !== sourceColumnName &&
            (await this.columnExists(tableName, targetColumnName))
        ) {
            throw new Error(
                `The column ${targetColumnName} already exists in the table ${tableName}. This would result in a data overwrite.`
            );
        }

        return await this.runQuery(
            queries.sqlTransformGeometry({
                tableName,
                sourceColumnName,
                targetColumnName,
                sourceEpsg,
                targetEpsg,
                invertedSourceLatLong
            })
        );
    }
}

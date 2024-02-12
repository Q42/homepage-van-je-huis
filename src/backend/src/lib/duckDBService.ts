import { Database } from "duckdb-async";
import { BaseApiResponse, ColumnDefenitions, CrawlerConfig, CsvIngestSource, IntermediateOutputFormats } from "./types";
import { parseValueForDbInsert } from "../utils/general";
import { devMode, pipelineConfig as pc } from "../../pipelineConfig";
import { getExportSelectQuery } from "../utils/db";

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
        if (
            devMode.enabled &&
            querystring.toLowerCase().includes("select") &&
            !querystring.toLowerCase().includes("limit") &&
            !querystring.toLowerCase().includes("copy") &&
            !querystring.toLowerCase().includes("distinct")
        ) {
            if (querystring.trim().endsWith(";")) {
                querystring = querystring.trim().slice(0, -1);
            }
            querystring += ` LIMIT ${devMode.limit};`;
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

    public async loadIntermediateSource(source: CsvIngestSource | CrawlerConfig, tempTable?: boolean) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        const parquetFile = `${pc.intermediateOutputDirectory}/${source.outputTableName}.parquet`;
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

        let querystring = `INSERT INTO ${tableName}(${columnNames.join(", ")}) VALUES ${valuesArray.join(", ")} `;

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
}

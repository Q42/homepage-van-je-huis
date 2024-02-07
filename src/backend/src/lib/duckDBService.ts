import { Database } from "duckdb-async";
import {
    BaseApiResponse,
    ColumnDefenitions,
    CsvIngestSource,
    IntermediateOutputFormats,
    IntermediateTableRef
} from "./types";
import { parseValueForDbInsert } from "../utils/general";
import { devMode } from "../../pipelineConfig";
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
    }

    public async enableSpatialExtension(): Promise<void> {
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
            !querystring.toLowerCase().includes("copy")
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

        const querystring = `CREATE TABLE ${source.tableName} AS FROM read_csv(${ingestArgs.join(", ")})`;
        await this.runQuery(querystring);
    }

    public async exportTable({
        tableName,
        outputFile,
        outputColumns,
        columnDefenitions: inputColumns,
        outputFormat = "parquet"
    }: ExportTableOptions) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        let selectStatement = tableName;

        selectStatement = getExportSelectQuery(tableName, inputColumns, outputColumns);

        let exportSuffix = "";
        switch (outputFormat) {
            case "parquet":
                exportSuffix = "(FORMAT PARQUET)";
                outputFile += ".parquet";
                break;
            default: // JSON doesn't need an export suffix
                exportSuffix = "";
                outputFile += ".json";
        }

        const queryToRun = `COPY ${selectStatement} TO '${outputFile}' ${exportSuffix}`;

        return this.runQuery(queryToRun);
    }

    public async dropTable(tableName: string) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        return this.runQuery(`DROP TABLE ${tableName}`);
    }

    public async loadParquetIntoTable(tableName: string, parquetFile: string, tempTable?: boolean) {
        if (!parquetFile.endsWith(".parquet")) {
            throw new Error("Invalid file format. Expected .parquet file.");
        }

        const querystring = `CREATE ${tempTable ? "TEMP " : ""}TABLE ${tableName} AS FROM read_parquet('${parquetFile}')`;
        return await this.runQuery(querystring);
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

    public async loadTablesFromIntermediateRefs(intermediateRefs: IntermediateTableRef[]) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        for (const intermediateRef of intermediateRefs) {
            let intermediateReader = "";

            switch (intermediateRef.fileLocation.split(".").pop()) {
                case "json":
                    intermediateReader = "read_json_auto";
                    break;
                case "parquet":
                    intermediateReader = "read_parquet";
                    break;
                default:
                    throw new Error("Unsupported file format");
            }

            const querystring = `CREATE TABLE ${intermediateRef.tableName} AS FROM ${intermediateReader}('${intermediateRef.fileLocation}')`;
            await this.runQuery(querystring);
            console.log(`Ingested ${intermediateRef.fileLocation}`);
        }
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
}

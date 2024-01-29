import { Database } from "duckdb-async";
import {
    BaseApiResponse,
    ColumnDefenitions,
    CsvIngestSource,
    IntermediateOutputFormats,
    IntermediateTableRef
} from "./types";
import { parseValueForDbInsert } from "./utils";

type DuckDBConfig = {
    dbLocation?: string;
};

const dbNotInitializedError = new Error("Database has not been initialized");

export class DuckDBService {
    public db: Database | undefined;

    constructor() {
        this.db = undefined;
    }

    public async runQuery(querystring: string) {
        if (!this.db) {
            throw dbNotInitializedError;
        }
        return await this.db.all(querystring);
    }

    public async initDb({ dbLocation = ":memory:" }: DuckDBConfig): Promise<void> {
        this.db = await Database.create(dbLocation);
    }

    public async ingestCSV(source: CsvIngestSource) {
        const ingestArgs = [`'${source.ingestSourcePath}'`, "header=true"];
        if (!this.db) {
            throw dbNotInitializedError;
        }

        if (source.outputColumns) {
            const columnTypesArg = "types=" + JSON.stringify(source.outputColumns);
            ingestArgs.push(columnTypesArg);
        }

        const querystring = `CREATE TABLE ${source.tableName} AS FROM read_csv_auto(${ingestArgs.join(", ")})`;
        await this.runQuery(querystring);
    }

    public async exportTable(
        tableName: string,
        outputFile: string,
        columns?: string[],
        outputFormat?: IntermediateOutputFormats
    ) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        let selectStatement = tableName;

        if (columns && columns.length > 0) {
            selectStatement = `(SELECT ${columns.join(", ")} FROM ${tableName})`;
        }

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

        const queryToRun = `COPY ${selectStatement} TO '${outputFile}' ${exportSuffix};`;

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
        console.log("beep");
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

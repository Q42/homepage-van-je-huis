import { Database } from "duckdb-async";
import { IngestSource, IntermediateOutputFormats, IntermediateTableRef } from "./types";

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

    public async ingestCSV(source: IngestSource) {
        const ingestArgs = [`'${source.ingestSourcePath}'`, "header=true"];
        if (!this.db) {
            throw dbNotInitializedError;
        }

        if (source.columnTypes) {
            const columnTypesArg = "types=" + JSON.stringify(source.columnTypes);
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
}

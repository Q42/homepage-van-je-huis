import { Database } from "duckdb-async";
import { IngestSource, OutputFormats } from "./types";

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
        if (!this.db) {
            throw dbNotInitializedError;
        }

        let columnDefenitions = "";

        let querystring = `CREATE TABLE ${source.outputName} AS FROM read_csv_auto('${source.ingestSourcePath}', header=true)`;

        if (source.columnTypes) {
        }

        await this.runQuery(querystring);
    }

    public async exportTable(tableName: string, outputFile: string, columns?: string[], outputFormat?: OutputFormats) {
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
                break;
            default: // JSON doesn't need an export suffix
                exportSuffix = "";
        }

        const queryToRun = `COPY ${selectStatement} TO '${outputFile}' ${exportSuffix};`;
        console.log(queryToRun);
        return this.runQuery(queryToRun);
    }
}

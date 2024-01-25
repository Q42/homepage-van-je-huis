import { Database } from "duckdb-async";
import { FileIngestSource } from "./types";

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

    public async loadDB({ dbLocation = ":memory:" }: DuckDBConfig): Promise<void> {
        this.db = await Database.create(dbLocation);
    }

    public async ingestCSV(source: FileIngestSource) {
        if (!this.db) {
            throw dbNotInitializedError;
        }
        const querystring = `CREATE TABLE ${source.outputName} AS FROM read_csv_auto('${source.ingestSourcePath}')`;
        await this.runQuery(querystring);
    }

    public async exportTableToJson(tableName: string, outputFile: string) {
        if (!this.db) {
            throw dbNotInitializedError;
        }

        const queryToRun = `COPY ${tableName} TO '${outputFile}';`;
        return this.runQuery(queryToRun);
    }
}

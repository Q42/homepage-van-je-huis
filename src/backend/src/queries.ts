import { csvIngestSources as cs } from "../pipelineConfig";

export const queries = {
    selectDistinct: (tableName: string, column: string, columnAs?: string) =>
        `SELECT DISTINCT ${column} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,
    getBaseTable: `SELECT * FROM ${cs.adressen.tableName}`
};

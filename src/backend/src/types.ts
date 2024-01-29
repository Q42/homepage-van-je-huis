import { Crawler } from "./scrapers/crawler";

export type CsvIngestSource = {
    ingestSourcePath: string;
    tableName: string;
    outputColumns: ColumnDefenitions;
};

export type CsvIngestSources = {
    [key: string]: CsvIngestSource;
};

export type CrawlerSource<T> = {
    crawler: Crawler<T>;
    tableName: string;
    guideFile: string;
    outputColumns: ColumnDefenitions;
};

export type CrawlerSources = {
    [key: string]: CrawlerSource<any>;
};

// there are more types, but these are the main ones
// see https://duckdb.org/docs/sql/data_types/overview for the full list
type ColumnTypes =
    | "BIGINT"
    | "BOOLEAN"
    | "DATE"
    | "DOUBLE"
    | "DECIMAL"
    | "HUGEINT"
    | "INTEGER"
    | "INTERVAL"
    | "REAL"
    | "SMALLINT"
    | "VARCHAR"
    | "TIME"
    | "TIMESTAMP"
    | "TINYINT"
    | "BLOB";

export type ColumnDefenitions = Record<string, ColumnTypes>;

export type IntermediateOutputFormats = "json" | "parquet";

export type IntermediateTableRef = { fileLocation: string; tableName: string };

export type BaseApiResponse = Record<string, any>;

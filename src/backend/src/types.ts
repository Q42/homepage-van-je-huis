export type IngestSource = {
    ingestSourcePath: string;
    outputName: string;
    columnTypes?: Record<string, ColumnTypes>;
};

export type IngestSources = {
    [key: string]: IngestSource;
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

export type OutputFormats = "json" | "parquet";

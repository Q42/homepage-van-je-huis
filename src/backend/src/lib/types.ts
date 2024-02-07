import { Options as PRetryOptions } from "p-retry";
import { AbstractCrawler } from "../crawlers/abstractCrawler";
import { DBAddress } from "../models/adresses";

export type CsvIngestSource = {
    ingestSourcePath: string;
    tableName: string;
    inputColumns: ColumnDefenitions;
    outputColumns: string[];
};

export type CsvIngestSources = Record<string, CsvIngestSource>;

type AnyApiCrawler = new (crawlerConfig: CrawlerConfig, ...args: any[]) => AbstractCrawler<any, any>;

type BaseCrawlerConfig = {
    outputTableName: string;
    outputColumns: ColumnDefenitions;
};

export interface CrawlerConfig extends BaseCrawlerConfig {
    crawler: AnyApiCrawler;
    guideFile?: string;
    skip?: boolean;
    retryConfig: PRetryOptions;
}

export type ApiCrawlerConfigs = {
    [key: string]: CrawlerConfig;
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
    | "BLOB"
    | "GEOMETRY";

export type GeoString = `POINT(${number} ${number})`;

export type ColumnDefenitions = Record<string, ColumnTypes>;

export type IntermediateOutputFormats = "json" | "parquet";

export type IntermediateTableRef = { fileLocation: string; tableName: string };

export type BaseApiResponse = Record<string, any>;

export type ImageUrlRepsonse = {
    url: string;
};

export interface EnrichedDBAddress extends DBAddress {
    straatnaamBeschrijving: string;
}

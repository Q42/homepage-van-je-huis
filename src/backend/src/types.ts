import { AbstractCrawler } from "./scrapers/abstractCrawler";
import { Options as PRetryOptions } from "p-retry";

export type CsvIngestSource = {
    ingestSourcePath: string;
    tableName: string;
    inputColumns: ColumnDefenitions;
    outputColumns: string[];
};

export type CsvIngestSources = Record<string, CsvIngestSource>;

type AnyCrawler = new (crawlerConfig: CrawlerConfig, ...args: any[]) => AbstractCrawler<any, any>;

export type CrawlerConfig = {
    crawler: AnyCrawler;
    outputTableName: string;
    guideFile: string;
    outputColumns: ColumnDefenitions;
    retryConfig: PRetryOptions;
};

export type CrawlerConfigs = {
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

export type ColumnDefenitions = Record<string, ColumnTypes>;

export type IntermediateOutputFormats = "json" | "parquet";

export type IntermediateTableRef = { fileLocation: string; tableName: string };

export type BaseApiResponse = Record<string, any>;

export type BaseDBAddress = {
    "identificatie": string;
    "huisnummerHoofdadres": number;
    "huisletterHoofdadres": string | undefined;
    "huisnummertoevoegingHoofdadres": string | undefined;
    "postcodeHoofdadres": string;
    "ligtAan:BAG.ORE.identificatieHoofdadres": string;
    "ligtAan:BAG.ORE.naamHoofdadres": string;
    "gebruiksdoel": string | undefined;
    "ligtIn:GBD.BRT.code": string;
    "ligtIn:GBD.WIJK.code": string;
    "ligtIn:GBD.GGW.code": string;
    "ligtIn:GBD.SDL.code": string;
    "geometrie": string;
};

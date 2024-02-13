import { Options as PRetryOptions } from "p-retry";
import { AbstractCrawler } from "../crawlers/abstractCrawler";
import { DBAddress } from "../models/adresses";

export type CsvIngestSource = {
    ingestSourcePath: string; // path to the csv file
    outputTableName: string; // name of the table that is to be created from the csv
    inputColumns: ColumnDefenitions; // the columns that are present in the csv
    outputColumns: string[]; // the columns that need to be exported
    // optinally, the name of a column that contains a lat long POINT that needs to be converted to RD
    // this will create a new column with the name of "rd_geometrie_[tableName]"
    // this column shouldn't manually be added to the in- and output columns, as it will be added automatically.
    geoTransformColumn?: string;
};

export type CsvIngestSources = Record<string, CsvIngestSource>;

type AnyApiCrawler = new (crawlerConfig: CrawlerConfig, ...args: any[]) => AbstractCrawler<any, any>;

type BaseCrawlerConfig = {
    outputTableName: string;
    outputColumns: ColumnDefenitions;
};

export interface CrawlerConfig extends BaseCrawlerConfig {
    crawler: AnyApiCrawler;
    guideSource?: CsvIngestSource;
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

export type BaseApiResponse = Record<string, any>;

export interface EnrichedDBAddress extends DBAddress {
    straatnaamBeschrijving: string;
}

export type SparqlBatch = { offset: number; limit: number };

export type ImageApiResponse = {
    archiveUrl?: string;
    title: string;
    imgUrl: string;
    pandId: string;
    startDate: string;
    endDate: string;
};

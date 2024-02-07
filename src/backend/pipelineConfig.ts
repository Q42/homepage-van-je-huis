import { SparqlImageArchiveCrawler } from "./src/crawlers/sparqlImageCrawler";
import { Options as PRetryOptions } from "p-retry";

import { ApiCrawlerConfigs as CrawlerConfigs, CsvIngestSources, IntermediateOutputFormats } from "./src/lib/types";

import { publicArtRecordOutputColumns } from "./src/models/publicArtRecord";
import { PublicArtCrawler } from "./src/crawlers/publicArtCrawler";
import { adresInputColumns, adresOutputColumns } from "./src/models/adresses";
import { straatOmschrijvingInputColumns, straatnaamOmschrijvingOutputColumns } from "./src/models/straatOmschrijving";

// devMode limits all select queries to a specified max number of rows
export const devMode = { enabled: true, limit: 15 };

export const csvIngestSources: CsvIngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        tableName: "adressen",
        inputColumns: adresInputColumns,
        outputColumns: adresOutputColumns
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        tableName: "straatNaamOmschrijving",
        inputColumns: straatOmschrijvingInputColumns,
        outputColumns: straatnaamOmschrijvingOutputColumns
    },
    // these two are just placeholders for now and need to be replaced with the actual data once its available
    artPlaceholder: {
        ingestSourcePath: "./data_input/art_placeholder.csv",
        tableName: "buitenkunst",
        inputColumns: {
            id: "VARCHAR",
            naam: "VARCHAR",
            afbeelding: "VARCHAR",
            geometrie: "GEOMETRY"
        },
        outputColumns: ["id", "naam", "afbeelding", "geometrie"]
    },
    eventsPlaceholder: {
        ingestSourcePath: "./placeholder_data/AMS750_events_csv.csv",
        tableName: "events",
        inputColumns: {
            Name_event: "VARCHAR",
            Date_start: "DATE",
            Date_end: "DATE",
            Location: "VARCHAR",
            Description: "VARCHAR"
        },
        outputColumns: ["Name_event", "Date_start", "Date_end", "Location", "Description"]
    }
};

export const defaultCrawlerRetryConfig: PRetryOptions = {
    retries: 3,
    minTimeout: 500,
    maxTimeout: 2000,
    randomize: true
};

export const crawlerConfigs: CrawlerConfigs = {
    publicArt: {
        crawler: PublicArtCrawler,
        retryConfig: { ...defaultCrawlerRetryConfig, retries: 1 },
        outputTableName: "buitenkunst",
        outputColumns: publicArtRecordOutputColumns
    },
    /*
    imageArchive: {
        crawler: ImageArchiveCrawler,
        outputTableName: "archief_afbeeldingen",
        guideFile: "./intermediate_output/adressen.parquet",
        outputColumns: imageRecordOutputColumns,
        retryConfig: defaultCrawlerRetryConfig
    },*/
    imageArchive: {
        skip: true, // remove this flag to also run this crawler
        crawler: SparqlImageArchiveCrawler,
        outputTableName: "archief_afbeeldingen",
        guideFile: "./intermediate_output/adressen.parquet",
        outputColumns: {
            id: "VARCHAR",
            idTo: "VARCHAR",
            title: "VARCHAR",
            description: "VARCHAR",
            imgUrl: "VARCHAR",
            visitUrl: "VARCHAR",
            date: "INTEGER",
            copyright: "VARCHAR"
        },
        retryConfig: defaultCrawlerRetryConfig
    }
};

export type PipelineConfig = {
    intermediateOutputDirectory: string;
    scraperGuideFileDirectory: string;
    crawlerOutputDirectory: string;
    intermediateOutputFormat: IntermediateOutputFormats;
    apiOutputDirectory: string;
    batchInsertMinThreshold: number;
    maxConsecutiveCrawlFailures: number;
};

export const pipelineConfig: PipelineConfig = {
    intermediateOutputDirectory: "./intermediate_output",
    crawlerOutputDirectory: "./crawler_output",
    intermediateOutputFormat: "parquet",
    apiOutputDirectory: "./api_generated",
    scraperGuideFileDirectory: "./crawler_guide_files",
    batchInsertMinThreshold: 500,
    maxConsecutiveCrawlFailures: 25
};

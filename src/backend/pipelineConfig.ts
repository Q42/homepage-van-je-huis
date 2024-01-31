import { ImageArchiveCrawler } from "./src/scrapers/archiveImageCrawler";
import pRetry, { AbortError, Options as PRetryOptions } from "p-retry";

import { CrawlerConfigs, CsvIngestSources, IntermediateOutputFormats } from "./src/types";

// devMode limits all select queries to a specified max number of rows
export const devMode = { enabled: true, limit: 10 };

export const csvIngestSources: CsvIngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        tableName: "adressen",
        outputColumns: {
            "identificatie": "VARCHAR",
            "huisnummerHoofdadres": "INTEGER",
            "huisletterHoofdadres": "VARCHAR",
            "huisnummertoevoegingHoofdadres": "VARCHAR",
            "postcodeHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.identificatieHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.naamHoofdadres": "VARCHAR",
            "gebruiksdoel": "VARCHAR",
            "ligtIn:GBD.BRT.code": "VARCHAR",
            "ligtIn:GBD.WIJK.code": "VARCHAR",
            "ligtIn:GBD.GGW.code": "VARCHAR",
            "ligtIn:GBD.SDL.code": "VARCHAR",
            "geometrie": "VARCHAR"
        }
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        tableName: "straatNaamOmschrijving",
        outputColumns: {
            identificatie: "VARCHAR",
            naam: "VARCHAR",
            beschrijving: "VARCHAR"
        }
    }
};

export const defaultCrawlerRetryConfig: PRetryOptions = {
    retries: 3,
    minTimeout: 500,
    maxTimeout: 2000,
    randomize: true
};

export const crawlerConfigs: CrawlerConfigs = {
    imageArchive: {
        crawler: ImageArchiveCrawler,
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
    batchInsertMinThreshold: 1000,
    maxConsecutiveCrawlFailures: 25
};

import { ImageRecord } from "./src/models/imageRecord";
import archiveImageCrawler from "./src/scrapers/archiveImageCrawler";
import { CrawlerSource, CrawlerSources, CsvIngestSources, IntermediateOutputFormats } from "./src/types";

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

const imageArchiveCrawler: CrawlerSource<ImageRecord> = {
    crawler: archiveImageCrawler,
    tableName: "afbeeldingen",
    guideFile: "./intermediate_output/adressen.parquet",
    outputColumns: {
        id: "VARCHAR",
        idTo: "VARCHAR",
        imgUrl: "VARCHAR",
        visitUrl: "VARCHAR",
        date: "VARCHAR"
    }
};

export const crawlerSources: CrawlerSources = {
    imageArchive: imageArchiveCrawler
};

export type PipelineConfig = {
    intermediateOutputDirectory: string;
    scraperGuideFileDirectory: string;
    scraperOutputDirectory: string;
    intermediateOutputFormat: IntermediateOutputFormats;
    apiOutputDirectory: string;
    batchInsertThreshold: number;
};

export const pipelineConfig: PipelineConfig = {
    intermediateOutputDirectory: "./intermediate_output",
    scraperOutputDirectory: "./crawler_output",
    intermediateOutputFormat: "parquet",
    apiOutputDirectory: "./api_generated",
    scraperGuideFileDirectory: "./crawler_guide_files",
    batchInsertThreshold: 1000
};

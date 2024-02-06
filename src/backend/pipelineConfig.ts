import { ImageArchiveCrawler } from "./src/scrapers/archiveImageCrawler";
import pRetry, { AbortError, Options as PRetryOptions } from "p-retry";

import { CrawlerConfigs, CsvIngestSources, IntermediateOutputFormats } from "./src/lib/types";

// devMode limits all select queries to a specified max number of rows
export const devMode = { enabled: true, limit: 15 };

export const csvIngestSources: CsvIngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        tableName: "adressen",
        inputColumns: {
            "identificatie": "VARCHAR",
            "aanduidingInOnderzoek": "VARCHAR",
            "geconstateerd": "VARCHAR",
            "heeftIn:BAG.NAG.identificatieHoofdadres": "VARCHAR",
            "huisnummerHoofdadres": "INTEGER",
            "huisletterHoofdadres": "VARCHAR",
            "huisnummertoevoegingHoofdadres": "VARCHAR",
            "postcodeHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.identificatieHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.naamHoofdadres": "VARCHAR",
            "ligtIn:BAG.WPS.identificatieHoofdadres": "VARCHAR",
            "ligtIn:BAG.WPS.naamHoofdadres": "VARCHAR",
            "ligtIn:BRK.GME.identificatie": "VARCHAR",
            "ligtIn:BRK.GME.naam": "VARCHAR",
            "heeftIn:BAG.NAG.identificatieNevenadres": "VARCHAR",
            "gebruiksdoel": "VARCHAR",
            "gebruiksdoelWoonfunctie": "VARCHAR",
            "gebruiksdoelGezondheidszorgfunctie": "VARCHAR",
            "aantalEenhedenComplex": "INTEGER",
            "is:WOZ.WOB.soortObject": "VARCHAR",
            "oppervlakte": "VARCHAR",
            "status": "VARCHAR",
            "beginGeldigheid": "VARCHAR",
            "eindGeldigheid": "VARCHAR",
            "documentdatum": "VARCHAR",
            "documentnummer": "VARCHAR",
            "verdiepingToegang": "VARCHAR",
            "toegang": "VARCHAR",
            "aantalBouwlagen": "INTEGER",
            "hoogsteBouwlaag": "INTEGER",
            "laagsteBouwlaag": "INTEGER",
            "aantalKamers": "INTEGER",
            "eigendomsverhouding": "VARCHAR",
            "redenopvoer": "VARCHAR",
            "redenafvoer": "VARCHAR",
            "ligtIn:BAG.PND.identificatie": "VARCHAR",
            "ligtIn:GBD.BBK.identificatie": "VARCHAR",
            "ligtIn:GBD.BBK.code": "VARCHAR",
            "ligtIn:GBD.BRT.identificatie": "VARCHAR",
            "ligtIn:GBD.BRT.code": "VARCHAR",
            "ligtIn:GBD.BRT.naam": "VARCHAR",
            "ligtIn:GBD.WIJK.identificatie": "VARCHAR",
            "ligtIn:GBD.WIJK.code": "VARCHAR",
            "ligtIn:GBD.WIJK.naam": "VARCHAR",
            "ligtIn:GBD.GGW.identificatie": "VARCHAR",
            "ligtIn:GBD.GGW.code": "VARCHAR",
            "ligtIn:GBD.GGW.naam": "VARCHAR",
            "ligtIn:GBD.GGP.identificatie": "VARCHAR",
            "ligtIn:GBD.GGP.code": "VARCHAR",
            "ligtIn:GBD.GGP.naam": "VARCHAR",
            "ligtIn:GBD.SDL.identificatie": "VARCHAR",
            "ligtIn:GBD.SDL.code": "VARCHAR",
            "ligtIn:GBD.SDL.naam": "VARCHAR",
            "geometrie": "GEOMETRY"
        },
        outputColumns: [
            "identificatie",
            "huisnummerHoofdadres",
            "huisletterHoofdadres",
            "huisnummertoevoegingHoofdadres",
            "postcodeHoofdadres",
            "ligtAan:BAG.ORE.identificatieHoofdadres",
            "ligtAan:BAG.ORE.naamHoofdadres",
            "ligtIn:BAG.PND.identificatie",
            "gebruiksdoel",
            "ligtIn:GBD.BRT.code",
            "ligtIn:GBD.WIJK.code",
            "ligtIn:GBD.GGW.code",
            "ligtIn:GBD.SDL.code",
            "geometrie"
        ]
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        tableName: "straatNaamOmschrijving",
        inputColumns: {
            identificatie: "VARCHAR",
            naam: "VARCHAR",
            beschrijving: "VARCHAR"
        },
        outputColumns: ["identificatie", "naam", "beschrijving"]
    },
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
        ingestSourcePath: "./data_input/AMS750_events_csv.csv",
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

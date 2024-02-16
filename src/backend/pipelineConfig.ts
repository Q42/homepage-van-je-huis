import { SparqlImageArchiveCrawler } from "./src/crawlers/sparqlImageCrawler";
import { Options as PRetryOptions } from "p-retry";

import { ApiCrawlerConfigs as CrawlerConfigs, CsvIngestSources } from "./src/lib/types";

import { publicArtRecordOutputColumns } from "./src/models/publicArtRecord";
import { PublicArtCrawler } from "./src/crawlers/publicArtCrawler";
import { adresInputColumns, adresOutputColumns } from "./src/models/adresses";
import { straatOmschrijvingInputColumns, straatnaamOmschrijvingOutputColumns } from "./src/models/straatOmschrijving";
import { cultureFacilitiesInputColumns, cultureFacilitiesOutputColumns } from "./src/models/culturalFacility";
import { treesInputColumns, treesOutputColumns } from "./src/models/trees";
import { buurtenInputColumns, buurtenOutputColumns } from "./src/models/buurten";
import { beesInputColumns, beesOutputColumns } from "./src/models/bees";
import { sparqlImageOutputColumns } from "./src/models/sparqlImages";

// devMode limits all select queries to a specified max number of rows
export const devMode = { enabled: true, limit: 1000 };

// See the type defenition for more info on what all these parameters do.
export const csvIngestSources: CsvIngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        outputTableName: "adressen",
        inputColumns: adresInputColumns,
        outputColumns: adresOutputColumns
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        outputTableName: "straatNaamOmschrijving",
        inputColumns: straatOmschrijvingInputColumns,
        outputColumns: straatnaamOmschrijvingOutputColumns
    },
    culturalFacilities: {
        ingestSourcePath: "./data_input/CULTUURVOORZIENINGEN.csv",
        outputTableName: "cultuurvoorzieningen",
        inputColumns: cultureFacilitiesInputColumns,
        outputColumns: cultureFacilitiesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    buurten: {
        ingestSourcePath: "./data_input/GBD_buurt_Actueel.csv",
        outputTableName: "buurten",
        inputColumns: buurtenInputColumns,
        outputColumns: buurtenOutputColumns
    },
    trees: {
        ingestSourcePath: "./data_input/BOMEN.csv",
        outputTableName: "bomen",
        inputColumns: treesInputColumns,
        outputColumns: treesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    bees: {
        ingestSourcePath: "./data_input/BIJEN_HONING.csv",
        outputTableName: "bijen",
        inputColumns: beesInputColumns,
        outputColumns: beesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    // these are just placeholders for now and need to be replaced with the actual data once its available
    eventsPlaceholder: {
        ingestSourcePath: "./placeholder_data/AMS750_events_csv.csv",
        outputTableName: "events",
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
        skip: true, // remove this flag to also run this crawler
        crawler: PublicArtCrawler,
        retryConfig: { ...defaultCrawlerRetryConfig, retries: 1 },
        outputTableName: "buitenkunst",
        outputColumns: publicArtRecordOutputColumns
    },
    imageArchive: {
        crawler: SparqlImageArchiveCrawler,
        outputTableName: "archief_afbeeldingen",
        outputColumns: sparqlImageOutputColumns,
        retryConfig: defaultCrawlerRetryConfig
    }
};

export type PipelineConfig = {
    intermediateOutputDirectory: string;
    apiOutputDirectory: string;
    apiResoliverDirectory: string;
    apiAddressFilesDirectory: string;
    dbBatchInsertMinThreshold: number;
    maxConsecutiveCrawlFailuresBeforeAbort: number;
    sortSliders: boolean;
    presentViewRangeMax: number; // the maximum distance in meters to show in the present view
    rdColumnPrefix: string;
    minArchiveImages: number; //If this threshold is not met by simply looking for images relating to an address, the search radius will be increased.
    aggregateTableName: string;
};

export const pipelineConfig: PipelineConfig = {
    intermediateOutputDirectory: "./intermediate_output",
    apiOutputDirectory: "./api_generated",
    apiResoliverDirectory: "/resolve",
    apiAddressFilesDirectory: "/address",
    dbBatchInsertMinThreshold: 500,
    maxConsecutiveCrawlFailuresBeforeAbort: 25,
    sortSliders: true,
    presentViewRangeMax: 1000,
    rdColumnPrefix: "rd_geometrie_",
    minArchiveImages: 5,
    aggregateTableName: "aggregates"
};

type PublicArtCrawlerExtraConfig = {
    totalPages: number;
    baseUrl: string;
    baseListPage: string;
};

export const publicArtCrawlerExtraConfig: PublicArtCrawlerExtraConfig = {
    totalPages: 108,
    baseUrl: "https://amsterdam.kunstwacht.nl",
    baseListPage: "https://amsterdam.kunstwacht.nl/kunstwerken/page"
};

type ImageArchiveCrawlerExtraConfig = {
    paginationSize: number;
};

export const imageArchiveCrawlerExtraConfig: ImageArchiveCrawlerExtraConfig = {
    paginationSize: 10000
};

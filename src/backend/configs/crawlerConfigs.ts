import { SparqlImageArchiveCrawler } from "../src/crawlers/sparqlImageCrawler";
import { Options as PRetryOptions } from "p-retry";

import { ApiCrawlerConfigs as CrawlerConfigs } from "../src/lib/types";

import { publicArtRecordOutputColumns } from "../src/models/publicArtRecord";
import { PublicArtCrawler } from "../src/crawlers/publicArtCrawler";
import { sparqlImageOutputColumns } from "../src/models/sparqlImages";

export const defaultCrawlerRetryConfig: PRetryOptions = {
    retries: 3,
    minTimeout: 500,
    maxTimeout: 2000,
    randomize: true
};

export const crawlerConfigs: CrawlerConfigs = {
    publicArt: {
        // skip: true, // remove this flag to also run this crawler
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

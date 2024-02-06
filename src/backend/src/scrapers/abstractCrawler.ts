import { Browser } from "puppeteer";
import { ApiCrawlerConfig, WebsiteCrawlerConfig } from "../lib/types";
import { BaseApiResponse } from "../lib/types";

export abstract class AbstractApiCrawler<T extends BaseApiResponse, Y> {
    crawlerConfig: ApiCrawlerConfig;

    public constructor(crawlerConfig: ApiCrawlerConfig) {
        this.crawlerConfig = crawlerConfig;
    }

    public abstract loadGuideData(): Promise<Y[]>;

    public abstract crawl(guideRecord: Y): Promise<T[]>;

    public abstract teardown(): Promise<void>;
}

export abstract class AbstractWebsiteCrawler<T> {
    crawlerConfig: WebsiteCrawlerConfig;
    browser: Browser;

    public constructor(crawlerConfig: WebsiteCrawlerConfig, browser: Browser) {
        this.crawlerConfig = crawlerConfig;
        this.browser = browser;
    }

    public abstract run(): Promise<T[]>;
}

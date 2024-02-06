import { CrawlerConfig } from "../lib/types";
import { BaseApiResponse } from "../lib/types";

export abstract class AbstractCrawler<T extends BaseApiResponse, Y> {
    crawlerConfig: CrawlerConfig;

    public constructor(crawlerConfig: CrawlerConfig) {
        this.crawlerConfig = crawlerConfig;
    }

    public abstract loadGuideData(): Promise<Y[]>;

    public abstract crawl(guideRecord: Y): Promise<T[]>;

    public abstract teardown(): Promise<void>;
}

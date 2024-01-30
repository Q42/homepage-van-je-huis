import { RowData } from "duckdb";
import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import { BaseApiResponse, CrawlerConfig } from "../types";
import { AbstractCrawler } from "./abstractCrawler";

import Parser from "rss-parser";
import { DuckDBService } from "../duckDBService";

type ArchiveImageApiRecord = {
    link: string;
    dc_title: string;
    dc_date: string;
    identifier: string;
    enclosure: {
        url: string;
    };
};
type ArchiveImageApiResponse = BaseApiResponse[];

export class ImageArchiveCrawler extends AbstractCrawler<ImageRecord, RowData> {
    protected duckDbService: DuckDBService;
    protected tempTableName = "TempImgGuide";
    protected rssParser = new Parser({ customFields: { item: ["dc_date"] } });

    public constructor(crawlerConfig: CrawlerConfig, duckDbService: DuckDBService) {
        super(crawlerConfig);
        this.duckDbService = duckDbService;
    }

    protected generateQuery(guideRecord: RowData): string {
        return `${guideRecord["ligtAan:BAG.ORE.naamHoofdadres"]}`;
    }

    protected async archiveImageApiClient(query: string): Promise<ArchiveImageApiResponse> {
        const sanitizedQuery = query.replace(" ", "+");
        const apiUrl = "https://archief.amsterdam/api/opensearch/";
        const res = await this.rssParser.parseURL(`${apiUrl}?q=${query}`);
        return res.items;
    }

    protected mapArchiveImages(baseRecord: BaseRecord, data: ArchiveImageApiResponse): ImageRecord[] {
        data as ArchiveImageApiRecord[];

        return data.map((record) => {
            const newRecord: ImageRecord = {
                ...baseRecord,
                imgUrl: record.enclosure.url,
                visitUrl: record.link,
                date: record.dc_date
            };
            return newRecord;
        });
    }

    public async loadGuideData(): Promise<RowData[]> {
        await this.duckDbService.loadParquetIntoTable(this.tempTableName, this.crawlerConfig.guideFile, true);

        return await this.duckDbService.runQuery(
            `SELECT "identificatie", "huisnummerHoofdadres", "huisletterHoofdadres", "huisnummertoevoegingHoofdadres", "ligtAan:BAG.ORE.naamHoofdadres" FROM ${this.tempTableName} LIMIT 10`
        );
    }

    public async crawl(guideRecord: RowData): Promise<ImageRecord[]> {
        const query = this.generateQuery(guideRecord);
        const baseRecord: BaseRecord = {
            id: guideRecord.identificatie,
            idTo: "adres"
        };
        const apiResponse = await this.archiveImageApiClient(query);
        return this.mapArchiveImages(baseRecord, apiResponse);
    }

    public async teardown(): Promise<void> {
        await this.duckDbService.dropTable(this.tempTableName);
    }
}

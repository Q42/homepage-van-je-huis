import { RowData } from "duckdb";
import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import { BaseApiResponse, CrawlerConfig } from "../types";
import { AbstractCrawler } from "./abstractCrawler";

import Parser from "rss-parser";
import { DuckDBService } from "../duckDBService";

type ArchiveImageApiResponse = BaseApiResponse[];

export class ImageArchiveCrawler extends AbstractCrawler<ImageRecord, RowData> {
    protected duckDbService: DuckDBService;
    protected tempTableName = "TempImgGuide";
    protected rssParser = new Parser({
        customFields: { item: ["dc_date", "dc_description", "dc_title", "sr_rechthebbende"] }
    });

    public constructor(crawlerConfig: CrawlerConfig, duckDbService: DuckDBService) {
        super(crawlerConfig);
        this.duckDbService = duckDbService;
    }

    protected upscaleMemorixThumbnailImageUrl(url: string): string {
        return url.replace("thumb/350x350/", "thumb/1000x1000/");
    }

    protected parseCopyrightOwner(data: string | undefined): string | undefined {
        if (data === undefined || data.toLowerCase() === "auteursrechtvrij") {
            return undefined;
        }
        return data;
    }

    protected parseDateStringToYear(data: string | undefined): number | undefined {
        // examples of possible date strings:
        // 17 november 2006
        // 1994
        // september 1976
        // 1860 ca. t/m 1870 ca.
        // 1876 t/m 1883
        // 1990 ca.
        // oktober 1895 t/m december 1895

        if (!data) {
            return;
        }

        const yearRegex = /\b[12]\d{3}\b/g;
        const years = data.match(yearRegex);
        if (years && years.length == 1) {
            return parseInt(years[0]);
        }
        // If there are multiple years, average them
        if (years && years.length > 1) {
            const parsedYears = years.map((year) => parseInt(year));
            return parsedYears.reduce((sum, year) => sum + year, 0) / parsedYears.length;
        }
    }

    protected generateQuery(guideRecord: RowData): string {
        const queryItems: string[] = [guideRecord["ligtAan:BAG.ORE.naamHoofdadres"]];
        if (guideRecord["huisnummerHoofdadres"]) {
            queryItems.push(guideRecord["huisnummerHoofdadres"]);
        }
        // if (guideRecord["huisletterHoofdadres"]) {
        //     queryItems.push(guideRecord["huisletterHoofdadres"]);
        // }
        // if (guideRecord["huisnummertoevoegingHoofdadres"]) {
        //     queryItems.push(guideRecord["huisnummertoevoegingHoofdadres"]);
        // }
        return queryItems.join("+");
    }

    protected async archiveImageApiClient(query: string): Promise<ArchiveImageApiResponse> {
        const sanitizedQuery = query.replace(" ", "+");
        const apiUrl = "https://archief.amsterdam/api/opensearch/";
        const res = await this.rssParser.parseURL(`${apiUrl}?q=${query}`);
        return res.items;
    }

    protected mapArchiveImages(baseRecord: BaseRecord, data: ArchiveImageApiResponse): ImageRecord[] {
        if (!Array.isArray(data)) {
            throw new Error("Data is not an array");
        }

        return data.map((record) => {
            const newRecord: ImageRecord = {
                ...baseRecord,
                imgUrl: record?.enclosure?.url ? this.upscaleMemorixThumbnailImageUrl(record.enclosure.url) : "",
                visitUrl: record?.link,
                date: this.parseDateStringToYear(record?.dc_date),
                title: record?.dc_title,
                description: record?.dc_description,
                copyright: record?.sr_rechthebbende
            };
            return newRecord;
        });
    }

    public async loadGuideData(): Promise<RowData[]> {
        await this.duckDbService.loadParquetIntoTable(this.tempTableName, this.crawlerConfig.guideFile, true);

        return await this.duckDbService.runQuery(
            `SELECT "identificatie", "huisnummerHoofdadres", "huisletterHoofdadres", "huisnummertoevoegingHoofdadres", "ligtAan:BAG.ORE.naamHoofdadres" FROM ${this.tempTableName}`
        );
    }

    public async crawl(guideRecord: RowData): Promise<ImageRecord[]> {
        const query = this.generateQuery(guideRecord);
        console.log(query);
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

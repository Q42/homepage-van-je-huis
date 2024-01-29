import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import { Scraper } from "./scraper";

import Parser from "rss-parser";

const rssParser = new Parser({ customFields: { item: ["dc_date"] } });

type ArchiveImageApiRecord = {
    link: string;
    dc_title: string;
    dc_date: string;
    identifier: string;
    enclosure: {
        url: string;
    };
};
type ArchiveImageApiResponse = Record<string, any>[];

async function archiveImageApiClient(query: string): Promise<ArchiveImageApiResponse> {
    const apiUrl = "https://archief.amsterdam/api/opensearch/";
    const res = await rssParser.parseURL(`${apiUrl}?q=${query}`);
    return res.items;
}

function mapArchiveImages(baseRecord: BaseRecord, data: ArchiveImageApiResponse): ImageRecord[] {
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

const archiveImageScraper = new Scraper(archiveImageApiClient, mapArchiveImages);

export default archiveImageScraper;

import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import { BaseApiResponse } from "../types";
import { Crawler } from "./crawler";

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
type ArchiveImageApiResponse = BaseApiResponse[];

async function archiveImageApiClient(query: string): Promise<ArchiveImageApiResponse> {
    const sanitizedQuery = query.replace(" ", "+");
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

const archiveImageCrawler = new Crawler<ImageRecord>(archiveImageApiClient, mapArchiveImages);

export default archiveImageCrawler;

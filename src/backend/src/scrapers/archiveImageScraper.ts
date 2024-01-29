import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import { Scraper } from "./scraper";
import { X2jOptions, XMLParser } from "fast-xml-parser";

const xmlParserOptions: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true
};

const xmlParser = new XMLParser(xmlParserOptions);

type ArchiveImageApiRecord = {
    link: string;
    dc_title: string;
    dc_date: string;
    identifier: string;
    enclosure: {
        "@_url": string;
    };
};
type ArchiveImageApiResponse = Record<string, any>[];

async function archiveImageApiClient(query: string): Promise<ArchiveImageApiResponse> {
    const apiUrl = "https://archief.amsterdam/api/opensearch/";
    const res = await fetch(`${apiUrl}?q=${query}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch from ${apiUrl}: ${res.status} ${res.statusText}`);
    }
    const resText = await res.text();
    if (!resText) {
        throw new Error(`Didn't get response contents from ${apiUrl}: ${res.status} ${res.statusText}`);
    }
    try {
        return xmlParser.parse(resText).rss.channel.item as ArchiveImageApiResponse;
    } catch (e) {
        return [];
    }
}

function mapArchiveImages(baseRecord: BaseRecord, data: ArchiveImageApiResponse): ImageRecord[] {
    data as ArchiveImageApiRecord[];

    return data.map((record) => {
        const newRecord: ImageRecord = {
            ...baseRecord,
            imgUrl: record.enclosure["@_url"],
            date: record.dc_date
        };
        return newRecord;
    });
}

const archiveImageScraper = new Scraper(archiveImageApiClient, mapArchiveImages);

export default archiveImageScraper;

async function testStuff() {
    const stuff = await archiveImageApiClient("prinsengracht+1");
    console.log(stuff);
}

testStuff();

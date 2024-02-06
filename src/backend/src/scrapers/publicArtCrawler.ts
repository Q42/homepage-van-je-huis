import { Browser, Page } from "puppeteer";
import { GeoLocation } from "../models/shared";
import { AbstractWebsiteCrawler } from "./abstractCrawler";
import { WebsiteCrawlerConfig } from "../lib/types";

type PublicArtRecord = {
    title: string;
    image: string;
    visitUrl: string;
    location: GeoLocation;
};

export class PublicArtCrawler extends AbstractWebsiteCrawler<PublicArtRecord> {
    constructor(crawlerConfig: WebsiteCrawlerConfig, browser: Browser) {
        super(crawlerConfig, browser);
    }

    protected async getArtUrls(): Promise<string[]> {
        const numberOfPages = 108;
        const baseArtUrl = "https://amsterdam.kunstwacht.nl";
        const artUrls: string[] = [];

        const page = await this.browser.newPage();
        for (let currentPage = 1; currentPage <= numberOfPages; currentPage++) {
            await page.goto(`https://amsterdam.kunstwacht.nl/kunstwerken/page/${currentPage}`, {
                waitUntil: "domcontentloaded"
            });

            const urls = await page.evaluate(() => {
                return document.body.querySelectorAll(".entry-image");
            });

            urls.forEach((link) => {
                const artworkUrl = link.getAttribute("href");
                if (artworkUrl) {
                    artUrls.push(baseArtUrl + artworkUrl);
                }
            });
        }

        await page.close();
        return artUrls;
    }

    protected extractCoordinates(str: string): GeoLocation {
        const coordinateMatch = str.match(/placeMarker\(([^,]+), ([^,]+)/);
        if (coordinateMatch) {
            return {
                latitude: parseFloat(coordinateMatch[1]),
                longitude: parseFloat(coordinateMatch[2])
            };
        } else {
            throw new Error("No coordinates found in the string");
        }
    }

    protected async extractArtCoordinates(page: Page) {
        const markerScriptString = await page.evaluate(() => {
            const scriptString = document.body.querySelector("#object_map")?.querySelector("script")?.textContent;
            return scriptString;
        });

        if (markerScriptString) {
            return this.extractCoordinates(markerScriptString);
        }
    }

    protected async extractTitle(page: Page) {
        const title = await page.evaluate(() => {
            return document.body.querySelector("h1")?.textContent;
        });
        if (title) {
            return title;
        }
    }

    protected async extractArtImage(page: Page) {
        const img = await page.evaluate(() => {
            return document.body.querySelector(".basis_afbeelding")?.querySelector("img")?.getAttribute("src");
        });
        if (img) {
            return img;
        }
    }

    public async extractArtDetails(page: Page): Promise<Omit<PublicArtRecord, "visitUrl">> {
        const location = await this.extractArtCoordinates(page);
        const title = await this.extractTitle(page);
        const image = await this.extractArtImage(page);

        if (!title || !image || !location) {
            throw new Error("Failed to extract all required data");
        }

        return {
            title: title,
            image: image,
            location: location
        };
    }

    public async run(): Promise<PublicArtRecord[]> {
        const urls = await this.getArtUrls();
        const records: PublicArtRecord[] = [];

        const page = await this.browser.newPage();
        for (const url of urls) {
            await page.goto(url, {
                waitUntil: "domcontentloaded"
            });

            const record = await this.extractArtDetails(page);
            records.push({
                ...record,
                visitUrl: url
            });
        }
        await page.close();

        return records;
    }
}

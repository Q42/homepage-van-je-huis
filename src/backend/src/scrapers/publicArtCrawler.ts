import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { AbstractCrawler } from "./abstractCrawler";
import { CrawlerConfig } from "../lib/types";
import { geoLocationToRDGeometryString } from "../utils/rijksdriehoek";
import { PublicArtRecord } from "../models/publicArtRecord";

export class PublicArtCrawler extends AbstractCrawler<PublicArtRecord, string> {
    browser: Browser | null;
    fetcherPage: Page | null;
    puppeteerOptions: PuppeteerLaunchOptions;

    constructor(crawlerConfig: CrawlerConfig, puppeteerOptions?: PuppeteerLaunchOptions) {
        super(crawlerConfig);
        this.browser = null;
        this.fetcherPage = null;
        this.puppeteerOptions = puppeteerOptions ?? {};
    }

    public async loadGuideData(): Promise<string[]> {
        return await this.getArtUrls();
    }
    public async crawl(guideRecord: string): Promise<PublicArtRecord[]> {
        if (!this.browser) {
            this.browser = await puppeteer.launch();
        }
        if (!this.fetcherPage) {
            this.fetcherPage = await this.browser.newPage();
        }

        await this.fetcherPage.goto(guideRecord, {
            waitUntil: "domcontentloaded"
        });
        const record = await this.extractArtDetails(this.fetcherPage);
        return [
            {
                ...record,
                visitUrl: guideRecord
            }
        ];
    }

    public async teardown(): Promise<void> {
        if (this.fetcherPage) {
            await this.fetcherPage.close();
            this.fetcherPage = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    protected async getArtUrls(): Promise<string[]> {
        const numberOfPages = 108;
        const baseArtUrl = "https://amsterdam.kunstwacht.nl";
        const artUrls: string[] = [];

        if (!this.browser) {
            this.browser = await puppeteer.launch({});
        }

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

    protected async extractArtCoordinates(page: Page) {
        const markerScriptString = await page.evaluate(() => {
            const scriptString = document.body.querySelector("#object_map")?.querySelector("script")?.textContent;
            return scriptString;
        });

        if (markerScriptString) {
            const coordinateMatch = markerScriptString.match(/placeMarker\(([^,]+), ([^,]+)/);
            if (coordinateMatch) {
                return {
                    latitude: parseFloat(coordinateMatch[1]),
                    longitude: parseFloat(coordinateMatch[2])
                };
            }
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
            location: geoLocationToRDGeometryString(location)
        };
    }
}

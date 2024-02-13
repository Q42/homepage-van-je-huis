import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { AbstractCrawler } from "./abstractCrawler";
import { CrawlerConfig } from "../lib/types";
import { geoLocationToRDGeometryString } from "../utils/rijksdriehoek";
import { PublicArtRecord } from "../models/publicArtRecord";
import cliProgress from "cli-progress";
import { AbortError } from "p-retry";
import { publicArtCrawlerExtraConfig as pAc } from "../../pipelineConfig";

export class PublicArtCrawler extends AbstractCrawler<PublicArtRecord, string> {
    browser: Browser | null;
    puppeteerOptions: PuppeteerLaunchOptions;

    constructor(crawlerConfig: CrawlerConfig, puppeteerOptions?: PuppeteerLaunchOptions) {
        super(crawlerConfig);
        this.browser = null;
        this.puppeteerOptions = puppeteerOptions ?? {};
    }

    public async loadGuideData(): Promise<string[]> {
        return await this.getArtUrls();
    }
    public async crawl(guideRecord: string): Promise<PublicArtRecord[]> {
        if (!this.browser) {
            this.browser = await puppeteer.launch(this.puppeteerOptions);
        }

        const fetcherPage = await this.browser.newPage();

        await fetcherPage.goto(guideRecord, {
            waitUntil: "domcontentloaded"
        });
        const record = await this.extractArtDetails(fetcherPage);
        fetcherPage.close();

        return [
            {
                ...record,
                visitUrl: guideRecord
            }
        ];
    }

    public async finalize(): Promise<void> {
        return;
    }

    public async teardown(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    protected async getArtUrls(): Promise<string[]> {
        const outputUrls: string[] = [];

        if (!this.browser) {
            this.browser = await puppeteer.launch({});
        }

        const page = await this.browser.newPage();
        const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        statusBar.start(pAc.totalPages, 0);
        for (let currentPage = 1; currentPage <= pAc.totalPages; currentPage++) {
            await page.goto(`${pAc.baseListPage}/${currentPage}`, {
                waitUntil: "domcontentloaded"
            });
            // IMPORTANT: everything that happens within page.evaluate does not have access to any variables outside
            // of that function's scope, since this code is essentially ran within the chrome browser.
            const urlsFromPage = await page.evaluate(() => {
                const artUrls: string[] = [];
                document.body.querySelectorAll(".entry-image").forEach((url) => {
                    const artworkUrl = url.getAttribute("href");
                    if (artworkUrl) {
                        artUrls.push(artworkUrl);
                    }
                });
                return artUrls;
            });
            outputUrls.push(...urlsFromPage.map((url) => `${pAc.baseUrl}${url}`));
            statusBar.increment();
        }
        statusBar.stop();
        await page.close();
        return outputUrls;
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
            // This means that the page was found, but did simply not contain the required data for homepage van je huis, and as such, should not be retried.
            // Some artworks, for example, don't contain a location.
            throw new AbortError("Failed to extract all required data");
        }

        return {
            title: title,
            image: image,
            location: geoLocationToRDGeometryString(location)
        };
    }
}

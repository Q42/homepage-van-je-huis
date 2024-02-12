import { RowData } from "duckdb";
import { BaseRecord } from "../models/baseRecord";
import { ImageRecord } from "../models/imageRecord";
import SparqlClient from "sparql-http-client";
import { queries } from "../lib/queries";
import { DuckDBService } from "../lib/duckDBService";
import { AbstractCrawler } from "./abstractCrawler";
import { CrawlerConfig, ImageUrlRepsonse } from "../lib/types";

const endpoint = "https://lod.uba.uva.nl/_api/datasets/ATM/ATM-KG/services/ATM-KG/sparql";

type ArchiveImageApiResponse = ImageUrlRepsonse[];

export class SparqlImageArchiveCrawler extends AbstractCrawler<ImageRecord, RowData> {
    protected duckDbService: DuckDBService;

    public constructor(crawlerConfig: CrawlerConfig, duckDbService: DuckDBService) {
        super(crawlerConfig);
        this.duckDbService = duckDbService;
    }

    protected upscaleMemorixThumbnailImageUrl(url: string): string {
        return url.replace("thumb/350x350/", "thumb/1000x1000/");
    }

    protected async archiveImageApiClient(street: string, houseNumber: number): Promise<ArchiveImageApiResponse> {
        const client = new SparqlClient({ endpointUrl: endpoint });
        const stream = await client.query.select(queries.sparqlSearchByAddress(street, houseNumber));

        const result: ImageUrlRepsonse[] = [];

        for await (const chunk of stream) {
            const image: ImageUrlRepsonse = {
                url: chunk.url.value
            };
            result.push(image);
        }

        return result;
    }

    protected mapArchiveImages(baseRecord: BaseRecord, data: ArchiveImageApiResponse): ImageRecord[] {
        if (!Array.isArray(data)) {
            throw new Error("Data is not an array");
        }

        return data.map((record) => {
            const newRecord: ImageRecord = {
                ...baseRecord,
                imgUrl: this.upscaleMemorixThumbnailImageUrl(record.url)
            };
            return newRecord;
        });
    }

    public async loadGuideData(): Promise<RowData[]> {
        if (this.crawlerConfig.guideSource === undefined) {
            throw new Error("Guide source is not defined whilst this crawler does need it");
        }
        await this.duckDbService.loadIntermediateSource(this.crawlerConfig.guideSource, true);

        return await this.duckDbService.runQuery(
            `SELECT "identificatie", "huisnummerHoofdadres", "ligtAan:BAG.ORE.naamHoofdadres" FROM ${this.crawlerConfig.guideSource.outputTableName}`
        );
    }

    public async crawl(guideRecord: RowData): Promise<ImageRecord[]> {
        const baseRecord: BaseRecord = {
            id: guideRecord.identificatie,
            idTo: "adres"
        };

        const apiResponse = await this.archiveImageApiClient(
            guideRecord["ligtAan:BAG.ORE.naamHoofdadres"],
            guideRecord["huisnummerHoofdadres"]
        );

        return this.mapArchiveImages(baseRecord, apiResponse);
    }

    public async teardown(): Promise<void> {
        if (this.crawlerConfig.guideSource?.outputTableName) {
            await this.duckDbService.dropTable(this.crawlerConfig.guideSource.outputTableName);
        }
    }
}

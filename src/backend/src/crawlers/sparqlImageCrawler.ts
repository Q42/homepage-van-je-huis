import SparqlClient from "sparql-http-client";
import { queries } from "../lib/queries";

import { AbstractCrawler } from "./abstractCrawler";
import { CrawlerConfig, ImageApiResponse, SparqlBatch } from "../lib/types";
import { imageArchiveCrawlerExtraConfig } from "../../pipelineConfig";

const endpoint = "https://lod.uba.uva.nl/_api/datasets/ATM/ATM-KG/services/ATM-KG/sparql";

export class SparqlImageArchiveCrawler extends AbstractCrawler<ImageApiResponse, SparqlBatch> {
    protected sparqlClient: SparqlClient;

    public constructor(crawlerConfig: CrawlerConfig) {
        super(crawlerConfig);

        this.sparqlClient = new SparqlClient({ endpointUrl: endpoint });
    }

    protected upscaleMemorixThumbnailImageUrl(url: string): string {
        return url.replace("thumb/350x350/", "thumb/1000x1000/");
    }

    public async loadGuideData(): Promise<SparqlBatch[]> {
        const stream = await this.sparqlClient.query.select(queries.sparqlGetTotalImages);
        let totalImages = 0;
        for await (const chunk of stream) {
            if (chunk["cnt"]?.value) {
                totalImages = parseInt(chunk["cnt"].value);
            }
        }
        const numPages = Math.ceil(totalImages / imageArchiveCrawlerExtraConfig.paginationSize);

        const sparqlBatch: SparqlBatch[] = [];

        for (let i = 0; i < numPages; i++) {
            sparqlBatch.push({
                offset: i * imageArchiveCrawlerExtraConfig.paginationSize,
                limit: imageArchiveCrawlerExtraConfig.paginationSize
            });
        }

        return sparqlBatch;
    }

    public async crawl(guideRecord: SparqlBatch): Promise<ImageApiResponse[]> {
        const result: ImageApiResponse[] = [];

        const stream = await this.sparqlClient.query.select(queries.sparqlGetImagesBatch(guideRecord));

        for await (const chunk of stream) {
            const image: ImageApiResponse = {
                archiveUrl: chunk["widget"]?.value,
                title: chunk["widgetLabel"]?.value,
                imgUrl: chunk["widgetImage"]?.value,
                pandId: chunk["pand"]?.value,
                startDate: chunk["startDate"]?.value,
                endDate: chunk["endDate"]?.value
            };
            result.push(image);
        }
        return result;
    }

    public async teardown(): Promise<void> {}
}

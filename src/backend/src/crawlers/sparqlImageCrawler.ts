import SparqlClient from "sparql-http-client";
import { queries } from "../lib/queries";

import { AbstractCrawler } from "./abstractCrawler";
import { CrawlerConfig, ImageApiResponse, SparqlBatch } from "../lib/types";
import { imageArchiveCrawlerExtraConfig } from "../../pipelineConfig";

const endpoint = "https://api.lod.uba.uva.nl/datasets/ATM/ATM-KG/services/ATM-KG/sparql";

export class SparqlImageArchiveCrawler extends AbstractCrawler<ImageApiResponse, SparqlBatch> {
    protected sparqlClient: SparqlClient;
    protected duckDBService: any;

    public constructor(crawlerConfig: CrawlerConfig, duckDBService: any) {
        if (!crawlerConfig) {
            throw new Error("No crawlerConfig provided to SparqlImageArchiveCrawler");
        }

        super(crawlerConfig);

        if (!duckDBService) {
            throw new Error("No duckDBService provided to SparqlImageArchiveCrawler");
        }

        this.duckDBService = duckDBService;
        this.sparqlClient = new SparqlClient({ endpointUrl: endpoint });
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
                archiveUrl: chunk["resource"]?.value,
                title: chunk["title"]?.value,
                imgUrl: chunk["thumbnail"]?.value,
                pandId: chunk["pand"]?.value,
                addressLink: chunk["address"]?.value,
                geoLink: chunk["geo"]?.value,
                streetLink: chunk["street"]?.value,
                streetName: chunk["street_name"]?.value,
                dateString: chunk["textDate"]?.value,
                startDate: chunk["startDate"]?.value,
                endDate: chunk["endDate"]?.value
            };
            result.push(image);
        }
        return result;
    }

    public async finalize(): Promise<void> {
        await this.duckDBService.runQuery(
            queries.sqlStringReplace({
                targetTable: this.crawlerConfig.outputTableName,
                targetColumn: "archiveUrl",
                sourceString: "https://ams-migrate.memorix.io/resources/records/",
                targetString: "https://archief.amsterdam/beeldbank/detail/"
            })
        );
        await this.duckDBService.runQuery(
            queries.sqlStringReplace({
                targetTable: this.crawlerConfig.outputTableName,
                targetColumn: "imgUrl",
                sourceString: "thumb/350x350/",
                targetString: "thumb/1000x1000/"
            })
        );
        await this.duckDBService.runQuery(
            queries.sqlStringReplace({
                targetTable: this.crawlerConfig.outputTableName,
                targetColumn: "pandId",
                sourceString: "http://bag.basisregistraties.overheid.nl/bag/id/pand/",
                targetString: ""
            })
        );
    }

    public async teardown(): Promise<void> {}
}

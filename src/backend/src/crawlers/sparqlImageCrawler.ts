import SparqlClient from "sparql-http-client";
import { imageArchiveCrawlerExtraConfig } from "../../configs/crawlerConfigs";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries/queries";
import { CrawlerConfig, SparqlBatch } from "../lib/types";
import { SparqlImage } from "../models/sparqlImages";
import { AbstractCrawler } from "./abstractCrawler";

const endpoint = "https://api.lod.uba.uva.nl/datasets/ATM/ATM-KG/services/ATM-KG/sparql";

export class SparqlImageArchiveCrawler extends AbstractCrawler<SparqlImage, SparqlBatch> {
    protected sparqlClient: SparqlClient;
    protected duckDBService: DuckDBService;

    public constructor(crawlerConfig: CrawlerConfig, duckDBService: DuckDBService) {
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
        const stream = await this.sparqlClient.query.select(queries.sparql.sparqlGetTotalImages);
        let totalImages = 0;
        for await (const chunk of stream) {
            if ("cnt" in chunk && chunk["cnt"].value) {
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

    public async crawl(guideRecord: SparqlBatch): Promise<SparqlImage[]> {
        const result: SparqlImage[] = [];

        const stream = await this.sparqlClient.query.select(queries.sparql.getImagesBatch(guideRecord));

        for await (const chunk of stream) {
            const streamData = chunk as Record<string, { value: any }>;
            const image: SparqlImage = {
                archiveUrl: streamData["resource"]?.value,
                title: streamData["title"]?.value,
                imgUrl: streamData["thumbnail"]?.value,
                pandId: streamData["pand"]?.value,
                addressLink: streamData["address"]?.value,
                wktPoint: streamData["wkt"]?.value,
                streetLink: streamData["street"]?.value,
                streetName: streamData["street_name"]?.value,
                streetId: streamData["openbareRuimte"]?.value,
                dateString: streamData["textDate"]?.value,
                startDate: streamData["startDate"]?.value,
                endDate: streamData["endDate"]?.value
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

        await this.duckDBService.runQuery(
            queries.sqlStringReplace({
                targetTable: this.crawlerConfig.outputTableName,
                targetColumn: "pandId",
                sourceString: "http://bag.basisregistraties.overheid.nl/bag/id/pand/",
                targetString: ""
            })
        );

        await this.duckDBService.runQuery(
            queries.sqlStringReplace({
                targetTable: this.crawlerConfig.outputTableName,
                targetColumn: "streetId",
                sourceString: "http://bag.basisregistraties.overheid.nl/bag/id/openbare-ruimte/",
                targetString: ""
            })
        );

        await this.duckDBService.transformGeometryFormat({
            tableName: this.crawlerConfig.outputTableName,
            sourceColumnName: "wktPoint",
            sourceEpsg: "EPSG:4326",
            targetEpsg: "EPSG:28992",
            invertedSourceLatLong: true
        });
    }

    public async teardown(): Promise<void> {}
}

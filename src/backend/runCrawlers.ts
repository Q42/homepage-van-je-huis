import { checkFilePaths, createDirectory, getIngestFilePathsFromSources, measureExecutionTime } from "./src/utils";
import { crawlerSources, pipelineConfig as pc } from "./pipelineConfig";
import { BaseApiResponse, CrawlerSource } from "./src/types";
import { DuckDBService } from "./src/duckDBService";
import { BaseRecord } from "./src/models/baseRecord";
import { ImageRecord } from "./src/models/imageRecord";

const duckDBService = new DuckDBService();

async function runCrawlers() {
    console.log("starting");
    // system initialization
    checkFilePaths(getIngestFilePathsFromSources(crawlerSources));

    await duckDBService.initDb({ dbLocation: ":memory:" });

    createDirectory(pc.scraperOutputDirectory);

    await runCrawler<ImageRecord>(crawlerSources.imageArchive, duckDBService);
}

async function runCrawler<T extends BaseApiResponse>(crawlerSource: CrawlerSource<T>, dbService: DuckDBService) {
    const tempTableName = "tempTable";
    await dbService.loadParquetIntoTable(tempTableName, crawlerSource.guideFile);
    await dbService.createTableFromDefinition(crawlerSource.tableName, crawlerSource.outputColumns);

    const guideData = await duckDBService.runQuery(
        `SELECT "identificatie", "huisnummerHoofdadres", "huisletterHoofdadres", "huisnummertoevoegingHoofdadres", "ligtAan:BAG.ORE.naamHoofdadres" FROM ${tempTableName} LIMIT 10`
    );

    const insertBatch: T[] = [];

    for (const row of guideData) {
        const baseRecord: BaseRecord = {
            id: row.identificatie,
            idTo: "adres"
        };
        const crawlResult = await crawlerSource.crawler.crawl(
            baseRecord,
            `${row["ligtAan:BAG.ORE.naamHoofdadres"]}+${row.huisnummerHoofdadres}`
        );

        if (crawlResult) {
            insertBatch.push(...crawlResult);
        }

        if (insertBatch.length >= pc.batchInsertThreshold) {
            await dbService.insertIntoTable<T>(crawlerSource.tableName, insertBatch);
            insertBatch.length = 0;
        }
    }
    if (insertBatch.length > 0) {
        await dbService.insertIntoTable<T>(crawlerSource.tableName, insertBatch);
        insertBatch.length = 0;
    }
    await duckDBService.dropTable(tempTableName);

    // do data export stuff here
    console.log(await duckDBService.runQuery(`SELECT * FROM ${crawlerSource.tableName} LIMIT 1000`));
}

measureExecutionTime(runCrawlers);

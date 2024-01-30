import { checkFilePaths, createDirectory, getIngestFilePathsFromSources, measureExecutionTime } from "./src/utils";
import { crawlerConfigs as cc, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { AbstractCrawler } from "./src/scrapers/abstractCrawler";
import { ImageArchiveCrawler } from "./src/scrapers/archiveImageCrawler";

const duckDBService = new DuckDBService();

async function runCrawlers() {
    console.log("starting");
    // system initialization
    checkFilePaths(getIngestFilePathsFromSources(cc));

    await duckDBService.initDb({ dbLocation: ":memory:" });

    const instantiatedCrawlers = {
        imageArchive: new cc.imageArchive.crawler(cc.imageArchive, duckDBService) as ImageArchiveCrawler
    };

    createDirectory(pc.scraperOutputDirectory);

    await runCrawler(instantiatedCrawlers.imageArchive, duckDBService);
}

async function runCrawler(instantiatedCrawler: AbstractCrawler<any, any>, dbService: DuckDBService) {
    const insertBatch = [];

    const guideData = await instantiatedCrawler.loadGuideData();

    dbService.createTableFromDefinition(
        instantiatedCrawler.crawlerConfig.outputTableName,
        instantiatedCrawler.crawlerConfig.outputColumns
    );

    for (const row of guideData) {
        const crawlResult = await instantiatedCrawler.crawl(row);

        if (crawlResult.length > 0) {
            insertBatch.push(...crawlResult);
        }

        if (insertBatch.length >= pc.batchInsertThreshold) {
            await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
            insertBatch.length = 0;
        }
    }
    if (insertBatch.length > 0) {
        await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
        insertBatch.length = 0;
    }
    await instantiatedCrawler.teardown();

    // do data export stuff here

    console.log(await duckDBService.runQuery(`SELECT * FROM ${instantiatedCrawler.crawlerConfig.outputTableName}`));
}

measureExecutionTime(runCrawlers);

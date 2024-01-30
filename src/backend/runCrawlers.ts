import { checkFilePaths, createDirectory, getIngestFilePathsFromSources, measureExecutionTime } from "./src/utils";
import { crawlerConfigs, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { AbstractCrawler } from "./src/scrapers/abstractCrawler";

const duckDBService = new DuckDBService();

async function runCrawlers() {
    console.log("starting");
    // system initialization
    checkFilePaths(getIngestFilePathsFromSources(crawlerConfigs));

    await duckDBService.initDb({ dbLocation: ":memory:" });

    const instantiatedCrawlers = {
        imageArchive: new crawlerConfigs.imageArchive.crawler(crawlerConfigs.imageArchive, duckDBService)
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

        if (crawlResult) {
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
    console.log(
        await duckDBService.runQuery(`SELECT * FROM ${instantiatedCrawler.crawlerConfig.outputTableName} LIMIT 1000`)
    );
}

measureExecutionTime(runCrawlers);

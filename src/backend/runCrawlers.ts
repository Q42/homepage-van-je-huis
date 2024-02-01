import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getIngestFilePathsFromSources,
    measureExecutionTime,
    writeObjectToJsonFile
} from "./src/utils";
import { crawlerConfigs as cc, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { AbstractCrawler } from "./src/scrapers/abstractCrawler";
import { ImageArchiveCrawler } from "./src/scrapers/archiveImageCrawler";
import pRetry from "p-retry";
import { appendObjectToFile } from "./src/failureLog";
import cliProgress from "cli-progress";

const duckDBService = new DuckDBService();

async function manageDbProcess() {
    try {
        await runCrawlers();
    } finally {
        await duckDBService.teardown();
    }
}

async function runCrawlers() {
    console.log("starting");
    const sessionName = generateSessionName("crawler-run");
    // system initialization
    checkFilePaths(getIngestFilePathsFromSources(cc));
    createDirectory(pc.crawlerOutputDirectory);

    await duckDBService.initDb({ dbLocation: `${pc.crawlerOutputDirectory}/${sessionName}.duckdb` });

    const instantiatedCrawlers = {
        imageArchive: new cc.imageArchive.crawler(cc.imageArchive, duckDBService) as ImageArchiveCrawler
    };

    await runCrawler(instantiatedCrawlers.imageArchive, duckDBService, sessionName);
}

async function runCrawler(
    instantiatedCrawler: AbstractCrawler<any, any>,
    dbService: DuckDBService,
    sessionName: string
) {
    const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const insertBatch = [];

    let consecutiveFailures = 0;

    const guideData = await instantiatedCrawler.loadGuideData();

    dbService.createTableFromDefinition(
        instantiatedCrawler.crawlerConfig.outputTableName,
        instantiatedCrawler.crawlerConfig.outputColumns
    );

    statusBar.start(guideData.length, 0);

    for (const row of guideData) {
        const crawlResult: any[] = [];

        try {
            const intermediateResult = await pRetry(
                async () => await instantiatedCrawler.crawl(row),
                instantiatedCrawler.crawlerConfig.retryConfig
            );
            crawlResult.push(...intermediateResult);
            consecutiveFailures = 0;
            statusBar.increment();
        } catch (e) {
            consecutiveFailures++;
            appendObjectToFile(
                row,
                `${pc.crawlerOutputDirectory}/${sessionName}_${instantiatedCrawler.crawlerConfig.outputTableName}-failed.json`
            );

            console.log(e);
            console.log("error crawling row:", row);
        }

        if (crawlResult.length > 0) {
            insertBatch.push(...crawlResult);
        }

        if (insertBatch.length >= pc.batchInsertMinThreshold) {
            await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
            insertBatch.length = 0;
        }
        if (consecutiveFailures >= pc.maxConsecutiveCrawlFailures) {
            throw new Error("max consecutive failures reached, aborting crawl");
        }
    }
    if (insertBatch.length > 0) {
        await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
        insertBatch.length = 0;
    }
    statusBar.stop();
    await instantiatedCrawler.teardown();
    dbService.exportTable(
        instantiatedCrawler.crawlerConfig.outputTableName,
        `${pc.crawlerOutputDirectory}/${instantiatedCrawler.crawlerConfig.outputTableName}_${sessionName}`,
        undefined,
        "parquet"
    );
}

measureExecutionTime(manageDbProcess);

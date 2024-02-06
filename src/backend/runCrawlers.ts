import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getIngestFilePathsFromSources,
    measureExecutionTime
} from "./src/utils/general";
import { crawlerConfigs as cc, pipelineConfig as pc } from "./pipelineConfig";

import { AbstractCrawler } from "./src/crawlers/abstractCrawler";
import { ImageArchiveCrawler } from "./src/crawlers/archiveImageCrawler";
import pRetry, { AbortError } from "p-retry";
import cliProgress from "cli-progress";
import { appendObjectToFile } from "./src/lib/failureLog";
import { DuckDBService } from "./src/lib/duckDBService";
import { PublicArtCrawler } from "./src/crawlers/publicArtCrawler";

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
    await duckDBService.enableSpatialExtension();

    const instantiatedCrawlers = {
        imageArchive: new cc.imageArchive.crawler(cc.imageArchive, duckDBService) as ImageArchiveCrawler,
        publicArt: new cc.publicArt.crawler(cc.publicArt, { headless: false }) as PublicArtCrawler
    };

    // await runCrawler(instantiatedCrawlers.imageArchive, duckDBService, sessionName);
    await runCrawler(instantiatedCrawlers.publicArt, duckDBService, sessionName);
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
            if (!(e instanceof AbortError)) {
                consecutiveFailures++;
            }

            createDirectory(`${pc.crawlerOutputDirectory}/failureLogs`);
            appendObjectToFile(
                row,
                `${pc.crawlerOutputDirectory}/failureLogs/${sessionName}_${instantiatedCrawler.crawlerConfig.outputTableName}-failed.json`
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

import { createDirectory, generateSessionName, measureExecutionTime } from "./src/utils/general";
import { pipelineConfig as pc } from "./configs/pipelineConfig";

import { AbstractCrawler } from "./src/crawlers/abstractCrawler";

import pRetry, { AbortError } from "p-retry";
import cliProgress from "cli-progress";
import { appendObjectToFile } from "./src/lib/failureLog";
import { DuckDBService } from "./src/lib/duckDBService";
import { PublicArtCrawler } from "./src/crawlers/publicArtCrawler";
import { SparqlImageArchiveCrawler } from "./src/crawlers/sparqlImageCrawler";
import { crawlerConfigs as cc } from "./configs/crawlerConfigs";

const duckDBService = new DuckDBService();

const intermediateDbDir = pc.outputDirs.root + pc.outputDirs.intermediateDbs;
const duckDbDir = intermediateDbDir + "/duckDb";
const failureLogDir = `${pc.outputDirs.root}/crawl_failureLogs`;
const directoriesToBeCreated: string[] = [pc.outputDirs.root, intermediateDbDir, duckDbDir, failureLogDir];

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

    directoriesToBeCreated.forEach((dir) => createDirectory(dir));

    await duckDBService.initDb({ dbLocation: `${duckDbDir}/${sessionName}.duckdb` });

    const instantiatedCrawlers = {
        imageArchive: new cc.imageArchive.crawler(cc.imageArchive, duckDBService) as SparqlImageArchiveCrawler,
        publicArt: new cc.publicArt.crawler(cc.publicArt) as PublicArtCrawler
    };

    for (const crawler of Object.values(instantiatedCrawlers)) {
        if (crawler.crawlerConfig.skip) {
            console.log(`Skipping ${crawler.crawlerConfig.crawler.name} as specified in pipelineConfig`);
            continue;
        }
        try {
            await runCrawler(crawler, duckDBService, sessionName);
        } catch (e) {
            console.error(`Crawler ${crawler} has encoutered a critical error and was unable to finish the crawl`, e);
        }
    }
}

async function runCrawler(
    instantiatedCrawler: AbstractCrawler<any, any>,
    dbService: DuckDBService,
    sessionName: string
) {
    const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const insertBatch = [];

    let consecutiveFailures = 0;
    console.log("Loading guide data for:", instantiatedCrawler.crawlerConfig.crawler);
    const guideData = await instantiatedCrawler.loadGuideData();

    await dbService.createTableFromDefinition(
        instantiatedCrawler.crawlerConfig.outputTableName,
        instantiatedCrawler.crawlerConfig.outputColumns
    );

    console.log("Starting crawler:", instantiatedCrawler.crawlerConfig.crawler);

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
            } else {
                statusBar.increment();
            }

            appendObjectToFile(
                row,
                `${failureLogDir}/${sessionName}_${instantiatedCrawler.crawlerConfig.outputTableName}-failed.json`
            );
        }

        if (crawlResult.length > 0) {
            insertBatch.push(...crawlResult);
        }

        if (insertBatch.length >= pc.dbBatchInsertMinThreshold) {
            await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
            insertBatch.length = 0;
        }
        if (consecutiveFailures >= pc.maxConsecutiveCrawlFailuresBeforeAbort) {
            throw new Error("max consecutive failures reached, aborting crawl");
        }
    }
    if (insertBatch.length > 0) {
        await dbService.insertIntoTable(instantiatedCrawler.crawlerConfig.outputTableName, insertBatch);
        insertBatch.length = 0;
    }
    statusBar.stop();
    await instantiatedCrawler.finalize();
    await instantiatedCrawler.teardown();
    dbService.exportTable({
        tableName: instantiatedCrawler.crawlerConfig.outputTableName,
        outputFile: `${intermediateDbDir}/${instantiatedCrawler.crawlerConfig.outputTableName}`,
        columnDefenitions: instantiatedCrawler.crawlerConfig.outputColumns,
        outputFormat: "parquet"
    });
}

measureExecutionTime(manageDbProcess);

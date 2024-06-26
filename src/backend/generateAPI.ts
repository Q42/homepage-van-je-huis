import { AddressRecord } from "../common/apiSchema/addressRecord";
import { PastData, TimelineEntry } from "../common/apiSchema/past";
import { AgendaItem, PresentData } from "../common/apiSchema/present";
import { pipelineConfig as pc, pipelineConfig } from "./configs/pipelineConfig";
import { DuckDBService } from "./src/lib/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";

import cliProgress from "cli-progress";

import { assembleApiRecord, getMinMaxRangeFromPastData, getMinMaxRangeFromPresentData } from "./src/utils/api";

import {
    checkFilePaths,
    createDirectory,
    generateSessionName,
    getHouseNumberFromAddress,
    measureExecutionTime,
    writeObjectToJsonFile
} from "./src/utils/general";
import { stringLibrary } from "./src/lib/strings";
import { CrawlerConfig, CsvIngestSource, EnrichedDBAddress } from "./src/lib/types";
import { getPublicArt } from "./src/apiGenerators.ts/getPublicArt";
import { getCulturalFacilities } from "./src/apiGenerators.ts/getCulturalFacilities";
import { queries } from "./src/lib/queries/queries";
import { getSurroundingsPhotos, getArchivePhotosForBuilding } from "./src/apiGenerators.ts/getArchivePhotos";
import { getAggregates } from "./src/apiGenerators.ts/getAggregates";
import { ResolverService } from "./src/lib/resolverService";
import { slugifyAddress } from "../common/util/resolve";
import slugify from "slugify";
import { isExistingFile } from "./src/utils/checkExisting";
import { csvIngestSources as cs } from "./configs/csvSourceConfigs";
import { crawlerConfigs } from "./configs/crawlerConfigs";
import { AnalyticsService } from "./src/lib/analyticsService";

const duckDBService = new DuckDBService();
const resolverService = new ResolverService();
const analyticsService = new AnalyticsService(!pc.analyticsEnabled);
const sessionName = generateSessionName("api-generation");
const analyticsOutputDir = pc.outputDirs.root + pc.outputDirs.analytics;

async function generateAPI() {
    const resolverOutputDir = pc.outputDirs.root + pc.outputDirs.api.root + pc.outputDirs.api.apiResolver;
    const addressOutputDir = pc.outputDirs.root + pc.outputDirs.api.root + pc.outputDirs.api.apiRecords;
    const intermediateDbDir = pc.outputDirs.root + pc.outputDirs.intermediateDbs;

    const directoriesToBeCreated: string[] = [
        pc.outputDirs.root,
        pc.outputDirs.root + pc.outputDirs.api.root,
        addressOutputDir,
        resolverOutputDir
    ];

    if (pc.analyticsEnabled) {
        directoriesToBeCreated.push(analyticsOutputDir);
    }

    let generationCounter = 0;
    let skipCounter = 0;

    await duckDBService.initDb({ dbLocation: pc.generationTableLocation });

    const sources: (CsvIngestSource | CrawlerConfig)[] = [...Object.values(cs), ...Object.values(crawlerConfigs)];

    const sourcePaths = sources.map(
        (source) =>
            `${pipelineConfig.outputDirs.root + pipelineConfig.outputDirs.intermediateDbs}/${source.outputTableName}.parquet`
    );
    checkFilePaths(sourcePaths);

    for (const source of sources) {
        console.log("---");
        await duckDBService.loadIntermediateSource(source, intermediateDbDir);
        console.log("---");
    }

    const sampleSet: string[] = [];

    if (pc.loadAnalyticsSampleSetFromReport && pc.devMode.enabled) {
        sampleSet.push(...AnalyticsService.loadSampleSetFromReportFile(pc.loadAnalyticsSampleSetFromReport));
        console.log("Using sample set from analytics report");
    }

    const baseAdressList = (await duckDBService.runQuery(
        queries.sqlGetBaseTable({
            addressTable: cs.adressen.outputTableName,
            streetDescriptionTable: cs.straatOmschrijving.outputTableName,
            offset: pc.startOffset,
            limit: pc.devMode.enabled ? pc.devMode.limit : undefined,
            sampleSet: sampleSet
        })
    )) as EnrichedDBAddress[];

    directoriesToBeCreated.forEach((dir) => {
        createDirectory(dir);
    });

    const eventCalendar = (await duckDBService.runQuery(
        queries.sqlGetEventCalendar(cs.eventsPlaceholder.outputTableName)
    )) as calendarEvent[];
    const events: AgendaItem[] = eventCalendar.map((event) => ({
        title: event.Name_event,
        description: event.Description ?? stringLibrary.eventNoDescription,
        date: event.Date_start,
        dateEnd:
            event.Date_end && event.Date_end.toUTCString() !== event.Date_start.toUTCString()
                ? event.Date_end
                : undefined
    }));

    // Generate the aggregates
    console.log("Generating aggregates table");
    await duckDBService.runQuery(
        queries.aggregates.sqlCreateAggregateTable({
            aggregateTableName: pipelineConfig.aggregateTableName,
            buurtenTableName: cs.buurten.outputTableName,
            beesTableName: cs.bees.outputTableName,
            treesTableName: cs.trees.outputTableName
        })
    );

    // Start generating the individual address API files
    const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    console.log("starting api generation");
    statusBar.start(baseAdressList.length, 0);

    for (const address of baseAdressList) {
        const addressFileName = slugifyAddress(
            slugify,
            address["ligtAan:BAG.ORE.naamHoofdadres"],
            getHouseNumberFromAddress(address)
        );

        const outputFilePath = `${addressOutputDir}/${addressFileName}.json`;

        if (pc.skipExistingApiFiles && isExistingFile(outputFilePath)) {
            resolverService.addAddressToResolverData(address);
            statusBar.increment();
            skipCounter++;
            continue;
        }

        const addressPresent: PresentData = {
            rangeStart: 0,
            rangeEnd: 0,
            slider: [],
            agenda: events
        };

        const addressPast: PastData = {
            rangeStart: 0,
            rangeEnd: 0,
            timeline: [],
            stories: []
        };

        // Add the base data for the address
        if (address?.straatnaamBeschrijving) {
            addressPast.stories.push({
                title: stringLibrary.streetNameOrigin,
                contents: address.straatnaamBeschrijving.trim()
            });
        }

        // Add the public artworks
        const publicArt = await getPublicArt(duckDBService, address.identificatie);
        addressPresent.slider.push(...publicArt);

        // Add the cultural facilities
        const culturalFacilities = await getCulturalFacilities(duckDBService, address.identificatie);
        addressPresent.slider.push(...culturalFacilities);

        // Add the archive photos

        let archivePhotoUncertainty: number | undefined = undefined;
        const archivePhotos = await getArchivePhotosForBuilding(duckDBService, address["ligtIn:BAG.PND.identificatie"]);
        if (archivePhotos.length > 0) {
            archivePhotoUncertainty = 0;
        }

        if (archivePhotos.length < pc.minArchiveImages) {
            const { result, uncertainty }: { result: TimelineEntry[]; uncertainty: number } =
                await getSurroundingsPhotos({
                    duckDBService,
                    addressId: address.identificatie,
                    maxDistance: pc.maxImgSearchRadius,
                    limit: pc.minArchiveImages - archivePhotos.length,
                    excludeImages: archivePhotos.map((photo) => photo.image.url)
                });
            archivePhotoUncertainty = uncertainty;

            archivePhotos.push(...result);
        }

        addressPast.timeline.push(...archivePhotos);
        addressPast.timelineUncertainty = archivePhotoUncertainty;

        // This is where the record gets finalized
        if (addressPast.timeline.length > 0) {
            const pastStartEnd = getMinMaxRangeFromPastData(addressPast);
            addressPast.rangeStart = pastStartEnd.timeRangeStart;
            addressPast.rangeEnd = pastStartEnd.timeRangeEnd;
        }

        if (addressPresent.slider.length > 0) {
            const presentStartEnd = getMinMaxRangeFromPresentData(addressPresent);
            addressPresent.rangeStart = presentStartEnd.distanceRangeStart;
            addressPresent.rangeEnd = presentStartEnd.distanceRangeEnd;
        }

        // Sprinkle in the aggregate data
        const aggregateEntries = await getAggregates({
            duckDBService,
            address: address,
            rangeStart: addressPresent.rangeStart,
            rangeEnd: addressPresent.rangeEnd
        });

        addressPresent.slider.push(...aggregateEntries);

        if (pipelineConfig.sortSliders) {
            addressPresent.slider.sort((a, b) => a.position - b.position);
            // the past timeline is sorted inversely as it starts in the present (highest value)
            addressPast.timeline.sort((a, b) => b.position - a.position);
        }

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);

        writeObjectToJsonFile(addressRecord, outputFilePath);
        resolverService.addAddressToResolverData(address);
        generationCounter++;
        analyticsService.addRecordToAnalytics(addressRecord);
        statusBar.increment();
    }
    statusBar.stop();
    resolverService.writeResolverFiles(resolverOutputDir);
    console.log(`Generated ${generationCounter} API files, skipped ${skipCounter} existing files`);
}

async function teardown() {
    console.log("shutting down");
    analyticsService.writeAnalyticsDataToFile(analyticsOutputDir + "/analytics_" + sessionName);
    try {
        await duckDBService.db?.close();
    } catch {}
}

process.on("SIGINT", teardown); // CTRL+C
process.on("SIGQUIT", teardown); // Keyboard quit
process.on("SIGTERM", teardown); // `kill` command

async function dbProcessRunner() {
    try {
        return await generateAPI();
    } finally {
        await teardown();
    }
}

measureExecutionTime(dbProcessRunner);

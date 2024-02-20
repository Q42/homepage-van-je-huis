import { AddressRecord } from "../common/apiSchema/addressRecord";
import { PastData, TimelineEntry } from "../common/apiSchema/past";
import { AgendaItem, PresentData } from "../common/apiSchema/present";
import {
    crawlerConfigs,
    csvIngestSources as cs,
    csvIngestSources,
    pipelineConfig as pc,
    pipelineConfig
} from "./pipelineConfig";
import { DuckDBService } from "./src/lib/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";

import cliProgress from "cli-progress";

import { assembleApiRecord, getMinMaxRangeFromPastData, getMinMaxRangeFromPresentData } from "./src/utils/api";

import {
    checkFilePaths,
    createDirectory,
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

const duckDBService = new DuckDBService();
const resolverService = new ResolverService();

async function generateAPI() {
    const resolverOutputDir = pc.apiOutputDirectory + pc.apiResoliverDirectory;
    const addressOutputDir = pc.apiOutputDirectory + pc.apiAddressFilesDirectory;
    let generationCounter = 0;
    let skipCounter = 0;

    await duckDBService.initDb({ dbLocation: ":memory:" });

    const sources: (CsvIngestSource | CrawlerConfig)[] = [...Object.values(cs), ...Object.values(crawlerConfigs)];

    const sourcePaths = sources.map(
        (source) => `${pipelineConfig.intermediateOutputDirectory}/${source.outputTableName}.parquet`
    );
    checkFilePaths(sourcePaths);

    for (const source of sources) {
        console.log("---");
        await duckDBService.loadIntermediateSource(source);
        console.log("---");
    }

    const baseAdressList = (await duckDBService.runQuery(
        queries.sqlGetBaseTable({
            addressTable: cs.adressen.outputTableName,
            streetDescriptionTable: cs.straatOmschrijving.outputTableName,
            offset: pc.startOffset
        })
    )) as EnrichedDBAddress[];

    createDirectory(pc.apiOutputDirectory);
    createDirectory(addressOutputDir);

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
            buurtenTableName: csvIngestSources.buurten.outputTableName,
            beesTableName: csvIngestSources.bees.outputTableName,
            treesTableName: csvIngestSources.trees.outputTableName
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
            addressPast.timeline.sort((a, b) => a.position - b.position);
        }

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);

        writeObjectToJsonFile(addressRecord, outputFilePath);
        resolverService.addAddressToResolverData(address);
        generationCounter++;
        statusBar.increment();
    }
    statusBar.stop();
    resolverService.writeResolverFiles(resolverOutputDir);
    console.log(`Generated ${generationCounter} API files, skipped ${skipCounter} existing files`);
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

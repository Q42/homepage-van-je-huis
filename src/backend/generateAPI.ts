import { AddressRecord } from "./apiSchema/addressRecord";
import { PastData } from "./apiSchema/past";
import { AgendaItem, DistanceDataAggregateEntry, PresentData } from "./apiSchema/present";
import {
    crawlerConfigs,
    csvIngestSources as cs,
    devMode,
    pipelineConfig as pc,
    pipelineConfig
} from "./pipelineConfig";
import { DuckDBService } from "./src/lib/duckDBService";
import { calendarEvent } from "./src/models/eventCalendar";

import cliProgress from "cli-progress";

import {
    generateAddressID,
    assembleApiRecord,
    getMinMaxRangeFromPastData,
    getMinMaxRangeFromPresentData
} from "./src/utils/api";

import { checkFilePaths, createDirectory, measureExecutionTime, writeObjectToJsonFile } from "./src/utils/general";
import { stringLibrary } from "./src/lib/strings";
import { CrawlerConfig, CsvIngestSource, EnrichedDBAddress } from "./src/lib/types";
import { getPublicArt } from "./src/apiGenerators.ts/getPublicArt";
import { getCulturalFacilities } from "./src/apiGenerators.ts/getCulturalFacilities";
import { queries } from "./src/lib/queries";
import { generateAddresResolveSchema } from "./src/utils/db";
import { getAggregates } from "./src/apiGenerators.ts/getAggregates";

const duckDBService = new DuckDBService();

async function generateAPI() {
    await duckDBService.initDb({ dbLocation: ":memory:" });

    const sources: (CsvIngestSource | CrawlerConfig)[] = [...Object.values(cs), ...Object.values(crawlerConfigs)];

    const sourcePaths = sources.map(
        (source) => `${pipelineConfig.intermediateOutputDirectory}/${source.outputTableName}.parquet`
    );
    checkFilePaths(sourcePaths);

    for (const source of sources) {
        await duckDBService.loadIntermediateSource(source, true);
    }

    const baseAdressList = (await duckDBService.runQuery(queries.sqlGetBaseTable)) as EnrichedDBAddress[];

    const resolverOutputDir = pc.apiOutputDirectory + pc.apiResoliverDirectory;
    const addressOutputDir = pc.apiOutputDirectory + pc.apiAddressFilesDirectory;

    createDirectory(pc.apiOutputDirectory);
    createDirectory(resolverOutputDir);
    createDirectory(addressOutputDir);

    const eventCalendar = (await duckDBService.runQuery(queries.sqlGetEventCalendar)) as calendarEvent[];
    const events: AgendaItem[] = eventCalendar.map((event) => ({
        title: event.Name_event,
        description: event.Description ?? stringLibrary.eventNoDescription,
        date: event.Date_start,
        dateEnd:
            event.Date_end && event.Date_end.toUTCString() !== event.Date_start.toUTCString()
                ? event.Date_end
                : undefined
    }));

    // Generate the resolver api files
    console.log("Generating resolver files");
    const streetNames = (
        await duckDBService.runQuery(
            queries.sqlSelectDistinct({
                tableName: "adressen",
                column: "ligtAan:BAG.ORE.naamHoofdadres",
                columnAs: "s"
            })
        )
    ).map((row) => row["s"]) as string[];

    writeObjectToJsonFile({ streets: streetNames }, resolverOutputDir + "/streets.json");

    // writeObjectToJsonFile(generateAddresResolveSchema(baseAdressList), resolverOutputDir + "/addressFullResolve.json");

    // Start generating the individual address API files
    const statusBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    console.log("starting api generation");
    statusBar.start(baseAdressList.length, 0);

    const numberOfAggregates = Math.floor(pc.presentViewRangeMax / pc.presentAggregateInterval);

    for (const address of baseAdressList) {
        const addressPresent: PresentData = {
            distanceRangeStart: 0,
            distanceRangeEnd: 0,
            slider: [],
            agenda: events
        };

        const addressPast: PastData = {
            timeRangeStart: 0,
            timeRangeEnd: 0,
            timeline: [],
            stories: []
        };

        // This is where all the data gets added to the api files
        if (address?.straatnaamBeschrijving) {
            addressPast.stories.push({
                title: stringLibrary.streetNameOrigin,
                contents: address.straatnaamBeschrijving.trim()
            });
        }

        // Add the aggregate data
        const aggregateDataEntries = await getAggregates({
            duckDBService: duckDBService,
            addresId: address.identificatie,
            numberOfAggregates: numberOfAggregates,
            interval: pc.presentAggregateInterval
        });

        addressPresent.slider.push(...aggregateDataEntries);

        // Add the public artworks
        const publicArt = await getPublicArt(duckDBService, address.identificatie);
        addressPresent.slider.push(...publicArt);

        // Add the cultural facilities
        const culturalFacilities = await getCulturalFacilities(duckDBService, address.identificatie);
        addressPresent.slider.push(...culturalFacilities);

        // This is where the record gets finalized
        if (addressPast.timeline.length > 0) {
            const pastStartEnd = getMinMaxRangeFromPastData(addressPast);
            addressPast.timeRangeStart = pastStartEnd.timeRangeStart;
            addressPast.timeRangeEnd = pastStartEnd.timeRangeEnd;
        }

        if (addressPresent.slider.length > 0) {
            const presentStartEnd = getMinMaxRangeFromPresentData(addressPresent);
            addressPresent.distanceRangeStart = presentStartEnd.distanceRangeStart;
            addressPresent.distanceRangeEnd = presentStartEnd.distanceRangeEnd;

            if (pipelineConfig.sortSliders) {
                addressPresent.slider.sort((a, b) => a.distanceToAddress - b.distanceToAddress);
                addressPast.timeline.sort((a, b) => a.year - b.year);
            }
        }

        const addressRecord: AddressRecord = assembleApiRecord(address, addressPresent, addressPast);
        writeObjectToJsonFile(
            addressRecord,
            `${addressOutputDir}/${generateAddressID(addressRecord.address)}.json`,
            devMode.enabled
        );
        statusBar.increment();
    }
    statusBar.stop();
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

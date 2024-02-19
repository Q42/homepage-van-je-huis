import { TimelineEntry } from "../../../common/apiSchema/past";
import { crawlerConfigs, csvIngestSources } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries/queries";
import { SparqlImage } from "../models/sparqlImages";

function getDatePosition(date1?: Date, date2?: Date) {
    if (!date1 && !date2) {
        throw new Error("Both dates are undefined");
    }

    const year1 = date1 ? date1.getFullYear() : undefined;
    const year2 = date2 ? date2.getFullYear() : undefined;

    if (year1 === undefined && year2 === undefined) {
        throw new Error("Both years are undefined");
    }

    const averageYear = year1 !== undefined && year2 !== undefined ? Math.round((year1 + year2) / 2) : year1 ?? year2;

    if (averageYear === undefined) {
        throw new Error("Unable to determine year position");
    }

    return averageYear;
}

function mapImageRecord(images: SparqlImage[]): TimelineEntry[] {
    return images
        .map((image) => {
            try {
                const entry: TimelineEntry = {
                    image: {
                        url: image.imgUrl,
                        altText: image.title
                    },
                    visitUrl: image.archiveUrl,
                    title: image.title,
                    position: getDatePosition(image.startDate, image.endDate),
                    type: "archiveImage"
                };
                return entry;
            } catch {
                return;
            }
        })
        .filter((entry) => entry !== undefined) as TimelineEntry[];
}

export async function getArchivePhotosForBuilding(
    duckDBService: DuckDBService,
    pandId: string
): Promise<TimelineEntry[]> {
    const dbResults = (await duckDBService.runQuery(
        queries.imageArchive.sqlSelectArchivePhotos({
            photoTableName: crawlerConfigs.imageArchive.outputTableName,
            pandId: pandId
        })
    )) as SparqlImage[];
    return mapImageRecord(dbResults);
}

export async function getSurroundingsPhotos({
    duckDBService,
    addressId,
    maxDistance,
    limit,
    excludeImages
}: {
    duckDBService: DuckDBService;
    addressId: string;
    maxDistance: number;
    limit: number;
    excludeImages?: string[];
}): Promise<{ result: TimelineEntry[]; uncertainty: number }> {
    let uncertainty = 1;

    let dbResults = (await duckDBService.runQuery(
        queries.imageArchive.sqlGetNeighboringImages({
            addressTableName: csvIngestSources.adressen.outputTableName,
            archiveImagesTableName: crawlerConfigs.imageArchive.outputTableName,
            addressId: addressId,
            maxDistance: maxDistance,
            limit: limit,
            excludeImages: excludeImages
        })
    )) as SparqlImage[];

    excludeImages?.push(...dbResults.map((photo) => photo.imgUrl));
    let remainingLimit = limit - dbResults.length;

    if (remainingLimit > 0) {
        const intermediate_results = (await duckDBService.runQuery(
            queries.imageArchive.sqlStreetIdSearch({
                addressTableName: csvIngestSources.adressen.outputTableName,
                archiveImagesTableName: crawlerConfigs.imageArchive.outputTableName,
                addressId: addressId,
                limit: remainingLimit,
                excludeImages: excludeImages
            })
        )) as SparqlImage[];

        if (intermediate_results.length > 0) {
            uncertainty = 2;
            dbResults.push(...intermediate_results);
            excludeImages?.push(...intermediate_results.map((photo) => photo.imgUrl));
            remainingLimit = limit - dbResults.length;
        }
    }

    if (remainingLimit > 0) {
        const intermediate_results = (await duckDBService.runQuery(
            queries.imageArchive.sqlAddressTitleSearch({
                addressTableName: csvIngestSources.adressen.outputTableName,
                archiveImagesTableName: crawlerConfigs.imageArchive.outputTableName,
                addressId: addressId,
                limit: remainingLimit,
                excludeImages: excludeImages
            })
        )) as SparqlImage[];

        if (intermediate_results.length > 0) {
            uncertainty = 3;
            dbResults.push(...intermediate_results);
        }
    }
    return { result: mapImageRecord(dbResults), uncertainty };
}

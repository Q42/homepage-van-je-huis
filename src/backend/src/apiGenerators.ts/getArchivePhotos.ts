import { TimelineEntry } from "../../../common/apiSchema/past";
import { crawlerConfigs } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries";
import { ImageApiResponse } from "../lib/types";

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

export async function getArchivePhotos(duckDBService: DuckDBService, pandId: string): Promise<TimelineEntry[]> {
    const dbResults = (await duckDBService.runQuery(
        queries.sqlSelectArchivePhotos({ photoTableName: crawlerConfigs.imageArchive.outputTableName, pandId: pandId })
    )) as ImageApiResponse[];
    return dbResults
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

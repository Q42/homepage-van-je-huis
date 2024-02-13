import { TimelineEntry } from "../../../common/apiSchema/past";
import { crawlerConfigs } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries";
import { ImageApiResponse } from "../lib/types";

export async function getArchivePhotos(duckDBService: DuckDBService, pandId: string): Promise<TimelineEntry[]> {
    const dbResults = (await duckDBService.runQuery(
        queries.sqlSelectArchivePhotos({ photoTableName: crawlerConfigs.imageArchive.outputTableName, pandId: pandId })
    )) as ImageApiResponse[];

    return dbResults.map((image) => {
        const entry: TimelineEntry = {
            image: {
                url: image.imgUrl,
                altText: undefined
            },
            visitUrl: image.archiveUrl,
            title: image.title,
            position: 0,
            type: "archiveImage"
        };
        return entry;
    });
}

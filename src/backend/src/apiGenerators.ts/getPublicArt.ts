import { DistanceImageViewEntry } from "../../apiSchema/present";
import { crawlerConfigs as cc, csvIngestSources as cs, pipelineConfig as pc } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { CustomizedPublicArtRecord } from "../models/publicArtRecord";
import { queries } from "../lib/queries";

export async function getPublicArt(duckDBService: DuckDBService, addressId: string): Promise<DistanceImageViewEntry[]> {
    const customArtRecords = (await duckDBService.runQuery(
        queries.sqlSelectPublicArt({
            addresTableName: cs.adressen.outputTableName,
            artTableName: cc.publicArt.outputTableName,
            addressId: addressId,
            range: pc.presentViewRangeMax
        })
    )) as CustomizedPublicArtRecord[];
    return customArtRecords.map((artRecord) => {
        const newEntry: DistanceImageViewEntry = {
            distanceToAddress: artRecord.distance_from_address,
            title: artRecord.title,
            visitUrl: artRecord.visitUrl,
            image: { url: artRecord.image, altText: artRecord.title },
            type: "outdoorArt"
        };
        return newEntry;
    });
}

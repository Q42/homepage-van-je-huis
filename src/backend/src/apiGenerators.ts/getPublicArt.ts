import { DistanceViewEntry } from "../../apiSchema/present";
import { crawlerConfigs as cc, csvIngestSources as cs } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { CustomizedPublicArtRecord } from "../models/publicArtRecord";
import { queries } from "../queries";

export async function getPublicArt(duckDBService: DuckDBService, addressId: string): Promise<DistanceViewEntry[]> {
    const customArtRecords = (await duckDBService.runQuery(
        queries.sqlSelectPublicArt(cs.adressen.outputTableName, cc.publicArt.outputTableName, addressId, 1000)
    )) as CustomizedPublicArtRecord[];
    return customArtRecords.map((artRecord) => {
        const newEntry: DistanceViewEntry = {
            distanceToAddress: artRecord.distance_from_address,
            title: artRecord.title,
            visitUrl: artRecord.visitUrl,
            image: { url: artRecord.image, altText: artRecord.title },
            type: "outdoorArt"
        };
        return newEntry;
    });
}

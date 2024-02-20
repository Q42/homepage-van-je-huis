import { DistanceViewEntry } from "../../../common/apiSchema/present";
import { pipelineConfig as pc } from "../../configs/pipelineConfig";

import { DuckDBService } from "../lib/duckDBService";
import { CustomizedPublicArtRecord } from "../models/publicArtRecord";
import { queries } from "../lib/queries/queries";
import { crawlerConfigs as cc } from "../../configs/crawlerConfigs";
import { csvIngestSources as cs } from "../../configs/csvSourceConfigs";

export async function getPublicArt(duckDBService: DuckDBService, addressId: string): Promise<DistanceViewEntry[]> {
    const customArtRecords = (await duckDBService.runQuery(
        queries.sqlSelectPublicArt({
            addresTableName: cs.adressen.outputTableName,
            artTableName: cc.publicArt.outputTableName,
            addressId: addressId,
            range: pc.presentViewRangeMax
        })
    )) as CustomizedPublicArtRecord[];
    return customArtRecords.map((artRecord) => {
        const newEntry: DistanceViewEntry = {
            position: artRecord.distance_from_address,
            title: artRecord.title,
            visitUrl: artRecord.visitUrl,
            image: { url: artRecord.image, altText: artRecord.title },
            type: "outdoorArt"
        };
        return newEntry;
    });
}

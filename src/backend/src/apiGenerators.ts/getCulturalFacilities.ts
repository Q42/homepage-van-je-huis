import { DistanceViewEntry } from "../../apiSchema/present";
import { crawlerConfigs as cc, csvIngestSources as cs } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { CustomizedCulturalFacilityRecord } from "../models/culturalFacility";
import { queries } from "../queries";
import { duckDBTransformLatLongGeoToRD } from "../utils/rijksdriehoek";

export async function getCulturalFacilities(
    duckDBService: DuckDBService,
    addressId: string
): Promise<DistanceViewEntry[]> {
    const rdGeoColumn = "rd_location";

    await duckDBTransformLatLongGeoToRD({
        duckDBService: duckDBService,
        tableName: cs.culturalFacilities.outputTableName,
        latLongColumnName: "WKT_LAT_LNG",
        newRdColumnName: rdGeoColumn
    });

    const customArtRecords = (await duckDBService.runQuery(
        queries.sqlSelectCulturalFacilities({
            addresTableName: "adressen",
            facilitiesTableName: cs.culturalFacilities.outputTableName,
            addressId: addressId,
            locationColumn: rdGeoColumn,
            range: 1000
        })
    )) as CustomizedCulturalFacilityRecord[];

    return customArtRecords.map((artRecord) => {
        const newEntry: DistanceViewEntry = {
            distanceToAddress: artRecord.distance_from_address,
            title: artRecord.Naamorganisatie,
            visitUrl: artRecord.Correctie_Website,
            type: "cultureMulti"
        };
        return newEntry;
    });
}

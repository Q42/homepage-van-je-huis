import { DistanceViewEntry, PresentEntityType } from "../../../common/apiSchema/present";
import { csvIngestSources as cs } from "../../configs/csvSourceConfigs";
import { pipelineConfig as pc } from "../../configs/pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries/queries";
import { CustomizedCulturalFacilityRecord } from "../models/culturalFacility";

function mapFacilityType(term: string): PresentEntityType | undefined {
    const termMapping: Record<string, PresentEntityType> = {
        "Multidisciplinair": "cultureMulti",
        "Muziek": "musicVenue",
        "Theater": "theatre",
        "Beeldende Kunst": "visualArts",
        "Film": "cinema",
        "Erfgoed": "heritage",
        "Architectuur": "architecture",
        "Creatieve Industrie": "creativeIndustries",
        "Dans": "dance",
        "Fotografie": "photography",
        "Beeldende kunst": "visualArts",
        "Creatieve industrie": "creativeIndustries",
        "Letteren": "literary",
        "TV en Radio": "TVandRadio",
        "Nieuwe Media": "newMedia",
        "Debat": "debate"
    };

    return termMapping[term];
}

export async function getCulturalFacilities(
    duckDBService: DuckDBService,
    addressId: string
): Promise<DistanceViewEntry[]> {
    const customArtRecords = (await duckDBService.runQuery(
        queries.sqlSelectCulturalFacilities({
            addresTableName: "adressen",
            facilitiesTableName: cs.culturalFacilities.outputTableName,
            addressId: addressId,
            locationColumn: pc.rdColumnPrefix + cs.culturalFacilities.outputTableName,
            range: pc.presentViewRangeMax
        })
    )) as CustomizedCulturalFacilityRecord[];

    return customArtRecords.map((artRecord) => {
        const newEntry: DistanceViewEntry = {
            position: artRecord.distance_from_address,
            // There are some encoding errors in the source CSV file that result in é being replaced by Ã©.
            title: artRecord.Naamorganisatie?.replace(/Ã©/g, "é"),
            visitUrl: artRecord.Correctie_Website,
            type: mapFacilityType(artRecord.Kunstdiscipline) ?? "cultureMulti"
        };
        return newEntry;
    });
}

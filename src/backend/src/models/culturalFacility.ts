import { ColumnDefenitions, GeoString } from "../lib/types";
export type CulturalFacilityRecord = {
    Naamorganisatie: string;
    Kunstdiscipline: string;
    Correctie_Website?: string;
    WKT_LAT_LNG: GeoString;
};
export const cultureFacilitiesInputColumns: ColumnDefenitions = {
    OBJECTNUMMER: "VARCHAR",
    Naamorganisatie: "VARCHAR",
    Kunstdiscipline: "VARCHAR",
    Correctie_Website: "VARCHAR",
    WKT_LNG_LAT: "VARCHAR",
    WKT_LAT_LNG: "VARCHAR",
    LNG: "DOUBLE",
    LAT: "DOUBLE"
};

export const cultureFacilitiesOutputColumns: string[] = [
    "Naamorganisatie",
    "Kunstdiscipline",
    "Correctie_Website",
    "WKT_LAT_LNG"
];

export interface CustomizedCulturalFacilityRecord extends Omit<CulturalFacilityRecord, "location"> {
    distance_from_address: number;
}

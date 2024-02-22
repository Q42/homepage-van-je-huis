import { ColumnDefenitions, GeoString } from "../lib/types";
import { amsterdamMapsGeoColumns } from "./amsterdamMapsGeo";
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
    ...amsterdamMapsGeoColumns
};

export const cultureFacilitiesOutputColumns: string[] = [
    "Naamorganisatie",
    "Kunstdiscipline",
    "Correctie_Website",
    "WKT_LAT_LNG"
];

export type CustomizedCulturalFacilityRecord = {
    distance_from_address: number;
} & Omit<CulturalFacilityRecord, "location">

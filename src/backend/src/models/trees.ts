import { ColumnDefenitions, GeoString } from "../lib/types";
import { amsterdamMapsGeoColumns } from "./amsterdamMapsGeo";
export type TreeRecord = {
    Naamorganisatie: string;
    Kunstdiscipline: string;
    Correctie_Website?: string;
    WKT_LAT_LNG: GeoString;
};
export const treesInputColumns: ColumnDefenitions = {
    OBJECTNUMMER: "VARCHAR",
    id: "VARCHAR",
    soortnaam: "VARCHAR",
    soortnaamKort: "VARCHAR",
    SoortnaamNL: "VARCHAR",
    soortnaamTop: "VARCHAR",
    boomhoogteklasseActueel: "VARCHAR",
    stamdiameterklasse: "VARCHAR",
    jaarVanAanleg: "INTEGER",
    typeObject: "VARCHAR",
    standplaatsGedetailleerd: "VARCHAR",
    typeBeheerderPlus: "VARCHAR",
    typeEigenaarPlus: "VARCHAR",
    ...amsterdamMapsGeoColumns
};

export const treesOutputColumns: string[] = [
    "soortnaam",
    "boomhoogteklasseActueel",
    "jaarVanAanleg",
    "typeBeheerderPlus"
];

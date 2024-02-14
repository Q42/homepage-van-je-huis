import { ColumnDefenitions } from "../lib/types";
import { amsterdamMapsGeoColumns } from "./amsterdamMapsGeo";

export const beesInputColumns: ColumnDefenitions = {
    OBJECTNUMMER: "VARCHAR",
    Aantal_kasten: "VARCHAR",
    Aantal_volken: "INTEGER",
    ...amsterdamMapsGeoColumns
};

export const beesOutputColumns: string[] = [...Object.keys(beesInputColumns)];

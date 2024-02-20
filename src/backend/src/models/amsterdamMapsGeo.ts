import { ColumnDefenitions } from "../lib/types";

// The base fields present in almost all csv files from maps.amsterdam.nl
export const amsterdamMapsGeoColumns: ColumnDefenitions = {
    WKT_LNG_LAT: "GEOMETRY",
    WKT_LAT_LNG: "GEOMETRY",
    LNG: "DOUBLE",
    LAT: "DOUBLE"
};

import { CsvIngestSources } from "../src/lib/types";

import { adresInputColumns, adresOutputColumns } from "../src/models/adresses";
import { straatOmschrijvingInputColumns, straatnaamOmschrijvingOutputColumns } from "../src/models/straatOmschrijving";
import { cultureFacilitiesInputColumns, cultureFacilitiesOutputColumns } from "../src/models/culturalFacility";
import { treesInputColumns, treesOutputColumns } from "../src/models/trees";
import { buurtenInputColumns, buurtenOutputColumns } from "../src/models/buurten";
import { beesInputColumns, beesOutputColumns } from "../src/models/bees";

// See the type defenition for more info on what all these parameters do.
export const csvIngestSources: CsvIngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        outputTableName: "adressen",
        inputColumns: adresInputColumns,
        outputColumns: adresOutputColumns
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        outputTableName: "straatNaamOmschrijving",
        inputColumns: straatOmschrijvingInputColumns,
        outputColumns: straatnaamOmschrijvingOutputColumns
    },
    culturalFacilities: {
        ingestSourcePath: "./data_input/CULTUURVOORZIENINGEN.csv",
        outputTableName: "cultuurvoorzieningen",
        inputColumns: cultureFacilitiesInputColumns,
        outputColumns: cultureFacilitiesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    buurten: {
        ingestSourcePath: "./data_input/GBD_buurt_Actueel.csv",
        outputTableName: "buurten",
        inputColumns: buurtenInputColumns,
        outputColumns: buurtenOutputColumns
    },
    trees: {
        ingestSourcePath: "./data_input/BOMEN.csv",
        outputTableName: "bomen",
        inputColumns: treesInputColumns,
        outputColumns: treesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    bees: {
        ingestSourcePath: "./data_input/BIJEN_HONING.csv",
        outputTableName: "bijen",
        inputColumns: beesInputColumns,
        outputColumns: beesOutputColumns,
        geoTransformColumn: "WKT_LAT_LNG"
    },
    // Below are just placeholders for now and need to be replaced with the actual data once its available
    eventsPlaceholder: {
        ingestSourcePath: "./placeholder_data/AMS750_events_csv.csv",
        outputTableName: "events",
        inputColumns: {
            Name_event: "VARCHAR",
            Date_start: "DATE",
            Date_end: "DATE",
            Location: "VARCHAR",
            Description: "VARCHAR"
        },
        outputColumns: ["Name_event", "Date_start", "Date_end", "Location", "Description"]
    }
};

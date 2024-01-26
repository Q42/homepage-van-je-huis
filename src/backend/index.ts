import { checkIngestSources, createDirectory, getColumnKeysFromSourceDef, measureExecutionTime } from "./src/utils";
import { DuckDBService } from "./src/duckDBService";
import { IngestSources } from "./src/types";

const outputDir = "./data_output";

const ingestSources: IngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        outputName: "adressen",
        columnTypes: {
            "identificatie": "VARCHAR",
            "huisnummerHoofdadres": "INTEGER",
            "huisletterHoofdadres": "VARCHAR",
            "huisnummertoevoegingHoofdadres": "VARCHAR",
            "postcodeHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.identificatieHoofdadres": "VARCHAR",
            "ligtAan:BAG.ORE.naamHoofdadres": "VARCHAR",
            "gebruiksdoel": "VARCHAR",
            "ligtIn:GBD.BRT.code": "VARCHAR",
            "ligtIn:GBD.WIJK.code": "VARCHAR",
            "ligtIn:GBD.GGW.code": "VARCHAR",
            "ligtIn:GBD.SDL.code": "VARCHAR",
            "geometrie": "VARCHAR"
        }
    },
    straatOmschrijving: {
        ingestSourcePath: "./data_input/BAG_openbare_ruimte_beschrijving_Actueel.csv",
        outputName: "straatOmschrijving"
    }
};

const duckDBService = new DuckDBService();

// const joinTest = `SELECT "ligtAan:BAG.ORE.naamHoofdadres", "huisnummerHoofdadres", "column2" FROM adressen JOIN straatomschrijving ON (adressen."ligtAan:BAG.ORE.identificatieHoofdadres" = straatOmschrijving.column0) LIMIT 3`;

async function cliRunner() {
    console.log("starting");
    // system initialization
    checkIngestSources(ingestSources);
    await duckDBService.initDb({ dbLocation: ":memory:" });
    createDirectory(outputDir);

    await duckDBService.ingestCSV(ingestSources.adressen);

    await duckDBService.exportTable(
        ingestSources.adressen.outputName,
        `${outputDir}/${ingestSources.adressen.outputName}.json`,
        getColumnKeysFromSourceDef(ingestSources.adressen)
    );
}
async function ensureDBIsClosed() {
    try {
        return cliRunner();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(ensureDBIsClosed);

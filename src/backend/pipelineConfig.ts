import { IngestSources, IntermediateOutputFormats } from "./src/types";

export const ingestSources: IngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        tableName: "adressen",
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
        tableName: "straatNaamOmschrijving",
        columnTypes: {
            identificatie: "VARCHAR",
            naam: "VARCHAR",
            beschrijving: "VARCHAR"
        }
    }
};

export type PipelineConfig = {
    intermediateOutputDirectory: string;
    intermediateOutputFormat: IntermediateOutputFormats;
};

export const pipelineConfig: PipelineConfig = {
    intermediateOutputDirectory: "./intermediate_output",
    intermediateOutputFormat: "parquet"
};

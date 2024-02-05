import { csvIngestSources as cs } from "../pipelineConfig";

export const queries = {
    selectDistinct: (tableName: string, column: string, columnAs?: string) =>
        `SELECT DISTINCT ${column} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,
    getBaseTable: `SELECT ${cs.adressen.tableName}.*, beschrijving AS straatnaamBeschrijving FROM ${cs.adressen.tableName} JOIN ${cs.straatOmschrijving.tableName} ON (${cs.adressen.tableName}."ligtAan:BAG.ORE.identificatieHoofdadres" = ${cs.straatOmschrijving.tableName} .identificatie)`
};

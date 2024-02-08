import { csvIngestSources as cs } from "../../pipelineConfig";

export const queries = {
    selectDistinct: (tableName: string, column: string, columnAs?: string) =>
        `SELECT DISTINCT ${column} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,
    getBaseTable: `SELECT ${cs.adressen.outputTableName}.*, beschrijving AS straatnaamBeschrijving FROM ${cs.adressen.outputTableName} JOIN ${cs.straatOmschrijving.outputTableName} ON (${cs.adressen.outputTableName}."ligtAan:BAG.ORE.identificatieHoofdadres" = ${cs.straatOmschrijving.outputTableName} .identificatie)`,
    getEventCalendar: `SELECT * FROM ${cs.eventsPlaceholder.outputTableName} ORDER BY Date_start ASC`
};

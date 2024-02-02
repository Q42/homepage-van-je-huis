import { csvIngestSources as cs } from "../pipelineConfig";
export const queries = {
    selectDistinct: (tableName: string, column: string, columnAs?: string) =>
        `SELECT DISTINCT ${column} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,
    getAddressIndex: `SELECT identificatie AS id, "ligtAan:BAG.ORE.naamHoofdadres" AS streetName, huisnummerHoofdadres AS number FROM ${cs.adressen.tableName}`
};

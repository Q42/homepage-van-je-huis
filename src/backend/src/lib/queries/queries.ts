import { GeoString } from "../types";
import { aggregateQueries } from "./agregates";
import { sqlTransformGeometry } from "./geoTransform";
import { imageArchive } from "./imageRetrieval";
import { sparqlQueries } from "./sparql";

export const queries = {
    sqlGetBaseTable: ({
        addressTable,
        streetDescriptionTable,
        offset,
        limit,
        sampleSet
    }: {
        addressTable: string;
        streetDescriptionTable: string;
        offset?: number;
        limit?: number;
        sampleSet?: string[];
    }) => {
        let sampleString = "";

        if (sampleSet && sampleSet.length > 0) {
            sampleString = `WHERE A.identificatie IN ('${sampleSet.join("','")}')`;
        }

        return `
        SELECT
            A.*,
            beschrijving AS straatnaamBeschrijving
        FROM
            ${addressTable} A
        JOIN ${streetDescriptionTable} AS B
                ON
            (A."ligtAan:BAG.ORE.identificatieHoofdadres" = B.identificatie)
        ${sampleString}
        ORDER BY
            A."ligtAan:BAG.ORE.naamHoofdadres",
            A.huisnummerHoofdadres,
            A.huisletterHoofdadres,
            A.huisnummertoevoegingHoofdadres ASC
        ${offset ? `OFFSET ${offset}` : ""}
        ${limit ? `LIMIT ${limit}` : ""}    
        `;
    },
    sqlGetEventCalendar: (eventsTableName: string) => `SELECT * FROM ${eventsTableName} ORDER BY Date_start ASC`,
    sqlSelectDistinct: ({ tableName, column, columnAs }: { tableName: string; column: string; columnAs?: string }) =>
        `SELECT DISTINCT ${column === "*" ? "*" : `"${column}"`} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,

    countWithinRangeOfLocation: ({
        location,
        targetTable,
        targetColumn,
        targetGeometryColumn,
        range
    }: {
        location: GeoString;
        targetTable: string;
        targetColumn: string;
        targetGeometryColumn: string;
        range: number;
    }) => `
    SELECT COUNT(A.${targetColumn})
    FROM "${targetTable}" 
    WHERE ST_Distance(${targetGeometryColumn}, ST_GeomFromText('${location}')) < ${range}
    `,
    sqlStringReplace: ({
        targetTable,
        targetColumn,
        sourceString,
        targetString
    }: {
        targetTable: string;
        targetColumn: string;
        sourceString: string;
        targetString: string;
    }) => `
    UPDATE "${targetTable}"
    SET "${targetColumn}" = REPLACE("${targetColumn}", '${sourceString}', '${targetString}');
    `,

    sqlSelectPublicArt: ({
        addresTableName,
        artTableName,
        addressId,
        range
    }: {
        addresTableName: string;
        artTableName: string;
        addressId: string;
        range: number;
    }) => `
        SELECT A.title , A.image , A.visitUrl , round(ST_Distance(A.location, B.geometrie),0) as distance_from_address
        FROM ${artTableName} A
        JOIN ${addresTableName} B ON ST_Distance(A.location, B.geometrie) < ${range}
        WHERE B.identificatie = '${addressId}'
        ORDER BY distance_from_address ASC;
        `,
    sqlSelectCulturalFacilities: ({
        addresTableName,
        facilitiesTableName,
        addressId,
        locationColumn,
        range
    }: {
        addresTableName: string;
        facilitiesTableName: string;
        addressId: string;
        locationColumn: string;
        range: number;
    }) => `
        SELECT A.* , round(ST_Distance(A.${locationColumn}, B.geometrie),0) as distance_from_address
        FROM ${facilitiesTableName} A
        JOIN ${addresTableName} B ON ST_Distance(A.${locationColumn}, B.geometrie) < ${range}
        WHERE B.identificatie = '${addressId}'
        ORDER BY distance_from_address ASC;
        `,

    aggregates: aggregateQueries,
    sparql: sparqlQueries,
    imageArchive: imageArchive,
    sqlTransformGeometry
};

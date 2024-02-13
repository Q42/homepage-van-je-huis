import { SparqlBatch } from "./types";

/**
 * Transforms the geometry column of a table in the database.
 * Adds a new geometry column and updates it with transformed geometry values.
 *
 * @param {string} tableName - The name of the table.
 * @param {string} newGeoColumnName - The name of the new geometry column.
 * @param {string} sourceColumnName - The name of the source geometry column. IMPORTANT: This must be a geometry text (VARCHAR) column, not a geometry column.
 * @param {string} sourceEpsg - The EPSG code of the source coordinate system.
 * @param {string} targetEpsg - The EPSG code of the target coordinate system.
 * @returns {string} The SQL query for adding a new column in the targed coordinate system.
 */
const sqlTransformGeometry = ({
    tableName,
    newGeoColumnName,
    sourceColumnName,
    sourceEpsg,
    targetEpsg
}: {
    tableName: string;
    newGeoColumnName: string;
    sourceColumnName: string;
    sourceEpsg: string;
    targetEpsg: string;
}) => `
ALTER TABLE ${tableName} ADD COLUMN ${newGeoColumnName} GEOMETRY;    
UPDATE ${tableName} 
SET ${newGeoColumnName} = ST_Transform(ST_GeomFromText(${sourceColumnName}), '${sourceEpsg}', '${targetEpsg}');`;

export const queries = {
    sqlGetBaseTable: ({
        addressTable,
        streetDescriptionTable
    }: {
        addressTable: string;
        streetDescriptionTable: string;
    }) =>
        `SELECT ${addressTable}.*, beschrijving AS straatnaamBeschrijving FROM ${addressTable} JOIN ${streetDescriptionTable} ON (${addressTable}."ligtAan:BAG.ORE.identificatieHoofdadres" = ${streetDescriptionTable} .identificatie)`,
    sqlGetEventCalendar: (eventsTableName: string) => `SELECT * FROM ${eventsTableName} ORDER BY Date_start ASC`,
    sqlSelectDistinct: ({ tableName, column, columnAs }: { tableName: string; column: string; columnAs?: string }) =>
        `SELECT DISTINCT "${column}" ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,

    sparqlSearchByAddress: (street: string, houseNumber: number) => `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX daa: <https://data.archief.amsterdam/ontology#>
        PREFIX schema: <http://www.w3.org/2000/01/rdf-schema#>
        prefix plainSchema: <http://schema.org/>
        PREFIX memorix: <https://ams-migrate.memorix.io/resources/recordtypes/Image#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT * WHERE {
        ?o daa:hasOrHadSubjectLocation ?location .
        ?location schema:label "${street}".
        ?o memorix:isAssociatedWithAddress ?address.
        ?o plainSchema:thumbnailUrl ?url.
        ?address daa:houseNumberBegin ?houseNumberSmall.
        ?address daa:houseNumberEnd ?houseNumberBig.
        filter(xsd:integer(?houseNumberSmall) <= ${houseNumber} && xsd:integer(?houseNumberBig) >= ${houseNumber})
        } LIMIT 1000`,

    sparqlGetTotalImages: `
    PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
    PREFIX bag: <http://bag.basisregistraties.overheid.nl/def/bag#>
    PREFIX schema: <https://schema.org/>
    PREFIX hg: <http://rdf.histograph.io/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX saa: <https://data.archief.amsterdam/ontology#>
    PREFIX memorix: <https://ams-migrate.memorix.io/resources/recordtypes/>

    SELECT (COUNT(*) as ?cnt) WHERE {
    {
        ?widget a memorix:Image ;
                saa:hasOrHadSubjectBuilding ?pand ;
                rico:title ?widgetLabel ;
                <http://schema.org/thumbnailUrl> ?widgetImage ;
    } UNION {
        ?widget a memorix:Image ;
                saa:hasOrHadSubjectAddress ?address ;
                rico:title ?widgetLabel ;
                <http://schema.org/thumbnailUrl> ?widgetImage . 
        ?address a hg:Address ;
                schema:geoContains ?geo .
        ?geo schema:geoWithin ?pand .
        ?pand a bag:Pand .
    }
        ?widget rico:creationDate ?creationDateItem .
        OPTIONAL {?creationDateItem rico:hasBeginningDate ?startDate .}
        OPTIONAL {?creationDateItem rico:hasEndDate ?endDate .}
    }
    `,
    sparqlGetImagesBatch: ({ offset, limit }: SparqlBatch) => `
    PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
    PREFIX bag: <http://bag.basisregistraties.overheid.nl/def/bag#>
    PREFIX schema: <https://schema.org/>
    PREFIX hg: <http://rdf.histograph.io/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX saa: <https://data.archief.amsterdam/ontology#>
    PREFIX memorix: <https://ams-migrate.memorix.io/resources/recordtypes/>

    SELECT ?widget ?widgetLabel ?widgetImage ?pand ?startDate ?endDate WHERE {
    {
        ?widget a memorix:Image ;
                saa:hasOrHadSubjectBuilding ?pand ;
                rico:title ?widgetLabel ;
                <http://schema.org/thumbnailUrl> ?widgetImage ;
    } UNION {
        ?widget a memorix:Image ;
                saa:hasOrHadSubjectAddress ?address ;
                rico:title ?widgetLabel ;
                <http://schema.org/thumbnailUrl> ?widgetImage . 
        ?address a hg:Address ;
                schema:geoContains ?geo .
        ?geo schema:geoWithin ?pand .
        ?pand a bag:Pand .
    }
        ?widget rico:creationDate ?creationDateItem .
        OPTIONAL {?creationDateItem rico:hasBeginningDate ?startDate .}
        OPTIONAL {?creationDateItem rico:hasEndDate ?endDate .}
    } LIMIT ${limit} OFFSET ${offset}
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
    sqlTransformGeometry
};

export const queries = {
    sqlSelectDistinct: (tableName: string, column: string, columnAs?: string) =>
        `SELECT DISTINCT ${column} ${columnAs ? "AS " + columnAs : ""} FROM ${tableName}`,

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

    sqlSelectPublicArt: (addresTableName: string, artTableName: string, addressId: string, range: number) => `
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
        SELECT A.title , A.image , A.visitUrl , round(ST_Distance(A.${locationColumn}, B.geometrie),0) as distance_from_address
        FROM ${facilitiesTableName} A
        JOIN ${addresTableName} B ON ST_Distance(A.${locationColumn}, B.geometrie) < ${range}
        WHERE B.identificatie = '${addressId}'
        ORDER BY distance_from_address ASC;
        `
};

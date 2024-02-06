type Query = string | ((...args: any[]) => string);

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
        } LIMIT 1000`
};

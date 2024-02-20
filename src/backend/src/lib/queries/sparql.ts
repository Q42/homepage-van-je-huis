import { SparqlBatch } from "../types";

export const sparqlQueries = {
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
?resource a memorix:Image ;
            rico:title ?title ;
            <http://schema.org/thumbnailUrl> ?thumbnail ;
            rico:creationDate ?creationDateItem .

OPTIONAL { ?creationDateItem rico:hasBeginningDate ?startDate . }
OPTIONAL { ?creationDateItem rico:hasEndDate ?endDate . }
OPTIONAL { ?creationDateItem rico:textualValue ?textDate . }

# Als er direct aan een pand gekoppeld is.
OPTIONAL { ?resource saa:hasOrHadSubjectBuilding ?pand . }

# Als er aan een adres gekoppeld is, dat (optioneel) weer aan een pand gekoppeld is.
OPTIONAL { 
?resource saa:hasOrHadSubjectAddress ?address . 

?address a hg:Address ;
            schema:geoContains ?geo ;
            hg:liesIn ?street .

?street a hg:Street ;
            rdfs:label ?street_name .

# Koppeling aan pand is optioneel.
OPTIONAL {
    ?geo schema:geoWithin ?pand .
    ?pand a bag:Pand .
}
}

# Als er ook aan een straat gekoppeld is.
OPTIONAL {
?resource saa:hasOrHadSubjectLocation ?street .

?street a hg:Street ;
            rdfs:label ?street_name .
}
}
`,
    getImagesBatch: ({ offset, limit }: SparqlBatch) => `
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX bag: <http://bag.basisregistraties.overheid.nl/def/bag#>
PREFIX schema: <https://schema.org/>
PREFIX hg: <http://rdf.histograph.io/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX saa: <https://data.archief.amsterdam/ontology#>
PREFIX memorix: <https://ams-migrate.memorix.io/resources/recordtypes/>

SELECT DISTINCT * WHERE {
    ?resource a memorix:Image ;
                rico:title ?title ;
                <http://schema.org/thumbnailUrl> ?thumbnail ;
                rico:creationDate ?creationDateItem .
    
    OPTIONAL { ?creationDateItem rico:hasBeginningDate ?startDate . }
    OPTIONAL { ?creationDateItem rico:hasEndDate ?endDate . }
    OPTIONAL { ?creationDateItem rico:textualValue ?textDate . }
    
    # Als er direct aan een pand gekoppeld is.
    OPTIONAL { ?resource saa:hasOrHadSubjectBuilding ?pand . }
    
    # Als er aan een adres gekoppeld is, dat (optioneel) weer aan een pand gekoppeld is.
    OPTIONAL { 
      ?resource saa:hasOrHadSubjectAddress ?address . 
      
      ?address a hg:Address ;
                schema:geoContains ?geo ;
                hg:liesIn ?street .

      ?street a hg:Street ;
                rdfs:label ?street_name .

      # Koppeling aan pand is optioneel.
      OPTIONAL {
        ?geo schema:geoWithin ?pand .
        ?pand a bag:Pand .
      }
    }
    
    # Als er ook aan een straat gekoppeld is.
    OPTIONAL {
      ?resource saa:hasOrHadSubjectLocation ?street .

      ?street a hg:Street ;
                rdfs:label ?street_name .
    }
} LIMIT ${limit}  ${offset === 0 ? "" : "OFFSET " + offset}
`
};

import { measureExecutionTime } from "./src/utils/general";

// Define the SPARQL endpoint
const endpoint = 'https://lod.uba.uva.nl/_api/datasets/ATM/ATM-KG/services/ATM-KG/sparql';

// Define your SPARQL query
const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX daa: <https://data.archief.amsterdam/ontology#>
    PREFIX schema: <http://www.w3.org/2000/01/rdf-schema#>
    prefix plainSchema: <http://schema.org/>
    PREFIX memorix: <https://ams-migrate.memorix.io/resources/recordtypes/Image#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT * WHERE {
    ?o daa:hasOrHadSubjectLocation ?location .
    ?location schema:label "Wagenaarstraat".
    ?o memorix:isAssociatedWithAddress ?address.
    ?o plainSchema:thumbnailUrl ?url.
    ?address daa:houseNumberBegin ?houseNumberSmall.
    ?address daa:houseNumberEnd ?houseNumberBig.
    filter(xsd:integer(?houseNumberSmall) <= 36 && xsd:integer(?houseNumberBig) >= 36)
    } LIMIT 10
`;


const SparqlClient = require('sparql-http-client');

async function dbProcessRunner() {
    const client = new SparqlClient({ endpointUrl: endpoint })
    const stream = await client.query.select(query);

    for await (const chunk of stream) {
        console.log(chunk.url.value);
        
    }
}

async function dbProcessRunner2() {
    await dbProcessRunner();
} 

measureExecutionTime(dbProcessRunner);

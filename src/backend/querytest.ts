import { DuckDBService } from "./src/duckDBService";

async function runTestQuery() {
    const duckDBService = new DuckDBService();
    await duckDBService.initDb({ dbLocation: ":memory:" });

    duckDBService.loadParquetIntoTable("afbeeldingen", "images.parquet", true);

    console.log("distinct images", await duckDBService.runQuery("SELECT count(DISTINCT visitUrl) FROM afbeeldingen"));
    console.log("total records", await duckDBService.runQuery("SELECT count(visitUrl) FROM afbeeldingen"));
    duckDBService.teardown();
}

runTestQuery();

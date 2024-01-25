import { checkIngestSources, createDirectory } from "./src/utils";
import { DuckDBService } from "./src/duckDBService";
import { IngestSources } from "./src/types";

const inputDir = "./data_input";
const outputDir = "./data_output";

const ingestSources: IngestSources = {
    adressen: {
        ingestSourcePath: "./data_input/BAG_verblijfsobject_Actueel.csv",
        outputName: "adressen"
    }
};

const duckDBService = new DuckDBService();

async function cliRunner() {
    // system initialization
    checkIngestSources(ingestSources);
    await duckDBService.loadDB({ dbLocation: ":memory:" });
    createDirectory(outputDir);

    await duckDBService.ingestCSV(ingestSources.adressen);
    await duckDBService.exportTableToJson(
        ingestSources.adressen.outputName,
        `${outputDir}/${ingestSources.adressen.outputName}.json`
    );
}

cliRunner();

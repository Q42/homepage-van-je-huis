import { ingestSources, pipelineConfig as pc } from "./pipelineConfig";
import { DuckDBService } from "./src/duckDBService";
import { checkFilePaths, getIntermediateTableRefsFromSource, measureExecutionTime } from "./src/utils";

const duckDBService = new DuckDBService();

async function generateAPI() {
    await duckDBService.initDb({ dbLocation: ":memory:" });

    const intermediateRefs = getIntermediateTableRefsFromSource(ingestSources, pc);
    checkFilePaths(intermediateRefs.map((ref) => ref.fileLocation));

    // await duckDBService.loadTablesFromIntermediateRefs(intermediateRefs);
}

async function dbProcessRunner() {
    try {
        return generateAPI();
    } finally {
        await duckDBService.db?.close();
    }
}

measureExecutionTime(dbProcessRunner);

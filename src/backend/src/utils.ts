import fs from "fs";
import { IngestSource, IngestSources, IntermediateOutputFormats, IntermediateTableRef } from "./types";
import { PipelineConfig } from "../pipelineConfig";

export function checkFilePaths(paths: string[]) {
    const missingSources: string[] = [];

    paths.forEach(([path]) => {
        if (!fs.existsSync(path)) {
            missingSources.push(path);
        }
    });

    if (missingSources.length > 0) {
        throw new Error(`Missing source files: ${missingSources.join(", ")}`);
    }
}

export function createDirectory(directoryName: string): void {
    if (!fs.existsSync(directoryName)) {
        return fs.mkdirSync(directoryName);
    }
}

export function writeObjectToJsonFile(object: any, filePath: string): void {
    const json = JSON.stringify(object, null, 2);
    return fs.writeFileSync(filePath, json);
}

export function getColumnKeysFromSourceDef(source: IngestSource) {
    const columnKeys: string[] = [];
    if (source.columnTypes !== undefined) {
        Object.keys(source.columnTypes).forEach((key) => {
            columnKeys.push(`"${key}"`);
        });
    }
    return columnKeys;
}

export async function measureExecutionTime(fn: () => Promise<any>) {
    const startTime = Date.now();
    await fn();
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime}ms`);
}

export function getIngestFilePathsFromSources(sources: IngestSources) {
    const filePaths: string[] = [];
    Object.entries(sources).forEach(([key, source]) => {
        filePaths.push(source.ingestSourcePath);
    });
    return filePaths;
}

export function getIntermediateTableRefsFromSource(sources: IngestSources, pipelineConfig: PipelineConfig) {
    const intermediateDirs: IntermediateTableRef[] = [];
    Object.entries(sources).forEach(([key, value]) => {
        value.tableName !== undefined &&
            intermediateDirs.push({
                fileLocation: `${pipelineConfig.intermediateOutputDirectory}/${value.tableName}.${pipelineConfig.intermediateOutputFormat}`,
                tableName: value.tableName
            });
    });
    return intermediateDirs;
}

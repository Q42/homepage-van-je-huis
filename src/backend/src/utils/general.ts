import fs from "fs";
import { CsvIngestSource, CsvIngestSources, IntermediateTableRef, ApiCrawlerConfigs } from "../lib/types";
import { PipelineConfig } from "../../pipelineConfig";

export function checkFilePaths(paths: string[]) {
    const missingSources: string[] = [];

    paths.forEach((path) => {
        if (!fs.existsSync(path)) {
            missingSources.push(path);
        }
    });

    if (missingSources.length > 0) {
        throw new Error(`Missing ingest files: ${missingSources.join(", ")}`);
    }
}

/**
 * Creates a directory with the specified name if it doesn't already exist.
 * @param directoryName - The name of the directory to create.
 */
export function createDirectory(directoryName: string): void {
    if (!fs.existsSync(directoryName)) {
        return fs.mkdirSync(directoryName);
    }
}

export function writeObjectToJsonFile(object: Record<any, any>, filePath: string, prettyJson?: boolean): void {
    const json = JSON.stringify(object, null, prettyJson ? 2 : undefined);
    return fs.writeFileSync(filePath, json);
}

/**
 * Runs a given asynchronous function and logs its duration.
 * @param fn - The function to be measured.

 */
export async function measureExecutionTime(fn: () => Promise<any>) {
    const startTime = Date.now();
    await fn();
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime}ms`);
    return;
}

export function getIngestFilePathsFromSources(sources: CsvIngestSources | ApiCrawlerConfigs) {
    const filePaths: string[] = [];
    Object.values(sources).forEach((source) => {
        if (source.ingestSourcePath !== undefined) {
            filePaths.push(source.ingestSourcePath ?? source.guideFile);
        }
    });
    return filePaths;
}

export function getIntermediateTableRefsFromSource(sources: CsvIngestSources, pipelineConfig: PipelineConfig) {
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

export function parseValueForDbInsert(value: any): string {
    if (!value) {
        return "NULL";
    }
    if (typeof value === "string") {
        return `'${value.replace(/'/g, '"')}'`.trim();
    }
    return value.toString();
}

export function generateSessionName(start?: string): string {
    const date = new Date();
    const dateString = date.toISOString().replace(/\.\d+Z/, "");

    return start ? start + "-" + dateString : dateString;
}

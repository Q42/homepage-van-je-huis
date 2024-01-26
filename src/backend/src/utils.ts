import fs from "fs";
import { IngestSource, IngestSources } from "./types";

export function checkIngestSources(sources: IngestSources) {
    const missingSources: string[] = [];

    Object.entries(sources).forEach(([key, value]) => {
        if (!fs.existsSync(value.ingestSourcePath)) {
            missingSources.push(value.ingestSourcePath);
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

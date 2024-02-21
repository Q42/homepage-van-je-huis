import fs from "fs";
import { CsvIngestSources } from "../lib/types";
import { DBAddress } from "../models/adresses";

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

export function getIngestFilePathsFromSources(sources: CsvIngestSources) {
    const filePaths: string[] = [];

    Object.values(sources).forEach((source) => {
        if (source.ingestSourcePath !== undefined) {
            filePaths.push(source.ingestSourcePath);
        }
    });
    return filePaths;
}

export function parseValueForDbInsert(value: undefined | null | number | bigint | string): string {
    if (value === undefined || value === null) {
        return "NULL";
    }
    if (typeof value === "string") {
        return `'${value.replace(/'/g, '"')}'`.trim();
    }
    return String(value);
}

export function generateSessionName(start?: string): string {
    const date = new Date();
    const dateString = date.toISOString().replace(/\.\d+Z/, "");

    return start ? start + "-" + dateString : dateString;
}

export function getHouseNumberFromAddress(address: DBAddress): string {
    let addressNumber = String(address.huisnummerHoofdadres);
    if (address.huisletterHoofdadres || address.huisnummertoevoegingHoofdadres) {
        addressNumber += "-" + (address.huisletterHoofdadres ?? "") + (address.huisnummertoevoegingHoofdadres ?? "");
    }
    return addressNumber;
}

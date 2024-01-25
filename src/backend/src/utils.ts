import fs from "fs";
import { IngestSources } from "./types";

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

export type FileIngestSource = {
    ingestSourcePath: string;
    outputName: string;
};

export type IngestSources = {
    [key: string]: FileIngestSource;
};

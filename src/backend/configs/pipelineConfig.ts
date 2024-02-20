export type PipelineConfig = {
    // devMode limits all select queries to a specified max number of rows
    devMode: { enabled: boolean; limit: number };

    // if true, the pipeline will skip the generation of api files for addresses that already have a file.
    // This allows you to break-off the generation process and pick up where you left off later on.
    skipExistingApiFiles: boolean;

    // Where should the intermediate databases be stored.
    intermediateOutputDirectory: string;

    apiOutputDirectory: string;
    apiResoliverDirectory: string;
    apiAddressFilesDirectory: string;

    // the number of rows to skip in the base table
    startOffset: number | undefined;

    // Minimum number of source records that need to be gathered before a batch insert into the intermediate db is performed.
    // If there are less source records in total, they will still get inserted as a batch.
    dbBatchInsertMinThreshold: number;

    maxConsecutiveCrawlFailuresBeforeAbort: number;
    sortSliders: boolean;

    // the maximum distance in meters to show in the present view
    presentViewRangeMax: number;
    rdColumnPrefix: string;

    //If this threshold is not met by simply looking for images relating to an address, the search radius will be increased.
    minArchiveImages: number;

    //The maximum search radius for surrounding
    maxImgSearchRadius: number;

    aggregateTableName: string;
};

export const pipelineConfig: PipelineConfig = {
    devMode: { enabled: true, limit: 10000 },
    skipExistingApiFiles: false,
    intermediateOutputDirectory: "./intermediate_output",
    apiOutputDirectory: "./api_generated",
    apiResoliverDirectory: "/resolve",
    apiAddressFilesDirectory: "/address",
    startOffset: undefined,
    dbBatchInsertMinThreshold: 500,
    maxConsecutiveCrawlFailuresBeforeAbort: 25,
    sortSliders: true,
    presentViewRangeMax: 1000,
    rdColumnPrefix: "rd_geometrie_",
    minArchiveImages: 15,
    maxImgSearchRadius: 150,
    aggregateTableName: "aggregates"
};

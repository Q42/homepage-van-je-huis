export type PipelineConfig = {
    // devMode limits all select queries to a specified max number of rows
    devMode: { enabled: boolean; limit: number };

    // if true, the pipeline will skip the generation of api files for addresses that already have a file.
    // This allows you to break-off the generation process and pick up where you left off later on.
    skipExistingApiFiles: boolean;

    outputDirs: {
        root: string;
        intermediateDbs: string;
        api: { root: string; apiResolver: string; apiRecords: string };
        analytics: string;
    };

    // If enabled, the analytics service will generate a simple analytics report on the generated api files.
    analyticsEnabled: boolean;

    // If the path to an analytics report is specified, that file will be used to generate a sample set of addresses.
    // This way, you can measure the effects that changes to the pipeline have on a consistent, representative, set of addresses.
    // This setting only takes effect in dev mode.
    loadAnalyticsSampleSetFromReport?: string;

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

    // Before generating the individual api files, the generation script constructs a master database
    // out of all the intermediate database. For debugging purposes, it can be convenient to save this db on disk. So it can be manually queried against using a db client.
    // For normal operation, ":memory:" is recommended.
    generationTableLocation: ":memory:" | `${string}.duckdb`;
};

export const pipelineConfig: PipelineConfig = {
    devMode: { enabled: true, limit: 5000 },
    skipExistingApiFiles: false,
    analyticsEnabled: true,
    loadAnalyticsSampleSetFromReport: "",
    outputDirs: {
        root: "./gen",
        api: { root: "/api", apiResolver: "/resolve", apiRecords: "/address" },
        analytics: "/analytics",
        intermediateDbs: "/intermediate_dbs"
    },
    startOffset: undefined,
    dbBatchInsertMinThreshold: 500,
    maxConsecutiveCrawlFailuresBeforeAbort: 25,
    sortSliders: true,
    presentViewRangeMax: 1000,
    rdColumnPrefix: "rd_geometrie_",
    minArchiveImages: 15,
    maxImgSearchRadius: 150,
    aggregateTableName: "aggregates",
    generationTableLocation: ":memory:"
};

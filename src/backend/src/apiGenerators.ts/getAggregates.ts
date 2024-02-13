import { AggregateData, DistanceDataAggregateEntry } from "../../apiSchema/present";
import { DuckDBService } from "../lib/duckDBService";
import { queries } from "../lib/queries";
import { GeoString } from "../lib/types";

export async function getAggregates({
    duckDBService,
    addressLocation,
    numberOfAggregates,
    interval
}: {
    duckDBService: DuckDBService;
    addressLocation: GeoString;
    numberOfAggregates: number;
    interval: number;
}): Promise<DistanceDataAggregateEntry[]> {
    const aggregateDataEntries: DistanceDataAggregateEntry[] = [];
    for (let i = 1; i <= numberOfAggregates; i++) {
        const aggregateStart = i * interval;

        const aggregateData: AggregateData = {};

        const trees = await duckDBService.runQuery(
            queries.countWithinRangeOfLocation({
                location: addressLocation,
                targetTable: "bomen",
                targetColumn: "*",
                targetGeometryColumn: "rd_geometrie_bomen",
                range: aggregateStart
            })
        );

        if (trees[0]["count_star()"] !== undefined) {
            aggregateData["trees"] = Number(trees[0]["count_star()"]);
        }

        const aggregateEntry: DistanceDataAggregateEntry = {
            distanceToAddress: aggregateStart,
            aggregateData
        };
        aggregateDataEntries.push(aggregateEntry);
    }
    return aggregateDataEntries;
}

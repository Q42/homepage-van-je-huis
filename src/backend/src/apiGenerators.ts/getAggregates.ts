import { DistanceViewAggregateEntry, DistanceViewEntry } from "../../../common/apiSchema/present";
import { pipelineConfig } from "../../pipelineConfig";
import { DuckDBService } from "../lib/duckDBService";
import { DBAddress } from "../models/adresses";

function divideOverRange(
    aggregates: DistanceViewAggregateEntry[],
    rangeStart: number,
    rangeEnd: number
): DistanceViewAggregateEntry[] {
    const numberOfAggregates = aggregates.length;

    const step = (rangeEnd - rangeStart) / (numberOfAggregates + 1);

    const entries: DistanceViewAggregateEntry[] = [];

    for (let i = 0; i < numberOfAggregates; i++) {
        const aggregate = aggregates[i];

        const position = Math.round(rangeStart + (i + 1) * step);

        entries.push({
            ...aggregate,
            position
        });
    }
    return entries;
}

export async function getAggregates({
    duckDBService,
    address,
    rangeStart,
    rangeEnd
}: {
    duckDBService: DuckDBService;
    address: DBAddress;
    rangeStart: number;
    rangeEnd: number;
}): Promise<DistanceViewAggregateEntry[]> {
    const aggregateEntries: DistanceViewAggregateEntry[] = [];

    try {
        const numberOfTreeSpecies = (
            await duckDBService.runQuery(`
    Select number_of_tree_species as treeSpecies from ${pipelineConfig.aggregateTableName}
    where "code" = '${address["ligtIn:GBD.BRT.code"]}'
    `)
        )[0]["treeSpecies"];

        if (numberOfTreeSpecies) {
            const treeSpeciesBuurtEntry: DistanceViewAggregateEntry = {
                type: "aggregate_tree_species",
                title: "",
                geoLevel: "buurt",
                position: 0,
                data: {}
            };

            treeSpeciesBuurtEntry.data[address["ligtIn:GBD.BRT.naam"]] = Number(numberOfTreeSpecies);

            aggregateEntries.push(treeSpeciesBuurtEntry);
        }
    } catch (e) {
        console.log("Unable to get tree species aggregate for address", address);
    }

    try {
        const numberOfTrees = (
            await duckDBService.runQuery(`
    Select SUM(number_of_trees) as trees from ${pipelineConfig.aggregateTableName}
    where "ligtIn:GBD.WIJK.code" = '${address["ligtIn:GBD.WIJK.code"]}'
    `)
        )[0]["trees"];
        if (numberOfTrees) {
            const treesWijkEntry: DistanceViewAggregateEntry = {
                type: "aggregate_trees",
                title: "",
                geoLevel: "wijk",
                position: 0,
                data: {}
            };

            treesWijkEntry.data[address["ligtIn:GBD.WIJK.naam"]] = Number(numberOfTrees);

            aggregateEntries.push(treesWijkEntry);
        }
    } catch (e) {
        console.log("Unable to get trees aggregate for address", address);
    }

    try {
        const numberOfBees = (
            await duckDBService.runQuery(`
    Select SUM(number_of_bees) as bees from ${pipelineConfig.aggregateTableName}
    where "ligtIn:GBD.SDL.code" = '${address["ligtIn:GBD.SDL.code"]}'
    `)
        )[0]["bees"];

        if (numberOfBees) {
            const beesStadsdeelEntry: DistanceViewAggregateEntry = {
                type: "aggregate_bees",
                title: "",
                geoLevel: "stadsdeel",
                position: 0,
                data: {}
            };

            beesStadsdeelEntry.data[address["ligtIn:GBD.SDL.naam"]] = Number(numberOfBees);

            aggregateEntries.push(beesStadsdeelEntry);
        }
    } catch (e) {
        console.log("Unable to get bees aggregate for address", address);
    }

    return divideOverRange(aggregateEntries, rangeStart, rangeEnd);
}

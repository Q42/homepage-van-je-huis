import { AddresDescription, AddressRecord } from "../../../common/apiSchema/addressRecord";
import { writeObjectToJsonFile } from "../utils/general";
import fs from "fs";

type DistributionKey = `${number}`;
type DistributionValue = { count: number; exampleId: string };
type Distribution = Record<DistributionKey, DistributionValue>;
type Range = { start: number | undefined; end: number | undefined };
type Ranking = { value: number | undefined; id: string | undefined; address: AddresDescription | undefined };

type AnalyticsData = {
    lastAddressId: string;
    numberOfRecords: number;
    pastDataDistribution: Distribution;
    averagePastRange: Range;
    presentDataDistribution: Distribution;
    averagePresentRange: Range;
    bestPresent: Ranking;
    worstPresent: Ranking;
    bestPast: Ranking;
    worstPast: Ranking;
    worstOverall: Ranking;
};

function averageCalculator(currentAverage: number, newValue: number, n: number) {
    return (newValue - currentAverage) / n + currentAverage;
}

export class AnalyticsService {
    protected analyticsData: AnalyticsData = {
        numberOfRecords: 0,
        pastDataDistribution: {},
        bestPast: {
            value: undefined,
            address: undefined,
            id: undefined
        },
        worstPast: {
            value: undefined,
            address: undefined,
            id: undefined
        },
        presentDataDistribution: {},
        bestPresent: {
            value: undefined,
            address: undefined,
            id: undefined
        },
        worstPresent: {
            value: undefined,
            address: undefined,
            id: undefined
        },
        averagePastRange: {
            start: undefined,
            end: undefined
        },
        averagePresentRange: {
            start: undefined,
            end: undefined
        },
        lastAddressId: "",
        worstOverall: {
            value: undefined,
            address: undefined,
            id: undefined
        }
    };

    protected internalCounters = {
        pastRange: 0,
        presentRange: 0
    };

    public serviceDisabled: boolean = false;

    constructor(disabled?: boolean) {
        this.serviceDisabled = Boolean(disabled);
    }

    protected updateDistributions(record: AddressRecord) {
        const pastDataLength = record.pastData.timeline.length;
        if (!(String(pastDataLength) in this.analyticsData.pastDataDistribution)) {
            this.analyticsData.pastDataDistribution[String(pastDataLength) as DistributionKey] = {
                count: 0,
                exampleId: record.id
            };
        }
        this.analyticsData.pastDataDistribution[String(pastDataLength) as DistributionKey].count++;

        const presentDataLength = record.presentData.slider.length;
        if (!(String(presentDataLength) in this.analyticsData.presentDataDistribution)) {
            this.analyticsData.presentDataDistribution[String(presentDataLength) as DistributionKey] = {
                count: 0,
                exampleId: record.id
            };
        }
        this.analyticsData.presentDataDistribution[String(presentDataLength) as DistributionKey].count++;
    }

    protected updateAverages(record: AddressRecord) {
        if (!(record.pastData.rangeEnd === 0 && record.pastData.rangeStart === 0)) {
            this.internalCounters.pastRange++;

            if (this.analyticsData.averagePastRange.start === undefined) {
                this.analyticsData.averagePastRange.start = record.pastData.rangeStart;
            }
            if (this.analyticsData.averagePastRange.end === undefined) {
                this.analyticsData.averagePastRange.end = record.pastData.rangeEnd;
            }

            this.analyticsData.averagePastRange.end = averageCalculator(
                this.analyticsData.averagePastRange.end,
                record.pastData.rangeEnd,
                this.internalCounters.pastRange
            );

            this.analyticsData.averagePastRange.start = averageCalculator(
                this.analyticsData.averagePastRange.start,
                record.pastData.rangeStart,
                this.internalCounters.pastRange
            );
        }

        if (!(record.presentData.rangeEnd === 0 && record.presentData.rangeStart === 0)) {
            this.internalCounters.presentRange++;

            if (this.analyticsData.averagePresentRange.start === undefined) {
                this.analyticsData.averagePresentRange.start = record.presentData.rangeStart;
            }
            if (this.analyticsData.averagePresentRange.end === undefined) {
                this.analyticsData.averagePresentRange.end = record.presentData.rangeEnd;
            }

            this.analyticsData.averagePresentRange.end = averageCalculator(
                this.analyticsData.averagePresentRange.end,
                record.presentData.rangeEnd,
                this.internalCounters.presentRange
            );

            this.analyticsData.averagePresentRange.start = averageCalculator(
                this.analyticsData.averagePresentRange.start,
                record.presentData.rangeStart,
                this.internalCounters.presentRange
            );
        }
    }

    protected updateRankings(record: AddressRecord) {
        if (
            this.analyticsData.bestPast.value === undefined ||
            record.pastData.timeline.length > this.analyticsData.bestPast.value
        ) {
            this.analyticsData.bestPast.value = record.pastData.timeline.length;
            this.analyticsData.bestPast.address = record.address;
            this.analyticsData.bestPast.id = record.id;
        }

        if (
            this.analyticsData.worstPast.value === undefined ||
            record.pastData.timeline.length < this.analyticsData.worstPast.value
        ) {
            this.analyticsData.worstPast.value = record.pastData.timeline.length;
            this.analyticsData.worstPast.address = record.address;
            this.analyticsData.worstPast.id = record.id;
        }

        if (
            this.analyticsData.bestPresent.value === undefined ||
            record.presentData.slider.length > this.analyticsData.bestPresent.value
        ) {
            this.analyticsData.bestPresent.value = record.presentData.slider.length;
            this.analyticsData.bestPresent.address = record.address;
            this.analyticsData.bestPresent.id = record.id;
        }

        if (
            this.analyticsData.worstPresent.value === undefined ||
            record.presentData.slider.length < this.analyticsData.worstPresent.value
        ) {
            this.analyticsData.worstPresent.value = record.presentData.slider.length;
            this.analyticsData.worstPresent.address = record.address;
            this.analyticsData.worstPresent.id = record.id;
        }

        if (
            this.analyticsData.worstOverall.value === undefined ||
            record.pastData.timeline.length + record.presentData.slider.length < this.analyticsData.worstOverall.value
        ) {
            this.analyticsData.worstOverall.value = record.pastData.timeline.length + record.presentData.slider.length;
            this.analyticsData.worstOverall.address = record.address;
            this.analyticsData.worstOverall.id = record.id;
        }
    }

    public addRecordToAnalytics(record: AddressRecord): void {
        if (this.serviceDisabled) {
            return;
        }
        this.analyticsData.numberOfRecords++;
        this.analyticsData.lastAddressId = record.id;

        this.updateDistributions(record);
        this.updateAverages(record);
        this.updateRankings(record);
    }

    public writeAnalyticsDataToFile(filePath: string): void {
        if (this.serviceDisabled) {
            return;
        }
        writeObjectToJsonFile(this.analyticsData, filePath, true);
    }

    public static loadSampleSetFromReportFile(filePath: string): string[] {
        let jsonData: undefined | AnalyticsData;
        try {
            const data = fs.readFileSync(filePath, "utf-8");
            jsonData = JSON.parse(data) as AnalyticsData;
        } catch (error) {
            console.error(
                `Error loading sample set from analytics report file. Check the pipeline config to see if you have the correct file, and if you even want to load a sample from a report.`
            );
            throw error;
        }

        const sampleSet: Set<string> = new Set();

        Object.values(jsonData.pastDataDistribution).forEach((value) => {
            sampleSet.add(value.exampleId);
        });

        Object.values(jsonData.presentDataDistribution).forEach((value) => {
            sampleSet.add(value.exampleId);
        });

        return Array.from(sampleSet);
    }
}

import { AddresDescription, AddressRecord } from "../../../common/apiSchema/addressRecord";
import { writeObjectToJsonFile } from "../utils/general";

type DistributionKey = `${number}`;
type Distribution = Record<DistributionKey, number>;
type Range = { start: number | undefined; end: number | undefined };
type Ranking = { value: number | undefined; address: AddresDescription | undefined };

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
            address: undefined
        },
        worstPast: {
            value: undefined,
            address: undefined
        },
        presentDataDistribution: {},
        bestPresent: {
            value: undefined,
            address: undefined
        },
        worstPresent: {
            value: undefined,
            address: undefined
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
            address: undefined
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
            this.analyticsData.pastDataDistribution[String(pastDataLength) as DistributionKey] = 0;
        }
        this.analyticsData.pastDataDistribution[String(pastDataLength) as DistributionKey]++;

        const presentDataLength = record.presentData.slider.length;
        if (!(String(presentDataLength) in this.analyticsData.presentDataDistribution)) {
            this.analyticsData.presentDataDistribution[String(presentDataLength) as DistributionKey] = 0;
        }
        this.analyticsData.presentDataDistribution[String(presentDataLength) as DistributionKey]++;
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
        }

        if (
            this.analyticsData.worstPast.value === undefined ||
            record.pastData.timeline.length < this.analyticsData.worstPast.value
        ) {
            this.analyticsData.worstPast.value = record.pastData.timeline.length;
            this.analyticsData.worstPast.address = record.address;
        }

        if (
            this.analyticsData.bestPresent.value === undefined ||
            record.presentData.slider.length > this.analyticsData.bestPresent.value
        ) {
            this.analyticsData.bestPresent.value = record.presentData.slider.length;
            this.analyticsData.bestPresent.address = record.address;
        }

        if (
            this.analyticsData.worstPresent.value === undefined ||
            record.presentData.slider.length < this.analyticsData.worstPresent.value
        ) {
            this.analyticsData.worstPresent.value = record.presentData.slider.length;
            this.analyticsData.worstPresent.address = record.address;
        }

        if (
            this.analyticsData.worstOverall.value === undefined ||
            record.pastData.timeline.length + record.presentData.slider.length < this.analyticsData.worstOverall.value
        ) {
            this.analyticsData.worstOverall.value = record.pastData.timeline.length + record.presentData.slider.length;
            this.analyticsData.worstOverall.address = record.address;
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
}

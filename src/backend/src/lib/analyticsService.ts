import { AddressRecord } from "../../../common/apiSchema/addressRecord";
import { writeObjectToJsonFile } from "../utils/general";

type DistributionKey = `${number}`;
type Distribution = Record<DistributionKey, number>;
type Range = { start: number | undefined; end: number | undefined };

type AnalyticsData = {
    lastAddressId: string;
    numberOfRecords: number;
    pastDataDistribution: Distribution;
    averagePastRange: Range;
    presentDataDistribution: Distribution;
    averagePresentRange: Range;
};

function averageCalculator(currentAverage: number, newValue: number, n: number) {
    return (newValue - currentAverage) / n + currentAverage;
}

export class AnalyticsService {
    protected analyticsData: AnalyticsData = {
        numberOfRecords: 0,
        pastDataDistribution: {},
        presentDataDistribution: {},
        averagePastRange: {
            start: undefined,
            end: undefined
        },
        averagePresentRange: {
            start: undefined,
            end: undefined
        },
        lastAddressId: ""
    };

    protected internalCounters = {
        pastRange: 0,
        presentRange: 0
    };

    public serviceDisabled: boolean = false;

    constructor(disabled?: boolean) {
        this.serviceDisabled = Boolean(disabled);
    }

    public addRecordToAnalytics(record: AddressRecord): void {
        if (this.serviceDisabled) {
            return;
        }
        this.analyticsData.numberOfRecords++;
        this.analyticsData.lastAddressId = record.id;

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

    public writeAnalyticsDataToFile(filePath: string): void {
        if (this.serviceDisabled) {
            return;
        }
        writeObjectToJsonFile(this.analyticsData, filePath, true);
    }
}

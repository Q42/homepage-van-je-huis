import { AddressRecord } from "../../../common/apiSchema/addressRecord";
import { PastData } from "../../../common/apiSchema/past";
import { PresentData } from "../../../common/apiSchema/present";
import { EnrichedDBAddress } from "../lib/types";

export function assembleApiRecord(
    baseAddress: EnrichedDBAddress,
    presentData: PresentData,
    pastData: PastData
): AddressRecord {
    return {
        "id": baseAddress.identificatie,
        "ligtIn:BAG.PND.identificatie": baseAddress["ligtIn:BAG.PND.identificatie"],
        "address": {
            streetName: baseAddress["ligtAan:BAG.ORE.naamHoofdadres"],
            houseNumber: baseAddress.huisnummerHoofdadres,
            houseNumberSuffix: baseAddress.huisletterHoofdadres,
            houseNumberSuffix2: baseAddress.huisnummertoevoegingHoofdadres
        },
        pastData,
        presentData
    };
}

export function getMinMaxRangeFromPastData(pastData: PastData): { timeRangeStart: number; timeRangeEnd: number } {
    const timeline = pastData.timeline.map((entry) => entry.position);
    const timeRangeStart = Math.min(...timeline);
    const timeRangeEnd = Math.max(...timeline);
    return { timeRangeEnd, timeRangeStart };
}

export function getMinMaxRangeFromPresentData(presentData: PresentData): {
    distanceRangeStart: number;
    distanceRangeEnd: number;
} {
    const timeline = presentData.slider.map((entry) => entry.position);
    const timeRangeStart = Math.min(...timeline);
    const timeRangeEnd = Math.max(...timeline);
    return { distanceRangeEnd: timeRangeEnd, distanceRangeStart: timeRangeStart };
}

import slugify from "slugify";
import crypto from "crypto";
import { AddresDescription, AddressRecord } from "../../../common/apiSchema/addressRecord";
import { PastData } from "../../../common/apiSchema/past";
import { PresentData } from "../../../common/apiSchema/present";
import { EnrichedDBAddress } from "../lib/types";

export function generateAddressID(address: AddresDescription): string {
    const slugifyOptions = {
        lower: true,
        trim: true
    };

    const addressBase: string[] = [address.streetName.toLowerCase(), String(address.houseNumber)];
    if (address.houseNumberSuffix) {
        addressBase.push(address.houseNumberSuffix.toLowerCase());
    }
    if (address.houseNumberSuffix2) {
        addressBase.push(address.houseNumberSuffix2.toLowerCase());
    }
    const slug = slugify(addressBase.join(" "), slugifyOptions);
    return crypto.createHash("md5").update(slug).digest("hex");
}

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
        presentData,
        pastData
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

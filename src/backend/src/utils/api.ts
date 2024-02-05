import { TableData } from "duckdb";
import { AddressIndex } from "../../apiSchema/addressIndex";
import slugify from "slugify";

import crypto from "crypto";
import { AddresDescription, AddressRecord } from "../../apiSchema/addressRecord";
import { EnrichedDBAddress } from "../types";
import { PastData } from "../../apiSchema/past";
import { PresentData } from "../../apiSchema/present";

export function mapAddressIndexRefsToAddressIndex(refs: TableData): AddressIndex {
    const addressIndex: AddressIndex = {};
    refs.forEach((address) => {
        if (address.streetName && !addressIndex[address.streetName]) {
            addressIndex[address.streetName] = {};
        }
        addressIndex[address.streetName][address.streetNumber] = address.id;
    });
    return addressIndex;
}

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
        addressId: baseAddress.identificatie,
        address: {
            streetName: baseAddress["ligtAan:BAG.ORE.naamHoofdadres"],
            houseNumber: baseAddress.huisnummerHoofdadres,
            houseNumberSuffix: baseAddress.huisletterHoofdadres,
            houseNumberSuffix2: baseAddress.huisnummertoevoegingHoofdadres
        },
        presentData,
        pastData
    };
}

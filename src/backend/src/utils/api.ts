import { TableData } from "duckdb";
import { AddressIndex } from "../../apiSchema/addressIndex";

import crypto from "crypto";
import { AddresDescription, AddressRecord } from "../../apiSchema/addressRecord";
import { BaseDBAddress } from "../types";

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
    const addressBase: string[] = [address.streetName.toLowerCase(), String(address.houseNumber)];
    if (address.houseNumberSuffix) {
        addressBase.push(address.houseNumberSuffix.toLowerCase());
    }
    if (address.houseNumberSuffix2) {
        addressBase.push(address.houseNumberSuffix2.toLowerCase());
    }
    const baseString = addressBase.join("-");
    return crypto.createHash("md5").update(baseString).digest("hex");
}

export function generateBaseApiRecord(baseAddress: BaseDBAddress): AddressRecord {
    return {
        addressId: baseAddress.identificatie,
        address: {
            streetName: baseAddress["ligtAan:BAG.ORE.naamHoofdadres"],
            houseNumber: baseAddress.huisnummerHoofdadres,
            houseNumberSuffix: baseAddress.huisletterHoofdadres,
            houseNumberSuffix2: baseAddress.huisnummertoevoegingHoofdadres
        },
        presentData: {
            distanceRangeStart: 0,
            distanceRangeEnd: 0,
            slider: [],
            stories: []
        },
        pastData: {
            timeRangeStart: 0,
            timeRangeEnd: 0,
            timeline: [],
            stories: []
        }
    };
}

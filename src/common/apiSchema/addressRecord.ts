import { PastData } from "./past";
import { PresentData } from "./present";

export type AddresDescription = {
    streetName: string;
    houseNumber: number;
    houseNumberSuffix?: string;
    houseNumberSuffix2?: string;
};

export type AddressRecord = {
    "id": string;
    "ligtIn:BAG.PND.identificatie": string;
    "address": AddresDescription;
    "presentData": PresentData;
    "pastData": PastData;
};

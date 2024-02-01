import { PastData } from "./past";
import { PresentData } from "./present";

export type AddressRecord = {
    addressId: string;
    streetNumber: string;
    streetNumberSuffix?: string;
    presentData: PresentData;
    pastData: PastData;
};

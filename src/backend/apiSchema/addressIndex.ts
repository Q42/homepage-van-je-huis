type StreetName = string;
type StreetNumber = string;
type BAGId = string;

export type AddressIndex = {
    [key: StreetName]: {
        [key: StreetNumber]: BAGId;
    };
};

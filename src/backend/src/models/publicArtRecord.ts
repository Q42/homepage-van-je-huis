import { ColumnDefenitions, GeoString } from "../lib/types";
export type PublicArtRecord = {
    title: string;
    image: string;
    visitUrl: string;
    location: GeoString;
};
export const publicArtRecordOutputColumns: ColumnDefenitions = {
    title: "VARCHAR",
    image: "VARCHAR",
    visitUrl: "VARCHAR",
    location: "GEOMETRY"
};

export interface CustomizedPublicArtRecord extends Omit<PublicArtRecord, "location"> {
    distance_from_address: number;
}

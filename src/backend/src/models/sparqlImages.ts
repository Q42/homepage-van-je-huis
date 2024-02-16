import { ColumnDefenitions, GeoString } from "../lib/types";

export const sparqlImageOutputColumns: ColumnDefenitions = {
    archiveUrl: "VARCHAR",
    title: "VARCHAR",
    imgUrl: "VARCHAR",
    pandId: "VARCHAR",
    addressLink: "VARCHAR",
    wktPoint: "GEOMETRY",
    streetLink: "VARCHAR",
    streetName: "VARCHAR",
    streetId: "VARCHAR",
    dateString: "VARCHAR",
    startDate: "DATE",
    endDate: "DATE"
};

export type SparqlImage = {
    archiveUrl?: string;
    title: string;
    imgUrl: string;
    pandId?: string;
    addressLink?: string;
    wktPoint?: GeoString;
    streetLink?: string;
    streetName?: string;
    streetId?: string;
    dateString: string;
    startDate: Date;
    endDate: Date;
};

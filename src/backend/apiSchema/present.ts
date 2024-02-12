import { BaseDataEntity, ImageRef } from "./shared";

export type GeoLevel = "straat" | "buurt" | "wijk" | "stadsdeel";

export type PresentImageEntityType =
    | "outdoorArt"
    | "cultureMulti"
    | "musicVenue"
    | "heritage"
    | "dance"
    | "visualArts"
    | "photography"
    | "cinema"
    | "literary"
    | "creativeIndustries"
    | "theatre"
    | "TVandRadio"
    | "architecture"
    | "newMedia"
    | "debate";

export type AggregateDataType = "trees" | "treeSpecies" | "honeyBeePopulations" | "bats";

export type PresentData = {
    distanceRangeStart: number; // Meters at which the slider starts
    distanceRangeEnd: number; // Meters at which the slider starts
    slider: (DistanceImageViewEntry | DistanceDataAggregateEntry)[]; // The entries for on the slider
    agenda: AgendaItem[]; // The events and such
};

export interface DistanceImageViewEntry extends BaseDataEntity {
    distanceToAddress: number; // Approximate distance to the address
    geoLevel?: GeoLevel; // The geo level of the entry
    image?: ImageRef;
    title: string; // Title of the entry
    visitUrl?: string; // URL to the source where people can find out more info about the image
    type: PresentImageEntityType; // The type of the entry
}

export interface DistanceDataAggregateEntry extends BaseDataEntity {
    distanceToAddress: number; // Approximate distance to the address
    aggregateData: Record<AggregateDataType, number>;
}

export interface AgendaItem extends BaseDataEntity {
    image?: ImageRef; // Hero image for the event
    title: string; // Title of the event
    description: string; // Description of the event
    date: Date; // Date of the event
    dateEnd?: Date; // End date of the event
    visitUrl?: string; // URL to the source where people can find out more info about the event
    visitUrlText?: string; // Text to display for the visitUrl. If none is provided, the frontend should default to the default copy/
}

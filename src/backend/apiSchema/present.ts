import { BaseDataEntity } from "./shared";

export type GeoLevel = "straat" | "buurt" | "wijk" | "stadsdeel";

export type PresentData = {
    distanceRangeStart: number; // Meters at which the slider starts
    distanceRangeEnd: number; // Meters at which the slider starts
    slider: SliderEntry[]; // The entries for on the slider
    agenda: AgendaItem[]; // The events and such
};

interface SliderEntry extends BaseDataEntity {
    distanceToAddress: number; // Approximate distance to the address
    geoLevel: GeoLevel; // The geo level of the entry
    image: string; // URL to the image
    visitUrl: string; // URL to the source where people can find out more info about the image
    altDescription: string; // Alt text for the image
}

export interface AgendaItem extends BaseDataEntity {
    image?: string; // URL to the hero image for the event
    title: string; // Title of the event
    description: string; // Description of the event
    date: Date; // Date of the event
    dateEnd?: Date; // End date of the event
    visitUrl?: string; // URL to the source where people can find out more info about the event
    visitUrlText?: string; // Text to display for the visitUrl. If none is provided, the frontend should default to the default copy/
}

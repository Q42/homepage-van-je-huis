import { PresentEntityType } from "./present";

export type BaseDataEntity = {
    sourceId?: string;
    source?: string;
};

export interface BaseSliderEntry extends BaseDataEntity {
    position: number;
    type: PresentEntityType | "archiveImage";
}

export type BaseView = {
    rangeStart: number; // Meters at which the slider starts
    rangeEnd: number; // Meters at which the slider starts
};

export type ImageRef = {
    url: string;
    width?: number;
    height?: number;
    altText?: string;
};

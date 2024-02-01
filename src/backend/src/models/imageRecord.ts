import { BaseRecord } from "./baseRecord";

// when updating this type, make sure to also update the outputColumns schema in the pipelineConfig
export interface ImageRecord extends BaseRecord {
    imgUrl: string;
    title?: string;
    description?: string;
    visitUrl?: string;
    date?: number;
    copyright?: string;
}

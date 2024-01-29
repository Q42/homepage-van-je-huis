import { BaseRecord } from "./baseRecord";

export interface ImageRecord extends BaseRecord {
    imgUrl: string;
    visitUrl?: string;
    date: string;
}

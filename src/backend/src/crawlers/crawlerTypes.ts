import { BaseApiResponse } from "../lib/types";
import { BaseRecord } from "../models/baseRecord";

export type ApiClient = (...args: string[]) => Promise<Record<string, any>[]>;

export type ApiParser<T extends BaseApiResponse> = (baseRecord: BaseRecord, data: Record<string, any>[]) => T[];

export type GuideLoader<Y> = (...args: any[]) => Promise<Y[]>;

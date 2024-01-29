import { BaseRecord } from "../models/baseRecord";
import { BaseApiResponse } from "../types";

export type ApiClient = (...args: string[]) => Promise<Record<string, any>[]>;

export type ApiParser<T extends BaseApiResponse> = (baseRecord: BaseRecord, data: Record<string, any>[]) => T[];

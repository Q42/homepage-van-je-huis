import { BaseRecord } from "../models/baseRecord";

export type ApiClient = (...args: string[]) => Promise<Record<string, any>[]>;

export type ApiParser<T> = (baseRecord: BaseRecord, data: Record<string, any>[]) => T[];

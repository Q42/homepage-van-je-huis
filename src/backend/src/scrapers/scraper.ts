import { BaseRecord } from "../models/baseRecord";
import { ApiClient, ApiParser as ApiMapper } from "./scaperTypes";

export class Scraper<T> {
    protected client: ApiClient;
    protected mapper: ApiMapper<T>;

    constructor(client: ApiClient, mapper: ApiMapper<T>) {
        this.client = client;
        this.mapper = mapper;
    }

    protected parse(baseRecord: BaseRecord, data: Record<string, any>[]): T[] {
        return this.mapper(baseRecord, data);
    }

    public async scrape(baseRecord: BaseRecord, ...args: string[]): Promise<T[]> {
        const data = await this.client(...args);
        return this.parse(baseRecord, data);
    }
}

import slugify from "slugify";
import { StreetsList, HouseNumberList } from "../../../common/apiSchema/resolve";
import { slugifyStreetName } from "../../../common/util/resolve";
import { DBAddress } from "../models/adresses";
import { createDirectory, getHouseNumberFromAddress, writeObjectToJsonFile } from "../utils/general";

type ResolverData = Record<string, string[]>;

export class ResolverService {
    private resolverData: ResolverData = {};

    public addAddressToResolverData(address: DBAddress) {
        if (!(address["ligtAan:BAG.ORE.naamHoofdadres"] in this.resolverData)) {
            this.resolverData[address["ligtAan:BAG.ORE.naamHoofdadres"]] = [];
        }

        const addressNumber = getHouseNumberFromAddress(address);
        this.resolverData[address["ligtAan:BAG.ORE.naamHoofdadres"]].push(addressNumber);
    }

    public writeResolverFiles(outputDir: string) {
        const streetNames = Object.keys(this.resolverData);

        if (streetNames.length === 0) {
            console.log("no resolver data to write");
            return;
        }
        console.log("writing resolver data to " + outputDir);
        createDirectory(outputDir + "/numbers");

        const streetsList: StreetsList = { streets: streetNames };

        writeObjectToJsonFile(streetsList, outputDir + "/streetNames.json");

        Object.entries(this.resolverData).forEach(([streetName, numbers]) => {
            const slugifiedStreetName = slugifyStreetName(slugify, streetName);
            const houseNumberList: HouseNumberList = { streetName: streetName, numbers: numbers };
            writeObjectToJsonFile(houseNumberList, outputDir + "/numbers/" + slugifiedStreetName + ".json");
        });
    }
}

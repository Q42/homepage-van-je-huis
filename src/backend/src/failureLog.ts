import fs from "fs";

export function appendObjectToFile(object: any, filePath: string): void {
    const jsonString = JSON.stringify(object);
    fs.appendFileSync(filePath, jsonString + "\n");
}

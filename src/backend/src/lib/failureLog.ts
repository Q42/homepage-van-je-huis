import fs from "fs";

export function appendObjectToFile(object: Record<string, any>, filePath: string): void {
    const jsonString = JSON.stringify(object);
    fs.appendFileSync(filePath, jsonString + "\n");
}

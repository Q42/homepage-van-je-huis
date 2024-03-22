import fs from "fs";

export function isExistingFile(filePath: string): boolean {
    try {
        const stats = fs.statSync(filePath);
        return stats.isFile();
    } catch (error) {
        return false;
    }
}

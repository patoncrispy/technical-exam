import { readFile } from 'fs/promises';

export async function readWarningData(key: string): Promise<string> {
    return readFile(`./${key}.xml`, { encoding: "utf-8" });
}


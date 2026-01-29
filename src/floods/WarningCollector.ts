import { Client } from "basic-ftp";
import { readFile } from "fs/promises";
import { config } from "../config";
import { logger } from "../logger";
import { readWarningData } from "../parser/ReadWarningData";

export class WarningCollector {
  async downloadWarning(amocRegion: string): Promise<string> {
    const client = new Client();
    try {
      await client.access({
        host: config.ftp.host,
        secure: config.ftp.secure,
      });

      await client.cd(config.ftp.warningsPath);
      const files = await client.list();

      for (const fileData of files) {
        if (fileData.name.endsWith(".amoc.xml") && `${amocRegion}.amoc.xml` === fileData.name) {
          if (!fileData.isSymbolicLink && !fileData.isDirectory) {
            await client.download(`./${amocRegion}.xml`, fileData.name);
          }
        }
      }

      const data = await readWarningData(amocRegion);
      return data;
    } catch (err) {
      logger.error({ err, amocRegion }, 'Failed to download warning');
      throw err;
    } finally {
      client.close();
    }
  }
}

export class WarningTextCollector extends WarningCollector {
  async downloadWarning(key: string): Promise<string> {
    const client = new Client();
    try {
      await client.access({
        host: config.ftp.host,
        secure: config.ftp.secure,
      });

      await client.cd(config.ftp.warningsPath);
      await client.download(`./${key}.txt`, key + ".txt");

      const warningText = await readFile(`./${key}.txt`, { encoding: "utf-8" });
      return warningText;
    } catch (err) {
      logger.warn({ err, key }, 'Warning text file not found');
      return "";
    } finally {
      client.close();
    }
  }
}
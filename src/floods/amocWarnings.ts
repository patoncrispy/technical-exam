import { Client } from "basic-ftp";
import { config } from "../config";
import { logger } from "../logger";

export async function getAllWarns(): Promise<string[]> {
  const client = new Client();
  try {
    await client.access({
      host: config.ftp.host,
      secure: config.ftp.secure,
    });

    await client.cd(config.ftp.warningsPath);
    const files = await client.list();
    const warns = await getNames(files);

    return warns;
  } catch (err) {
    logger.error({ err }, 'Failed to fetch warnings');
    throw err;
  } finally {
    client.close();
  }
}

export const getNames = async (warnings: { name: string }[]): Promise<string[]> => {
  const warns: string[] = [];

  for (const warning of warnings) {
    if (warning.name.endsWith(".amoc.xml")) {
      warns.push(warning.name);
    }
  }

  return warns;
};
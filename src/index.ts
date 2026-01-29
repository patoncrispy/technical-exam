import express from "express";
import { config } from "./config";
import { logger } from "./logger";
import { convertStateIdsToAmoc } from "./main/convertStateIdsToAmoc";
import { FloodWarningParser } from "./parser/FloodWarningParser";
import {
  WarningCollector,
  WarningTextCollector,
} from "./floods/WarningCollector";
import { getAllWarns } from "./floods/amocWarnings";

const app = express();

app.get("/", async (req, res) => {
  try {
    const data = await getAllWarns();
    const state = convertStateIdsToAmoc(req.query.state?.toString() || "");

    const results = [];
    for (const key of data) {
      if (key.startsWith(state)) {
        results.push(key.replace(/\.amoc\.xml/, ""));
      }
    }

    res.send(results);
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch warnings list');
    res.status(500).send({ error: 'Failed to fetch warnings' });
  }
});

app.get("/warning/:id", async (req, res) => {
  try {
    const downloader = new WarningCollector();
    const xmlid = req.params.id;

    const warning = await downloader.downloadWarning(xmlid);
    const warningParser = new FloodWarningParser(warning);

    const textDownloader = new WarningTextCollector();
    const text = await textDownloader.downloadWarning(xmlid);

    res.send({ ...(await warningParser.getWarning()), text: text || "" });
  } catch (error) {
    logger.error({ err: error, warningId: req.params.id }, 'Failed to fetch warning');
    res.status(500).send({ error: 'Failed to fetch warning' });
  }
});

app.listen(config.server.port, () => {
  logger.info({ port: config.server.port }, 'BOM Warnings API started');
});

import { WarningTextCollector } from "../floods/WarningCollector";
import { parseXmlString } from "./parseXmlString";

export class FloodWarningParser {
  constructor(private xmlString: any) {}

  async getWarning() {
    const obj: any = await new Promise((resolve, reject) => {
      parseXmlString(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let productType = parseProductType(obj);
    let service = getService(obj);

    return {
      productType,
      service,
      start: await this.getIssueTime(),
      expiry: await this.getEndTime(),
    };
  }
  async getIssueTime() {
    const obj: any = await new Promise((resolve, reject) => {
      parseXmlString(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let issuetime = (obj.amoc["issue-time-utc"] || [])[0];

    return issuetime;
  }

  async getEndTime() {
    const obj: any = await new Promise((resolve, reject) => {
      parseXmlString(this.xmlString, (data) => {
        resolve(data);
      });
    });

    let issuetime = (obj.amoc["expiry-time"] || [])[0];

    return issuetime;
  }

  async downloadwarningText(): Promise<string> {
    const obj: any = await new Promise((resolve, reject) => {
      parseXmlString(this.xmlString, (data) => {
        resolve(data);
      });
    });
    const downloader = new WarningTextCollector();

    const warningText = await downloader.downloadWarning(
      obj.amoc.identifier[0],
    );

    return warningText;
  }
}
function getService(obj: any) {
  let service = (obj.amoc["service"] || [])[0];

  switch (service) {
    case "COM":
      service = "Commercial Services";
      break;
    case "HFW":
      service = "Flood Warning Service";
      break;
    case "TWS":
      service = "Tsunami Warning Services";
      break;
    case "WAP":
      service = "Analysis and Prediction";
      break;
    case "WSA":
      service = "Aviation Weather Services";
      break;
    case "WSD":
      service = "Defence Weather Services";
      break;
    case "WSF":
      service = "Fire Weather Services";
      break;
    case "WSM":
      service = "Marine Weather Services";
      break;
    case "WSP":
      service = "Public Weather Services";
      break;
    case "WSS":
      service = "Cost Recovery Services";
      break;
    case "WSW":
      service = "Disaster Mitigation";
      break;
  }
  return service;
}

export function parseProductType(obj: any): string | undefined {
  let productType: string | undefined;

  if (obj && obj.amoc["product-type"]) {
    productType = (obj.amoc["product-type"] || [])[0];
  }

  switch (productType) {
    case "A":
      productType = "Advice";
      break;
    case "B":
      productType = "Bundle";
      break;
    case "C":
      productType = "Climate";
      break;
    case "D":
      productType = "Metadata";
      break;
    case "E":
      productType = "Analysis";
      break;
    case "F":
      productType = "Forecast";
      break;
    case "M":
      productType = "Numerical Weather Prediction";
      break;
    case "O":
      productType = "Observation";
      break;
    case "Q":
      productType = "Reference";
      break;
    case "R":
      productType = "Radar";
      break;
    case "S":
      productType = "Special";
      break;
    case "T":
      productType = "Satellite";
      break;
    case "W":
      productType = "Warning";
      break;
    case "X":
      productType = "Mixed";
      break;
  }
  return productType;
}

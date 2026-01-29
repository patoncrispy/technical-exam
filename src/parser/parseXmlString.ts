// http://www.bom.gov.au/schema/v1.7/amoc.xsd
import { parseString } from "xml2js";

export function parseXmlString(xml: string, callback: (result: any) => void) {
  parseString(xml, (_err: any, result: any) => {
    callback(result);
  });
}

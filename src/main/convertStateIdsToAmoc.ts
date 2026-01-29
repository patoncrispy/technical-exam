export function convertStateIdsToAmoc(state: string): string {
  switch (state.toUpperCase()) {
    case "NT":
      return "IDD";
    case "NSW":
      return "IDN";
    case "QLD":
      return "IDQ";
    case "SA":
      return "IDS";
    case "TAS":
      return "IDT";
    case "VIC":
      return "IDV";
    case "WA":
      return "IDW";
    case "ACT":
      return "IDN";
  }

  return "unk";
}

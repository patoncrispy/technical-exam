import { getAllWarns } from "./amocWarnings";
import { Client } from "basic-ftp";

// Mock the basic-ftp module
jest.mock("basic-ftp");

const mockClient = {
  access: jest.fn().mockResolvedValue(undefined),
  cd: jest.fn().mockResolvedValue(undefined),
  list: jest.fn().mockResolvedValue([
    { name: "IDQ11307.amoc.xml", isDirectory: false, isSymbolicLink: false },
    { name: "IDN10064.amoc.xml", isDirectory: false, isSymbolicLink: false },
    { name: "IDW12200.amoc.xml", isDirectory: false, isSymbolicLink: false },
    { name: "some-other-file.txt", isDirectory: false, isSymbolicLink: false },
  ]),
  close: jest.fn(),
};

(Client as jest.Mock).mockImplementation(() => mockClient);

describe("getAllWarns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GIVEN BOM FTP is accessible WHEN fetching warnings THEN returns array with multiple items", async () => {
    // Arrange - mock is already set up

    // Act
    const warnings = await getAllWarns();

    // Assert
    expect(warnings.length).toBeGreaterThan(1);
    expect(mockClient.access).toHaveBeenCalled();
    expect(mockClient.close).toHaveBeenCalled();
  });

  it("GIVEN BOM FTP is accessible WHEN fetching warnings THEN only returns .amoc.xml files", async () => {
    // Arrange - mock is already set up

    // Act
    const warnings = await getAllWarns();

    // Assert
    expect(warnings).toEqual([
      "IDQ11307.amoc.xml",
      "IDN10064.amoc.xml",
      "IDW12200.amoc.xml",
    ]);
    expect(warnings).not.toContain("some-other-file.txt");
  });

  it("GIVEN BOM FTP fails WHEN fetching warnings THEN throws error and closes connection", async () => {
    // Arrange
    mockClient.access.mockRejectedValueOnce(new Error("Connection failed"));

    // Act & Assert
    await expect(getAllWarns()).rejects.toThrow("Connection failed");
    expect(mockClient.close).toHaveBeenCalled();
  });
});

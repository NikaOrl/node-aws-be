import * as AWSMock from "aws-sdk-mock";
import { catalogBatchProcess } from "./catalogBatchProcess";
import { Client } from "pg";

const mockProduct = JSON.stringify({
  count: "6",
  description:
    "Write your own epic odyssey and become a legendary Spartan hero in Assassin’s Creed® Odyssey, an inspiring adventure where you must forge your destiny and define your own path in a world on the brink of tearing itself apart. Influence how history unfolds as you experience a rich and ever-changing world shaped by your decisions.",
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
  price: "10",
  title: "Assassin’s Creed®Odyssey",
  image:
    "https://store-images.s-microsoft.com/image/apps.2894.71972716530068101.68cb6eed-71f2-4211-8ace-94c4035f8759.ba8996ce-bce7-4206-bfbf-c0934994c82a"
});

jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(() => {
      return { rows: [{ id: 1, index: 0 }] };
    }),
    end: jest.fn()
  };
  return { Client: jest.fn(() => mClient) };
});

describe("catalogBatchProcess", () => {
  let client;

  beforeEach(() => {
    process.env.SNS_ARN = "test";
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.SNS_ARN = undefined;
  });

  it("should successfully add all products", async () => {
    const snsMockPublish = jest.fn(() => Promise.resolve());
    AWSMock.mock("SNS", "publish", snsMockPublish);
    await catalogBatchProcess({
      Records: [{ body: mockProduct }]
    });
    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledTimes(4);

    expect(client.query.mock.calls[0][0]).toEqual("BEGIN");
    expect(client.query.mock.calls[3][0]).toEqual("COMMIT");

    expect(client.end).toBeCalledTimes(1);
  });

  it("should fail due to parsing", async () => {
    await catalogBatchProcess(null);
    expect(client.query).toBeCalledWith("ROLLBACK");
  });

  it("should fail due to validation", async () => {
    await catalogBatchProcess({ Records: [{ body: "" }] });
    expect(client.end).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith("ROLLBACK");
  });
});

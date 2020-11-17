import * as AWSMock from "aws-sdk-mock";

import { importProductsFile } from "./importProductsFile";
import { CORS_HEADERS, HTTP_CODES, BUCKET } from "../constants";
import { APIGatewayProxyEvent } from "aws-lambda";

const mockEventWithoutQueryStringParameters: APIGatewayProxyEvent = {
  path: "",
  httpMethod: "",
  headers: {},
  queryStringParameters: null,
  pathParameters: {},
  stageVariables: {},
  body: "",
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  isBase64Encoded: false,
  requestContext: null,
  resource: ""
};

const mockEventWithQueryStringParameters: APIGatewayProxyEvent = {
  ...mockEventWithoutQueryStringParameters,
  queryStringParameters: { name: "products.cvs" }
};

describe("importProductsFile", () => {
  it("should return status code 200 and create signed URL and return it back", async () => {
    const testURL = "testUrl";
    const getSignedUrlMock = jest.fn((_operation, _params, callback) =>
      callback(null, testURL)
    );
    AWSMock.mock("S3", "getSignedUrl", getSignedUrlMock);
    const result = await importProductsFile(
      mockEventWithQueryStringParameters,
      null,
      null
    );

    expect(result).toEqual({
      statusCode: HTTP_CODES.OK,
      headers: CORS_HEADERS,
      body: JSON.stringify(testURL)
    });
    expect(getSignedUrlMock.mock.calls[0][1]).toEqual({
      Bucket: BUCKET,
      Key: "uploaded/products.cvs",
      Expires: 60,
      ContentType: "text/csv"
    });
  });

  it("should return status code 500 ", async () => {
    const result = await importProductsFile(
      mockEventWithoutQueryStringParameters,
      null,
      null
    );

    expect(result).toEqual({
      statusCode: HTTP_CODES.SERVER_ERROR,
      headers: CORS_HEADERS,
      body: '{"message":{}}'
    });
  });
});

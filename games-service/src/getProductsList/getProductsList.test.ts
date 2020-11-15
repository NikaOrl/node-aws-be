import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getProductsList } from "./getProductsList";
import * as productsList from "../productsList.json";

const mockEvent: APIGatewayProxyEvent = {
  path: "",
  httpMethod: "",
  headers: {},
  queryStringParameters: {},
  pathParameters: {},
  stageVariables: {},
  body: "",
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  isBase64Encoded: false,
  requestContext: null,
  resource: ""
};

describe("getProductsList", () => {
  test("returns products list and status code 200", async () => {
    const result = (await getProductsList(
      mockEvent,
      null,
      null
    )) as APIGatewayProxyResult;

    expect(result.body).toEqual(JSON.stringify(productsList));
    expect(result.statusCode).toEqual(200);
  });
});

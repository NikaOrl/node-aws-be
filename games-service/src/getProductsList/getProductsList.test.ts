import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getProductsList } from "./getProductsList";
import productsList from "../productsList.json";
import { HTTP_CODES } from "../constants";

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

xdescribe("getProductsList", () => {
  test("returns products list and status code 200", async () => {
    const result = (await getProductsList(
      mockEvent,
      null,
      null
    )) as APIGatewayProxyResult;

    expect(result.body).toEqual(JSON.stringify(productsList));
    expect(result.statusCode).toEqual(HTTP_CODES.OK);
  });
});

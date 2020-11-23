import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getProductsById } from "./getProductsById";
import productsList from "../productsList.json";
import { HTTP_CODES } from "../constants";

const mockEventBase: APIGatewayProxyEvent = {
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

const mockEventWithExistingId: APIGatewayProxyEvent = {
  ...mockEventBase,
  pathParameters: {
    productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa"
  }
};

const mockEventWithIncorrectId: APIGatewayProxyEvent = {
  ...mockEventBase,
  pathParameters: {
    productId: "123"
  }
};

const errorMessage = "No product with provided id has been found";

xdescribe("getProductsById", () => {
  test("returns status code 200 and right product when correct id is provided", async () => {
    const expectedProduct = JSON.stringify(productsList[0]);
    const result = (await getProductsById(
      mockEventWithExistingId,
      null,
      null
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toEqual(HTTP_CODES.OK);
    expect(result.body).toEqual(expectedProduct);
  });

  test("returns status code 404 and error message when incorrect id is provided", async () => {
    const result = (await getProductsById(
      mockEventWithIncorrectId,
      null,
      null
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toEqual(HTTP_CODES.NOT_FOUND);
    expect(result.body).toEqual(errorMessage);
  });
});

import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as productsList from "../productsList.json";
import { CORS_HEADERS } from "../headers";

export const getProductsById: APIGatewayProxyHandler = async event => {
  console.log("getProductsById was called with event: ", event);

  try {
    const productId = event.pathParameters.productId;
    const product = productsList.find(product => product.id === productId);

    if (!product) {
      return {
        statusCode: 404,
        headers: { ...CORS_HEADERS },
        body: "No product with provided id has been found"
      };
    }
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify(product)
    };
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.error("An error occured: ", errorString);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS },
      body: errorString
    };
  }
};

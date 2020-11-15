import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as productsList from "../productsList.json";
import { CORS_HEADERS } from "../headers";

export const getProductsList: APIGatewayProxyHandler = async event => {
  console.log("getProductsList was called with event: ", event);

  try {
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify(productsList)
    };
  } catch (error) {
    const errorData = JSON.stringify(error);
    console.log("An error occured while processing event: ", errorData);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS },
      body: errorData
    };
  }
};

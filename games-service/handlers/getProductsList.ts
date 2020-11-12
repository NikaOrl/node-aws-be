import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as productsList from "./productsList.json";

export const getProductsList: APIGatewayProxyHandler = async event => {
  console.log("getProductsList was called with event: ", event);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(productsList)
    };
  } catch (error) {
    const errorData = JSON.stringify(error);
    console.log("An error occured while processing event: ", errorData);

    return {
      statusCode: 500,
      body: errorData
    };
  }
};

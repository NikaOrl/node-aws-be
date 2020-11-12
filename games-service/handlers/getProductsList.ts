import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as gamesList from "./gamesList.json";

export const getProductsList: APIGatewayProxyHandler = async event => {
  console.log("getProductsList was called with event: ", event);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(gamesList)
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

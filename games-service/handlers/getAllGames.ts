import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as gamesList from "./gamesList.json";

export const getAllGames: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(gamesList)
  };
};

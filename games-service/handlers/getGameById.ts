import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as gamesList from "./gamesList.json";

export const getGameById: APIGatewayProxyHandler = async event => {
  const gameId = event.pathParameters.gameId;

  return {
    statusCode: 200,
    body: JSON.stringify(gamesList.find(game => game.id === gameId))
  };
};

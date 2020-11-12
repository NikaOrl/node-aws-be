import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import * as gamesList from "./gamesList.json";

export const getProductsById: APIGatewayProxyHandler = async event => {
  console.log("getProductById was called with event: ", event);

  try {
    const gameId = event.pathParameters.gameId;
    const game = gamesList.find(game => game.id === gameId);

    if (!game) {
      return {
        statusCode: 404,
        body: "No game with provided id has been found"
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(game)
    };
  } catch (error) {
    const errorString = JSON.stringify(error);
    console.error("An error occured: ", errorString);

    return {
      statusCode: 500,
      body: errorString
    };
  }
};

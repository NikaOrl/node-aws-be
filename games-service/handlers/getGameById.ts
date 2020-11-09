import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

export const getGameById: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
};

import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { Client } from "pg";

import { CORS_HEADERS, HTTP_CODES } from "../constants";
import { DB_OPTIONS } from "../db/dbConfig";

export const getProductsList: APIGatewayProxyHandler = async event => {
  console.log("getProductsList was called with event: ", event);

  const client = new Client(DB_OPTIONS);
  await client.connect();

  try {
    const dmlResult = await client.query(
      `SELECT product.id, product.title, product.description, product.price, product.image, stock.count
      FROM product
      INNER JOIN stock
      ON product.id = stock.product_id`
    );
    const responseData = JSON.stringify(dmlResult.rows);

    return {
      statusCode: HTTP_CODES.OK,
      headers: { ...CORS_HEADERS },
      body: responseData
    };
  } catch (error) {
    const errorData = JSON.stringify(error);
    console.log("An error occured while processing event: ", errorData);

    return {
      statusCode: HTTP_CODES.SERVER_ERROR,
      headers: { ...CORS_HEADERS },
      body: errorData
    };
  } finally {
    client.end();
  }
};

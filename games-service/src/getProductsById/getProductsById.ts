import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { Client } from "pg";

import { CORS_HEADERS, HTTP_CODES } from "../constants";
import { DB_OPTIONS } from "../db/dbConfig";

export const getProductsById: APIGatewayProxyHandler = async event => {
  console.log("getProductsById was called with event: ", event);

  const client = new Client(DB_OPTIONS);
  await client.connect();

  try {
    const productId = event.pathParameters.productId;

    const dmlResult = await client.query(
      `
      SELECT product.id, product.description, product.title, product.price, product.image, stock.count
                FROM product, stock
                WHERE product.id = stock.product_id AND product.id = $1
    `,
      [productId]
    );

    if (!dmlResult.rowCount) {
      return {
        statusCode: HTTP_CODES.NOT_FOUND,
        headers: { ...CORS_HEADERS },
        body: "No product with provided id has been found"
      };
    }

    const product = JSON.stringify(dmlResult.rows[0]);

    return {
      statusCode: HTTP_CODES.OK,
      headers: { ...CORS_HEADERS },
      body: product
    };
  } catch (error) {
    console.log("An error occured: ", error);
    const errorData = JSON.stringify({
      message: error
    });

    return {
      statusCode: HTTP_CODES.SERVER_ERROR,
      headers: { ...CORS_HEADERS },
      body: errorData
    };
  } finally {
    client.end();
  }
};

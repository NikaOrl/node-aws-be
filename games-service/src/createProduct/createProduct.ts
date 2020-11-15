import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { Client } from "pg";

import { CORS_HEADERS, HTTP_CODES } from "../constants";
import { DB_OPTIONS } from "../db/dbConfig";

export const createProduct: APIGatewayProxyHandler = async event => {
  console.log("createProduct was called with event: ", event);

  const client = new Client(DB_OPTIONS);
  await client.connect();

  try {
    const body = JSON.parse(event.body);
    const { title, description, price, count } = body;

    if (!title) {
      return {
        statusCode: HTTP_CODES.CLIENT_ERROR,
        headers: { ...CORS_HEADERS },
        body: `Field 'title' is empty`
      };
    }

    await client.query("begin");

    const productInsertResult = await client.query(
      `
      INSERT INTO product(description, title, price) VALUES($1, $2, $3) RETURNING id
    `,
      [title, description, price]
    );

    const insertedProductId = productInsertResult.rows[0].id;

    await client.query(
      `
      INSERT INTO stock (product_id, count) VALUES ($1, $2)
    `,
      [insertedProductId, count]
    );

    await client.query(`commit`);

    const responseData = JSON.stringify({ id: insertedProductId });

    return {
      statusCode: HTTP_CODES.CREATED,
      headers: { ...CORS_HEADERS },
      body: responseData
    };
  } catch (error) {
    await client.query(`rollback`);

    console.log("An error occured while processing event: ", error);
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

import { Client } from "pg";
import { SNS } from "aws-sdk";
import "source-map-support/register";
import { DB_OPTIONS } from "../db/dbConfig";
import { REGION } from "../constants";

export const catalogBatchProcess = async event => {
  console.log("catalogBatchProcess was called with event: ", event);

  const sns = new SNS({ region: REGION });
  const client = new Client(DB_OPTIONS);
  await client.connect();

  try {
    const products = event.Records.map(({ body }) => {
      const product = JSON.parse(body);

      if (!product.title) {
        product.error = `Field 'title' is empty`;
      }
      return { ...product };
    }).filter(p => {
      if (p.error) {
        console.error(`Product is not valid: ${JSON.parse(p)}`);
      }

      return !p.error;
    });

    if (!products.length) {
      throw new Error("No valid products in the uploaded file");
    }

    await client.query("BEGIN");

    const { rows } = await client.query(`
            INSERT INTO product(description, title, price, image) VALUES
            ${products
              .map(
                product =>
                  `('${product.title}', '${product.description}', ${product.price}, '${product.image}')`
              )
              .join(",")}
              RETURNING id
        `);

    await client.query(`
            INSERT INTO stock (product_id, count) VALUES
            ${rows
              .map((r, index) => `('${r.id}', ${products[index].count})`)
              .join(", ")};
        `);
    await client.query("COMMIT");

    await Promise.all(
      products.map((product, index) =>
        sns
          .publish({
            Subject: `New product with id ${rows[index].id} was added`,
            Message: JSON.stringify(product),
            MessageAttributes: {
              count: {
                DataType: "Number",
                StringValue: product.count
              }
            },
            TopicArn: process.env.SNS_ARN
          })
          .promise()
          .then(() => console.log("Email was send", JSON.stringify(product)))
          .catch(e => {
            console.log(e);
            throw new Error(e);
          })
      )
    );
  } catch (error) {
    const errorData = JSON.stringify(error);

    await client.query("ROLLBACK");
    console.log("An error occured while processing event: ", errorData);
  } finally {
    client.end();
  }
};

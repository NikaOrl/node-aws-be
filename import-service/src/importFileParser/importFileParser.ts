import { S3Handler } from "aws-lambda";
import { S3, SQS } from "aws-sdk";
import { GetObjectRequest } from "aws-sdk/clients/s3";
import * as csvParser from "csv-parser";

import { REGION, BUCKET } from "../constants";

export const importFileParser: S3Handler = event => {
  console.log("importFileParser was called with event: ", event);

  try {
    const s3 = new S3({ region: REGION });
    const sqs = new SQS();

    event.Records.forEach(record => {
      const source = record.s3.object.key;

      const params: GetObjectRequest = {
        Bucket: BUCKET,
        Key: source
      };

      const fileStream = s3.getObject(params).createReadStream();

      fileStream
        .pipe(csvParser())
        .on("data", product => {
          console.log(product);
          sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_QUEUE,
              MessageBody: JSON.stringify(product)
            },
            err => {
              console.log(err || "Message was pushed to SQS");
            }
          );
        })
        .on("error", error => {
          throw new Error(error.message);
        })
        .on("end", async () => {
          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${source}`,
              Key: source.replace("uploaded", "parsed")
            })
            .promise();

          console.log(
            `importFileParser replaced object ${source} to 'parsed' folder`
          );

          await s3
            .deleteObject({
              Bucket: BUCKET,
              Key: source
            })
            .promise();

          console.log(`importFileParser deleted parsed object ${source}`);
        });
    });
  } catch (error) {
    console.log("An error occured: ", error);
  }
};

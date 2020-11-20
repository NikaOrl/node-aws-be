import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";

import { REGION, BUCKET, HTTP_CODES, CORS_HEADERS } from "../constants";

export const importProductsFile: APIGatewayProxyHandler = async event => {
  console.log("importProductsFile was called with event: ", event);

  try {
    const s3 = new S3({ region: REGION });

    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return {
        statusCode: HTTP_CODES.CLIENT_ERROR,
        headers: { ...CORS_HEADERS },
        body: JSON.stringify({
          message: "File was not provided right - file name wasn't found"
        })
      };
    }

    const signedUrlParams = {
      Bucket: BUCKET,
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: "text/csv"
    };

    const signedUrl = await s3.getSignedUrlPromise(
      "putObject",
      signedUrlParams
    );

    return {
      statusCode: HTTP_CODES.OK,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify(signedUrl)
    };
  } catch (error) {
    console.log("An error occured: ", error);

    return {
      statusCode: HTTP_CODES.SERVER_ERROR,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify({
        message: error
      })
    };
  }
};

import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import "source-map-support/register";

const generatePolicy = (principalId, resource, effect) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource
      }
    ]
  }
});

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context,
  cb
) => {
  console.log("Event: ", JSON.stringify(event));

  if (event.type !== "TOKEN") cb("Unauthorized");

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const [userName, password] = plainCreds;

    console.log("userName: ", userName);
    console.log("password: ", password);

    const effect =
      process.env[userName] && process.env[userName] === password
        ? "Allow"
        : "Deny";

    const policy = generatePolicy(effect, event.methodArn, effect);

    cb(null, policy);
  } catch (e) {
    cb(`Unauthorized: ${e.message}`);
  }
};

export const BUCKET =
  "import-service-dev-serverlessdeploymentbucket-12wj3mh48ul3c";
export const REGION = "us-east-1";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json"
};

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,

  CLIENT_ERROR: 400,
  UNATHORIZED: 403,
  NOT_FOUND: 404,

  SERVER_ERROR: 500
};

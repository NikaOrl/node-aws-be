import { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "import-service"
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true
    }
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource:
          "arn:aws:s3:::import-service-dev-serverlessdeploymentbucket-12wj3mh48ul3c"
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource:
          "arn:aws:s3:::import-service-dev-serverlessdeploymentbucket-12wj3mh48ul3c/*"
      }
    ]
  },

  functions: {
    importProductsFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },

    importFileParser: {
      handler: "handler.importFileParser",
      events: [
        {
          s3: {
            bucket:
              "import-service-dev-serverlessdeploymentbucket-12wj3mh48ul3c",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded/",
                suffix: ""
              }
            ],
            existing: true
          }
        }
      ]
    }
  }
};

module.exports = serverlessConfiguration;
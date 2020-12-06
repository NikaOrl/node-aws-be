import { Serverless } from "serverless/aws";

import { ResponseParameters } from "./src/constants";

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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_QUEUE: {
        Ref: "SQSQueue"
      }
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
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["SQSQueue", "Arn"]
          }
        ]
      }
    ]
  },

  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue"
        }
      },
      GatewayResponseAccessDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: ResponseParameters,
          ResponseType: "ACCESS_DENIED",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: ResponseParameters,
          ResponseType: "UNAUTHORIZED",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          }
        }
      }
    },
    Outputs: {
      SQSQueue: {
        Value: {
          Ref: "SQSQueue"
        },
        Export: {
          Name: "SQSQueue"
        }
      },
      SQSQueueUrl: {
        Value: {
          Ref: "SQSQueue"
        },
        Export: {
          Name: "SQSQueueUrl"
        }
      },
      SQSQueueArn: {
        Value: {
          "Fn::GetAtt": ["SQSQueue", "Arn"]
        },
        Export: {
          Name: "SQSQueueArn"
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "put",
            path: "import",
            cors: true,
            authorizer: {
              name: "basicAuthorizer",
              arn:
                "arn:aws:lambda:us-east-1:443507229806:function:authorization-service-dev-basicAuthorizer",
              type: "token",
              resultTtlInSeconds: 0
            },
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

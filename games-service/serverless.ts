import { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "games-service"
  },

  frameworkVersion: "2",

  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true
    }
  },

  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],

  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    stage: "dev",
    region: "us-east-1",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::ImportValue": "SQSQueueArn"
          }
        ]
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          Ref: "SNSTopic"
        }
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_QUEUE: {
        "Fn::ImportValue": "SQSQueueUrl"
      },
      SNS_ARN: {
        Ref: "SNSTopic"
      }
    }
  },

  resources: {
    Resources: {
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic"
        }
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "mishaminion.nika@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          }
        }
      },
      SNSBigAmountSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "nika.orlova.1997@yandex.ru",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          },
          FilterPolicy: {
            count: [{ numeric: [">=", 10] }]
          }
        }
      }
    }
  },

  functions: {
    getProductsList: {
      handler: "handler.getProductsList",
      events: [
        {
          http: {
            path: "products",
            method: "get",
            cors: true
          }
        }
      ]
    },

    getProductsById: {
      handler: "handler.getProductsById",
      events: [
        {
          http: {
            path: "products/{productId}",
            method: "get",
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    createProduct: {
      handler: "handler.createProduct",
      events: [
        {
          http: {
            method: "post",
            path: "products",
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: "handler.catalogBatchProcess",
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              "Fn::ImportValue": "SQSQueueArn"
            }
          }
        }
      ]
    }
  }
};

module.exports = serverlessConfiguration;

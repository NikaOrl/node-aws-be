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
    }
  },

  functions: {
    getProductsList: {
      handler: "handler.getProductsList",
      events: [
        {
          http: {
            path: "games",
            method: "get",
            cors: true
          }
        }
      ]
    },

    getProductById: {
      handler: "handler.getProductById",
      events: [
        {
          http: {
            path: "games/{gameId}",
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
    }
  }
};

module.exports = serverlessConfiguration;

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
    }
  }
};

module.exports = serverlessConfiguration;

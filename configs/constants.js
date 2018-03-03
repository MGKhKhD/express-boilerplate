const devConfig = {
  Mongo_URL: "mongodb://localhost/express-boilerplate-dev",
  JWT_SECRET: "JWTsecret"
};

const prodConfig = {
  Mongo_URL: "mongodb://localhost/express-boilerplate-test"
};

const testConfig = {
  Mongo_URL: "mongodb://localhost/express-boilerplate-prod"
};

const defaultConfig = {
  PORT: process.env.PORT || 4300
};

const config = env => {
  switch (env) {
    case "development":
      return devConfig;
    case "test":
      return testConfig;
    default:
      return prodConfig;
  }
};

module.exports = { ...defaultConfig, ...config(process.env.NODE_ENV) };

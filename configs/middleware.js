const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

const middleware = app => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());

  if (isDev) {
    app.use(morgan("env"));
  }
};

module.exports = middleware;

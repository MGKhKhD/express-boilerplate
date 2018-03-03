const passport = require("passport");
const passportLocal = require("passport-local");
const passportJwt = require("passport-jwt");

const ExtractJwt = passportJwt.ExtractJwt;

const User = require("../models/userModel");
const constants = require("../configs/constants");

const localStrategy = new passportLocal(
  {
    usernameField: "email"
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      } else if (user && !user.authenticateUser(password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: constants.JWT_SECRET
};

const jwtStrategy = new passportJwt.Strategy(
  jwtConfig,
  async (jwt_payload, done) => {
    try {
      const user = await User.findById({ _id: jwt_payload._id });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

const authLocal = passport.authenticate("local", { session: false });
const authJWT = passport.authenticate("jwt", { session: false });

module.exports = { authLocal, authJWT };

const passport = require("passport");
const passportJwt = require("passport-jwt");
const config = require("../config");
const User = require("../../models/user");

const jwtOptions = {
  // Reads JWT from the HTTP Authorization header with the 'bearer' scheme
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  // Secret used to sign the JWT
  secretOrKey: config.authentication.token.secret,
  // Issuer stored in JWT
  issuer: config.authentication.token.issuer,
  // Audience stored in JWT
  audience: config.authentication.token.audience
};

passport.use(
  new passportJwt.Strategy(jwtOptions, async (payload, done) => {
    // In production, you should check to see if the token has not expired here
    const user = await User.findById(payload.sub);
    if (user) {
      return done(null, user, payload);
    }
    return done(null, false, { message: "User not found." });
  })
);

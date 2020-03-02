const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      // Find user with matching username
      User.findOne(
        {
          email
        },
        async function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: "Email not found."
            }); // Not returned with request
          }

          // Checks to see if hashed password matches hash of provided password
          const passwordCorrect =
            user === null
              ? false
              : await bcrypt.compare(password, user.passwordHash);

          if (!passwordCorrect) {
            return done(null, false, {
              message: "Incorrect password."
            }); // Not returned with request
          }
          return done(null, user);
        }
      );
    }
  )
);

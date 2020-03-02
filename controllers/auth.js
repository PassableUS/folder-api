const authRouter = require("express").Router();
const passport = require("passport");
const token = require("../utils/authentication/token");
const config = require("../utils/config");
const bcrypt = require("bcrypt");
const User = require("../models/user");

require("../utils/authentication/jwt");
require("../utils/authentication/google");
require("../utils/authentication/facebook");
require("../utils/authentication/local");

function generateUserJWTAndRedirect(req, res) {
  console.log("GENERATING JWT AND REDIRECTING");
  const accessJWT = token.generateAccessJWT(req.user.id);
  console.log("GENERATED ACCESS JWT " + accessJWT + "ATTEMPTING TO REDIRECT");
  console.log(
    "REDIRECTING TO: " + `${config.frontendUrl}/auth/login?token=${accessJWT}`
  );
  res
    .status(200)
    .redirect(`${config.frontendUrl}/auth/login?token=${accessJWT}`);
}

function generateUserJWTAndSend(req, res) {
  const accessJWT = token.generateAccessJWT(req.user.id);
  res.status(200).json(accessJWT);
}

const registerUserByEmailAndPassword = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Generate hashed password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const createdUser = new User({
      email: email,
      firstName,
      lastName,
      passwordHash
    });

    const savedUser = await createdUser.save();

    res.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
};

// Google Routes
authRouter.get(
  "/google/start",
  passport.authenticate("google", {
    session: false,
    scope: ["openid", "profile", "email"]
  })
);
authRouter.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false
  }),
  generateUserJWTAndRedirect
);

// Facebook Routes
authRouter.get(
  "/facebook/start",
  passport.authenticate("facebook", {
    session: false
  })
);
authRouter.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    session: false
  }),
  generateUserJWTAndRedirect
);

// Register User Routes
authRouter.post("/local/start", registerUserByEmailAndPassword);

// Local Authentication Routes
authRouter.post(
  "/local/login",
  passport.authenticate("local", {
    session: false
  }),
  generateUserJWTAndSend
);

module.exports = authRouter;

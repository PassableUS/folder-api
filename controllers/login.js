const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const passport = require("passport");
require("../utils/authentication/jwt");

const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!user || !passwordCorrect) {
    return res.status(401).json({
      error: "Invalid username or password"
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

loginRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const userForProfile = {
      username: user.username,
      id: user._id
    };
    res.json(userForProfile);
  }
);

module.exports = loginRouter;

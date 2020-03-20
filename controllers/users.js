const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
require("../utils/authentication/jwt");

usersRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.put(
  "/modalssetup",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let body = req.body;

      const user = await User.findByIdAndUpdate(req.user.id, { ...body }, {new: true});
      user.save();
      res.json(user);
    } catch (exception) {
      next(exception);
    }
  });

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});

  res.json(users.map(u => u.toJSON()));
});

usersRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const userForProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
      avatar: user.avatar,
      email: user.email,
      role: user.role
    };
    res.json(userForProfile);
  }
);

usersRouter.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      res.json(user);
    } catch (exception) {
      console.log('exception', exception)
      // next(exception);
    }
  });


module.exports = usersRouter;

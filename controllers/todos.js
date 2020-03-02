const todosRouter = require("express").Router();
const passport = require("passport");
require("../utils/authentication/jwt");

todosRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // TODO: Add support for times, only uses text for now
      const todo = req.body;
      const user = req.user;

      user.todos.push(todo);
      const savedUser = await req.user.save();

      res.json(savedUser.todos);
    } catch (exception) {
      next(exception);
    }
  }
);

todosRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(user.todos);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = todosRouter;

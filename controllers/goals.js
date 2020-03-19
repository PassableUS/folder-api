const goalsRouter = require("express").Router();
const Goal = require("../models/goal");
const passport = require("passport");
require("../utils/authentication/jwt");

goalsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let goals = req.body;

      goals = goals.map(goal => {
        // if it's a course goal
        const urlObject = {};
        if (goal.courseURL) {
          urlObject.courseURL = goal.courseURL.join('/');
        }
        
        return {...goal, ...urlObject}
      });

      const savedGoals = await Goal.insertMany(goals);

      res.json(savedGoals);
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/week/:startDate/:endDate/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { startDate, endDate, userId } = req.params;
      const goals = await Goal.find({"startDate": startDate, "endDate": endDate, user: userId});

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/course/:moduleId/:courseURL/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { moduleId, courseURL, userId } = req.params;
      const url = courseURL.split(',').join('/');

      const goals = await Goal.find({"moduleId": moduleId, "courseURL": url, user: userId});

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/pathway/:pathwayId/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { pathwayId, userId } = req.params;
      
      const goals = await Goal.find({"pathwayId": pathwayId, user: userId});

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = goalsRouter;

const goalsRouter = require("express").Router();
const Goal = require("../models/goal");
const passport = require("passport");
require("../utils/authentication/jwt");

goalsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const goals = req.body;

      const savedGoals = await Goal.insertMany(goals);

      res.json(savedGoals);
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      
      const goals = await Goal.find({});

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const goal = await Goal.findById(req.params.goalId);

      if (!event) {
        res.status(404).send();
        return; // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      res.json(goal);
    } catch (error) {
      next(error);
    }
  }
);

// goalsRouter.put(
//   "/:goalId",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res, next) => {
//     try {
//       const event = await Goal.findById(req.params.eventId);
//       const { title, desc, allDay, start, end, id } = req.body;

//       if (!event) {
//         res.status(404).send();
//         return; // Must stop further execution of async code or else Express will try to send the json at the end there.
//       }

//       event.title = title;
//       event.desc = desc;
//       event.allDay = allDay;
//       event.start = start;
//       event.end = end;
//       event.id = id;

//       event.save();

//       res.json(event);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = goalsRouter;

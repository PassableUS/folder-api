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
      goals = goals.map(goal => ({...goal, courseURL: goal.courseURL.join('/')}))

      const savedGoals = await Goal.insertMany(goals);

      res.json(savedGoals);
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/week/:startDate/:endDate",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.params;
      const goals = await Goal.find(
        {"startDate": startDate, "endDate": endDate}
        );

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/course/:moduleId/:courseURL",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { moduleId, courseURL } = req.params;
      const url = courseURL.split(',').join('/');

      const goals = await Goal.find(
        {"moduleId": moduleId, "courseURL": url}
        );

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

goalsRouter.get(
  "/:pathwayId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { pathwayId } = req.params;
      
      const goals = await Goal.find(
        {"pathwayId": pathwayId}
        );

      res.json(goals.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
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

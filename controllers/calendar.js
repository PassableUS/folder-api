const calendarRouter = require("express").Router();
const CalendarEvent = require("../models/calendarEvent");
const passport = require("passport");
require("../utils/authentication/jwt");

calendarRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { calendarEvents } = req.body;

      const events = await CalendarEvent.insertMany(calendarEvents);

      res.json(events);
    } catch (exception) {
      next(exception);
    }
  }
);

calendarRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      
      const events = await CalendarEvent.find({});

      res.json(events.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

calendarRouter.get(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const event = await CalendarEvent.findById(req.params.eventId);

      if (!event) {
        res.status(404).send();
        return; // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);

calendarRouter.put(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const event = await CalendarEvent.findById(req.params.eventId);
      const { title, desc, allDay, start, end, id } = req.body;

      if (!event) {
        res.status(404).send();
        return; // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      event.title = title;
      event.desc = desc;
      event.allDay = allDay;
      event.start = start;
      event.end = end;
      event.id = id;

      event.save();

      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = calendarRouter;

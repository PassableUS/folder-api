const notesRouter = require("express").Router();
const passport = require("passport");
const Note = require("../models/note");

require("../utils/authentication/jwt");

notesRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // TODO: Add support for times, only uses text for now
      const noteInformation = req.body;
      const user = req.user;

      const newNote = await new Note({
        title: noteInformation.noteTitle,
        content: noteInformation.content
      });

      user.notes.push(newNote.id);
      await req.user.save();

      res.json(newNote);
    } catch (exception) {
      next(exception);
    }
  }
);

notesRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userNotes = req.user.notes;
      res.json(userNotes);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = notesRouter;

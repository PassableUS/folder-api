const notesRouter = require("express").Router();
const passport = require("passport");
const Note = require("../models/note");
const User = require("../models/user");

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
        noteType: noteInformation.noteType,
        content: noteInformation.content
      }).save();

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
      const user = User.findById(req.user.id);
      const populatedUser = await user.populate(
        "notes",
        "title noteType content"
      );
      const userNotes = populatedUser.notes;
      res.json(userNotes);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = notesRouter;

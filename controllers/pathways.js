const pathwaysRouter = require("express").Router();
const Pathway = require("../models/pathway");
const User = require("../models/user");
const passport = require("passport");
require("../utils/authentication/jwt");

pathwaysRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { occupation, pathwayName, tags, description } = req.body;

      const pathway = new Pathway({
        name: pathwayName,
        occupation,
        tags: JSON.parse(tags), // Manually parses as bodyParser fails to parse as array
        description,
        author: req.user._id
      });

      const savedPathway = await pathway.save();

      res.json(savedPathway);
    } catch (exception) {
      next(exception);
    }
  }
);

pathwaysRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // TODO: Implement pagination here
      const pathways = await Pathway.find({}).populate(
        "author",
        "firstName lastName avatar"
      );

      res.json(pathways.map(p => p.toJSON()));
    } catch (exception) {
      next(exception);
    }
  }
);

pathwaysRouter.get(
  "/:pathwayId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const pathway = await Pathway.findById(req.params.pathwayId);

      const isOwner = String(pathway.author) === String(req.user._id);
      const isEnrolled = req.user.enrolledPathways.includes(pathway.id);

      const populatedPathway = await Pathway.findById(req.params.pathwayId)
        .populate("author", "firstName lastName avatar")
        .populate({
          path: "modules",
          select: "name courses description author",
          populate: {
            // Populates author within the module
            path: "author",
            select: "firstName lastName avatar"
          }
        });

      if (!populatedPathway) {
        res.status(404).send();
        return; // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      const populatedPathwayWithUserDetails = {
        ...populatedPathway.toJSON(),
        isOwner,
        isEnrolled
      };

      res.json(populatedPathwayWithUserDetails);
    } catch (error) {
      next(error);
    }
  }
);

pathwaysRouter.put(
  "/:pathwayId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const pathway = await Pathway.findById(req.params.pathwayId);
      if (String(pathway.author) !== String(req.user._id)) {
        console.log("========== UNAUTHORIZED MODULE ADD ============");
        console.log("Pathway author: ", pathway.author);
        console.log("Request author: ", req.user._id);
        res
          .status(401)
          .send("You do not have permission to add modules to this pathway.");
        return;
      }

      if (!pathway) {
        res.status(404).send();
        return; // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      pathway.modules.push(req.body.moduleId);
      pathway.save();

      res.json(pathway);
    } catch (error) {
      next(error);
    }
  }
);

pathwaysRouter.post(
  "/coursePathway",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { occupation, pathwayName, tags, description } = req.body;

      const pathway = new Pathway({
        name: pathwayName,
        occupation,
        tags: JSON.parse(tags), // Manually parses as bodyParser fails to parse as array
        description,
        author: req.user._id
      });

      const savedPathway = await pathway.save();

      savedPathway.modules.push(req.body.moduleId);

      res.json(savedPathway);
    } catch (exception) {
      next(exception);
    }
  }
);

pathwaysRouter.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { pathwayId } = req.body;

      const user = await User.findById(req.user.id);
      user.enrolledPathways.push(pathwayId);
      await user.save();

      res.json(user);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = pathwaysRouter;

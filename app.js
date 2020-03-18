const config = require("./utils/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const passport = require("passport");

const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authRouter = require("./controllers/auth");
const pathwayRouter = require("./controllers/pathways");
const modulesRouter = require("./controllers/modules");
const todosRouter = require("./controllers/todos");
const calendarRouter = require("./controllers/calendar");
const goalsRouter = require("./controllers/goals");
const notesRouter = require("./controllers/notes");

logger.info("Connecting to:", config.database);

mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch(error => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

// Middleware
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // support encoded bodies
app.use(passport.initialize());
app.use(middleware.logRequest);

// Routers
app.use("/api/authentication", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/pathways", pathwayRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/todos", todosRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/notes", notesRouter);

// After router middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

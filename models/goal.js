// TODO: Implement toJSON methods here and use them in controller to prevent information leaking
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  goal: String,
  startDate: String,
  endDate: String,
  moduleId: String,
  courseURL: String,
  pathwayId: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

goalSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;

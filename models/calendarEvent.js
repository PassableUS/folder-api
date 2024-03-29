// TODO: Implement toJSON methods here and use them in controller to prevent information leaking
const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  title: String,
  desc: String,
  allDay: Boolean,
  start: Date,
  end: Date,
  id: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

calendarEventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);

module.exports = CalendarEvent;

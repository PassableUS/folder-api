// TODO: Implement toJSON methods here and use them in controller to prevent information leaking
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courses: [Object],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

moduleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// LATER UPDATE MODULE NAME
// userSchema.methods.updateFirstName = function (firstName) {
//   if (firstName) { // If we are passed a valid name (not undefined), we will update the name
//     let newUser = {
//       ...this.toObject(),
//       firstName
//     }
//     User.findByIdAndUpdate(mongoose.Types.ObjectId(this._id), newUser)
//       .catch(error => {
//         return { error }
//       })
//   } else {
//     console.log('Invalid first name: ' + firstName)
//   }
// }

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;

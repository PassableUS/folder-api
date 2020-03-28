// TODO: Implement toJSON methods here and use them in controller to prevent information leaking
const mongoose = require("mongoose");

const pathwaySchema = new mongoose.Schema(
  {
    name: String,
    occupation: String,
    tags: [String],
    description: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
      }
    ]
  },
  {
    timestamps: {}
  }
);

pathwaySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

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

const Pathway = mongoose.model("Pathway", pathwaySchema);

module.exports = Pathway;

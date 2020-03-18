const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  passwordHash: String,
  firstName: String,
  lastName: String,
  providerId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: "https://i.imgur.com/54Uw1Vi.png"
  },
  role: {
    type: String,
    default: "USER"
  },
  todos: {
    type: [Object],
    default: [
      {
        text: "Create a todo in order to use this feature",
        created_at: Date.now(),
        deadline: Date.now(),
        done: false
      }
    ]
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(findOrCreate);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // For security purposes, the passwordHash of the user should not be sent with the user object (even though it is not the plaintext password, it can still be decrypted)
    delete returnedObject.passwordHash;
  }
});

userSchema.methods.updateFirstName = function(firstName) {
  if (firstName) {
    // If we are passed a valid name (not undefined), we will update the name
    let newUser = {
      ...this.toObject(),
      firstName
    };
    User.findByIdAndUpdate(mongoose.Types.ObjectId(this._id), newUser).catch(
      error => {
        return {
          error
        };
      }
    );
  } else {
    console.log("Invalid first name: " + firstName);
  }
};

userSchema.methods.updateLastName = function(lastName) {
  if (lastName) {
    let newUser = {
      ...this.toObject(),
      lastName
    };
    User.findByIdAndUpdate(mongoose.Types.ObjectId(this._id), newUser).catch(
      error => {
        return {
          error
        };
      }
    );
  } else {
    console.log("Invalid last name: " + lastName);
  }
};

userSchema.methods.updateAvatarURL = function(avatarURL) {
  if (avatarURL) {
    // If we are passed a valid URL (not undefined), we will update the avatar
    let newUser = {
      ...this.toObject(),
      avatar: avatarURL
    };
    User.findByIdAndUpdate(mongoose.Types.ObjectId(this._id), newUser).catch(
      error => {
        return {
          error
        };
      }
    );
  } else {
    console.log("Invalid avatarURL: " + avatarURL);
  }
};

userSchema.methods.updateEmail = function(email) {
  if (email) {
    // If we are passed a valid email (not undefined), we will update the email
    let newUser = {
      ...this.toObject(),
      email
    };
    User.findByIdAndUpdate(mongoose.Types.ObjectId(this._id), newUser).catch(
      error => {
        return {
          error
        };
      }
    );
  } else {
    console.log("Invalid email: " + email);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;

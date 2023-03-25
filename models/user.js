const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["super-admin", "school", "branch", "coordinator", "student"],
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};



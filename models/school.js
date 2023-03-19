const mongoose = require("mongoose");

const schoolSchema = mongoose.Schema({
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  isDelete: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SchoolModel = mongoose.model("School", schoolSchema);

module.exports = {
  SchoolModel,
};

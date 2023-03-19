const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isDelete: {
    type: String,
    required: true,
  },
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  school: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  branch: {
    id: mongoose.Schema.Types.ObjectId,
    location: String,
  },
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
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

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = {
  StudentModel,
};

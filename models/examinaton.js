const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  roomNo: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

const ExaminationModel = mongoose.model("Examination", examinationSchema);

module.exports = {
  ExaminationModel,
};

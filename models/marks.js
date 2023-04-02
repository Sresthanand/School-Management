const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  student: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    class: String,
  },
  isDelete: {
    type: String,
    required: true,
  },
  subject1: {
    name: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  subject2: {
    name: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  subject3: {
    name: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  subject4: {
    name: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  subject5: {
    name: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
});

const MarksModel = mongoose.model("Marks", marksSchema);

module.exports = {
  MarksModel,
};

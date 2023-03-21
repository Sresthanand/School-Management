const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
  status: {
    type: String,
    enum: ["present", "absent"],
  },
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  student: {
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

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);
module.exports = {
  AttendanceModel,
};

const mongoose = require("mongoose");

const coordinatorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CoordinatorModel = mongoose.model("Coordinator", coordinatorSchema);

module.exports = {
  CoordinatorModel,
};

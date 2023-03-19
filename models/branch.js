const mongoose = require("mongoose");

const branchSchema = mongoose.Schema({
  location: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BranchModel = mongoose.model("Branch", branchSchema);
module.exports = {
  BranchModel,
};

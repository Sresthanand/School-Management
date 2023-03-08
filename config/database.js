const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost:27017/posist-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

const userSchema = mongoose.Schema({ 
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["super-admin", "school", "branch", "coordinator", "student"],
  },
});


const schoolSchema = mongoose.Schema({ 
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const branchSchema = mongoose.Schema({
  location: String,
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

const coordinatorSchema = mongoose.Schema({
  name: String,
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

const studentSchema = mongoose.Schema({
  name: String,
  class: String,
  gender: String,
  enrollmentNumber: Number,
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

const UserModel = mongoose.model("User", userSchema);
const SchoolModel = mongoose.model("School", schoolSchema);
const BranchModel = mongoose.model("Branch", branchSchema);
const CoordinatorModel = mongoose.model("Coordinator", coordinatorSchema);
const StudentModel = mongoose.model("Student", studentSchema);

module.exports = {
  UserModel,
  SchoolModel,
  BranchModel,
  CoordinatorModel,
  StudentModel,
};

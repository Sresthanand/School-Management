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

//super admin -> school details null
//in super admin , only username, password and role

// admin(school) -> school details
//in admin(School) -> username ,password, role, school details, (no link with superadmin, just superadmin can register) and its
//coordinators array will be updated while registering for coordinators

//coordinator ->
// school details null
//teacher details will have value,  username , password, roles, nameofcoordinators, gender, students under it(which will be updated when registering student)

//student -> student details and username pass + add ons

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["super-admin", "school", "branch", "coordinator", "student"],
  },
});

const schoolSchema = mongoose.Schema({
  name: String,
  branches: [
    {
      type: String,
    },
  ],
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
  coordinators: [
    {
      type: String,
    },
  ],
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
  students: [
    {
      type: String,
    },
  ],
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

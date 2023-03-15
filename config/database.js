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

const branchSchema = mongoose.Schema({
  location: {
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

const coordinatorSchema = mongoose.Schema({
  name: {
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

const studentSchema = mongoose.Schema({
  name: {
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

const messageSchema = new mongoose.Schema({
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  messageTitle: {
    type: String,
    required: true,
  },
  messageContent: {
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

const marksSchema = new mongoose.Schema({
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  student: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
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

const UserModel = mongoose.model("User", userSchema);
const SchoolModel = mongoose.model("School", schoolSchema);
const BranchModel = mongoose.model("Branch", branchSchema);
const CoordinatorModel = mongoose.model("Coordinator", coordinatorSchema);
const StudentModel = mongoose.model("Student", studentSchema);
const ExaminationModel = mongoose.model("Examination", examinationSchema);
const MessageModel = mongoose.model("Message", messageSchema);
const MarksModel = mongoose.model("Marks", marksSchema);

module.exports = {
  UserModel,
  SchoolModel,
  BranchModel,
  CoordinatorModel,
  StudentModel,
  ExaminationModel,
  MessageModel,
  MarksModel,
};

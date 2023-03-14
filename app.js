const express = require("express");
const app = express();
const cors = require("cors");
const { hashSync, compareSync } = require("bcrypt");

const { UserModel } = require("./config/database");
const { SchoolModel } = require("./config/database");
const { BranchModel } = require("./config/database");
const { CoordinatorModel } = require("./config/database");
const { StudentModel } = require("./config/database");
const { ExaminationModel } = require("./config/database");
const { MessageModel } = require("./config/database");
const { MarksModel } = require("./config/database");

const passport = require("passport");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //cross origin
app.use(passport.initialize());

require("./config/passport");

// Middleware to check user role
const checkUserRole = (roles) => {
  return (req, res, next) => {
    console.log("Hi, I am from CHECK User role");
    // console.log(roles);
    // console.log(req.user);
    // console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    console.log("hi2");
    next();
  };
};



// Middleware to authenticate requests using passport -> only for protected routes -> to verify token and reuests
const authenticateRequest = passport.authenticate("jwt", { session: false });
//------------------------------------------------------------------------------------------//

//SUPER-ADMIN API;S

//school post req
app.post(
  "/schoolRegister",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    console.log("Hi, I am from school register!");

    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "school",
    });

    const school = new SchoolModel({
      name: req.body.school.name,
    });

    user
      .save()
      .then((savedUser) => {
        school.userId = {
          id: savedUser._id,
          username: savedUser.username,
        };
        console.log(school);
        return school.save(); // Return the promise from school.save() so that it can be chained in next .then() block
      })
      .then((savedSchool) => {
        res.send({
          success: true,
          message: "School created successfully",
          user: {
            id: savedSchool.userId.id,
            username: savedSchool.userId.username,
          },
          school: {
            id: savedSchool._id,
            name: savedSchool.name,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
);

//schoolGet Request
app.get(
  "/getAllSchools",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    console.log("Hi, I am from get all schools!");

    SchoolModel.find({}, { name: 1, _id: 1 }, (err, schools) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else {
        res.send({
          success: true,
          message: "Schools fetched successfully",
          schools: schools,
        });
      }
    });
  }
);

//schoolUpdate ->
app.put(
  "/updateSchool/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    const id = req.params.id;

    SchoolModel.findById(id)
      .then((school) => {
        if (!school) {
          return res.status(404).json({
            success: false,
            message: "School not found",
          });
        }

        school.name = req.body.name || school.name; // Update the school name if provided

        school.updatedAt = Date.now();

        school
          .save()
          .then((updatedSchool) => {
            return res.status(200).json({
              success: true,
              message: "School updated successfully",
              school: updatedSchool,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating school",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating school",
          error: err,
        });
      });
  }
);

//schooldelete ->
app.delete(
  "/schools/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  async (req, res) => {
    const schoolId = req.params.id;
    try {
      // Check if the school exists
      const school = await SchoolModel.findById(schoolId);
      if (!school) {
        return res.status(404).send({ message: "School not found" });
      }

      // Delete the school's associated user account
      await UserModel.findByIdAndDelete(school.userId.id);

      // Delete the school
      await SchoolModel.findByIdAndDelete(schoolId);

      res.send({ message: "School deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

//------------------------------------------------------------------------------------------//

//SCHOOL API'S

//Branchregister 
app.post(
  "/branchRegister",
  authenticateRequest,
  checkUserRole(["school"]), // One who is trying to register the user, in our case it's a school
  (req, res) => {
    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "branch", // set the user role as "branch"
    });

    user
      .save()
      .then((user) => {
        SchoolModel.findOne({ "userId.id": req.user.id }) // find the school using the userId property
          .then((school) => {
            const branch = new BranchModel({
              location: req.body.branch.location,
              school: {
                id: school._id,
                name: school.name,
              },
              userId: {
                id: user._id,
                username: user.username,
              },
            });

            branch.save().then((branch) => {
              res.send({
                success: true,
                message: "User created successfully",
                user: {
                  id: user._id,
                  username: user.username,
                  role: user.role,
                },
                branch: {
                  id: branch._id,
                  location: branch.location,
                  school: {
                    id: school._id,
                    name: school.name,
                  },
                },
              });
            });
          })
          .catch((err) => {
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
);


//Branch Get req
app.get(
  "/getBranches",
  authenticateRequest,
  checkUserRole(["school"]),
  (req, res) => {
    console.log("Hi, I am from get branches!");

    const userId = req.user.id;

    SchoolModel.findOne({ "userId.id": userId }, (err, school) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!school) {
        console.log("No school found for this user");
        res.send({
          success: false,
          message: "No school found for this user",
        });
      } else {
        const schoolId = school._id;
        console.log(school);
        console.log(schoolId);

        BranchModel.find(
          { "school.id": schoolId },
          { location: 1, "school.id": 1, "school.name": 1, _id: 1 },
          (err, branches) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              res.send({
                success: true,
                message: "Branches fetched successfully",
                branches: branches,
              });
            }
          }
        );
      }
    });
  }
);

//BranchDelete ->can only be done via that respective school(admin)
//BranchUpdate ->can only be done via that respective school(admin)

//------------------------------------------------------------------------------------------//

//BRANCH API'S

//Coordinator register
app.post(
  "/coordinatorRegister",
  authenticateRequest,
  checkUserRole(["branch"]), // One who is trying to register the user, in our case it's a branch
  (req, res) => {
    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "coordinator", // set the user role as "coordinator"
    });

    user
      .save()
      .then((user) => {
        BranchModel.findOne({ "userId.id": req.user.id }) // find the branch using the userId property of the logged in user
          .then((branch) => {
            SchoolModel.findOne({ _id: branch.school.id }) // find the school using the school id of the branch
              .then((school) => {
                const coordinator = new CoordinatorModel({
                  name: req.body.name.name,
                  userId: {
                    id: user._id,
                    username: user.username,
                  },
                  school: {
                    id: school._id,
                    name: school.name,
                  },
                  branch: {
                    id: branch._id,
                    location: branch.location,
                  },
                });

                coordinator.save().then((coordinator) => {
                  res.send({
                    success: true,
                    message: "User created successfully",
                    user: {
                      id: user._id,
                      username: user.username,
                      role: user.role,
                    },
                    coordinator: {
                      id: coordinator._id,
                      name: coordinator.name,
                      school: {
                        id: school._id,
                        name: school.name,
                      },
                      branch: {
                        id: branch._id,
                        name: branch.name,
                      },
                    },
                  });
                });
              })
              .catch((err) => {
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
);

//coordinator get
app.get(
  "/getCoordinators",
  authenticateRequest,
  checkUserRole(["branch"]),
  (req, res) => {
    console.log("Hi, I am from get coordinators!");

    const userId = req.user.id;

    BranchModel.findOne({ "userId.id": userId }, (err, branch) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!branch) {
        console.log("No branch found for this user");
        res.send({
          success: false,
          message: "No branch found for this user",
        });
      } else {
        const branchId = branch._id;
        console.log(branch);
        console.log(branchId);

        CoordinatorModel.find(
          { "branch.id": branchId },
          {
            name: 1,
            "branch.id": 1,
            "branch.location": 1,
            "school.id": 1,
            "school.name": 1,
            _id: 1,
          },
          (err, coordinators) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              res.send({
                success: true,
                message: "Coordinators fetched successfully",
                coordinators: coordinators,
              });
            }
          }
        );
      }
    });
  }
);

//coordinator delete -> can only be done by tha particular school branch and simulataneoulsy its(school branch)

//coordinator update -> can only be done by tha particular school branch and simulataneoulsy its(school branch)

//------------------------------------------------------------------------------------------//

//COORDINATOR API'S

//student register
app.post(
  "/studentRegister",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "student",
    });

    user
      .save()
      .then((user) => {
        CoordinatorModel.findOne({ "userId.id": req.user.id })
          .then((coordinator) => {
            BranchModel.findOne({ _id: coordinator.branch.id })
              .then((branch) => {
                console.log("Hellooo school");
                console.log(branch);
                SchoolModel.findOne({ _id: branch.school.id })
                  .then((school) => {
                    console.log("Hellooo school");
                    console.log(school);
                    const student = new StudentModel({
                      name: req.body.information.name,
                      class: req.body.information.classofstudent,
                      gender: req.body.information.gender,
                      enrollmentNumber: req.body.information.enrollmentNumber,
                      userId: {
                        id: user._id,
                        username: user.username,
                      },
                      school: {
                        id: school._id,
                        name: school.name,
                      },
                      branch: {
                        id: branch._id,
                        location: branch.location, //location
                      },
                      coordinator: {
                        id: coordinator._id,
                        name: coordinator.name,
                      },
                    });
                    student.save().then((student) => {
                      res.send({
                        success: true,
                        message: "User created successfully",
                        user: {
                          id: user._id,
                          username: user.username,
                          role: user.role,
                        },
                        student: {
                          id: student._id,
                          name: student.name,
                          school: {
                            id: school._id,
                            name: school.name,
                          },
                          branch: {
                            id: branch._id,
                            name: branch.name,
                          },
                          coordinator: {
                            id: coordinator._id,
                            name: coordinator.name,
                          },
                        },
                      });
                    });
                  })
                  .catch((err) => {
                    res.send({
                      success: false,
                      message: "Something went wrong",
                      error: err,
                    });
                  });
              })
              .catch((err) => {
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
);

//student get 
app.get(
  "/getStudents",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;

    CoordinatorModel.findOne(
      { "userId.id": coordinatorId },
      (err, coordinator) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Something went wrong",
            error: err,
          });
        } else if (!coordinator) {
          console.log("No coordinator found for this user");
          res.send({
            success: false,
            message: "No coordinator found for this user",
          });
        } else {
          const coordinatorName = coordinator.name;
          const coordinatorId = coordinator._id;
          const schoolName = coordinator.school.name;
          const schoolId = coordinator.school.id;
          const branchName = coordinator.branch.location;
          const branchId = coordinator.branch.id;

          StudentModel.find(
            { "coordinator.id": coordinatorId },
            (err, students) => {
              if (err) {
                console.log(err);
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              } else {
                const formattedStudents = students.map((student) => {
                  return {
                    id: student._id,
                    name: student.name,
                    class: student.class,
                    gender: student.gender,
                    enrollmentNumber: student.enrollmentNumber,
                    coordinator: {
                      name: coordinatorName,
                      id: coordinatorId,
                    },
                    school: {
                      name: schoolName,
                      id: schoolId,
                    },
                    branch: {
                      location: branchName,
                      id: branchId,
                    },
                  };
                });

                res.send({
                  success: true,
                  message: "Students fetched successfully",
                  coordinator: {
                    name: coordinatorName,
                    id: coordinatorId,
                    schoolName: schoolName,
                    schoolId: schoolId,
                    branchName: branchName,
                    branchId: branchId,
                  },
                  students: formattedStudents,
                });
              }
            }
          );
        }
      }
    );
  }
);

//student delete -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//student update -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//------------------------------------------------------------------------------------------//

//Functionality api's

//For student DashBoard, Can get its info
app.get(
  "/getStudentData",
  authenticateRequest,
  checkUserRole(["student"]),
  (req, res) => {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, (err, student) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!student) {
        console.log("No student found for this user");
        res.send({
          success: false,
          message: "No student found for this user",
        });
      } else {
        const studentData = {
          name: student.name,
          class: student.class,
          gender: student.gender,
          enrollmentNumber: student.enrollmentNumber,
          coordinator: {
            name: student.coordinator.name,
            id: student.coordinator.id,
          },
          school: {
            name: student.school.name,
            id: student.school.id,
          },
          branch: {
            location: student.branch.location,
            id: student.branch.id,
          },
        };

        res.send({
          success: true,
          message: "Student data fetched successfully",
          data: studentData,
        });
      }
    });
  }
);

//for saving exam
app.post(
  "/examRegistration",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    // Get the coordinator's user ID and username from the request
    const { id, username } = req.user;

    // Find the coordinator in the CoordinatorModel using their user ID
    CoordinatorModel.findOne({ "userId.id": id })
      .then((coordinator) => {
        if (!coordinator) {
          // If the coordinator is not found, return an error
          return res.status(404).json({ message: "Coordinator not found" });
        }

        // Create a new examination document using the request body
        const examination = new ExaminationModel({
          coordinator: {
            id: coordinator._id,
            name: coordinator.name,
          },
          userId: {
            id: id,
            username: username,
          },
          date: req.body.date,
          time: req.body.time,
          roomNo: req.body.roomnumber,
          subject: req.body.subject,
        });

        // Save the examination document to the database
        examination.save().then((exam) => {
          // Return a success response with the newly created examination document
          res.status(201).json({ success: true, exam });
        });
      })
      .catch((err) => {
        // Return an error response if an error occurs
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

//for getting exam for student
app.get(
  "/getStudentExams",
  authenticateRequest,
  checkUserRole(["student"]),
  (req, res) => {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, (err, student) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!student) {
        console.log("No student found for this user");
        res.send({
          success: false,
          message: "No student found for this user",
        });
      } else {
        ExaminationModel.find(
          { "coordinator.id": student.coordinator.id },
          (err, exams) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              const studentExams = exams.map((exam) => {
                return {
                  subject: exam.subject,
                  roomNo: exam.roomNo,
                  time: exam.time,
                  date: exam.date,
                };
              });

              res.send({
                success: true,
                message: "Exams fetched successfully",
                data: studentExams,
              });
            }
          }
        );
      }
    });
  }
);

//for saving message
app.post(
  "/saveMessage",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    // Get the coordinator's user ID and username from the request
    const { id, username } = req.user;

    // Find the coordinator in the CoordinatorModel using their user ID
    CoordinatorModel.findOne({ "userId.id": id })
      .then((coordinator) => {
        if (!coordinator) {
          // If the coordinator is not found, return an error
          return res.status(404).json({ message: "Coordinator not found" });
        }

        // Create a new message document using the request body
        const message = new MessageModel({
          coordinator: {
            id: coordinator._id,
            name: coordinator.name,
          },
          userId: {
            id: id,
            username: username,
          },
          messageTitle: req.body.messageTitle,
          messageContent: req.body.messageContent,
        });

        // Save the message document to the database
        message.save().then((savedMessage) => {
          // Return a success response with the newly created message document
          res.status(201).json({ success: true, message: savedMessage });
        });
      })
      .catch((err) => {
        // Return an error response if an error occurs
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

//for getting message for student
app.get(
  "/getStudentMessages",
  authenticateRequest,
  checkUserRole(["student"]),
  (req, res) => {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, (err, student) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!student) {
        console.log("No student found for this user");
        res.send({
          success: false,
          message: "No student found for this user",
        });
      } else {
        MessageModel.find(
          {
            "coordinator.id": student.coordinator.id,
            // "userId.id": studentId
          },
          (err, messages) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              const studentMessages = messages.map((message) => {
                return {
                  title: message.messageTitle,
                  content: message.messageContent,
                  createdAt: message.createdAt,
                };
              });

              res.send({
                success: true,
                message: "Messages fetched successfully",
                data: studentMessages,
              });
            }
          }
        );
      }
    });
  }
);

//for saving markks(coordinator will do)
app.post(
  "/registerMarks",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;

    console.log("Hiii i am from regsiter marks");
    console.log(req.body);

    // Find the coordinator based on the authenticated user id
    CoordinatorModel.findOne(
      { "userId.id": coordinatorId },
      (err, coordinator) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Something went wrong",
            error: err,
          });
        } else if (!coordinator) {
          console.log("No coordinator found for this user");
          res.send({
            success: false,
            message: "No coordinator found for this user",
          });
        } else {
          // Get the coordinator's id and name
          const coordinatorId = coordinator._id;
          const coordinatorName = coordinator.name;

          // Get the student's id and name from the request body
          const studentId = req.body.studentId;
          const studentName = req.body.studentName;

          // Create a new marks object using the request body
          const newMarks = new MarksModel({
            coordinator: {
              id: coordinatorId,
              name: coordinatorName,
            },
            student: {
              id: studentId,
              name: studentName,
            },
            subject1: {
              name: req.body.subject1.name,
              marksObtained: req.body.subject1.marks,
              totalMarks: req.body.maximumMarks,
            },
            subject2: {
              name: req.body.subject2.name,
              marksObtained: req.body.subject2.marks,
              totalMarks: req.body.maximumMarks,
            },
            subject3: {
              name: req.body.subject3.name,
              marksObtained: req.body.subject3.marks,
              totalMarks: req.body.maximumMarks,
            },
            subject4: {
              name: req.body.subject4.name,
              marksObtained: req.body.subject4.marks,
              totalMarks: req.body.maximumMarks,
            },
            subject5: {
              name: req.body.subject5.name,
              marksObtained: req.body.subject5.marks,
              totalMarks: req.body.maximumMarks,
            },
          });

          // Save the new marks object to the database
          newMarks.save((err, savedMarks) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Failed to save marks",
                error: err,
              });
            } else {
              console.log("Marks saved successfully");
              res.send({
                success: true,
                message: "Marks saved successfully",
                marks: savedMarks,
              });
            }
          });
        }
      }
    );
  }
);

//for getting marks(student will do)
app.get(
  "/getStudentMarks",
  authenticateRequest,
  checkUserRole(["student"]),
  (req, res) => {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, (err, student) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      } else if (!student) {
        console.log("No student found for this user");
        res.send({
          success: false,
          message: "No student found for this user",
        });
      } else {
        MarksModel.findOne(
          {
            "student.id": student._id,
          },
          (err, marks) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else if (!marks) {
              console.log("No marks found for this student");
              res.send({
                success: false,
                message: "No marks found for this student",
              });
            } else {
              const {
                coordinator,
                student: studentData,
                subject1,
                subject2,
                subject3,
                subject4,
                subject5,
              } = marks;

              const { name: coordinatorName } = coordinator;
              const { name: studentName } = studentData;
              //this data is returning
              const data = {
                //coordinator id and student id is not getting returned* check
                id: marks._id,
                coordinator: { id: coordinator._id, name: coordinatorName },
                student: { id: studentData._id, name: studentName },
                subject1,
                subject2,
                subject3,
                subject4,
                subject5,
              };
              res.json({
                //this is getting returned
                success: true,
                message: "Marks fetched successfully",
                data,
              });
            }
          }
        );
      }
    });
  }
);



//login for All Users
app.post("/login", (req, res) => {
  UserModel.findOne({ username: req.body.username }).then((user) => {
    // console.log("Hi1111", user);
    //No user Found
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Could not find the user.",
      });
    }

    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const payLoad = {
      username: user.username,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payLoad, "Random string", { expiresIn: "1d" });

    return res.json({
      success: true,
      token: token,
      role: user.role,
    });
  });
});

//reset password for super admin when he or she log in for the first time
app.put("/resetpassword", authenticateRequest, async (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;
  console.log("hi0");
  try {
    console.log("hi1");
    const user = await UserModel.findOne({ username: username });
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = hashSync(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.send("Password reset successfully");

    console.log("hi2");
  } catch (error) {
    console.log("hi3");
    res.status(500).send(error);
  }
});

app.listen(5000, () => console.log("Listening to port 5000"));

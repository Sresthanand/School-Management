const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");

const { UserModel } = require("../models/user");
const { SchoolModel } = require("../models/school");
const { BranchModel } = require("../models/branch");
const { CoordinatorModel } = require("../models/coordinator");
const { StudentModel } = require("../models/student");

const { ExaminationModel } = require("../models/examinaton");
const { MessageModel } = require("../models/message");
const { MarksModel } = require("../models/marks");
const { AttendanceModel } = require("../models/attendance");

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

router.post(
  "/studentRegister",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  function (req, res) {
    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "student",
    });

    user
      .save()
      .then(function (user) {
        CoordinatorModel.findOne({ "userId.id": req.user.id })
          .then(function (coordinator) {
            console.log("Hellooo coordinator");
            console.log(coordinator);
            const student = new StudentModel({
              name: req.body.information.name,
              class: req.body.information.classofstudent,
              gender: req.body.information.gender,
              enrollmentNumber: req.body.information.enrollmentNumber,
              image: req.body.information.image,
              isDelete: false,
              userId: {
                id: user._id,
                username: user.username,
              },
              school: {
                id: coordinator.school.id,
                name: coordinator.school.name,
              },
              branch: {
                id: coordinator.branch.id,
                location: coordinator.branch.location,
              },
              coordinator: {
                id: coordinator._id,
                name: coordinator.name,
              },
            });
            console.log("Studentttt + " + student);
            student
              .save()
              .then(function (student) {
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
                      id: coordinator.school.id,
                      name: coordinator.school.name,
                    },
                    branch: {
                      id: coordinator.branch.id,
                      name: coordinator.branch.name,
                    },
                    coordinator: {
                      id: coordinator._id,
                      name: coordinator.name,
                    },
                  },
                });
              })
              .catch(function (err) {
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              });
          })
          .catch(function (err) {
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          });
      })
      .catch(function (err) {
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
);

router.get(
  "/getStudents",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const search = req.query.search !== "undefined" ? req.query.search : "";

    const selectedClass =
      req.query.class !== "undefined" ? req.query.class.toString() : "";

    const selectedGender =
      req.query.gender !== "undefined" ? req.query.gender.toString() : "";

    console.log("Gender " + selectedGender);
    console.log("Class" + selectedClass);
    console.log("search" + search);

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

          const skip = (page - 1) * limit;

          let filter = {
            "coordinator.id": coordinatorId,
            isDelete: false,
          };

          if (search && !selectedClass && !selectedGender) {
            filter.$or = [
              { name: { $regex: search, $options: "i" } },
              { gender: { $regex: search, $options: "i" } },
              { enrollmentNumber: { $regex: search, $options: "i" } },
              { "school.name": { $regex: search, $options: "i" } },
              { "branch.location": { $regex: search, $options: "i" } },
              { "coordinator.name": { $regex: search, $options: "i" } },
              { class: { $regex: search, $options: "i" } },
            ];
          } else if (selectedClass && !search && !selectedGender) {
            filter.class = selectedClass;
          } else if (selectedGender && !search && !selectedClass) {
            filter.gender = selectedGender;
          } else if (search && selectedClass && !selectedGender) {
            filter.$or = [
              { name: { $regex: search, $options: "i" } },
              { gender: { $regex: search, $options: "i" } },
              { enrollmentNumber: { $regex: search, $options: "i" } },
              { "school.name": { $regex: search, $options: "i" } },
              { "branch.location": { $regex: search, $options: "i" } },
              { "coordinator.name": { $regex: search, $options: "i" } },
              { class: { $regex: search, $options: "i" } },
              { class: selectedClass },
            ];
          } else if (search && selectedGender && !selectedClass) {
            filter.$or = [
              { name: { $regex: search, $options: "i" } },
              { gender: { $regex: search, $options: "i" } },
              { enrollmentNumber: { $regex: search, $options: "i" } },
              { "school.name": { $regex: search, $options: "i" } },
              { "branch.location": { $regex: search, $options: "i" } },
              { "coordinator.name": { $regex: search, $options: "i" } },
              { gender: selectedGender },
            ];
          } else if (selectedClass && selectedGender && !search) {
            filter.class = selectedClass;
            filter.gender = selectedGender;
          } else if (search && selectedClass && selectedGender) {
            filter.$or = [
              { name: { $regex: search, $options: "i" } },
              { gender: { $regex: search, $options: "i" } },
              { enrollmentNumber: { $regex: search, $options: "i" } },
              { "school.name": { $regex: search, $options: "i" } },
              { "branch.location": { $regex: search, $options: "i" } },
              { "coordinator.name": { $regex: search, $options: "i" } },
              { class: { $regex: search, $options: "i" } },
              { class: selectedClass },
              { gender: selectedGender },
            ];
          } else if (selectedGender && selectedClass && !search) {
            filter.class = selectedClass;
            filter.gender = selectedGender;
          }

          StudentModel.find(filter)
            .skip(skip)
            .limit(limit)
            .exec((err, students) => {
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
                    image: student.image,
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

                StudentModel.countDocuments(filter, (err, count) => {
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
                      totalPages: Math.ceil(count / limit),
                    });
                  }
                });
              }
            });
        }
      }
    );
  }
);

router.put(
  "/deleteStudent/:id",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const id = req.params.id;

    console.log("Hi, I am from delete student API.");
    console.log(id);

    StudentModel.findById(id)
      .then((student) => {
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }

        student.isDelete = true;

        student.updatedAt = Date.now();

        student
          .save()
          .then((updatedStudent) => {
            return res.status(200).json({
              success: true,
              message: "Student updated successfully",
              student: updatedStudent,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating student",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating student",
          error: err,
        });
      });
  }
);

router.post(
  "/examRegistration",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const { id, username } = req.user;

    CoordinatorModel.findOne({ "userId.id": id })
      .then((coordinator) => {
        if (!coordinator) {
          return res.status(404).json({ message: "Coordinator not found" });
        }

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

        examination.save().then((exam) => {
          res.status(201).json({ success: true, exam });
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.post(
  "/saveMessage",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const { id, username } = req.user;

    CoordinatorModel.findOne({ "userId.id": id })
      .then((coordinator) => {
        if (!coordinator) {
          return res.status(404).json({ message: "Coordinator not found" });
        }

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

        message.save().then((savedMessage) => {
          res.status(201).json({ success: true, message: savedMessage });
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.post(
  "/registerMarks",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;

    console.log("Hiii i am from regsiter marks");
    console.log(req.body);

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
      
          const coordinatorId = coordinator._id;
          const coordinatorName = coordinator.name;

    
          const studentId = req.body.studentId;
          const studentName = req.body.studentName;
          const studentClass = req.body.studentClass;

    
          const newMarks = new MarksModel({
            coordinator: {
              id: coordinatorId,
              name: coordinatorName,
            },
            student: {
              id: studentId,
              name: studentName,
              class: studentClass,
            },
            isDelete: "false",
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

router.get(
  "/getMarksCoordinator",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;

    console.log("Hi i am marks dedo api ");

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
          MarksModel.find(
            {
              "coordinator.id": coordinator._id,
              isDelete: "false",
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
                console.log("No marks found for this coordinator");
                res.send({
                  success: false,
                  message: "No marks found for this coordinator",
                });
              } else {
                const data = marks.map((mark) => {
                  const {
                    coordinator,
                    student,
                    subject1,
                    subject2,
                    subject3,
                    subject4,
                    subject5,
                  } = mark;

                  const { name: coordinatorName } = coordinator;
                  const { name: studentName } = student;
                  return {
                    id: mark._id,
                    coordinator: { id: coordinator._id, name: coordinatorName },
                    student: { id: student._id, name: studentName },
                    subject1,
                    subject2,
                    subject3,
                    subject4,
                    subject5,
                  };
                });

                res.json({
                  success: true,
                  message: "Marks fetched successfully",
                  data,
                });
              }
            }
          );
        }
      }
    );
  }
);

router.get(
  "/getStudentAttendance",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id;

    console.log("Hi i am attendance bata do api ");

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
          AttendanceModel.find(
            { "coordinator.id": coordinator._id },
            (err, attendances) => {
              if (err) {
                console.log(err);
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              } else if (!attendances.length) {
                console.log("No attendance records found for this coordinator");
                res.send({
                  success: false,
                  message: "No attendance records found for this coordinator",
                });
              } else {
                const attendanceInfo = attendances.map((attendance) => ({
                  id: attendance._id,
                  studentName: attendance.student.name,
                  status: attendance.status,
                  coordinatorName: attendance.coordinator.name,
                  createdAt: attendance.createdAt,
                }));
                res.send({
                  success: true,
                  message: "Attendance records retrieved successfully",
                  data: attendanceInfo,
                });
              }
            }
          );
        }
      }
    );
  }
);

router.put(
  "/deletMarks/:id",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const id = req.params.id;

    console.log("Hi, I am from delete marks API.");
    console.log(id);

    MarksModel.findById(id)
      .then((marks) => {
        if (!marks) {
          return res.status(404).json({
            success: false,
            message: "Marks not found",
          });
        }

        marks.isDelete = "true";

        marks.updatedAt = Date.now();

        marks
          .save()
          .then((updatedMarks) => {
            return res.status(200).json({
              success: true,
              message: "Marks updated successfully",
              marks: updatedMarks,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating marks",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating marks",
          error: err,
        });
      });
  }
);

router.put(
  "/updateMarks/:id",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const id = req.params.id;
    const { subject1, subject2, subject3, subject4, subject5 } = req.body;

    console.log("Hi, I am from update marks API.");
    console.log(id);

    MarksModel.findById(id)
      .then((marks) => {
        if (!marks) {
          return res.status(404).json({
            success: false,
            message: "Marks not found",
          });
        }

        console.log(req.body);

        marks.subject1.name = subject1.name;
        marks.subject1.marksObtained = subject1.marks;
        marks.subject1.totalMarks = subject1.maximumMarks;

        marks.subject2.name = subject2.name;
        marks.subject2.marksObtained = subject2.marks;
        marks.subject2.totalMarks = subject2.maximumMarks;

        marks.subject3.name = subject3.name;
        marks.subject3.marksObtained = subject3.marks;
        marks.subject3.totalMarks = subject3.maximumMarks;

        marks.subject4.name = subject4.name;
        marks.subject4.marksObtained = subject4.marks;
        marks.subject4.totalMarks = subject4.maximumMarks;

        marks.subject5.name = subject5.name;
        marks.subject5.marksObtained = subject5.marks;
        marks.subject5.totalMarks = subject5.maximumMarks;

        marks
          .save()
          .then((updatedMarks) => {
            return res.status(200).json({
              success: true,
              message: "Marks updated successfully",
              marks: updatedMarks,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating marks",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating marks",
          error: err,
        });
      });
  }
);

//Coordinator Stats

router.get(
  "/totalStudents",
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
          StudentModel.aggregate([
            {
              $match: {
                $and: [
                  { "coordinator.id": coordinator._id },
                  { isDelete: "false" },
                ],
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ]).exec((err, result) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              const count = result.length > 0 ? result[0].count : 0;
              res.send({
                success: true,
                message: "Total students found",
                count: count,
              });
            }
          });
        }
      }
    );
  }
);

router.get(
  "/topmarkscored",
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
          MarksModel.aggregate([
            {
              $match: {
                "coordinator.id": coordinator._id,
              },
            },
            {
              $addFields: {
                totalMarks: {
                  $sum: [
                    "$subject1.totalMarks",
                    "$subject2.totalMarks",
                    "$subject3.totalMarks",
                    "$subject4.totalMarks",
                    "$subject5.totalMarks",
                  ],
                },
                obtainedMarks: {
                  $sum: [
                    "$subject1.marksObtained",
                    "$subject2.marksObtained",
                    "$subject3.marksObtained",
                    "$subject4.marksObtained",
                    "$subject5.marksObtained",
                  ],
                },
                studentName: "$student.name",
              },
            },
            {
              $addFields: {
                percentage: {
                  $multiply: [
                    { $divide: ["$obtainedMarks", "$totalMarks"] },
                    100,
                  ],
                },
              },
            },
            {
              $sort: {
                percentage: -1,
              },
            },
            {
              $limit: 5,
            },
            {
              $project: {
                _id: 0,
                name: "$studentName",
                percentage: {
                  $round: ["$percentage", 2],
                },
              },
            },
          ]).exec((err, topStudents) => {
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
                message: "Top 5 students retrieved successfully",
                data: topStudents,
              });
            }
          });
        }
      }
    );
  }
);

router.get(
  "/genderCount",
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
          StudentModel.aggregate([
            {
              $match: {
                $and: [
                  { "coordinator.id": coordinator._id },
                  { isDelete: "false" },
                ],
              },
            },
            {
              $group: {
                _id: "$gender",
                count: { $sum: 1 },
              },
            },
          ]).exec((err, result) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              let countArr = [0, 0];
              result.forEach((item) => {
                if (item._id === "Male") {
                  countArr[0] = item.count;
                } else if (item._id === "Female") {
                  countArr[1] = item.count;
                }
              });
              res.send({
                success: true,
                message: "Gender count retrieved successfully",
                countArr: countArr,
              });
            }
          });
        }
      }
    );
  }
);

router.get(
  "/classWiseCount",
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
          StudentModel.aggregate([
            {
              $match: {
                $and: [
                  { "coordinator.id": coordinator._id },
                  { isDelete: "false" },
                ],
              },
            },
            {
              $group: {
                _id: { $toInt: "$class" },
                count: { $sum: 1 },
              },
            },
          ]).exec((err, students) => {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              const countOfStudents = new Array(12).fill(0);
              
              students.forEach((student) => {
                countOfStudents[student._id - 1] = student.count;
              });
              res.send({
                success: true,
                message: "Count of students by class",
                countOfStudents,
              });
            }
          });
        }
      }
    );
  }
);

router.get(
  "/studnetsActiveInactiveCount",
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
          StudentModel.aggregate(
            [
              {
                $match: {
                  $and: [{ "coordinator.id": coordinator._id }],
                },
              },
              {
                $group: {
                  _id: "$isDelete",
                  count: { $sum: 1 },
                },
              },
            ],
            function (err, result) {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }

              let activeStudentsCount = 0;
              let inActiveStudentsCount = 0;

              result.forEach((item) => {
                if (item._id === "false") {
                  activeStudentsCount = item.count;
                } else if (item._id === "true") {
                  inActiveStudentsCount = item.count;
                }
              });

              return res.json({ activeStudentsCount, inActiveStudentsCount });
            }
          );
        }
      }
    );
  }
);

router.get(
  "/studentsRegistrationsOverPeriodOfTime",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  function (req, res) {
    var startDate = new Date("2023-02-01T00:00:00.000Z"); 
    var endDate = new Date();

    const coordinatorId = req.user.id;

    CoordinatorModel.findOne(
      { "userId.id": coordinatorId },
      function (err, coordinator) {
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
          StudentModel.aggregate(
            [
              {
                $match: {
                  $and: [
                    { "coordinator.id": coordinator._id },
                    { createdAt: { $gte: startDate, $lte: endDate } },
                  ],
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  count: { $sum: 1 },
                },
              },
              {
                $sort: { _id: 1 },
              },
            ],
            function (err, result) {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }
              var dates = [],
                counts = [];
              result.forEach(function (item) {
                dates.push(item._id);
                counts.push(item.count);
              });
              res.json({
                dates: dates,
                counts: counts,
              });
            }
          );
        }
      }
    );
  }
);

router.get(
  "/attendanceCount",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  function (req, res) {
    const coordinatorId = req.user.id;

    CoordinatorModel.findOne(
      { "userId.id": coordinatorId },
      function (err, coordinator) {
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
          AttendanceModel.aggregate(
            [
              { $match: { "coordinator.id": coordinator._id } },
              {
                $project: {
                  createdAt: {
                    $dateToString: {
                      date: {
                        $add: ["$createdAt", 19800000],
                      },
                      format: "%Y-%m-%d",
                      timezone: "+05:30",
                    },
                  },
                  status: 1,
                },
              },
              {
                $group: {
                  _id: {
                    date: "$createdAt",
                  },
                  present: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "present"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  absent: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "absent"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                },
              },
              { $sort: { "_id.date": 1 } },
            ],
            function (err, result) {
              if (err) {
                console.log(err);
                res.send({
                  success: false,
                  message: "Something went wrong",
                  error: err,
                });
              } else {
                let dates = [];
                let presentAttendanceCounts = [];
                let absentAttendanceCounts = [];

                result.forEach(function (attendance) {
                  dates.push(attendance._id.date);
                  presentAttendanceCounts.push(attendance.present);
                  absentAttendanceCounts.push(attendance.absent);
                });

                const attendanceCounts = [
                  presentAttendanceCounts,
                  absentAttendanceCounts,
                ];

                res.send({
                  success: true,
                  message: "Attendance counts retrieved successfully",
                  attendanceCounts: attendanceCounts,
                  dates: dates,
                });
              }
            }
          );
        }
      }
    );
  }
);

module.exports = router;

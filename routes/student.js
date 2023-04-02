const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");

const CronJob = require("cron").CronJob;

const { UserModel } = require("../models/user");
const { SchoolModel } = require("../models/school");
const { BranchModel } = require("../models/branch");

const { CoordinatorModel } = require("../models/coordinator");
const { StudentModel } = require("../models/student");
const { ExaminationModel } = require("../models/examinaton");
const { MessageModel } = require("../models/message");
const { MarksModel } = require("../models/marks");
const { AttendanceModel } = require("../models/attendance");

const job = new CronJob("0 0 * * *", markAttendance); //every mid night
job.start();

//pdf
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "Asia/Kolkata",
};

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

router.get(
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
          image: student.image,
          id: student._id,
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

router.get(
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

router.get(
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

router.get(
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

router.put("/markAttendance/:id", (req, res) => {
  const studentId = req.params.id;

  console.log("hi i am from mark attendance");

  console.log("StudentId " + studentId);
  //const currentDate = new Date().toISOString().split("T")[0];
  const currentDate = new Date().toLocaleDateString("en-US");
  console.log(currentDate);

  //const currentDate = new Date().toLocaleString("en-IN", options);
  // console.log(currentDate);

  AttendanceModel.findOne(
    { "student.id": studentId, createdAt: { $gte: currentDate } },
    (err, attendance) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      console.log("Attendance" + attendance);

      if (!attendance) {
        return res.status(404).send("Attendance Not Found");
      }

      if (attendance.status === "present") {
        console.log(
          "i will run my attendance has already been marked for the day"
        );
        return res.status(400).send("Attendance already marked for today");
      }

      attendance.status = "present";
      attendance.updatedAt = Date.now();

      attendance.save((err, updatedAttendance) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        return res.status(200).send(updatedAttendance);
      });
    }
  );
});

function markAttendance() {
  CoordinatorModel.find(function (err, coordinators) {
    if (err) {
      console.error(err);
      return;
    }

    coordinators.forEach(function (coordinator) {
      StudentModel.find(
        { "coordinator.id": coordinator._id },
        function (err, students) {
          if (err) {
            console.error(err);
            return;
          }

          students.forEach(function (student) {
            const attendance = new AttendanceModel({
              status: "absent",
              coordinator: {
                id: coordinator._id,
                name: coordinator.name,
              },
              student: {
                id: student._id,
                name: student.name,
              },
            });

            attendance.save(function (err) {
              if (err) {
                console.error(err);
              }
            });
          });
        }
      );
    });
  });
}

// router.post("/generateReportCard", (req, res) => {
//   const studentId = req.body.studentId;
//   console.log("hi ia m from generate report card api");
//   console.log(studentId);

//   const doc = new PDFDocument();
//   const writeStream = fs.createWriteStream("report_card.pdf");
//   doc.pipe(writeStream);
//   doc.fontSize(20).text("Hi I am pdf!", 100, 100);
//   doc.end();

//   writeStream.on("finish", () => {
//     const file = fs.createReadStream("report_card.pdf");
//     const stat = fs.statSync("report_card.pdf");
//     res.setHeader("Content-Length", stat.size);
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="report_card.pdf"`
//     );
//     file.pipe(res);
//   });
// });

router.post("/generateReportCard", (req, res) => {
  const studentId = req.body.studentId;
  console.log("hi ia m from generate report card api");
  console.log(studentId);

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream("report_card.pdf");
  doc.pipe(writeStream);
  doc.fontSize(20).text("Hi I am pdf!", 100, 100);
  doc.end();

  writeStream.on("finish", () => {
    const file = fs.createReadStream("report_card.pdf");
    const filePath = "C:/Users/SRESTH/Downloads/report_card.pdf";
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);
    res.send("Report card generated and downloaded successfully!");
  });
});

//Stats api

router.get(
  "/getStudentStats",
  authenticateRequest,
  checkUserRole(["student"]),
  function (req, res) {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, function (err, student) {
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
        MarksModel.aggregate([
          { $match: { "student.id": student._id, isDelete: "false" } },
          {
            $project: {
              subjectMarks: [
                "$subject1.marksObtained",
                "$subject2.marksObtained",
                "$subject3.marksObtained",
                "$subject4.marksObtained",
                "$subject5.marksObtained",
              ],
              subjectNames: [
                "$subject1.name",
                "$subject2.name",
                "$subject3.name",
                "$subject4.name",
                "$subject5.name",
              ],
            },
          },
          {
            $project: {
              highestMarks: { $max: "$subjectMarks" },
              lowestMarks: { $min: "$subjectMarks" },
              highestMarksSubject: {
                $arrayElemAt: [
                  "$subjectNames",
                  {
                    $indexOfArray: ["$subjectMarks", { $max: "$subjectMarks" }],
                  },
                ],
              },
              lowestMarksSubject: {
                $arrayElemAt: [
                  "$subjectNames",
                  {
                    $indexOfArray: ["$subjectMarks", { $min: "$subjectMarks" }],
                  },
                ],
              },
            },
          },
        ]).exec(function (err, result) {
          if (err) {
            console.log(err);
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          } else if (!result || result.length === 0) {
            console.log("No marks found for this student");
            res.send({
              success: false,
              message: "No marks found for this student",
            });
          } else {
            res.send({
              success: true,
              highestMarks: result[0].highestMarks,
              highestMarksSubject: result[0].highestMarksSubject,
              lowestMarks: result[0].lowestMarks,
              lowestMarksSubject: result[0].lowestMarksSubject,
            });
          }
        });
      }
    });
  }
);

router.get(
  "/getStudentPercentage",
  authenticateRequest,
  checkUserRole(["student"]),
  function (req, res) {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, function (err, student) {
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
        MarksModel.aggregate([
          {
            $match: {
              "student.id": student._id,
              isDelete: "false",
            },
          },
          {
            $group: {
              _id: "$student.id",
              totalMarks: {
                $sum: {
                  $add: [
                    "$subject1.marksObtained",
                    "$subject2.marksObtained",
                    "$subject3.marksObtained",
                    "$subject4.marksObtained",
                    "$subject5.marksObtained",
                  ],
                },
              },
              totalMaxMarks: {
                $sum: {
                  $add: [
                    "$subject1.totalMarks",
                    "$subject2.totalMarks",
                    "$subject3.totalMarks",
                    "$subject4.totalMarks",
                    "$subject5.totalMarks",
                  ],
                },
              },
            },
          },
        ]).exec(function (err, result) {
          if (err) {
            console.log(err);
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          } else if (result.length == 0) {
            console.log("No marks found for this student");
            res.send({
              success: false,
              message: "No marks found for this student",
            });
          } else {
            const percentage =
              (result[0].totalMarks / result[0].totalMaxMarks) * 100;

            res.send({
              success: true,
              percentage: percentage.toFixed(2),
            });
          }
        });
      }
    });
  }
);

router.get(
  "/getStudentRank",
  authenticateRequest,
  checkUserRole(["student"]),
  function (req, res) {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, function (err, student) {
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
        MarksModel.aggregate([
          {
            $match: {
              "coordinator.id": student.coordinator.id,
              "student.class": student.class,
              isDelete: "false",
            },
          },
          {
            $group: {
              _id: "$student.id",
              totalMarks: {
                $sum: {
                  $add: [
                    "$subject1.marksObtained",
                    "$subject2.marksObtained",
                    "$subject3.marksObtained",
                    "$subject4.marksObtained",
                    "$subject5.marksObtained",
                  ],
                },
              },
              totalMaxMarks: {
                $sum: {
                  $add: [
                    "$subject1.totalMarks",
                    "$subject2.totalMarks",
                    "$subject3.totalMarks",
                    "$subject4.totalMarks",
                    "$subject5.totalMarks",
                  ],
                },
              },
            },
          },
        ]).exec((err, result) => {
          result.forEach((obj, index) => {
            console.log(`Object ${index}:`, obj);
          });

          if (err) {
            console.log(err);
            res.send({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          } else {
            const percentages = result.map((r) => {
              const percent = (r.totalMarks / r.totalMaxMarks) * 100;
              return { studentId: r._id, percentage: percent };
            });
            const studentPercentage = percentages.find(
              (p) => p.studentId.toString() === student._id.toString()
            );
            const sortedPercentages = percentages.sort(
              (a, b) => b.percentage - a.percentage
            );

            const studentRank =
              sortedPercentages.findIndex(
                (p) => p.studentId.toString() === student._id.toString()
              ) + 1;

            const allPercentages = sortedPercentages.map((p) => ({
              percentage: p.percentage,
            }));

            const N = percentages.length;

            const percentile = ((N - studentRank + 0.5) / N) * 100;

            res.send({
              success: true,
              message: "Student rank fetched successfully",
              rank: studentRank,
              percentages: allPercentages,
              percentile: percentile,
            });
          }
        });
      }
    });
  }
);

router.get(
  "/getStudentSubjectGrades",
  authenticateRequest,
  checkUserRole(["student"]),
  function (req, res) {
    const studentId = req.user.id;

    StudentModel.findOne({ "userId.id": studentId }, function (err, student) {
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
          { "student.id": student._id, isDelete: "false" },
          function (err, marks) {
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
              const subjectGrades = [];
              for (let i = 1; i <= 5; i++) {
                const subjectName = marks["subject" + i].name;
                const marksObtained = marks["subject" + i].marksObtained;
                const totalMarks = marks["subject" + i].totalMarks;
                const percentage = ((marksObtained / totalMarks) * 100).toFixed(
                  2
                );

                subjectGrades.push({
                  subjectName: subjectName,
                  percentage: percentage,
                });
              }

              res.send({
                success: true,
                message: "Subject grades fetched successfully",
                subjectGrades: subjectGrades,
              });
            }
          }
        );
      }
    });
  }
);

module.exports = router;

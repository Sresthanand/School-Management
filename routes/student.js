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

module.exports = router;

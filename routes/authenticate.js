const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

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

router.post(
  "/login",
  (req, res) => {
    UserModel.findOne({ username: req.body.username }).then((user) => {
      // No user Found
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

      if (user.role === "school") {
        console.log("Hi i am froms school login and role");
        SchoolModel.findOne({ "userId.id": user._id }, (err, school) => {
          console.log("school" + school);
          if (err) {
            console.log("hi1");
            return res.status(500).send({
              success: false,
              message: "An error occurred while finding the school.",
            });
          }

          if (!school) {
            console.log("hi2");
            return res.status(401).send({
              success: false,
              message: "Could not find the school.",
            });
          }

          if (school.isDelete === "true") {
            console.log("hi3");
            return res.status(401).send({
              success: false,
              message: "Your account has been deleted!",
            });
          }

          console.log("hi4");
          return res.json({
            success: true,
            token: token,
            role: user.role,
          });
        });
      } else if (user.role === "branch") {
        console.log("Hi i am from branch login and role");
        BranchModel.findOne({ "userId.id": user._id }, (err, branch) => {
          console.log("branch" + branch);
          if (err) {
            return res.status(500).send({
              success: false,
              message: "An error occurred while finding the branch.",
            });
          }

          if (!branch) {
            return res.status(401).send({
              success: false,
              message: "Could not find the branch.",
            });
          }

          if (branch.isDelete === "true") {
            return res.status(401).send({
              success: false,
              message: "Your account has been deleted!",
            });
          }

          SchoolModel.findOne({ _id: branch.school.id }, (err, school) => {
            console.log("school" + school);
            if (err) {
              return res.status(500).send({
                success: false,
                message: "An error occurred while finding the school.",
              });
            }

            if (!school) {
              return res.status(401).send({
                success: false,
                message: "Could not find the school.",
              });
            }

            if (school.isDelete === "true") {
              return res.status(401).send({
                success: false,
                message: "Your account has been deleted!",
              });
            }

            return res.json({
              success: true,
              token: token,
              role: user.role,
            });
          });
        });
      } else if (user.role === "coordinator") {
        console.log("Hi i am from coordinator login and role");
        CoordinatorModel.findOne(
          { "userId.id": user._id },
          (err, coordinator) => {
            console.log("coordinator" + coordinator);
            if (err) {
              return res.status(500).send({
                success: false,
                message: "An error occurred while finding the coordinator.",
              });
            }

            if (!coordinator) {
              return res.status(401).send({
                success: false,
                message: "Could not find the coordinator.",
              });
            }

            if (coordinator.isDelete === "true") {
              return res.status(401).send({
                success: false,
                message: "Your account has been deleted!",
              });
            }

            BranchModel.findOne(
              { _id: coordinator.branch.id },
              (err, branch) => {
                console.log("branch" + branch);
                if (err) {
                  return res.status(500).send({
                    success: false,
                    message: "An error occurred while finding the branch.",
                  });
                }

                if (!branch) {
                  return res.status(401).send({
                    success: false,
                    message: "Could not find the branch.",
                  });
                }

                if (branch.isDelete === "true") {
                  return res.status(401).send({
                    success: false,
                    message: "Your account has been deleted!",
                  });
                }

                SchoolModel.findOne(
                  { _id: branch.school.id },
                  (err, school) => {
                    console.log("school" + school);
                    if (err) {
                      return res.status(500).send({
                        success: false,
                        message: "An error occurred while finding the school.",
                      });
                    }

                    if (!school) {
                      return res.status(401).send({
                        success: false,
                        message: "Could not find the school.",
                      });
                    }

                    if (school.isDelete === "true") {
                      return res.status(401).send({
                        success: false,
                        message: "Your account has been deleted!",
                      });
                    }

                    return res.json({
                      success: true,
                      token: token,
                      role: user.role,
                    });
                  }
                );
              }
            );
          }
        );
      } else if (user.role === "student") {
        console.log("Hi i am from student login and role");
        StudentModel.findOne({ "userId.id": user._id }, (err, student) => {
          console.log("student" + student);
          if (err) {
            return res.status(500).send({
              success: false,
              message: "An error occurred while finding the coordinator.",
            });
          }

          if (!student) {
            return res.status(401).send({
              success: false,
              message: "Could not find the student.",
            });
          }

          if (student.isDelete === "true") {
            return res.status(401).send({
              success: false,
              message: "Your account has been deleted!",
            });
          }

          CoordinatorModel.findOne(
            { _id: student.coordinator.id },
            (err, coordinator) => {
              console.log("coordinator" + coordinator);
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: "An error occurred while finding the coordinator.",
                });
              }

              if (!coordinator) {
                return res.status(401).send({
                  success: false,
                  message: "Could not find the coordinator.",
                });
              }

              if (coordinator.isDelete === "true") {
                return res.status(401).send({
                  success: false,
                  message: "Your account has been deleted!",
                });
              }

              BranchModel.findOne({ _id: student.branch.id }, (err, branch) => {
                console.log("branch" + branch);
                if (err) {
                  return res.status(500).send({
                    success: false,
                    message: "An error occurred while finding the branch.",
                  });
                }

                if (!branch) {
                  return res.status(401).send({
                    success: false,
                    message: "Could not find the branch.",
                  });
                }

                if (branch.isDelete === "true") {
                  return res.status(401).send({
                    success: false,
                    message: "Your account has been deleted!",
                  });
                }

                SchoolModel.findOne(
                  { _id: student.school.id },
                  (err, school) => {
                    console.log("school" + school);
                    if (err) {
                      return res.status(500).send({
                        success: false,
                        message: "An error occurred while finding the school.",
                      });
                    }

                    if (!school) {
                      return res.status(401).send({
                        success: false,
                        message: "Could not find the school.",
                      });
                    }

                    if (school.isDelete === "true") {
                      return res.status(401).send({
                        success: false,
                        message: "Your account has been deleted!",
                      });
                    }

                    return res.json({
                      success: true,
                      token: token,
                      role: user.role,
                    });
                  }
                );
              });
            }
          );
        });
      } else {
        return res.json({
          success: true,
          token: token,
          role: user.role,
        });
      }
    });
  }
);



module.exports = router;

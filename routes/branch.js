const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");

const { UserModel } = require("../models/user");
const { SchoolModel } = require("../models/school");
const { BranchModel } = require("../models/branch");
const { CoordinatorModel } = require("../models/coordinator");

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

router.post(
  "/coordinatorRegister",
  authenticateRequest,
  checkUserRole(["branch"]),
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
                  image: req.body.name.image,
                  isDelete: false,
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

router.get(
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
          { "branch.id": branchId, isDelete: "false" }, //changed "false"
          {
            name: 1,
            image: 1,
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

router.put(
  "/deleteCoordinator/:id",
  authenticateRequest,
  checkUserRole(["branch"]),
  (req, res) => {
    const id = req.params.id;

    console.log("Hi, I am from delete coordinator API.");
    console.log(id);

    CoordinatorModel.findById(id)
      .then((coordinator) => {
        if (!coordinator) {
          return res.status(404).json({
            success: false,
            message: "Coordinator not found",
          });
        }

        // Set isDelete property to true
        coordinator.isDelete = true;

        coordinator.updatedAt = Date.now();

        coordinator
          .save()
          .then((updatedCoordinator) => {
            return res.status(200).json({
              success: true,
              message: "Coordinator updated successfully",
              coordinator: updatedCoordinator,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating coordinator",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating coordinator",
          error: err,
        });
      });
  }
);

//Stats Controller

router.get(
  "/coordinatorsCount",
  authenticateRequest,
  checkUserRole(["branch"]),
  function (req, res) {
    const userId = req.user.id;

    BranchModel.findOne({ "userId.id": userId }, function (err, branch) {
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

        CoordinatorModel.aggregate(
          [
            { $match: { "branch.id": branchId, isDelete: "false" } },
            {
              $group: {
                _id: "$branch.id",
                count: { $sum: 1 },
              },
            },
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
              const count = result.length > 0 ? result[0].count : 0;
              res.json({ count: count });
            }
          }
        );
      }
    });
  }
);

router.get(
  "/coordinatorInactiveActiveCount",
  authenticateRequest,
  checkUserRole(["branch"]),
  function (req, res) {
    const userId = req.user.id;

    BranchModel.findOne({ "userId.id": userId }, function (err, branch) {
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

        CoordinatorModel.aggregate([
          { $match: { "branch.id": branchId } },
          {
            $group: {
              _id: "$isDelete",
              count: { $sum: 1 },
            },
          },
        ]).exec(function (err, result) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
          }

          let activeCoordinatorCount = 0;
          let inactiveCoordinatorCount = 0;

          result.forEach((item) => {
            if (item._id === "false") {
              activeCoordinatorCount = item.count;
            } else if (item._id === "true") {
              inactiveCoordinatorCount = item.count;
            }
          });

          return res.json({ activeCoordinatorCount, inactiveCoordinatorCount });
        });
      }
    });
  }
);

router.get(
  "/coordinatorsRegisteredOverPeriodOfTime",
  authenticateRequest,
  checkUserRole(["branch"]),
  function (req, res) {

    const userId = req.user.id;
    const startDate = new Date("2023-02-01T00:00:00.000Z"); // start of time period
    const endDate = new Date(); // end of time period (current date)

    BranchModel.findOne({ "userId.id": userId }, function (err, branch) {
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

        CoordinatorModel.aggregate(
          [
            {
              $match: {
                "branch.id": branchId,
                createdAt: {
                  $gte: startDate,
                  $lte: endDate,
                },
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
              return res.status(500).json({ message: "Internal server error" });
            }
            var dates = [],
              counts = [];
            result.forEach((item) => {
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
    });
  }
);

module.exports = router;

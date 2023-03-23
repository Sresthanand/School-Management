const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");

const { UserModel } = require("../models/user");
const { SchoolModel } = require("../models/school");
const { BranchModel } = require("../models/branch");

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

router.post(
  "/branchRegister",
  authenticateRequest,
  checkUserRole(["school"]),
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
              image: req.body.branch.image,
              isDelete: false,
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

router.get(
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
          { "school.id": schoolId, isDelete: false },
          { location: 1, "school.id": 1, "school.name": 1, _id: 1, image: 1 },
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

router.put(
  "/deleteBranch/:id",
  authenticateRequest,
  checkUserRole(["school"]),
  (req, res) => {
    const id = req.params.id;

    console.log("Hi, I am from delete branch API.");
    console.log(id);

    BranchModel.findById(id)
      .then((branch) => {
        if (!branch) {
          return res.status(404).json({
            success: false,
            message: "Branch not found",
          });
        }

        // Set isDelete property to true
        branch.isDelete = true;

        branch.updatedAt = Date.now();

        branch
          .save()
          .then((updatedBranch) => {
            return res.status(200).json({
              success: true,
              message: "Branch updated successfully",
              branch: updatedBranch,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: "Error updating branch",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error updating branch",
          error: err,
        });
      });
  }
);

//Stats Route

router.get(
  "/branchesCount",
  authenticateRequest,
  checkUserRole(["school"]),
  function (req, res) {
    const userId = req.user.id;

    SchoolModel.findOne({ "userId.id": userId }, { _id: 1 }).exec(function (
      err,
      school
    ) {
      if (err) throw err;
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      const schoolId = school._id;
      BranchModel.aggregate(
        [
          { $match: { "school.id": schoolId, isDelete: "false" } },
          {
            $group: {
              _id: "$school.id",
              count: { $sum: 1 },
            },
          },
        ],
        function (err, result) {
          if (err) throw err;
          const count = result.length > 0 ? result[0].count : 0;
          res.json({ count: count });
        }
      );
    });
  }
);

router.get(
  "/branchLocationCount",
  authenticateRequest,
  checkUserRole(["school"]),
  function (req, res) {
    const userId = req.user.id;

    SchoolModel.findOne({ "userId.id": userId }, { _id: 1 }).exec(function (
      err,
      school
    ) {
      if (err) throw err;
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      const schoolId = school._id;

      BranchModel.aggregate([
        {
          $match: {
            "school.id": schoolId,
            isDelete: "false",
          },
        },
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            location: "$_id",
            count: 1,
          },
        },
      ]).exec(function (err, branches) {
        if (err) throw err;

        const locations = branches.map((branch) => branch.location);
        const counts = branches.map((branch) => branch.count);

        return res.status(200).json({ locations, counts });
      });
    });
  }
);

router.get(
  "/activeInactivebranches",
  authenticateRequest,
  checkUserRole(["school"]),
  function (req, res) {
    const userId = req.user.id;

    SchoolModel.findOne(
      { "userId.id": userId },
      { _id: 1 },
      function (err, school) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!school) {
          return res.status(404).json({ message: "School not found" });
        }
        const schoolId = school._id;

        console.log("schoolId" + schoolId);

        BranchModel.aggregate(
          [
            {
              $match: { "school.id": schoolId },
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
              return res.status(500).json({ message: "Internal server error" });
            }

            let activeBranchCount = 0;
            let inactiveBranchCount = 0;

            result.forEach((item) => {
              if (item._id === "false") {
                activeBranchCount = item.count;
              } else if (item._id === "true") {
                inactiveBranchCount = item.count;
              }
            });

            return res.json({ activeBranchCount, inactiveBranchCount });
          }
        );
      }
    );
  }
);

router.get(
  "/branchRegistrationsOverPeriodOfTime",
  authenticateRequest,
  checkUserRole(["school"]),
  function (req, res) {
    var startDate = new Date("2023-02-01T00:00:00.000Z"); // start of time period
    var endDate = new Date(); // end of time period (current date)

    const userId = req.user.id;

    SchoolModel.findOne(
      { "userId.id": userId },
      { _id: 1 },
      function (err, school) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!school) {
          return res.status(404).json({ message: "School not found" });
        }
        const schoolId = school._id;

        console.log("schoolId" + schoolId);

        BranchModel.aggregate(
          [
            {
              $match: {
                "school.id": schoolId,
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
    );
  }
);

module.exports = router;

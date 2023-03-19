const express = require("express");
const router = express.Router();
const { hashSync, compareSync } = require("bcrypt");
const { UserModel } = require("../models/user");
const { SchoolModel } = require("../models/school");

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

router.post(
  "/schoolRegister",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    // Add your schoolRegister API code here
    console.log("Hi, I am from school register!");

    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "school",
    });

    const school = new SchoolModel({
      name: req.body.school.name,
      image: req.body.school.image,
      isDelete: false,
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
            image: savedSchool.image,
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

router.get(
  "/getAllSchools",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    console.log("Hi, I am from get all schools!");

    SchoolModel.find(
      { isDelete: false },
      { name: 1, _id: 1, image: 1 },
      (err, schools) => {
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
      }
    );
  }
);

router.put(
  "/updateSchool/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    // Add your getAllSchools API code here
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

router.put(
  "/deleteSchool/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    const id = req.params.id;

    console.log("Hi iam from delete school api");
    console.log(id);

    SchoolModel.findById(id)
      .then((school) => {
        if (!school) {
          return res.status(404).json({
            success: false,
            message: "School not found",
          });
        }

        // Set isDelete property to true
        school.isDelete = true;

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

module.exports = router;

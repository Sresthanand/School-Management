const express = require("express");
const app = express();
const cors = require("cors");
const { hashSync, compareSync } = require("bcrypt");

const { UserModel } = require("./config/database");
const { SchoolModel } = require("./config/database");
const { BranchModel } = require("./config/database");
const { CoordinatorModel } = require("./config/database");
const { StudentModel } = require("./config/database");

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

//correct ->
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

//schooldelete -> can only be deleted by software head that is super admin

//schoolUpdate -> can only be done via software head that is super admin in our case

//schoolget -> can only be done via software head that is super admin in our case

//------------------------------------------------------------------------------------------//

//Branchregister ->can only be done via that respective school(admin)

//correct->
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

//BranchDelete ->can only be done via that respective school(admin)
//BranchUpdate ->can only be done via that respective school(admin)
//Branchget ->can only be done via that respective school(admin)

//------------------------------------------------------------------------------------------//

//coordinator register -> can only be done by tha particular school branch and simulataneoulsy its(school branch)

//correct ->
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
                    name: branch.name,
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

//coordinator delete -> can only be done by tha particular school branch and simulataneoulsy its(school branch)

//coordinator update -> can only be done by tha particular school branch and simulataneoulsy its(school branch)

//coordinator get can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//------------------------------------------------------------------------------------------//
//student register -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

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
                SchoolModel.findOne({ _id: branch.school.id })
                  .then((school) => {
                    const student = new StudentModel({
                      name: req.body.information.name,
                      class: req.body.information.class,
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
                        name: branch.name,
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

//student delete -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//student update -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//student get -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)

//------------------------------------------------------------------------------------------//

//login for super-admin, school , school-branch ,coordinator and student to their respective pages

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

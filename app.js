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
  // console.log('hi i am from checksuerole')
  //console.log(role);
  return (req, res, next) => {
    console.log("hi");
    console.log(roles);
    console.log(req.user);
    console.log(req.user.roles);
    if (!roles.includes(req.user.roles)) {
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

//API'S

//Architecture ->
//School management owner is the super admin
//admin register(super admin can make admin)-> in our case schools
//then schools can create respective branches
//then branches will create coordinators
//coordinators will create students

//------------------------------------------------------------------------------------------//

//schoolregister -> can only be made by software head that is super admin

app.post(
  "/schoolRegister",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  (req, res) => {
    // Data will come in the request body
    console.log("Hi, I am from school register!");

    // Create a new User model with the username, password, and role fields
    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "school",
    });

    const school = new SchoolModel({
      name: req.body.nameofschool,
      //branches[]
      //metadata
    });

    // Save the User and School models
    Promise.all([user.save(), school.save()])
      .then(([user, school]) => {
        res.send({
          success: true,
          message: "School created successfully",
          user: {
            id: user._id,
            username: user.username,
          },
          school: {
            id: school._id,
            name: school.name,
          },
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

//schooldelete -> can only be deleted by software head that is super admin

app.delete(
  "/schoolDelete/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
      // Find the school by ID and remove it
      console.log("Hi from school delete!");
      const deletedSchool = await SchoolModel.findByIdAndRemove(id);
      console.log(deletedSchool);

      if (!deletedSchool) {
        return res.status(404).send();
      }
      res.send(deletedSchool);
    } catch (error) {
      res.status(500).send(error);
      console.log("Hi from error");
    }
  }
);

//schoolUpdate -> can only be done via software head that is super admin in our case
app.put(
  "/schoolUpdate/:id",
  authenticateRequest,
  checkUserRole(["super-admin"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      // Find the school by ID and update its details
      console.log("Hi from school update!");
      const school = await SchoolModel.findByIdAndUpdate(
        id,
        {
          $set: {
            "schoolDetails.name": req.body.name,
            // "schoolDetails.location": req.body.location,
            //password update too(later feature maybe)
          },
        },
        { new: true }
      );

      if (!school) {
        return res.status(404).send();
      }

      res.send(school);
    } catch (error) {
      res.status(500).send(error);
      console.log("Hi from error");
    }
  }
);

//------------------------------------------------------------------------------------------//

//Branchregister ->can only be done via that respective school(admin)

app.post(
  "/branchRegister",
  authenticateRequest,
  checkUserRole(["school"]), //One who is trying to register the user, in our case it's a school
  (req, res) => {
    const schoolUsername = req.body.name; // get the school name from the request body
    console.log(schoolUsername);

    const user = new UserModel({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: "branch", // set the user role as "branch"
    });

    user
      .save()
      .then((user) => {
        const branch = new BranchModel({
          location: req.body.location,
          // coordinators: [],
        });

        branch.save().then((branch) => {
          // update the school's branches array
          console.log(schoolUsername);
          SchoolModel.findOne({
            role: "school",
            username: req.user.username,
          })
            .then((school) => {
              console.log(school);
              if (!school.branches) school.branches = [];
              school.branches.push(branch); //embedding (no id as no referncing data)
              school.save();
            })
            .catch((err) => {
              res.send({
                success: false,
                message: "Something went wrong",
                error: err,
              });
            });

          res.send({
            success: true,
            message: "user created Successfully",
            user: {
              id: user._id,
              username: user.username,
              role: user.role,
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
  }
);

//BranchDelete ->can only be done via that respective school(admin)
app.delete(
  "/branchDelete/:id",
  authenticateRequest,
  checkUserRole(["school"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      // Find the branch by ID and remove it
      const deletedBranch = await BranchModel.findByIdAndRemove(id);

      if (!deletedBranch) {
        return res.status(404).send();
      }

      // Find the school by username and remove the branch from its branches array
      const school = await SchoolModel.findOne({
        role: "school",
        username: req.user.name,
      });

      if (!school) {
        return res.status(404).send();
      }

      school.branches = school.branches.filter(
        (branchId) => branchId.toString() !== deletedBranch._id.toString()
      );

      await school.save();

      res.send(deletedBranch);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//BranchUpdate ->can only be done via that respective school(admin)
app.put(
  "/branchUpdate/:id",
  authenticateRequest,
  checkUserRole(["school"]),
  async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
      // Find the branch by ID and update it
      console.log("hi!!!!!!!!!!!!!!!!!!!");
      const updatedBranch = await BranchModel.findByIdAndUpdate(
        id,
        {
          $set: {
            location: req.body.location,
          },
        },
        { new: true }
      );

      if (!updatedBranch) {
        return res.status(404).send();
      }

      res.send(updatedBranch);
    } catch (error) {
      res.status(500).send(error);
      console.log("hii from error");
    }
  }
);

//------------------------------------------------------------------------------------------//

//coordinator register -> can only be done by tha particular school branch and simulataneoulsy its(school branch)
//branch array should be updated while registering
app.post(
  "/coordinatorRegister",
  authenticateRequest,
  checkUserRole(["branch"]), // Only a branch can register a coordinator
  (req, res) => {
    const branchId = req.user.id; // Get the branch ID from the authenticated user
    console.log(branchId);

    // Check if the branch exists
    BranchModel.findById(branchId)
      .then((branch) => {
        if (!branch) {
          return res.status(404).send({ message: "Branch not found" });
        }

        // Create the coordinator user
        const user = new UserModel({
          username: req.body.username,
          password: hashSync(req.body.password, 10),
          role: "coordinator",
        });

        const coordinator = new CoordinatorModel({
          name: req.body.name,
          // students: [],
        });

        // Save the user and coordinator
        user
          .save()
          .then((savedUser) => {
            coordinator
              .save()
              .then((savedCoordinator) => {
                // Update the branch's coordinators array
                if (!branch.coordinators) branch.coordinators = [];
                branch.coordinators.push(savedCoordinator); //no id as no referencing only embedding
                branch
                  .save()
                  .then(() => {
                    res.send({
                      success: true,
                      message: "Coordinator created successfully",
                      user: {
                        id: savedUser._id,
                        username: savedUser.username,
                      },
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    res.status(500).send({ message: "Something went wrong" });
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).send({ message: "Something went wrong" });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ message: "Something went wrong" });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
      });
  }
);

//coordinator delete -> can only be done by tha particular school branch and simulataneoulsy its(school branch)
//branch array should be updated while registering
app.delete(
  "/coordinatorDelete/:coordinatorId",
  authenticateRequest,
  checkUserRole(["branch"]), // Only a branch can delete a coordinator
  async (req, res) => {
    const branchId = req.user.id; // Get the branch ID from the authenticated user
    const coordinatorId = req.params.coordinatorId; // Get the coordinator ID from the request parameters

    try {
      // Check if the branch exists
      const branch = await BranchModel.findById(branchId);
      if (!branch) {
        return res.status(404).send({ message: "Branch not found" });
      }

      // Check if the coordinator exists
      const coordinator = await CoordinatorModel.findById(coordinatorId);
      if (!coordinator) {
        return res.status(404).send({ message: "Coordinator not found" });
      }

      // Remove the coordinator from the branch's coordinators array
      branch.coordinators = branch.coordinators.filter(
        (id) => id.toString() !== coordinatorId
      );
      await branch.save();

      // Delete the coordinator user
      await CoordinatorModel.findByIdAndDelete(coordinatorId);

      res.send({
        success: true,
        message: "Coordinator deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);
//coordinator update -> can only be done by tha particular school branch and simulataneoulsy its(school branch)
//branch array should be updated while registering
app.put(
  "/coordinatorUpdate/:coordinatorId",
  authenticateRequest,
  checkUserRole(["branch"]), // Only a branch can update a coordinator
  async (req, res) => {
    const branchId = req.user.id; // Get the branch ID from the authenticated user
    const coordinatorId = req.params.coordinatorId; // Get the coordinator ID from the request parameters

    try {
      // Check if the branch exists
      const branch = await BranchModel.findById(branchId);
      if (!branch) {
        return res.status(404).send({ message: "Branch not found" });
      }

      // Check if the coordinator exists
      const coordinator = await CoordinatorModel.findById(coordinatorId);
      if (!coordinator) {
        return res.status(404).send({ message: "Coordinator not found" });
      }

      // Update the coordinator user
      // coordinator.username = req.body.username || coordinator.username;
      // coordinator.password = req.body.password
      //   ? hashSync(req.body.password, 10)
      //   : coordinator.password;
      coordinator.name = req.body.name || coordinator.name;
      await coordinator.save();

      res.send({
        success: true,
        message: "Coordinator updated successfully",
        user: {
          id: coordinator._id,
          username: coordinator.username,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

//------------------------------------------------------------------------------------------//
//student register -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)
// student array should be updated while registering

app.post(
  "/studentRegister",
  authenticateRequest,
  checkUserRole(["coordinator"]),
  (req, res) => {
    const coordinatorId = req.user.id; // Get the coordinator ID from the authenticated user

    CoordinatorModel.findById(coordinatorId, (err, coordinator) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Something went wrong" });
      }

      if (!coordinator) {
        return res.status(404).send({ message: "Coordinator not found" });
      }

      const user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10),
        role: "student",
      });

      const student = new StudentModel({
        name: req.body.name,
        class: req.body.class,
        gender: req.body.gender,
        enrollmentNumber: req.body.enrollmentNumber,
      });

      user.save((err, savedUser) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "Something went wrong" });
        }

        student.save((err, savedStudent) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ message: "Something went wrong" });
          }

          if (!coordinator.students) {
            coordinator.students = [];
          }

          coordinator.students.push(savedStudent); //no id only embedding data
          coordinator.save((err) => {
            if (err) {
              console.log(err);
              return res.status(500).send({ message: "Something went wrong" });
            }

            res.send({
              success: true,
              message: "Student created successfully",
              user: {
                id: savedUser._id,
                username: savedUser.username,
              },
            });
          });
        });
      });
    });
  }
);

//student delete -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)
// student array should be updated while registering
app.delete(
  "/studentDelete/:studentId",
  authenticateRequest,
  checkUserRole(["coordinator"]), // Only a coordinator can delete a student
  async (req, res) => {
    const coordinatorId = req.user.id; // Get the coordinator ID from the authenticated user
    const studentId = req.params.studentId; // Get the student ID from the request parameters

    try {
      // Check if the coordinator exists
      const coordinator = await CoordinatorModel.findById(coordinatorId);
      if (!coordinator) {
        return res.status(404).send({ message: "Coordinator not found" });
      }

      // Check if the student exists
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).send({ message: "Student not found" });
      }

      // Remove the student from the coordinator's students array
      coordinator.students = coordinator.students.filter(
        (id) => id.toString() !== studentId
      );
      await coordinator.save();

      // Delete the student user
      await StudentModel.findByIdAndDelete(studentId);

      res.send({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

//student update -> can only be done by tha particular coordinator and simulataneoulsy its(coordinator)
// student array should be updated while registering
app.put(
  "/studentUpdate/:studentId",
  authenticateRequest,
  checkUserRole(["coordinator"]), // Only a coordinator can update a student
  async (req, res) => {
    const coordinatorId = req.user.id; // Get the coordinator ID from the authenticated user
    const studentId = req.params.studentId; // Get the student ID from the request parameters

    try {
      // Check if the coordinator exists
      const coordinator = await CoordinatorModel.findById(coordinatorId);
      if (!coordinator) {
        return res.status(404).send({ message: "Coordinator not found" });
      }

      // Check if the student exists
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).send({ message: "Student not found" });
      }

      // Check if the coordinator is authorized to update this student
      // if (!coordinator.students.includes(studentId)) {
      //   return res
      //     .status(401)
      //     .send({ message: "You are not authorized to update this student" });
      // }

      // Update the student user
      // student.username = req.body.username || student.username;
      // if (req.body.password) {
      //   student.password = hashSync(req.body.password, 10);
      // }
      student.name = req.body.name || student.name;
      student.class = req.body.class || student.class;
      student.enrollmentNumber =
        req.body.enrollmentNumber || student.enrollmentNumber;
      student.gender = req.body.gender || student.gender;

      const savedUser = await student.save();

      res.send({
        success: true,
        message: "Student updated successfully",
        user: {
          id: savedUser._id,
          username: savedUser.username,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

//------------------------------------------------------------------------------------------//

//login for super-admin, school , school-branch and student to their respective pages
//login for super-admin, admin , user and redirecting to their respective pages
app.post("/login", (req, res) => {
  console.log("Login post request");
  console.log(req.body.username);
  console.log(req.body.password);

  UserModel.findOne({ username: req.body.username }).then((user) => {
    console.log("Hi1111", user);
    //No user Found
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Could not find the user.",
      });
    }

    //Incorrect passowrd
    console.log(req.body.password + " I am req.body.password");
    console.log(user.password + " I am user.password");
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const payLoad = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(payLoad, "Random string", { expiresIn: "1d" });

    return res.status(200).send({
      success: true,
      message: "Logged in successfully!!",
      token: "Bearer " + token,
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

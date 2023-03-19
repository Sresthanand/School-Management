const express = require("express");
const app = express();
const cors = require("cors");
const { hashSync, compareSync } = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("./config/passport");
require("./config/database");

const { UserModel } = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

const superAdminRoutes = require("./routes/superadmin");
app.use("/api/superadmin", superAdminRoutes);

const schoolRoutes = require("./routes/school");
app.use("/api/school", schoolRoutes);

const branchRoutes = require("./routes/branch");
app.use("/api/branch", branchRoutes);

const coordinatorRoutes = require("./routes/coordinator");
app.use("/api/coordinator", coordinatorRoutes);

const studentRoutes = require("./routes/student");
app.use("/api/student", studentRoutes);

const uploadImageRoute = require("./routes/uploadimage");
app.use("/api/upload", uploadImageRoute);

const authenticateRoutes = require("./routes/authenticate");
app.use("/api/authenticate", authenticateRoutes);

app.listen(5000, () => console.log("Listening to port 5000"));

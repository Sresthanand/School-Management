const passport = require("passport");

const authenticateRequest = passport.authenticate("jwt", { session: false });

console.log("I am Authenticate req")
const checkUserRole = (roles) => {
  return (req, res, next) => {
    console.log("Hi, I am from CHECK User role");
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
console.log("I am check user role")

module.exports = { authenticateRequest, checkUserRole };

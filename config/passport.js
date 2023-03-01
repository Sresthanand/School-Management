const { compareSync } = require("bcrypt");
const passport = require("passport");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
const {UserModel} = require("./database");

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "Random string";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {    
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

//Persists user data inside session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

mySchoolApp.service("AuthService", function (jwtHelper, $state) {
  var self = this;

  self.checkTokenValidity = function (token) {
    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
      return false;
    }
    return true;
  };
});


mySchoolApp.service("loginService", function ($http) {
  this.login = function (username, password) {
    return $http.post("http://localhost:5000/api/authenticate/login", {
      username: username,
      password: password,
    });
  };
});

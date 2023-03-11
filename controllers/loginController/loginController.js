// Inject the new services and factories into your controller
mySchoolApp.controller(
  "loginController",
  function ($scope, $state, loginService, tokenService, jwtHelper) {
    tokenService.clearToken();
    console.log(" hi i am login controller");

    $scope.login = function () {
      loginService
        .login($scope.username, $scope.password)
        .then(function (response) {
          var token = response.data.token;
          var decodedToken = jwtHelper.decodeToken(token);
          console.log(decodedToken);
          tokenService.setToken(token);
          console.log(decodedToken.role);
          switch (decodedToken.role) {
            case "super-admin":
              $state.go("SuperAdminDashBoard");
              break;
            case "school":
              $state.go("SchoolDashboard");
              break;
            case "branch":
              $state.go("SchoolBranchDashboard");
              break;
            case "coordinator":
              $state.go("Coordinator");
              break;
            case "student":
              $state.go("StudentDashBoard");
              break;
            default:
              alert("Invalid user role");
          }
        })
        .catch(function (error) {
          if (error.status === 401) {
            alert("Invalid username or password");
          } else {
            alert("An error occurred: " + error.statusText);
          }
        });
    };
  }
);

mySchoolApp.controller(
  "loginController",
  function ($scope, $http, $state, jwtHelper) {
    $scope.login = function () {
      $http
        .post("http://localhost:5000/login", {
          username: $scope.username,
          password: $scope.password,
        })
        .then(function (response) {
          var token = response.data.token;

          console.log($scope.username);
          console.log($scope.password);

          var decodedToken = jwtHelper.decodeToken(token);

          localStorage.setItem("token", token);
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

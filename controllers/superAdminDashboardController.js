mySchoolApp.controller(
  "superAdminDashboardController",
  function ($scope, $state, jwtHelper, $http) {
    var token = localStorage.getItem("token");

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.registerSchool = function () {
      var data = {
        username: $scope.username,
        password: $scope.password,
        school: {
          name: $scope.schoolName,
        },
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/schoolRegister",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      }).then(
        function (response) {
          console.log(response);
          alert("School created successfully");
        },
        function (error) {
          console.log(error);
          alert("Something went wrong");
        }
      );
    };
  }
);

const authenticateRequest = passport.authenticate("jwt", { session: false });

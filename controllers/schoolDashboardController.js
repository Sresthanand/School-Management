mySchoolApp.controller(
  "schoolDashboardController",
  function ($scope, $state, jwtHelper, $http) {
    var token = localStorage.getItem("token");

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.branchRegister = function () {
      const location = $scope.location;
      const username = $scope.username;
      const password = $scope.password;

      const requestData = {
        branch: {
          location,
        },
        username,
        password,
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/branchRegister",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: requestData,
      })
        .then((response) => {
          console.log("User created successfully:", response.data.user);
          console.log("Branch created successfully:", response.data.branch);
          alert("Branch Created Succesfully");
        })
        .catch((error) => {
          console.error("Error in registration:", error.data);
          alert("Something Went Wrong!");
        });
    };
  }
);

// const authenticateRequest = passport.authenticate("jwt", { session: false });

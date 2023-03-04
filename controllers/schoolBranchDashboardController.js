mySchoolApp.controller(
  "schoolBranchDashboardController",
  function ($scope, $state, jwtHelper, $http) {
    var token = localStorage.getItem("token");

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.coordinatorRegister = function () {
      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;

      const requestData = {
        name: {
          name,
        },
        username,
        password,
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/coordinatorRegister",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: requestData,
      })
        .then((response) => {
          console.log("User created successfully:", response.data.user);
          console.log(
            "Coordinator created successfully:",
            response.data.coordinator
          );
          alert("Coordinator Created Successfully");
        })
        .catch((error) => {
          console.error("Error in registration:", error.data);
          alert("Something Went Wrong!");
        });
    };
  }
);

// const authenticateRequest = passport.authenticate("jwt", { session: false });

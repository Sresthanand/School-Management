mySchoolApp.controller(
  "studentDashboardController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am student controller!!!!!!!!!!!!!!");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    // API call to get student data

    $http({
      method: "GET",
      url: "http://localhost:5000/getStudentData",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Hiiiii response hu mai");
        console.log(response);
        $scope.name = response.data.data.name;
        $scope.studentClass = response.data.data.class;
        $scope.gender = response.data.data.gender;
        $scope.enrollmentNumber = response.data.data.enrollmentNumber;
        $scope.schoolName = response.data.data.school.name;
        $scope.branchName = response.data.data.branch.location;
        $scope.coordinatorName = response.data.data.coordinator.name;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

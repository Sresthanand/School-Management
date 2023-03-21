mySchoolApp.controller(
  "SuperAdminStatsController",
  function ($scope, $rootScope, jwtHelper, $http) {
    console.log("Hi  i am super admin stats controller");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    var token = localStorage.getItem("token");

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/total",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.totalSchools = response.data.totalSchools;

        $scope.totalBranches = response.data.totalBranches;

        $scope.totalCoordinators = response.data.totalCoordinators;

        $scope.totalStudents = response.data.totalStudents;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

mySchoolApp.controller(
  "schoolDashboardStatsController",
  function ($scope, $rootScope, jwtHelper, $http) {
    console.log("Hi  i am school stats controller");

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

    //total branches
    $http({
      method: "GET",
      url: "http://localhost:5000/api/school/branchesCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.numberOfBranches = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

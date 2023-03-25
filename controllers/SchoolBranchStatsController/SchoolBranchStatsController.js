mySchoolApp.controller(
  "SchoolBranchStatsController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");

    console.log("Hi i am from school branch stats controllerr");

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

    $http({
      method: "GET",
      url: "http://localhost:5000/api/branch/coordinatorsCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.totalCoordinators = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

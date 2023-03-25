mySchoolApp.controller(
  "CoordinatorStatsController",
  function ($scope, $rootScope, jwtHelper, $http) {
    console.log("Hi  i am coordinator stats controller");

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

    //total registrations

    $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/totalStudents",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        $scope.totalStudents = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

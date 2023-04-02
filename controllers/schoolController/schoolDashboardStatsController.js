mySchoolApp.controller(
  "schoolDashboardStatsController",
  function (
    $scope,
    $rootScope,
    jwtHelper,
    $http,

    AuthService,
    RouteChangeService,

    SchoolStatsService
  ) {
    console.log("Hi  i am school stats controller");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    SchoolStatsService.getBranchesCount(token)
      .then(function (response) {
        console.log(response);
        $scope.numberOfBranches = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

mySchoolApp.controller(
  "SchoolBranchStatsController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,

    coordinatorStats
  ) {
    console.log("Hi i am from school branch stats controllerr");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    coordinatorStats
      .getCoordinatorCount(token)
      .then(function (response) {
        console.log(response);
        $scope.totalCoordinators = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });

      
  }
);

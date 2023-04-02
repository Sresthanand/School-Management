mySchoolApp.controller(
  "CoordinatorStatsController",
  function (
    $scope,
    $rootScope,
    jwtHelper,
    $http,
    AuthService,
    RouteChangeService,

    studentStatsService
  ) {
    console.log("Hi  i am coordinator stats controller");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };
    //total registrations

    studentStatsService
      .getTotalStudents(token)
      .then(function (response) {
        $scope.totalStudents = response.data.count;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

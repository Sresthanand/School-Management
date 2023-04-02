mySchoolApp.controller(
  "SuperAdminStatsController",
  function (
    $scope,
    $rootScope,
    jwtHelper,
    $http,
    AuthService,
    RouteChangeService,
    SuperAdminStatsService
  ) {
    console.log("Hi  i am super admin stats controller");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    // Total registrations
    SuperAdminStatsService.getTotalRegistrations(token)
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

    // Latest registrations
    SuperAdminStatsService.getLatestRegistrations(token)
      .then(function (response) {
        console.log(response);
        $scope.latestBranchCreatedAt = response.data.latestBranch[0].createdAt;
        $scope.latestBranchLocation = response.data.latestBranch[0].location;
        $scope.latestBranchschoolName =
          response.data.latestBranch[0].schoolName;

        $scope.latestCoordinatorCreatedAt =
          response.data.latestCoordinator[0].createdAt;
        $scope.latesCoordinatorName = response.data.latestCoordinator[0].name;

        $scope.latestSchoolCreatedAt = response.data.latestSchool[0].createdAt;
        $scope.latestSchoolName = response.data.latestSchool[0].name;

        $scope.latestStudentCreatedAt =
          response.data.latestStudent[0].createdAt;
        $scope.latestStudentName = response.data.latestStudent[0].name;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

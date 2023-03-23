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

    //total registrations

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

    //latest registrations

    $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/latest",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("Hi i am from get latest front end");
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

mySchoolApp.controller(
  "StudentDashboardStatsController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,

    studentDashboardStatsServices,
    StudentDashboardStatsFactory
  ) {
    console.log("Hi i am Student Dashboard Stats controller!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    studentDashboardStatsServices
      .getStudentMarksStats(token)
      .then(function (response) {
        console.log(response);

        $scope.highestMarks = response.data.highestMarks;
        $scope.highestMarksSubjectName = response.data.highestMarksSubject;

        $scope.lowestMarks = response.data.lowestMarks;
        $scope.lowestMarksSubjectName = response.data.lowestMarksSubject;
      })
      .catch(function (err) {
        console.log(err);
      });

    studentDashboardStatsServices
      .getStudentPercentage(token)
      .then(function (response) {
        console.log(response);

        $scope.percentage = response.data.percentage;

        $scope.cgpa = StudentDashboardStatsFactory.calculateCGPA(
          $scope.percentage
        );
        $scope.overallGrade =
          StudentDashboardStatsFactory.calculateOverallGrade($scope.percentage);
      })
      .catch(function (err) {
        console.log(err);
      });

    studentDashboardStatsServices
      .getStudenRank(token)
      .then(function (response) {
        console.log(response);

        $scope.rank = response.data.rank;
        $scope.percentile = response.data.percentile;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

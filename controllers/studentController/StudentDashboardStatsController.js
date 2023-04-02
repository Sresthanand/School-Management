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

    // studentDashboardStatsServices
    //   .getStudentPercentage(token)
    //   .then(function (response) {
    //     console.log(response);

    //     $scope.percentage = response.data.percentage;

    //     var cgpa = ($scope.percentage / 9.5).toFixed(2);
    //     $scope.cgpa = cgpa;

    //     if ($scope.percentage >= 90 && $scope.percentage <= 100) {
    //       $scope.overallGrade = "A+";
    //     } else if ($scope.percentage >= 80 && $scope.percentage < 90) {
    //       $scope.overallGrade = "A";
    //     } else if ($scope.percentage >= 70 && $scope.percentage < 80) {
    //       $scope.overallGrade = "B+";
    //     } else if ($scope.percentage >= 60 && $scope.percentage < 70) {
    //       $scope.overallGrade = "B";
    //     } else if ($scope.percentage >= 50 && $scope.percentage < 60) {
    //       $scope.overallGrade = "C";
    //     } else if ($scope.percentage >= 40 && $scope.percentage < 50) {
    //       $scope.overallGrade = "D";
    //     } else if ($scope.percentage < 30) {
    //       $scope.overallGrade = "F";
    //     }
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });

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

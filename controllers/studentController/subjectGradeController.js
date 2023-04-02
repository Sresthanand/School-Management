mySchoolApp.controller(
  "subjectGradeController",
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
    console.log("Hi i am SUBJECT Grade Stats controller!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    studentDashboardStatsServices
      .getStudentSubjectWiseMarks(token)
      .then(function (response) {
        console.log(response);
        var subjectPercentages =
          StudentDashboardStatsFactory.calculateSubjectPercentage(
            response.data.subjectGrades
          );

        $scope.labels = [
          subjectPercentages.subject1Name,
          subjectPercentages.subject2Name,
          subjectPercentages.subject3Name,
          subjectPercentages.subject4Name,
          subjectPercentages.subject5Name,
        ];
        $scope.data = [
          subjectPercentages.subject1Percentage,
          subjectPercentages.subject2Percentage,
          subjectPercentages.subject3Percentage,
          subjectPercentages.subject4Percentage,
          subjectPercentages.subject5Percentage,
        ];
        $scope.type = "polarArea";

        $scope.toggle = function () {
          $scope.type = $scope.type === "polarArea" ? "pie" : "polarArea";
        };
      })

      .catch(function (err) {
        console.log(err);
      });
  }
);

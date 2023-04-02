mySchoolApp.controller(
  "ExamController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,
    studentDashboardService
  ) {
    console.log("Hi i am Exam controller!!!!!!!!!!!!!!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };
    // Get student exams
    studentDashboardService
      .getStudentExams(token)
      .then(function (response) {
        console.log(response);
        $scope.exams = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

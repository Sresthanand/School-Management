mySchoolApp.controller(
  "AttendanceController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,

    studentService
  ) {
    console.log("Hi i am student attendance controller!!!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.selectedStatus = "";

    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedStatus = "";
      $scope.dateQuery = ""; 
    };

    $scope.StatusFilter = function (attendance) {
      return (
        $scope.selectedStatus === "" ||
        attendance.status === $scope.selectedStatus
      );
    };

    $scope.filterByDate = function (attendance) {
      if (!$scope.dateQuery) {
        var today = new Date(); 
        $scope.dateQuery = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
          //return true; -> commented 
        );
      }
      var selectedDate = new Date($scope.dateQuery);
      var attendanceDate = new Date(attendance.createdAt);
      return selectedDate.toDateString() === attendanceDate.toDateString();
    };

    // Get student attendance
    studentService
      .getStudentAttendance(token)
      .then(function (response) {
        console.log(response);
        $scope.attendances = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

mySchoolApp.controller(
  "AttendanceController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am student attendance controller!!!");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.selectedStatus = "";

    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedStatus = "";
      $scope.dateQuery = ""; // Add this line to reset the date filter
    };

    $scope.StatusFilter = function (attendance) {
      return (
        $scope.selectedStatus === "" ||
        attendance.status === $scope.selectedStatus
      );
    };

    $scope.filterByDate = function (attendance) {
      if (!$scope.dateQuery) {
        return true;
      }
      var selectedDate = new Date($scope.dateQuery);
      var attendanceDate = new Date(attendance.createdAt);
      return selectedDate.toDateString() === attendanceDate.toDateString();
    };

    $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/getStudentAttendance",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.attendances = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

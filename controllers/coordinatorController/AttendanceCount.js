mySchoolApp.controller(
  "AttendanceCount",
  function ($scope, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am AttendanceCount controller!");

    studentStatsService
      .getAttendanceCount(token)
      .then(function (response) {
        console.log(response);

        $scope.labels = response.data.dates;
        $scope.data = response.data.attendanceCounts;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

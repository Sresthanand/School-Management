mySchoolApp.controller("AttendanceCount", function ($scope, $http) {
  var token = localStorage.getItem("token");

  console.log("Hi i am AttendanceCount controller!");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/coordinator/attendanceCount",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      console.log(response);

      $scope.labels = response.data.dates;
      $scope.data = response.data.attendanceCounts;
    })
    .catch(function (err) {
      console.log(err);
    });
});

mySchoolApp.controller("classWiseStatsController", function ($scope, $http) {
  var token = localStorage.getItem("token");

  console.log("Hi i am gender chart controller!");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/coordinator/classWiseCount",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      console.log(response.data.countOfStudents);
      $scope.labels = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
      $scope.data = [response.data.countOfStudents];
      $scope.colors = ["#9370DB"];
    })
    .catch(function (err) {
      console.log(err);
    });
});

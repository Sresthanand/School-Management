mySchoolApp.controller(
  "genderChartController",
  function ($scope, $http, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am gender chart controller!");

    studentStatsService
      .getGenderCount(token)
      .then(function (response) {
        console.log(response.data.countArr);

        $scope.labels = ["Male", " Female"];
        $scope.data = response.data.countArr;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

mySchoolApp.controller("genderChartController", function ($scope, $http) {
  var token = localStorage.getItem("token");

  console.log("Hi i am gender chart controller!");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/coordinator/genderCount",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      console.log(response.data.countArr);

      $scope.labels = ["Male", " Female"];
      $scope.data = response.data.countArr;
    })
    .catch(function (err) {
      console.log(err);
    });
});

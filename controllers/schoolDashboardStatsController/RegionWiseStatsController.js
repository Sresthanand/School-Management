mySchoolApp.controller("RegionWiseStatsController", function ($scope, $http) {
  var token = localStorage.getItem("token");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/school/branchLocationCount",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      console.log(response);
      $scope.labels = response.data.locations;
      $scope.data = [response.data.counts];
      $scope.series = ["Branches"];
      $scope.colors = [ "#9370DB"];

    })
    .catch(function (err) {
      console.log(err);
    });
});

mySchoolApp.controller(
  "RegionWiseStatsController",
  function ($scope, SchoolStatsService) {
    var token = localStorage.getItem("token");

    SchoolStatsService.getBranchLocationCount(token)
      .then(function (response) {
        console.log(response);
        $scope.labels = response.data.locations;
        $scope.data = [response.data.counts];
        $scope.series = ["Branches"];
        $scope.colors = ["#9370DB"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

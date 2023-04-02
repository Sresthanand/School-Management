mySchoolApp.controller("lineChart", function ($scope, SuperAdminStatsService) {
  SuperAdminStatsService.getActiveInactiveSchools()
    .then(function (response) {
      console.log("active inactive");
      console.log(response);
      $scope.labels = ["Inactive Schools", "Active Schools"];
      $scope.data = [
        response.data.inactiveSchools,
        response.data.activeSchools,
      ];
      $scope.colors = ["#F7464A", "#46BFBD"];
    })
    .catch(function (err) {
      console.log(err);
    });
});

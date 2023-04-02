mySchoolApp.controller(
  "BranchStartsActiveInactiveController",
  function ($scope, SchoolStatsService) {
    var token = localStorage.getItem("token");

    SchoolStatsService.getActiveInactiveBranches(token)
      .then(function (response) {
        console.log(response);
        $scope.labels = ["Inactive Branches", "Active Branches"];
        $scope.data = [
          response.data.inactiveBranchCount,
          response.data.activeBranchCount,
        ];
        $scope.colors = ["#F7464A", "#46BFBD"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

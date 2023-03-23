mySchoolApp.controller(
  "BranchStartsActiveInactiveController",
  function ($scope, $http) {
    var token = localStorage.getItem("token");

    $http({
      method: "GET",
      url: "http://localhost:5000/api/school/activeInactivebranches",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
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

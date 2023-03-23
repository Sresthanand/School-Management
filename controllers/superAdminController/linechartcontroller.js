mySchoolApp.controller("lineChart", function ($scope, $http) {
  var token = localStorage.getItem("token");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/superadmin/activeInactiveSchools",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
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

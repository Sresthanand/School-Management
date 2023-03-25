mySchoolApp.controller("topperChartController", function ($scope, $http) {
  var token = localStorage.getItem("token");

  console.log("Hi i am topper chart controller!");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/coordinator/topmarkscored",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      $scope.responsedata = response.data.data;

      const names = $scope.responsedata.map((student) => student.name);
      const percentages = $scope.responsedata.map(
        (student) => student.percentage
      );

      $scope.labels = names;
      $scope.data = percentages;
    })
    .catch(function (err) {
      console.log(err);
    });
});

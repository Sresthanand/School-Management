mySchoolApp.controller("chartController", function ($scope, $http) {
  var token = localStorage.getItem("token");

  $http({
    method: "GET",
    url: "http://localhost:5000/api/superadmin/schoolRegistrationsOverPeriodOfTime",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      $scope.labels = response.data.dates;
      $scope.data = [response.data.counts];
      $scope.series = ["School Registrations"];

      $scope.colors = ["#F7464A", "#46BFBD"];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };

      $scope.datasetOverride = [
        { yAxisID: "y-axis-1" },
        { yAxisID: "y-axis-2" },
      ];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: "y-axis-1",
              type: "linear",
              display: true,
              position: "left",
            },
            {
              id: "y-axis-2",
              type: "linear",
              display: true,
              position: "right",
            },
          ],
        },
      };
    })
    .catch(function (err) {
      console.log(err);
    });
});

mySchoolApp.controller(
  "studentsRegistrationStats",
  function ($scope, $http, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am studentsRegistrationStats controller!");

    studentStatsService
      .getStudentsRegistrationsOverPeriodOfTime(token)
      .then(function (response) {
        console.log(response);
        $scope.labels = response.data.dates;
        $scope.data = [response.data.counts];

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
  }
);

mySchoolApp.controller(
  "marksComparisonController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,
    studentDashboardStatsServices
  ) {
    console.log("Hi i am marksComparisonController Stats controller!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    // Get student exams

    studentDashboardStatsServices
      .getStudenRank(token)
      .then(function (response) {
        console.log("Hi i am from marks comparison controller");

        const percentArray = response.data.percentages
          .map((p) => p.percentage)
          .reverse();
        const rankArray = response.data.percentages
          .map((p, index) => index + 1)
          .reverse();

        $scope.data = percentArray.map((p, index) => {
          return {
            x: p,
            y: rankArray[index],
            r: 10 + index * 1,
          };
        });

        $scope.options = {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 5,
                  stepSize: 1,
                  callback: function (value, index, values) {
                    return "Rank " + value;
                  },
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  min: 0,
                  max: 110,
                  stepSize: 10,
                  callback: function (value, index, values) {
                    return value + "%";
                  },
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var label = dataset.label || "";
                var value = dataset.data[tooltipItem.index];
                return (
                  label + " Percentage: " + value.x + "%, Rank: " + value.y
                );
              },
            },
          },
        };
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

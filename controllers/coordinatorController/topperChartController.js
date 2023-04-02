mySchoolApp.controller(
  "topperChartController",
  function ($scope, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am topper chart controller!");

    studentStatsService
      .getTopMarkScored(token)
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
  }
);

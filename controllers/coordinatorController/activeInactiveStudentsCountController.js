mySchoolApp.controller(
  "activeInactiveStudentsCountController",
  function ($scope, $http, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am studnetsActiveInactiveCount controller!");

    studentStatsService
      .getActiveInactiveStudentsCount(token)
      .then(function (response) {
        console.log(response);
        $scope.labels = ["Actice Students", "Inactive Students"];
        $scope.data = [
          response.data.activeStudentsCount,
          response.data.inActiveStudentsCount,
        ];
        $scope.colors = ["#000080", "#9370DB"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

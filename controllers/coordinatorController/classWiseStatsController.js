mySchoolApp.controller(
  "classWiseStatsController",
  function ($scope, studentStatsService) {
    var token = localStorage.getItem("token");

    console.log("Hi i am class wise chart controller!");

    studentStatsService
      .getClassWiseCount(token)
      .then(function (response) {
        console.log(response.data.countOfStudents);
        $scope.labels = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ];
        $scope.data = [response.data.countOfStudents];
        $scope.colors = ["#9370DB"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

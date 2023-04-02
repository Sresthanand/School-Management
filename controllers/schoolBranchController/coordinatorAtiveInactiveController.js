mySchoolApp.controller(
  "coordinatorAtiveInactiveController",
  function ($scope, $state, jwtHelper, $http, $rootScope, coordinatorStats) {
    var token = localStorage.getItem("token");

    console.log("Hi i am from coordinator active inactive controller");

    coordinatorStats
      .getCoordinatorActiveInactiveCount(token)
      .then(function (response) {
        console.log(response);

        $scope.labels = ["Active Coordinators", "Inactive Coordinators"];
        $scope.data = [
          response.data.activeCoordinatorCount,
          response.data.inactiveCoordinatorCount,
        ];
        $scope.colors = ["#000080", "#9370DB"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

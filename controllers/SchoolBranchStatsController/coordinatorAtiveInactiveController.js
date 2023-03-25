mySchoolApp.controller(
  "coordinatorAtiveInactiveController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");

    console.log("Hi i am from school branch stats controllerr");

    $http({
      method: "GET",
      url: "http://localhost:5000/api/branch/coordinatorInactiveActiveCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);

        $scope.labels = ["Actice Coordinators", "Inactive Coordinators"];
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

mySchoolApp.controller(
  "StudentMarksController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am StudentMarksController!");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    // call the API to get student marks
    $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/getMarksCoordinator",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.marksList = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });
    
  }
);

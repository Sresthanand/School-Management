mySchoolApp.controller(
  "myCoordinatorController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am from my coordinator controllerr");
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

    //get api for coordinators

    $http({
      method: "GET",
      url: "http://localhost:5000/getCoordinators",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.coordinators = response.data.coordinators;
      })
      .catch(function (err) {
        console.log(err);
      });

    //reset filters
    $scope.resetFilters = function () {
      $scope.searchQuery = "";
    };

    
  }
);

// const authenticateRequest = passport.authenticate("jwt", { session: false });

mySchoolApp.controller(
  "BranchesController",
  function ($scope, $state, jwtHelper,$rootScope, $http) {
   
    console.log("Hi i am From BranCH coNTROLLER");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });


    var token = localStorage.getItem("token");
    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };
  }
);

//   const authenticateRequest = passport.authenticate("jwt", { session: false });

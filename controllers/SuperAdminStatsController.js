// Controller code
mySchoolApp.controller(
  "SuperAdminStatsController",
  function ($scope, $rootScope, jwtHelper, $http) {
    console.log("Hi  i am schooool edit controller");
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


    //API Logic 
    
  }
);

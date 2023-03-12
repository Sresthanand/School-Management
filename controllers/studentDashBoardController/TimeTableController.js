mySchoolApp.controller(
    "TimeTableController",
    function ($scope, $state, jwtHelper, $http, $rootScope) {
      var token = localStorage.getItem("token");
      console.log("Hi i am Time Table controller!!!!!!!!!!!!!!");
  
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

      
  
      
    }
  );
  
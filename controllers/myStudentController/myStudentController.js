mySchoolApp.controller(
  "myStudentController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am from my students controllerr");
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

    $http({
      method: "GET",
      url: "http://localhost:5000/getStudents",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Hi!!!!!!!!!!");
        console.log(response);
        $scope.coordinator = response.data.coordinator;
        $scope.students = response.data.students;
      })
      .catch(function (err) {
        console.log(err);
      });

      $scope.resetFilters = function() {
        $scope.searchQuery = '';
        $scope.selectedClass = '';
        $scope.selectedGender = '';
      }
  }
);

// const authenticateRequest = passport.authenticate("jwt", { session: false });

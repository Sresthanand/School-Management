mySchoolApp.controller(
  "myStudentController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    $scope.selectedClass = "";
    $scope.selectedGender = "";

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

    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedClass = "";
      $scope.selectedGender = "";
    };

    $scope.genderFilter = function (student) {
      return (
        $scope.selectedGender === "" || student.gender === $scope.selectedGender
      );
    };

    //GET Request for getting students

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

    //POST Request for saving marks



    
  }
);

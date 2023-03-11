// Define a controller for schools
mySchoolApp.controller(
  "myschoolsController",
  function ($scope, $rootScope, jwtHelper, MyschoolService) {
    console.log("Hi, I am schools controller.");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    $scope.selectedSchool = null;

    var token = localStorage.getItem("token");

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    // Call API to get all schools
    MyschoolService
      .getAllSchools(token)
      .then(function (response) {
        console.log("Hi!!!!!!!!!!");
        console.log(response);
        $scope.schools = response.data.schools;
      })
      .catch(function (err) {
        console.log(err);
      });

    // Open Edit Modal and set the selected school
    $scope.openEditModal = function (school) {
      console.log(school);
      $rootScope.selectedSchool = school;
      console.log($rootScope.selectedSchool);
    };

    // Call API to update school name
    $scope.updateSchoolName = function (updatedSchoolName) {
      console.log("Hiii i am from updateSchoolname");
      console.log($rootScope.selectedSchool);
      MyschoolService
        .updateSchoolName(
          token,
          $rootScope.selectedSchool._id,
          updatedSchoolName
        )
        .then(function (response) {
          for (var i = 0; i < $scope.schools.length; i++) {
            if ($scope.schools[i]._id === $rootScope.selectedSchool._id) {
              $scope.schools[i].name = updatedSchoolName;
              break;
            }
          }
          console.log(response);
          alert("You successfully updated the school.");
        })
        .catch(function (error) {
          console.log(error);
          alert("There was an error updating the school.");
        });

      $("#editModal").modal("hide");
    };

    // Call API to Delete all schools
  }
);

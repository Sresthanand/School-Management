mySchoolApp.controller(
  "superAdminDashboardController",
  function ($scope, $state, AuthService, SchoolService, RouteChangeService) {
    console.log("Hi i am superadmindashboard controller!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.registerSchool = function () {
      SchoolService.registerSchool(
        token,
        $scope.username,
        $scope.password,
        $scope.schoolName
      ).then(
        function (response) {
          console.log(response);
          alert("School created successfully");
        },
        function (error) {
          console.log(error);
          alert("Something went wrong");
        }
      );
    };
  }
);

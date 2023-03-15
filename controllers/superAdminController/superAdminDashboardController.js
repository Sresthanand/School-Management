//Image Upload Directive
mySchoolApp.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);

mySchoolApp.controller(
  "superAdminDashboardController",
  function (
    $scope,
    $state,
    AuthService,
    SchoolService,
    SchoolImageUploadService,
    RouteChangeService,
    $http,
  ) {
    console.log("Hi i am superadmindashboard controller!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    // SchoolImageUploadService.uploadImage($scope.file , $http)

    // $scope.registerSchool = function () {
    //   console.log("Hi i am registerSchool starting")
    //   console.log($scope.file);
    //   console.log("Hi i am registerSchool")

    //   SchoolService.registerSchool(
    //     token,
    //     $scope.username,
    //     $scope.password,
    //     $scope.schoolName,
    //     $scope.file
    //   ).then(
    //     function (response) {
    //       console.log(response);
    //       alert("School created successfully");
    //     },
    //     function (error) {
    //       console.log(error);
    //       alert("Something went wrong");
    //     }
    //   );
    // };

    $scope.registerSchool = function () {

      console.log("Hi i am registerSchool starting");
      console.log($scope.file);
      console.log("Hi i am registerSchool");

      SchoolImageUploadService.uploadImage(token,$scope.file, $http)
        .then(function (uploadResponse) {
          console.log("hello i am after school image upload service is completed!");
          console.log(uploadResponse);
          SchoolService.registerSchool(
            token,
            $scope.username,
            $scope.password,
            $scope.schoolName,
            uploadResponse.data.Location,
          )
            .then(function (registerResponse) {
              console.log("hello i am after school service is completed!");
              console.log(registerResponse);
              alert("School created successfully");
            })
            .catch(function (registerError) {
              console.log(registerError);
              alert("Something went wrong with school registration");
            });
        })
        .catch(function (uploadError) {
          console.log(uploadError);
          alert("Something went wrong with image upload");
        });
    };
  }
);

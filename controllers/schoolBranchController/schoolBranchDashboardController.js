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
  "schoolBranchDashboardController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,

    AuthService,
    RouteChangeService,

    CoordinatorImageUploadService,
    CoordinatorService,

    $timeout
  ) {
    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.loading = false;

    $scope.showToast = true;
    $scope.toastMessage = "Hello! Welcome to Branch Dashboard!";
    $scope.toastColor = "green";
    $timeout(function () {
      $scope.showToast = false;
    }, 2000);

    $scope.coordinatorRegister = function () {
      $scope.loading = true;

      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;

      CoordinatorImageUploadService.uploadImage(token, $scope.file, $http)
        .then(function (uploadResponse) {
          console.log("Image uploaded successfully");
          console.log(uploadResponse);

          CoordinatorService.registerCoordinator(
            token,
            name,
            username,
            password,
            uploadResponse.data.Location
          )
            .then(function (response) {
              console.log("User created successfully:", response.data.user);
              console.log(
                "Coordinator created successfully:",
                response.data.coordinator
              );
              $scope.loading = false;
              //alert("Coordinator Created Successfully");
              $scope.showToast = true;
              $scope.toastMessage = "Coordinator Created Successfully";
              $scope.toastColor = "green";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            })
            .catch(function (error) {
              console.error("Error in registration:", error.data);
              //alert("Something Went Wrong!");
              $scope.showToast = true;
              $scope.toastMessage =
                "Something went wrong with Coordinator registration";
              $scope.toastColor = "red";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            });
        })
        .catch(function (uploadError) {
          console.error("Error in image upload:", uploadError.data);
          //alert("Something went wrong with image upload");

          $scope.showToast = true;
          $scope.toastMessage = "Something went wrong with Image upload";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
  }
);

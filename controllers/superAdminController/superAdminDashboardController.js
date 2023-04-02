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
    $http,
    $timeout,

    AuthService,
    RouteChangeService,

    SchoolService,
    SchoolImageUploadService
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

    $scope.loading = false;

    $scope.showToast = true;
    $scope.toastMessage = "Hello! Welcome to Super Admin Dashboard!";
    $scope.toastColor = "green";
    $timeout(function () {
      $scope.showToast = false;
    }, 2000);

    $scope.registerSchool = function () {
      $scope.loading = true;
      SchoolImageUploadService.uploadImage(token, $scope.file, $http)
        .then(function (uploadResponse) {
          SchoolService.registerSchool(
            token,
            $scope.username,
            $scope.password,
            $scope.schoolName,
            uploadResponse.data.Location
          )
            .then(function (registerResponse) {
              $scope.loading = false;

              $scope.showToast = true;
              $scope.toastMessage = "School created successfully";
              $scope.toastColor = "green";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            })
            .catch(function (registerError) {
              console.log(registerError);
              $scope.loading = false;

              $scope.showToast = true;
              $scope.toastMessage =
                "Something went wrong with school registration";
              $scope.toastColor = "red";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            });
        })
        .catch(function (uploadError) {
          console.log(uploadError);
          $scope.loading = false;

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

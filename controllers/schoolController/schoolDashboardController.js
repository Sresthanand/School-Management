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
  "schoolDashboardController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,

    RouteChangeService,
    AuthService,

    BranchImageUploadService,
    BranchService,
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

    $scope.showToast = true;
    $scope.toastMessage = "Hello! Welcome to School Dashboard!";
    $scope.toastColor = "green";
    $timeout(function () {
      $scope.showToast = false;
    }, 2000);

    //first call the api for image upload then take its response and pass here in image
    $scope.loading = false;
    $scope.branchRegister = function () {
      $scope.loading = true;

      const location = $scope.location;
      const username = $scope.username;
      const password = $scope.password;

      BranchImageUploadService.uploadImage(token, $scope.file, $http)
        .then(function (uploadResponse) {
          BranchService.registerBranch(
            token,
            username,
            password,
            location,
            uploadResponse.data.Location
          )
            .then(function (registerResponse) {
              $scope.loading = false;
              //alert("Branch Created Successfully");
              $scope.showToast = true;
              $scope.toastMessage = "Branch created successfully";
              $scope.toastColor = "green";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            })
            .catch(function (registerError) {
              console.error(
                "Error in branch registration:",
                registerError.data
              );
              // alert("Something went wrong with branch registration");

              $scope.showToast = true;
              $scope.toastMessage =
                "Something went wrong with Branch registration";
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

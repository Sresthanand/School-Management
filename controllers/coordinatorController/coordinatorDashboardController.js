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
  "coordinatorDashboardController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    $timeout,

    AuthService,
    RouteChangeService,

    StudentImageUploadService,
    studentService
  ) {
    console.log("Hi i am coordinator controller!");

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
    $scope.toastMessage = "Hello! Welcome to Coordinator Dashboard!";
    $scope.toastColor = "green";
    $timeout(function () {
      $scope.showToast = false;
    }, 2000);

    $scope.studentRegister = function () {
      $scope.loading = true;

      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;
      const classofstudent = $scope.class;
      const gender = $scope.gender;
      const enrollmentNumber = $scope.enrollmentNumber;

      StudentImageUploadService.uploadImage(token, $scope.file, $http)
        .then(function (uploadResponse) {
          console.log("Image uploaded successfully");
          console.log(uploadResponse);

          studentService
            .registerStudent(
              token,
              username,
              password,
              name,
              classofstudent,
              gender,
              enrollmentNumber,
              uploadResponse.data.Location
            )
            .then(function (registerResponse) {
              console.log("Student created successfully");
              console.log(registerResponse);
              $scope.loading = false;
              //alert("Student Created Successfully");
              $scope.showToast = true;
              $scope.toastMessage = "Student Created Successfully";
              $scope.toastColor = "green";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            })
            .catch(function (registerError) {
              console.error("Error in registration:", registerError.data);
              //alert("Something Went Wrong!");
              $scope.showToast = true;
              $scope.toastMessage = "Something went wrong";
              $scope.toastColor = "red";
              $timeout(function () {
                $scope.showToast = false;
              }, 3000);
            });
        })
        .catch(function (uploadError) {
          console.error("Error in image upload:", uploadError.data);
          // alert("Something went wrong with image upload");
          $scope.showToast = true;
          $scope.toastMessage = "Something went wrong with image Upload";
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

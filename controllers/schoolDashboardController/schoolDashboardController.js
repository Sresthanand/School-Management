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
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");

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

    //first call the api for image upload then take its response and pass here in image
    $scope.branchRegister = function () {
      // Get the branch location, username, and password from the scope
      const location = $scope.location;
      const username = $scope.username;
      const password = $scope.password;

      // Use FormData to construct the request body for image upload
      const fd = new FormData();
      fd.append("file", $scope.file);

      // Call the image upload API
      $http({
        method: "POST",
        url: "http://localhost:5000/uploadImage",
        data: fd,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": undefined,
        },
      })
        .then(function (uploadResponse) {
          console.log("Image uploaded successfully");
          console.log(uploadResponse);

    
          const requestData = {
            branch: {
              location,
              image: uploadResponse.data.Location,
            },
            username,
            password,
          };

          // Call the branch registration API
          $http({
            method: "POST",
            url: "http://localhost:5000/branchRegister",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: requestData,
          })
            .then(function (registerResponse) {
              console.log("Branch registered successfully");
              console.log(registerResponse);
              alert("Branch Created Successfully");
            })
            .catch(function (registerError) {
              console.error(
                "Error in branch registration:",
                registerError.data
              );
              alert("Something went wrong with branch registration");
            });
        })
        .catch(function (uploadError) {
          console.error("Error in image upload:", uploadError.data);
          alert("Something went wrong with image upload");
        });
    };
  }
);

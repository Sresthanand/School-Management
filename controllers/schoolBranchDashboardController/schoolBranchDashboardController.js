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
  
    $scope.loading = false;

    $scope.coordinatorRegister = function () {

      $scope.loading = true;
      
      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;

      const fd = new FormData();
      fd.append("file", $scope.file);

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
            name: {
              name,
              image: uploadResponse.data.Location,
            },
            username,
            password,
          };

          $http({
            method: "POST",
            url: "http://localhost:5000/coordinatorRegister",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: requestData,
          })
            .then(function (response) {
              console.log("User created successfully:", response.data.user);
              console.log(
                "Coordinator created successfully:",
                response.data.coordinator
              );
              $scope.loading = false;
              alert("Coordinator Created Successfully");
            })
            .catch(function (error) {
              console.error("Error in registration:", error.data);
              alert("Something Went Wrong!");
            });
        })
        .catch(function (uploadError) {
          console.error("Error in image upload:", uploadError.data);
          alert("Something went wrong with image upload");
        }) .finally(function () {
          $scope.loading = false;
        });
    };
  }
);

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
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am coordinator controller!");

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

    $scope.studentRegister = function () {
      $scope.loading = true;

      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;
      const classofstudent = $scope.class;
      const gender = $scope.gender;
      const enrollmentNumber = $scope.enrollmentNumber;

      // Use FormData to construct the request body for image upload
      const fd = new FormData();
      fd.append("file", $scope.file);

      // Call the image upload API
      $http({
        method: "POST",
        url: "http://localhost:5000/api/upload/uploadImage",
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
            information: {
              name,
              classofstudent,
              gender,
              enrollmentNumber,
              image: uploadResponse.data.Location,
            },
            username,
            password,
          };

          $http({
            method: "POST",
            url: "http://localhost:5000/api/coordinator/studentRegister",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: requestData,
          })
            .then((response) => {
              console.log("User created successfully:", response.data.user);
              console.log(
                "student created successfully:",
                response.data.information
              );
              $scope.loading = false;
              alert("Student Created Successfully");
            })
            .catch((error) => {
              console.error("Error in registration:", error.data);
              alert("Something Went Wrong!");
            });
        })
        .catch(function (uploadError) {
          console.error("Error in image upload:", uploadError.data);
          alert("Something went wrong with image upload");
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
  }
);

// $scope.studentRegister = function () {
//   console.log("hi i am student !!!!!!!!!!!!!!!");
//   const name = $scope.name;
//   const username = $scope.username;
//   const password = $scope.password;
//   const classofstudent = $scope.class;
//   const gender = $scope.gender;
//   const enrollmentNumber = $scope.enrollmentNumber;

//   console.log("Hey yyyyyyyyyysadfihoasfhlao");
//   console.log(
//     name + username + password + classofstudent + gender + enrollmentNumber
//   );

//   console.log("Name " + name);
//   console.log("username " + username);
//   console.log("password " + password);
//   console.log("classofstudent " + classofstudent);
//   console.log("gender " + gender);
//   console.log("enrollmentNumber " + enrollmentNumber);

//   const requestData = {
//     information: {
//       name,
//       classofstudent,
//       gender,
//       enrollmentNumber,
//     },
//     username,
//     password,
//   };

//   $http({
//     method: "POST",
//     url: "http://localhost:5000/studentRegister",
//     headers: {
//       Authorization: "Bearer " + token,
//       "Content-Type": "application/json",
//     },
//     data: requestData,
//   })
//     .then((response) => {
//       console.log("User created successfully:", response.data.user);
//       console.log(
//         "student created successfully:",
//         response.data.information
//       );
//       alert("student Created Succesfully");
//     })
//     .catch((error) => {
//       console.error("Error in registration:", error.data);
//       alert("Something Went Wrong!");
//     });
// };

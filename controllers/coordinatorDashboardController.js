
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

    $scope.studentRegister = function () {
      console.log("hi i am student !!!!!!!!!!!!!!!");
      const name = $scope.name;
      const username = $scope.username;
      const password = $scope.password;
      const classofstudent = $scope.class;
      const gender = $scope.gender;
      const enrollmentNumber = $scope.enrollmentNumber;

      console.log("Hey yyyyyyyyyysadfihoasfhlao");
      console.log(
        name + username + password + classofstudent + gender + enrollmentNumber
      );

      console.log("Name " + name);
      console.log("username " + username);
      console.log("password " + password);
      console.log("classofstudent " + classofstudent);
      console.log("gender " + gender);
      console.log("enrollmentNumber " + enrollmentNumber);

      const requestData = {
        information: {
          name,
          classofstudent,
          gender,
          enrollmentNumber,
        },
        username,
        password,
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/studentRegister",
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
          alert("student Created Succesfully");
        })
        .catch((error) => {
          console.error("Error in registration:", error.data);
          alert("Something Went Wrong!");
        });
    };
  }
);

// const authenticateRequest = passport.authenticate("jwt", { session: false });

// mySchoolApp.controller(
//     "coordinatorController",
//     function ($scope, $state, $http) {
//       var token = localStorage.getItem("token");

//       if (!token) {
//         $state.go("login");
//       }

//       $scope.logout = function () {
//         localStorage.removeItem("token");
//         $state.go("login");
//       };

//       $http({
//         method: "GET",
//         url: "http://localhost:5000/coordinator",
//         headers: {
//           Authorization: "Bearer " + token,
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => {
//           console.log("Coordinator data:", response.data);
//           $scope.coordinators = response.data;
//         })
//         .catch((error) => {
//           console.error("Error in getting coordinator data:", error.data);
//           alert("Something Went Wrong!");
//         });
//     }
//   )

//   const authenticateRequest = passport.authenticate("jwt", { session: false });

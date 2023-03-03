var mySchoolApp = angular.module("mySchoolApp", ["ui.router", "angular-jwt"]);

mySchoolApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: "views/login.html",
    controller: "loginController",
  });

  $stateProvider.state("SuperAdminDashBoard", {
    url: "/superAdminDashboard",
    templateUrl: "views/SuperAdminDashboard.html",
    controller: "superAdminDashboardController",
    authenticate: true,
  });

  $stateProvider.state("SchoolDashboard", {
    url: "/schoolDashboard",
    templateUrl: "views/SchoolDashboard.html",
    controller: "schoolDashboardController",
  });

  $stateProvider.state("SchoolBranchDashboard", {
    url: "/schoolBranchDashboard",
    templateUrl: "views/SchoolBranchDashboard.html",
    controller: "schoolBranchDashboardController",
  });

  $stateProvider.state("Coordinator", {
    url: "/coordinatorDashboard",
    templateUrl: "views/Coordinator.html",
    controller: "coordinatorDashboardController",
  });

  $stateProvider.state("StudentDashBoard", {
    url: "/studentDashboard",
    templateUrl: "views/StudentDashboard.html",
    controller: "studentDashboardController",
  });

  $urlRouterProvider.otherwise("/login");
});


// mySchoolApp.controller(
//   "loginController",
//   function ($scope, $http, $state, jwtHelper) {
//     $scope.login = function () {
//       $http
//         .post("http://localhost:5000/login", {
//           username: $scope.username,
//           password: $scope.password,
//         })
//         .then(function (response) {
//           var token = response.data.token;

//           console.log($scope.username);
//           console.log($scope.password);

//           var decodedToken = jwtHelper.decodeToken(token);

//           localStorage.setItem("token", token);
//           console.log(decodedToken.role);

//           switch (decodedToken.role) {
//             case "super-admin":
//               $state.go("SuperAdminDashBoard");
//               break;
//             case "school":
//               $state.go("SchoolDashboard");
//               break;
//             case "branch":
//               $state.go("SchoolBranchDashboard");
//               break;
//             case "coordinator":
//               $state.go("Coordinator");
//               break;
//             case "student":
//               $state.go("StudentDashBoard");
//               break;
//             default:
//               alert("Invalid user role");
//           }
//         })
//         .catch(function (error) {
//           if (error.status === 401) {
//             alert("Invalid username or password");
//           } else {
//             alert("An error occurred: " + error.statusText);
//           }
//         });
//     };
//   }
// );


// mySchoolApp.controller(
//   "superAdminDashboardController",
//   function ($scope, $state, jwtHelper) {
//     var token = localStorage.getItem("token");

//     if (!token || jwtHelper.isTokenExpired(token)) {
//       $state.go("login");
//     }

//     $scope.logout = function () {
//       localStorage.removeItem("token");
//       $state.go("login");
//     };
//   }
// );

// // ui-sref/=user.backlog

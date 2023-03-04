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
    // authenticate: true,
  });

  $stateProvider.state("SchoolDashboard", {
    url: "/schoolDashboard",
    templateUrl: "views/SchoolDashboard.html",
    controller: "schoolDashboardController",
    // authenticate: true,
  });

  $stateProvider.state("SchoolBranchDashboard", {
    url: "/schoolBranchDashboard",
    templateUrl: "views/SchoolBranchDashboard.html",
    controller: "schoolBranchDashboardController",
    // authenticate: true,
  });

  $stateProvider.state("Coordinator", {
    url: "/coordinatorDashboard",
    templateUrl: "views/Coordinator.html",
    controller: "coordinatorDashboardController",
    // authenticate: true,
  });

  $stateProvider.state("StudentDashBoard", {
    url: "/studentDashboard",
    templateUrl: "views/StudentDashboard.html",
    controller: "studentDashboardController",
    // authenticate: true,
  });

  $urlRouterProvider.otherwise("/login");
});

// // ui-sref/=user.backlog

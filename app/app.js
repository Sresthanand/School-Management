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
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "super-admin") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  // Define the nested state
  $stateProvider.state("SuperAdminDashBoard.myschools", {
    url: "/myschools",
    templateUrl: "views/myschools.html",
    controller: "myschoolsController",
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "super-admin") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  $stateProvider.state("SchoolDashboard", {
    url: "/schoolDashboard",
    templateUrl: "views/SchoolDashboard.html",
    controller: "schoolDashboardController",
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "school") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  $stateProvider.state("SchoolBranchDashboard", {
    url: "/schoolBranchDashboard",
    templateUrl: "views/SchoolBranchDashboard.html",
    controller: "schoolBranchDashboardController",
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "branch") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  $stateProvider.state("Coordinator", {
    url: "/coordinatorDashboard",
    templateUrl: "views/Coordinator.html",
    controller: "coordinatorDashboardController",
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "coordinator") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  $stateProvider.state("StudentDashBoard", {
    url: "/studentDashboard",
    templateUrl: "views/StudentDashboard.html",
    controller: "studentDashboardController",
    resolve: {
      auth: function ($q, $state, jwtHelper) {
        var token = localStorage.getItem("token");
        if (token) {
          var payload = jwtHelper.decodeToken(token);
          if (payload.role === "student") {
            return $q.when();
          }
        }
        return $q.reject("Not Authorized");
      },
    },
  });

  $urlRouterProvider.otherwise("/login");
});

mySchoolApp.run(function ($rootScope, $state) {
  $rootScope.$state = $state;
});

mySchoolApp.controller("myschoolsController", function ($scope, $rootScope) {
  console.log("Hi  i am schooooooooolss controller");
  $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $rootScope.currentRoute = newValue;
    }
  });
  // rest of your controller code
});

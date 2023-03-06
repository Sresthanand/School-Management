var mySchoolApp = angular.module("mySchoolApp", ["ui.router", "angular-jwt"]);

mySchoolApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: "views/login.html",
    controller: "loginController",
  });
 
  //superadmin
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

  // Define the nested state 1 for superadmin
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

  // Define the nested state 2 for superadmin
  $stateProvider.state("SuperAdminDashBoard.stats", {
    url: "/stats",
    templateUrl: "views/SuperAdminStats.html",
    controller: "SuperAdminStatsController",
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

  //school 
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


  // Define the nested state 1 for schools
  $stateProvider.state("SchoolDashboard.branches", {
    url: "/mybranches",
    templateUrl: "views/mybranches.html",
    controller: "BranchesController",
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
  
  //branch
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

  $stateProvider.state("SchoolBranchDashboard.coordinators", {
    url: "/mycoordinators",
    templateUrl: "views/mycoordinators.html",
    controller: "myCoordinatorController",
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

var mySchoolApp = angular.module("mySchoolApp", ["ui.router", "angular-jwt"]);

mySchoolApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("login", {
    //done //done
    url: "/login",
    templateUrl: "views/login/loginPage.html",
    controller: "loginController",
  });

  //superadmin
  $stateProvider.state("SuperAdminDashBoard", {
    //done //done
    url: "/superAdminDashboard",
    templateUrl: "views/superAdmin/SuperAdminDashboard.html",
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
    //done //done
    url: "/myschools",
    templateUrl: "views/superAdmin/myschools.html",
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
    //done //done
    url: "/stats",
    templateUrl: "views/superAdmin/SuperAdminStats.html",
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
    //done //factories and servicecs later*
    url: "/schoolDashboard",
    templateUrl: "views/school/SchoolDashboard.html",
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
    //done //factories and servicecs later*
    url: "/mybranches",
    templateUrl: "views/school/mybranches.html",
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
    //done //factories and servicecs later*
    url: "/schoolBranchDashboard",
    templateUrl: "views/branch/SchoolBranchDashboard.html",
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

  // Define the nested state 1 for bracnhes
  $stateProvider.state("SchoolBranchDashboard.coordinators", {
    //done //factories and servicecs later*
    url: "/mycoordinators",
    templateUrl: "views/branch/mycoordinators.html",
    controller: "myCoordinatorController",
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
    //done //factories and servicecs later*
    url: "/coordinatorDashboard",
    templateUrl: "views/coordinators/Coordinator.html",
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

  // Define the nested state 1 for coordinators
  $stateProvider.state("Coordinator.students", {
    //done //factories and servicecs later*
    url: "/mystudents",
    templateUrl: "views/coordinators/mystudents.html",
    controller: "myStudentController",
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

  $stateProvider.state("Coordinator.examschedule", {
    //done //factories and servicecs later*
    url: "/examschedule",
    templateUrl: "views/coordinators/examschedule.html",
    controller: "examscheduleController",
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
    //done
    url: "/studentDashboard",
    templateUrl: "views/students/StudentDashboard.html",
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

  $stateProvider.state("StudentDashBoard.Timetable", {
    //done //factories and servicecs later*
    url: "/timetable",
    templateUrl: "views/students/TimeTable.html",
    controller: "TimeTableController",
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

  $stateProvider.state("StudentDashBoard.exam", {
    //done //factories and servicecs later*
    url: "/exam",
    templateUrl: "views/students/Exam.html",
    controller: "ExamController",
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

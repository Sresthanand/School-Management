var mySchoolApp = angular.module("mySchoolApp", [
  "ui.router",
  "angular-jwt",
  "ng-file-model",
  "chart.js",
]);

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
        //  window.location = "/#!/login"
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
        //$state.go("login")
        //// $urlRouterProvider.otherwise("/login");
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

  // Define the nested state 2 for schools
  $stateProvider.state("SchoolDashboard.stats", {
    //done //factories and servicecs later*
    url: "/stats",
    templateUrl: "views/school/schoolDashboardStats.html",
    controller: "schoolDashboardStatsController",
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

  // Define the nested state 2 for bracnhes
  $stateProvider.state("SchoolBranchDashboard.stats", {
    //done //factories and servicecs later*
    url: "/stats",
    templateUrl: "views/branch/SchoolBranchStats.html",
    controller: "SchoolBranchStatsController",
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

  // Define the nested state 2 for coordinators
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

  // Define the nested state 3 for coordinators
  $stateProvider.state("Coordinator.sendNotifications", {
    //done //factories and servicecs later*
    url: "/notification",
    templateUrl: "views/coordinators/Notifications.html",
    controller: "NotificationController",
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

  // Define the nested state 4 for coordinators
  $stateProvider.state("Coordinator.studentMarks", {
    //done //factories and servicecs later*
    url: "/studentMarks",
    templateUrl: "views/coordinators/StudentMarks.html",
    controller: "StudentMarksController",
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

  // Define the nested state 4 for coordinators
  $stateProvider.state("Coordinator.studentAttendance", {
    //done //factories and servicecs later*
    url: "/studentAttendance",
    templateUrl: "views/coordinators/StudentAttendance.html",
    controller: "AttendanceController",
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

  // Define the nested state 4 for coordinators
  $stateProvider.state("Coordinator.analytics", {
    //done //factories and servicecs later*
    url: "/stats",
    templateUrl: "views/coordinators/CoordinatorStats.html",
    controller: "CoordinatorStatsController",
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

  $stateProvider.state("StudentDashBoard.Analytics", {
    //done //factories and servicecs later*
    url: "/stats",
    templateUrl: "views/students/analytics.html",
    controller: "StudentDashboardStatsController",
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

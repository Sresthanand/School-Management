mySchoolApp.service("studentStatsService", function ($http) {
  var baseUrl = "http://localhost:5000/";
  // Get total students
  this.getTotalStudents = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/totalStudents",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get top mark scored
  this.getTopMarkScored = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/topmarkscored",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
  //gender
  this.getGenderCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/genderCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get class-wise count
  this.getClassWiseCount = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/classWiseCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get count of active and inactive students
  this.getActiveInactiveStudentsCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/studnetsActiveInactiveCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get student registration counts over a period of time
  this.getStudentsRegistrationsOverPeriodOfTime = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/studentsRegistrationsOverPeriodOfTime",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get attendance count
  this.getAttendanceCount = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/attendanceCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

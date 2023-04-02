mySchoolApp.service("studentDashboardStatsServices", function ($http) {
  var baseUrl = "http://localhost:5000/";

  // Get student Maximum Marks, Minimum Marks, Percentage, Percentile
  this.getStudentMarksStats = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentStats",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStudentPercentage = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentPercentage",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStudenRank = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentRank",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStudentSubjectWiseMarks = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentSubjectGrades",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

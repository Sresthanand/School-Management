mySchoolApp.service("studentDashboardService", function ($http) {
  var baseUrl = "http://localhost:5000/";

  // Get student data
  this.getStudentData = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentData",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get messages
  this.getStudentMessages = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentMessages",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStudentMarks = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentMarks",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Mark attendance
  this.markAttendance = function (token, studentId) {
    return $http({
      method: "PUT",
      url: baseUrl + "api/student/markAttendance/" + studentId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get student exams
  this.getStudentExams = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/student/getStudentExams",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  //download ReportCard
  this.reportCardGeneration = function (token,studentId) {
    return $http({
      method: "POST",
      url: baseUrl + "api/student/generateReportCard",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { studentId: studentId },
    });
  };
});

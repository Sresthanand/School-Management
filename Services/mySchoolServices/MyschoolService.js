// Define a service to handle API requests for schools
mySchoolApp.service("MyschoolService", function ($http) {
  var baseUrl = "http://localhost:5000/";

  // Get all schools
  this.getAllSchools = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/getAllSchools",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Update school name
  this.updateSchoolName = function (token, schoolId, updatedSchoolName) {
    return $http({
      method: "PUT",
      url: baseUrl + "updateSchool/" + schoolId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        name: updatedSchoolName,
      },
    });
  };

  //delete school
  this.deleteSchool = function (token, schoolId) {
    return $http({
      method: "PUT",
      url: "http://localhost:5000/api/superadmin/deleteSchool/" + schoolId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

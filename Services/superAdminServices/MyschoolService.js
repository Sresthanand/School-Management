// Define a service to handle API requests for schools
mySchoolApp.service("MyschoolService", function ($http) {
  var baseUrl = "http://localhost:5000/";

  // Get all schools
  this.getAllSchools = function (token, page, searchQuery) {
    return $http({
      method: "GET",
      url: `http://localhost:5000/api/superadmin/getAllSchools?page=${page}&limit=6&search=${searchQuery}`,
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
      url: "http://localhost:5000/api/superadmin/updateSchool/" + schoolId,
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

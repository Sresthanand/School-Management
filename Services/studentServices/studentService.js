mySchoolApp.service("studentService", function ($http) {
    var baseUrl = "http://localhost:5000/";
  // Delete branch
  this.deleteStudent = function (token,studentId) {
    console.log("Hi i am from student services" + studentId);
    return $http({
      method: "PUT",
      url: baseUrl + "deleteStudent/" + studentId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});


  

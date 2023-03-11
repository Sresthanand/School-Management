mySchoolApp.service("SchoolService", function ($http) {
    var self = this;
  
    self.registerSchool = function (token, username, password, schoolName) {
      var data = {
        username: username,
        password: password,
        school: {
          name: schoolName,
        },
      };
  
      return $http({
        method: "POST",
        url: "http://localhost:5000/schoolRegister",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      });
    };
  });
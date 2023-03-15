mySchoolApp.service("SchoolService", function ($http) {
  var self = this;

  self.registerSchool = function (
    token,
    username,
    password,
    schoolName,
    imageUrl
  ) {
    var data = {
      username: username,
      password: password,
      school: {
        name: schoolName,
        image: imageUrl,
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

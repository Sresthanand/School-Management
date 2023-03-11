mySchoolApp.controller(
  "examscheduleController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am from my exam scheduler controllerr");
    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };
    //api for exam
    $scope.ExamRegister = function () {
      var data = {
        date: $scope.date,
        time: $scope.time,
        subject: $scope.subject,
        roomnumber: $scope.roomnumber,
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/examRegistration",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      })
        .then(function (response) {
          console.log(response);
          alert("Exams has been scheduled!");
          // handle success
        })
        .catch(function (err) {
          console.log(err);
          alert("There is some error" + err);
          // handle error
        });
    };
  }
);

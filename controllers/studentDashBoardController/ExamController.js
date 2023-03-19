mySchoolApp.controller(
    "ExamController",
    function ($scope, $state, jwtHelper, $http, $rootScope) {
      var token = localStorage.getItem("token");
      console.log("Hi i am Exam controller!!!!!!!!!!!!!!");
  
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
     
      $http({
        method: "GET",
        url: "http://localhost:5000/api/student/getStudentExams",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          console.log(response);
          $scope.exams = response.data.data;
          // console.log(exams.date);
        })
        .catch(function (err) {
          console.log(err);
        });
        
      
      
    }
  );
  
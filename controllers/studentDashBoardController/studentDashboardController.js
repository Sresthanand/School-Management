mySchoolApp.controller(
  "studentDashboardController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am student controller!!!!!!!!!!!!!!");

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

    // API call to get student data

    $http({
      method: "GET",
      url: "http://localhost:5000/getStudentData",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Hiiiii response hu mai");
        console.log(response);
        $scope.name = response.data.data.name;
        $scope.studentClass = response.data.data.class;
        $scope.gender = response.data.data.gender;
        $scope.enrollmentNumber = response.data.data.enrollmentNumber;
        $scope.schoolName = response.data.data.school.name;
        $scope.branchName = response.data.data.branch.location;
        $scope.coordinatorName = response.data.data.coordinator.name;
      })
      .catch(function (err) {
        console.log(err);
      });

    // API call to get student messages

    $http({
      method: "GET",
      url: "http://localhost:5000/getStudentMessages",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Messages fetched successfully");
        console.log(response);
        $scope.messages = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });

    //API call to get student marks
    $http({
      method: "GET",
      url: "http://localhost:5000/getStudentMarks",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Marks fetched successfully");
        console.log(response);

        //need to exclude first three keys as they are not needed
        //0th index has id
        //1st index has coordinator
        //2bd index has student

        var marksArray = [];

        var responseKeys = Object.keys(response.data.data);
        for (var i = 3; i < responseKeys.length; i++) {
          marksArray.push(response.data.data[responseKeys[i]]);
        }
        console.log(marksArray);
        $scope.marks = marksArray;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

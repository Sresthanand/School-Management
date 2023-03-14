mySchoolApp.controller(
  "myStudentController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    $scope.selectedClass = "";
    $scope.selectedGender = "";

    var token = localStorage.getItem("token");

    console.log("Hi i am from my students controllerr");

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

    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedClass = "";
      $scope.selectedGender = "";
    };

    $scope.genderFilter = function (student) {
      return (
        $scope.selectedGender === "" || student.gender === $scope.selectedGender
      );
    };

    //GET Request for getting students

    $http({
      method: "GET",
      url: "http://localhost:5000/getStudents",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Hi!!!!!!!!!!");
        console.log(response);
        $scope.coordinator = response.data.coordinator;
        $scope.students = response.data.students;
      })
      .catch(function (err) {
        console.log(err);
      });

    $scope.openMarksModal = function (student) {
      $scope.selectedStudent = student;
      $("#marksModal").modal("show");
    };

    $scope.saveMarks = function () {
      var data = {
        studentId: $scope.selectedStudent.id,
        studentName: $scope.selectedStudent.name,
        subject1: {
          name: $scope.nameofsubject1,
          marks: $scope.marksofsubject1,
        },
        subject2: {
          name: $scope.nameofsubject2,
          marks: $scope.marksofsubject2,
        },
        subject3: {
          name: $scope.nameofsubject3,
          marks: $scope.marksofsubject3,
        },
        subject4: {
          name: $scope.nameofsubject4,
          marks: $scope.marksofsubject4,
        },
        subject5: {
          name: $scope.nameofsubject5,
          marks: $scope.marksofsubject5,
        },
        maximumMarks: $scope.maximumMarks,
      };

      console.log("Hi i am from save marks function");
      console.log(data);

      $http({
        method: "POST",
        url: "http://localhost:5000/registerMarks",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      })
        .then(function (response) {
          alert("Marks have been saved!");
          console.log(response);
          $("#marksForm").modal("hide");
        })
        .catch(function (err) {
          alert("there is error!");
          console.log(err);
        });
    };
  }
);

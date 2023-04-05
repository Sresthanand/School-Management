mySchoolApp.controller(
  "myStudentController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    $timeout,

    AuthService,
    RouteChangeService,

    studentService
  ) {
    $scope.selectedClass = "";
    $scope.selectedGender = "";

    console.log("Hi i am from my students controllerr");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.checkMarks1 = function () {
      if ($scope.marksofsubject1 <= $scope.maximumMarks) {
        $scope.marksform.marks1.$setValidity("max", true);
      } else {
        $scope.marksform.marks1.$setValidity("max", false);
      }
    };

    $scope.checkMarks2 = function () {
      if ($scope.marksofsubject2 <= $scope.maximumMarks) {
        $scope.marksform.marks2.$setValidity("max", true);
      } else {
        $scope.marksform.marks2.$setValidity("max", false);
      }
    };

    $scope.checkMarks3 = function () {
      if ($scope.marksofsubject3 <= $scope.maximumMarks) {
        $scope.marksform.marks3.$setValidity("max", true);
      } else {
        $scope.marksform.marks3.$setValidity("max", false);
      }
    };

    $scope.checkMarks4 = function () {
      if ($scope.marksofsubject4 <= $scope.maximumMarks) {
        $scope.marksform.marks4.$setValidity("max", true);
      } else {
        $scope.marksform.marks4.$setValidity("max", false);
      }
    };

    $scope.checkMarks5 = function () {
      if ($scope.marksofsubject5 <= $scope.maximumMarks) {
        $scope.marksform.marks5.$setValidity("max", true);
      } else {
        $scope.marksform.marks5.$setValidity("max", false);
      }
    };

    $scope.currentPage = 1;

    $scope.handlePagination = function (page) {
      $scope.currentPage = page;
      studentService
        .getStudents(
          token,
          page,
          $scope.searchQuery,
          $scope.selectedClass,
          $scope.selectedGender
        )
        .then(function (response) {
          console.log(response);
          $scope.students = response.data.students;
          const totalPages = response.data.totalPages;
          $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    studentService
      .getStudents(token, $scope.currentPage)
      .then(function (response) {
        console.log(response);
        $scope.students = response.data.students;
        const totalPages = response.data.totalPages;
        $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      })
      .catch(function (err) {
        console.log(err);
      });

    $scope.openMarksModal = function (student) {
      $scope.selectedStudent = student;

      console.log($scope.selectedStudent.class);
      $("#marksModal").modal("show");
    };

    $scope.handleClose = function () {
      $scope.nameofsubject = "";
      $scope.marksofsubject1 = "";
      $scope.nameofsubject2 = "";
      $scope.marksofsubject2 = "";
      $scope.nameofsubject3 = "";
      $scope.marksofsubject3 = "";
      $scope.nameofsubject4 = "";
      $scope.marksofsubject4 = "";
      $scope.nameofsubject5 = "";
      $scope.marksofsubject5 = "";
      $scope.maximumMarks = "";
    };

    $scope.saveMarks = function () {
      var studentId = $scope.selectedStudent.id;
      var studentName = $scope.selectedStudent.name;
      var studentClass = $scope.selectedStudent.class;

      var subject1Name = $scope.nameofsubject1;
      var subject1Marks = $scope.marksofsubject1;
      var subject2Name = $scope.nameofsubject2;
      var subject2Marks = $scope.marksofsubject2;
      var subject3Name = $scope.nameofsubject3;
      var subject3Marks = $scope.marksofsubject3;
      var subject4Name = $scope.nameofsubject4;
      var subject4Marks = $scope.marksofsubject4;
      var subject5Name = $scope.nameofsubject5;
      var subject5Marks = $scope.marksofsubject5;
      var maximumMarks = $scope.maximumMarks;

      console.log("Hi i am from save marks function");

      studentService
        .saveMarks(
          token,
          studentId,
          studentName,
          studentClass,
          subject1Name,
          subject1Marks,
          subject2Name,
          subject2Marks,
          subject3Name,
          subject3Marks,
          subject4Name,
          subject4Marks,
          subject5Name,
          subject5Marks,
          maximumMarks
        )
        .then(function (response) {
          $scope.showToast = true;
          $scope.toastMessage = "Marks have been saved!";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(response);
          $("#marksForm").modal("hide");
        })
        .catch(function (err) {
          //alert("there is error!");
          $scope.showToast = true;
          $scope.toastMessage = "there is error!";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(err);
        });
    };

    //delete
    $scope.openDeleteModal = function (student) {
      console.log(student);
      $rootScope.selectedStudenDelete = student;
      console.log($rootScope.selectedStudenDelete);
    };

    $scope.confirmDelete = function (student) {
      var studentId = $rootScope.selectedStudenDelete.id;
      console.log("studentId : " + studentId);

      studentService
        .deleteStudent(token, studentId)
        .then(function (response) {
          console.log(response);
          var index = $scope.students.indexOf($rootScope.selectedStudenDelete);
          if (index !== -1) {
            $scope.students.splice(index, 1);
          }

          $scope.showToast = true;
          $scope.toastMessage = "Student has been deleted succesfully!!";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);

          //alert
        })
        .catch(function (err) {
          console.log(err);
          //alert
          $scope.showToast = true;
          $scope.toastMessage = "there is error!";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(err);
        });

      $("#deleteModal").modal("hide");
    };
  }
);

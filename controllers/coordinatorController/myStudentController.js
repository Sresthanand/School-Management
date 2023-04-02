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

    $scope.classFilter = function (student) {
      return (
        $scope.selectedClass === "" || student.class === $scope.selectedClass
      );
    };

    //GET Request for getting students
    // studentService
    //   .getStudents(token)
    //   .then(function (response) {
    //     console.log("Hi!!!!!!!!!!");
    //     console.log(response);
    //     $scope.students = response.data.students;
    //     const totalPages = response.data.totalPages;
    //     $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });

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

    // Initial call to load the first page of students
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

    // $scope.saveMarks = function () {
    //   var data = {
    //     studentId: $scope.selectedStudent.id,
    //     studentName: $scope.selectedStudent.name,
    //     subject1: {
    //       name: $scope.nameofsubject1,
    //       marks: $scope.marksofsubject1,
    //     },
    //     subject2: {
    //       name: $scope.nameofsubject2,
    //       marks: $scope.marksofsubject2,
    //     },
    //     subject3: {
    //       name: $scope.nameofsubject3,
    //       marks: $scope.marksofsubject3,
    //     },
    //     subject4: {
    //       name: $scope.nameofsubject4,
    //       marks: $scope.marksofsubject4,
    //     },
    //     subject5: {
    //       name: $scope.nameofsubject5,
    //       marks: $scope.marksofsubject5,
    //     },
    //     maximumMarks: $scope.maximumMarks,
    //   };

    //   console.log("Hi i am from save marks function");
    //   console.log(data);

    //   studentService
    //     .saveMarks(token, data)
    //     .then(function (response) {
    //       alert("Marks have been saved!");
    //       console.log(response);
    //       $("#marksForm").modal("hide");
    //     })
    //     .catch(function (err) {
    //       alert("there is error!");
    //       console.log(err);
    //     });
    // };

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
          // alert("Marks have been saved!");
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

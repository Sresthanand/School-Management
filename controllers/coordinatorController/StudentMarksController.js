mySchoolApp.controller(
  "StudentMarksController",
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
    console.log("Hi i am StudentMarksController!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    // call the API to get student marks
    studentService
      .getStudentMarks(token)
      .then(function (response) {
        console.log(response);
        $scope.marksList = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });

      
    $scope.resetFilters = function () {
      $scope.searchQuery = "";
    };

    // $scope.sortByTotalMarks = function (marks) {
    //   return -(
    //     marks.subject1.marksObtained +
    //     marks.subject2.marksObtained +
    //     marks.subject3.marksObtained +
    //     marks.subject4.marksObtained +
    //     marks.subject5.marksObtained
    //   );
    // };

    $scope.openDeleteAlert = function (marks) {
      console.log(marks.id);
      var confirmation = confirm(
        "Are you sure you want to delete these marks?"
      );
      if (confirmation) {
        studentService
          .deleteMarks(token, marks.id)
          .then(function (response) {
            var index = $scope.marksList.indexOf(marks);
            $scope.marksList.splice(index, 1);
            //alert
            $scope.showToast = true;
            $scope.toastMessage = "Marks Deleted successfully!";
            $scope.toastColor = "green";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);
          })
          .catch(function (err) {
            console.log(err);
            //alert
            $scope.showToast = true;
            $scope.toastMessage = "Something went wrong while Deleting Marks!";
            $scope.toastColor = "red";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);
          });
      }
    };

    $scope.openMarksModal = function (marks) {
      $scope.marksCal = marks;
      console.log($scope.marksCal);
      $scope.MarksId = marks.id;
      console.log($scope.MarksId);
    };

    $scope.checkMarks = function () {
      if ($scope.marksofsubject1 <= $scope.maximumMarks) {
        $scope.marksform.marks1.$setValidity("max", true);
      } else {
        $scope.marksform.marks1.$setValidity("max", false);
      }
    };

    $scope.editMarks = function (
      maximumMarks,
      nameofsubject1,
      marksofsubject1,
      nameofsubject2,
      marksofsubject2,
      nameofsubject3,
      marksofsubject3,
      nameofsubject4,
      marksofsubject4,
      nameofsubject5,
      marksofsubject5
    ) {
      var MarksId = $scope.MarksId;
      var subject1Name = nameofsubject1;
      var subject1Marks = marksofsubject1;
      var subject2Name = nameofsubject2;
      var subject2Marks = marksofsubject2;
      var subject3Name = nameofsubject3;
      var subject3Marks = marksofsubject3;
      var subject4Name = nameofsubject4;
      var subject4Marks = marksofsubject4;
      var subject5Name = nameofsubject5;
      var subject5Marks = marksofsubject5;
      var maximumMarks = maximumMarks;

      var marksCalculate = $scope.marksCal;

      //console.log(MarksId + "Heyo bitch");
      console.log("Hi i am from edit marks function");

      studentService
        .editMarksOfStudent(
          token,
          MarksId,
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
          console.log(response);
          $scope.showToast = true;
          $scope.toastMessage = "Marks have been Updated Succesfully!";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(response);

          console.log(marksCalculate);

          var index = $scope.marksList.indexOf(marksCalculate);

          console.log("Index" + index);

          if (index !== -1) {
            $scope.marksList[index].MaximumMarks = maximumMarks;

            $scope.marksList[index].subject1.name = subject1Name;
            $scope.marksList[index].subject1.marksObtained = subject1Marks;

            $scope.marksList[index].subject2.name = subject2Name;
            $scope.marksList[index].subject2.marksObtained = subject2Marks;

            $scope.marksList[index].subject3.name = subject3Name;
            $scope.marksList[index].subject3.marksObtained = subject3Marks;

            $scope.marksList[index].subject4.name = subject4Name;
            $scope.marksList[index].subject4.marksObtained = subject4Marks;

            $scope.marksList[index].subject5.name = subject5Name;
            $scope.marksList[index].subject5.marksObtained = subject5Marks;
          }

          $scope.showForm = false;
          // $("#marksForm").modal("hide");
        })
        .catch(function (err) {
          //alert("there is error!");
          console.log(err);
          $scope.showToast = true;
          $scope.toastMessage = "Some error occured, Please try again later!";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(err);
        });
    };
  }
);

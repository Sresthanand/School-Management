mySchoolApp.controller(
  "studentDashboardController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,
    $timeout,
    studentDashboardService,
    studentDashboardStatsServices,
    StudentDashboardStatsFactory
  ) {
    console.log("Hi i am student controller!!!!!!!!!!!!!!");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.showToast = true;
    $scope.toastMessage = "Hello! Welcome to Student Dashboard!";
    $scope.toastColor = "green";
    $timeout(function () {
      $scope.showToast = false;
    }, 500);

    // API call to get student data

    studentDashboardService
      .getStudentData(token)
      .then(function (response) {
        console.log("Hiiiii response hu mai");
        console.log(response);
        $scope.name = response.data.data.name;
        $scope.studentClass = response.data.data.class;
        $scope.gender = response.data.data.gender;
        $scope.image = response.data.data.image;
        $scope.enrollmentNumber = response.data.data.enrollmentNumber;
        $scope.schoolName = response.data.data.school.name;
        $scope.branchName = response.data.data.branch.location;
        $scope.coordinatorName = response.data.data.coordinator.name;

        $scope.studentId = response.data.data.id; //for attendance
      })
      .catch(function (err) {
        console.log(err);
      });

    // API call to get student messages

    // Get messages
    studentDashboardService
      .getStudentMessages(token)
      .then(function (response) {
        console.log("Messages fetched successfully");
        console.log(response);
        $scope.messages = response.data.data;
      })
      .catch(function (err) {
        console.log(err);
      });

    //API call to get student marks

    // Fetch student marks
    studentDashboardService
      .getStudentMarks(token)
      .then(function (response) {
        console.log("Marks fetched successfully");
        console.log(response);

        if (!response.data.data || typeof response.data.data !== "object") {
          $scope.marksUnavailable = true;
        } else {
          var marksArray = [];

          var responseKeys = Object.keys(response.data.data);
          for (var i = 3; i < responseKeys.length; i++) {
            marksArray.push(response.data.data[responseKeys[i]]);
          }
          console.log(marksArray);
          $scope.marks = marksArray;
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    $scope.handleAttendance = function (studentId) {
      studentDashboardService
        .markAttendance(token, studentId)
        .then(function (response) {
          if (
            response.data &&
            response.data.message === "Attendance already marked for today"
          ) {
            //alert("Your attendance has already been marked for today");
            $scope.showToast = true;
            $scope.toastMessage =
              "Your attendance has already been marked for today";
            $scope.toastColor = "green";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);
          } else {
            //alert("Your attendance has been marked!");
            $scope.showToast = true;
            $scope.toastMessage = "Your attendance has been marked!";
            $scope.toastColor = "green";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);

            console.log(response);
          }
        })
        .catch(function (err) {
          if (
            err.status === 400 &&
            err.data === "Attendance already marked for today"
          ) {
            //alert("Your attendance has already been marked for today");
            $scope.showToast = true;
            $scope.toastMessage =
              "Your attendance has already been marked for today";
            $scope.toastColor = "red";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);
          } else {
            //alert("There was an error while marking your attendance");
            $scope.showToast = true;
            $scope.toastMessage =
              "There was an error while marking your attendance";
            $scope.toastColor = "red";
            $timeout(function () {
              $scope.showToast = false;
            }, 3000);

            console.log(err);
          }
        });
    };

    studentDashboardStatsServices
      .getStudentPercentage(token)
      .then(function (response) {
        console.log(response);

        $scope.percentage = response.data.percentage;

        $scope.cgpa = StudentDashboardStatsFactory.calculateCGPA(
          $scope.percentage
        );
        $scope.overallGrade =
          StudentDashboardStatsFactory.calculateOverallGrade($scope.percentage);

        console.log($scope.cgpa + " " + $scope.overallGrade);
      })
      .catch(function (err) {
        console.log(err);
      });

    studentDashboardStatsServices
      .getStudenRank(token)
      .then(function (response) {
        console.log(response);

        $scope.rank = response.data.rank;
        $scope.percentile = response.data.percentile;

        console.log($scope.rank + " " + $scope.percentile);
      })
      .catch(function (err) {
        console.log(err);
      });

    //handleStudentReportCard
    $scope.handleStudentReportCard = function (studentId) {
      studentDashboardService
        .reportCardGeneration(
          token,
          studentId,
          $scope.name,
          $scope.studentClass,
          $scope.gender,
          $scope.enrollmentNumber,
          $scope.schoolName,
          $scope.branchName,
          $scope.coordinatorName,
          $scope.marks,
          $scope.cgpa,
          $scope.overallGrade,
          $scope.rank,
          $scope.percentile,
          $scope.percentage
        )
        .then(function (response) {
          console.log(response);

          $scope.showToast = true;
          $scope.toastMessage = "Your Results has been Succesfully Downloaded! Check Downloads Folder!";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);

        })
        .catch(function (err) {
          //console.log(err);
          $scope.showToast = true;
          $scope.toastMessage =
            "There was some error while downloading result! Please try again later!";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });
    };
  }
);

// $scope.handleAttendance = function (studentId) {
//   $http({
//     method: "PUT",
//     url: "http://localhost:5000/api/student/markAttendance/" + studentId,
//     headers: {
//       Authorization: "Bearer " + token,
//       "Content-Type": "application/json",
//     },
//   })
//     .then(function (response) {
//       if (
//         response.data &&
//         response.data.message === "Attendance already marked for today"
//       ) {
//         alert("Your attendance has already been marked for today");
//       } else {
//         alert("Your attendance has been marked!");
//         console.log(response);
//       }
//     })
//     .catch(function (err) {
//       if (
//         err.status === 400 &&
//         err.data === "Attendance already marked for today"
//       ) {
//         alert("Your attendance has already been marked for today");
//       } else {
//         alert("There was an error while marking your attendance");
//         console.log(err);
//       }
//     });
// };

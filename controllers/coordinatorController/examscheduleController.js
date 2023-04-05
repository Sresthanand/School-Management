mySchoolApp.controller(
  "examscheduleController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    AuthService,
    RouteChangeService,

    $timeout,

    studentService
  ) {
    console.log("Hi i am from my exam scheduler controllerr");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    $scope.ExamRegister = function () {
      var date = $scope.date;
      var time = $scope.time;
      var subject = $scope.subject;
      var roomnumber = $scope.roomnumber;

      studentService
        .examRegister(token, date, time, subject, roomnumber)
        .then(function (response) {
          console.log(response);
          //alert("Exams has been scheduled!");
          $scope.showToast = true;
          $scope.toastMessage = "Exams has been scheduled";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .catch(function (err) {
          console.log(err);
          //alert("There is some error" + err);
          $scope.showToast = true;
          $scope.toastMessage = "Something went wrong while scheduling exams!";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });
    };
  }
);

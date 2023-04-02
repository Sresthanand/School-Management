mySchoolApp.controller(
  "NotificationController",
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
    console.log("Hi i am from my coordinator controllerr");

    $scope.$watch("$root.$state.current.name", RouteChangeService.setRoute);

    var token = localStorage.getItem("token");

    AuthService.checkTokenValidity(token);

    $scope.logout = function () {
      console.log("Hi i am Logout!");
      localStorage.removeItem("token");
      $state.go("login");
    };

    // send message
    // $scope.sendMessage = function () {
    //   var message = {
    //     messageTitle: $scope.messagetitle,
    //     messageContent: $scope.messagecontent,
    //   };

    //   studentService
    //     .saveMessage(token, message)
    //     .then(function (response) {
    //       console.log(response);
    //       alert("Message sent successfully!");
    //     })
    //     .catch(function (err) {
    //       console.log(err);
    //       alert("Error sending message. Please try again later.");
    //     });
    // };

    $scope.sendMessage = function () {
      var messageTitle = $scope.messagetitle;
      var messageContent = $scope.messagecontent;

      studentService
        .saveMessage(token, messageTitle, messageContent)
        .then(function (response) {
          console.log(response);
          // alert("Message sent successfully!");
          $scope.showToast = true;
          $scope.toastMessage = "Message sent successfully!";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .catch(function (err) {
          console.log(err);
          // alert("Error sending message. Please try again later.");
          $scope.showToast = true;
          $scope.toastMessage =
            "Error sending message. Please try again later.";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });
    };
  }
);

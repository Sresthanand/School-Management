mySchoolApp.controller(
  "NotificationController",
  function ($scope, $state, jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem("token");
    console.log("Hi i am from my coordinator controllerr");
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

    //post req for saving message
    $scope.sendMessage = function () {
      var message = {
        messageTitle: $scope.messagetitle,
        messageContent: $scope.messagecontent,
      };

      $http({
        method: "POST",
        url: "http://localhost:5000/saveMessage",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: message,
      })
        .then(function (response) {
          console.log(response);
          // Show a success message to the user
          alert("Message sent successfully!");
        })
        .catch(function (err) {
          console.log(err);
          // Show an error message to the user
          alert("Error sending message. Please try again later.");
        });
    };
  }
);

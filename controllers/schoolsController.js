app.controller("schoolsController", function ($scope) {
  $scope.showRegistrationForm = true;
  $scope.showHelloMessage = false;

  // function to toggle the registration form and the "Hello" message
  $scope.toggleFormAndMessage = function () {
    $scope.showRegistrationForm = !$scope.showRegistrationForm;
    $scope.showHelloMessage = !$scope.showHelloMessage;
  };
});

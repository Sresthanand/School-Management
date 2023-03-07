mySchoolApp.controller(
  "BranchesController",
  function ($scope, $state, jwtHelper, $rootScope, $http) {
    console.log("Hi i am From BranCH coNTROLLER");

    $scope.$watch("$root.$state.current.name", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $rootScope.currentRoute = newValue;
      }
    });

    var token = localStorage.getItem("token");
    if (!token || jwtHelper.isTokenExpired(token)) {
      $state.go("login");
    }

    $scope.logout = function () {
      localStorage.removeItem("token");
      $state.go("login");
    };

    //call api to get all branches
    $scope.branches = []; // initialize an empty array to store fetched branches

    //call api to get all branches
    $http({
      method: "GET",
      url: "http://localhost:5000/getBranches",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("Hi!!!!!!!!!!");
        console.log(response);
        $scope.branches = response.data.branches;
      })
      .catch(function (err) {
        console.log(err);
      });

    //edit

    //delete later
  }
);

//   const authenticateRequest = passport.authenticate("jwt", { session: false });

mySchoolApp.controller(
  "myCoordinatorController",
  function ($scope, $state, jwtHelper, $http, $rootScope, CoordinatorService) {
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

    //get api for coordinators

    $http({
      method: "GET",
      url: "http://localhost:5000/getCoordinators",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.coordinators = response.data.coordinators;
        if ($scope.coordinators.length === 0) {
          alert("Please register a coordinator first.");
          $state.go("SchoolBranchDashboard");
        }

      })
      .catch(function (err) {
        console.log(err);
      });

    //reset filters
    $scope.resetFilters = function () {
      $scope.searchQuery = "";
    };

    //delete
    $scope.openDeleteModal = function (coordinator) {
      console.log(coordinator);
      $rootScope.selectedCoordinatorDelete = coordinator;
      console.log($rootScope.selectedCoordinatorDelete);
    };

    //confirm delete func -> Call API to Delete all schools
    $scope.confirmDelete = function (coordinator) {
      var coordinatorId = $rootScope.selectedCoordinatorDelete._id;
      console.log("coordinatorId : " + coordinatorId);

      CoordinatorService.deleteCoordinator(token, coordinatorId)
        .then(function (response) {
          console.log(response);
          var index = $scope.coordinators.indexOf(
            $rootScope.selectedCoordinatorDelete
          );
          if (index !== -1) {
            $scope.coordinators.splice(index, 1);
          }
          // Reset selected coordinator
          $rootScope.selectedCoordinatorDelete = null;
          $("#deleteModal").modal("hide");
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
);

mySchoolApp.controller(
  "myCoordinatorController",
  function (
    $scope,
    $state,
    jwtHelper,
    $http,
    $rootScope,
    CoordinatorService,
    $timeout
  ) {
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

    $scope.currentPage = 1;

    $scope.handlePagination = function (page) {
      $scope.currentPage = page;
      CoordinatorService.getCoordinators(token, page, $scope.searchQuery)
        .then(function (response) {
          console.log(response);
          $scope.coordinators = response.data.coordinators;
          const totalPages = response.data.totalPages;
          $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    // Initial call to load the first page of coordinator
    CoordinatorService.getCoordinators(token, $scope.currentPage)
      .then(function (response) {
        console.log(response);
        $scope.coordinators = response.data.coordinators;
        if ($scope.coordinators.length === 0) {
          alert("Please register a coordinator first.");
          $state.go("SchoolBranchDashboard");
        }
        const totalPages = response.data.totalPages;
        $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
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

          //alert

          $scope.showToast = true;
          $scope.toastMessage = "Coordinator Deleted Successfully";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);

          // Reset selected coordinator
          $rootScope.selectedCoordinatorDelete = null;
          $("#deleteModal").modal("hide");
        })
        .catch(function (err) {
          //alert
          $scope.showToast = true;
          $scope.toastMessage =
            "Something went wrong while Deleting Coordinator";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
          console.log(err);
        });
    };

    // Open Edit Modal and set the selected branch
    $scope.openEditModal = function (coordinator) {
      console.log(coordinator);
      $rootScope.selectedCoordinator = coordinator;
      console.log($rootScope.selectedCoordinator);
    };

    $scope.updateCoordinatorName = function (updatedCoordinatorName) {
      console.log("Hiii i am from update Coordinator name");
      CoordinatorService.updateCoordinatorName(
        token,
        $rootScope.selectedCoordinator._id,
        updatedCoordinatorName
      )
        .then(function (response) {
          for (var i = 0; i < $scope.coordinators.length; i++) {
            if (
              $scope.coordinators[i]._id === $rootScope.selectedCoordinator._id
            ) {
              $scope.coordinators[i].name = updatedCoordinatorName;
              break;
            }
          }
          console.log(response);
          //alert("You successfully updated the coordinator name.");
          $scope.showToast = true;
          $scope.toastMessage =
            "You successfully updated the coordinator name.";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .catch(function (error) {
          console.log(error);
          //alert("There was an error updating the Coordinator Name.");
          $scope.showToast = true;
          $scope.toastMessage =
            "There was an error updating the Coordinator Name.";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });

      $("#editModal").modal("hide");
    };
  }
);

mySchoolApp.controller(
  "BranchesController",
  function ($scope, $state, jwtHelper, $rootScope, $http, BranchService) {
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
        console.log(response);
        $scope.branches = response.data.branches;
        if ($scope.branches.length === 0) {
          alert("Please register a branch first.");
          $state.go("SchoolDashboard");
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    //edit

    //delete
    $scope.openDeleteModal = function (branch) {
      console.log(branch);
      $rootScope.selectedBranchDelete = branch;
      console.log($rootScope.selectedBranchDelete);
    };

    //confirm delete func -> Call API to Delete all schools
    $scope.confirmDelete = function (branch) {
      var branchId = $rootScope.selectedBranchDelete._id;
      console.log("branchId : " + branchId);
      BranchService.deleteBranch(token, branchId)
        .then(function (response) {
          for (var i = 0; i < $scope.branches.length; i++) {
            if ($scope.branches[i]._id === branchId) {
              $scope.branches.splice(i, 1);
              break;
            }
          }
          console.log(response);
          alert("Branch deleted successfully!");
        })
        .catch(function (error) {
          console.log(error);
          alert("Error deleting branch.");
        });

      $("#deleteModal").modal("hide");
    };

    //reset filters
    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedLocation = "";
    };
  }
);


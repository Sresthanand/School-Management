mySchoolApp.controller(
  "BranchesController",
  function (
    $scope,
    $state,
    jwtHelper,
    $rootScope,
    $http,
    $timeout,
    BranchService
  ) {
    console.log("Hi i am From BranCH coNTROLLER"); //

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
    $scope.branches = [];
    $scope.currentPage = 1;

    $scope.handlePagination = function (page) {
      $scope.currentPage = page;
      BranchService.getBranches(
        token,
        page,
        $scope.searchQuery,
        $scope.selectedLocation
      )
        .then(function (response) {
          console.log(response);
          $scope.branches = response.data.branches;
          const totalPages = response.data.totalPages;
          $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    // Initial call to load the first page of branches
    BranchService.getBranches(token)
      .then(function (response) {
        console.log(response);

        $scope.branches = response.data.branches;
        const totalPages = response.data.totalPages;
        $scope.pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        if ($scope.branches.length === 0) {
          alert("Please register a branch first.");
          $state.go("SchoolDashboard");
        }
      })
      .catch(function (err) {
        console.log(err);
      });

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
          //alert("Branch deleted successfully!");
          $scope.showToast = true;
          $scope.toastMessage = "Branch Deleted successfully";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .catch(function (error) {
          console.log(error);
          // alert("Error deleting branch.");
          $scope.showToast = true;
          $scope.toastMessage = "Error Deleting Branch";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });

      $("#deleteModal").modal("hide");
    };

    //reset filters
    $scope.resetFilters = function () {
      $scope.searchQuery = "";
      $scope.selectedLocation = "";
    };

    // Open Edit Modal and set the selected branch
    $scope.openEditModal = function (branch) {
      console.log(branch);
      $rootScope.selectedBranch = branch;
      console.log($rootScope.selectedBranch);
    };

    $scope.updateBranchLocation = function (updatedlocation) {
      console.log("Hiii i am from update branchname");
      BranchService.updateBranchLocation(
        token,
        $rootScope.selectedBranch._id,
        updatedlocation
      )
        .then(function (response) {
          for (var i = 0; i < $scope.branches.length; i++) {
            if ($scope.branches[i]._id === $rootScope.selectedBranch._id) {
              $scope.branches[i].location = updatedlocation;
              break;
            }
          }
          console.log(response);
          // alert("You successfully updated the branch location.");
          $scope.showToast = true;
          $scope.toastMessage = "You successfully updated the branch location.";
          $scope.toastColor = "green";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        })
        .catch(function (error) {
          console.log(error);
          //alert("There was an error updating the branch location.");
          $scope.showToast = true;
          $scope.toastMessage =
            "There was an error updating the branch location.";
          $scope.toastColor = "red";
          $timeout(function () {
            $scope.showToast = false;
          }, 3000);
        });

      $("#editModal").modal("hide");
    };
  }
);

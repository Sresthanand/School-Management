mySchoolApp.service("CoordinatorService", function ($http) {
    var baseUrl = "http://localhost:5000/";
  // Delete branch
  this.deleteCoordinator = function (token,coordinatorId) {
    return $http({
      method: "PUT",
      url: "http://localhost:5000/api/branch/deleteCoordinator/" + coordinatorId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});


  

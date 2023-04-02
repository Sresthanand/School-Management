mySchoolApp.service("CoordinatorService", function ($http) {
  var baseUrl = "http://localhost:5000/";
  // Delete branch
  this.deleteCoordinator = function (token, coordinatorId) {
    return $http({
      method: "PUT",
      url:
        "http://localhost:5000/api/branch/deleteCoordinator/" + coordinatorId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  //get coordinators
  this.getCoordinators = function (token, page, searchQuery) {
    return $http({
      method: "GET",
      url: `http://localhost:5000/api/branch/getCoordinators?page=${page}&limit=6&search=${searchQuery}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Update Coordinaoor Name
  this.updateCoordinatorName = function (
    token,
    coordinatorId,
    updatedCoordinatorName
  ) {
    return $http({
      method: "PUT",
      url:
        "http://localhost:5000/api/branch/updateCoordinator/" + coordinatorId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        name: updatedCoordinatorName,
      },
    });
  };

  this.registerCoordinator = function (
    token,
    name,
    username,
    password,
    imageUrl
  ) {
    var data = {
      name: {
        name: name,
        image: imageUrl,
      },
      username: username,
      password: password,
    };

    return $http({
      method: "POST",
      url: "http://localhost:5000/api/branch/coordinatorRegister",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };
});

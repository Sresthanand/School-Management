mySchoolApp.service("coordinatorStats", function ($http) {
  this.getCoordinatorCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/branch/coordinatorsCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getCoordinatorActiveInactiveCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/branch/coordinatorInactiveActiveCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getRegisteredCoordinatorsOverTime = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/branch/coordinatorsRegisteredOverPeriodOfTime",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

mySchoolApp.service("SchoolStatsService", function ($http) {
  this.getBranchesCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/school/branchesCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getBranchLocationCount = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/school/branchLocationCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getActiveInactiveBranches = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/school/activeInactivebranches",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getBranchRegistrationsOverPeriodOfTime = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/school/branchRegistrationsOverPeriodOfTime",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

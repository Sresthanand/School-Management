mySchoolApp.service("SuperAdminStatsService", function ($http) {
  this.getTotalRegistrations = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/total",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getLatestRegistrations = function (token) {
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/latest",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getActiveInactiveSchools = function () {
    var token = localStorage.getItem("token");
    return $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/activeInactiveSchools",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getSchoolRegistrationsOverPeriodOfTime = function () {
    var token = localStorage.getItem("token");

    return $http({
      method: "GET",
      url: "http://localhost:5000/api/superadmin/schoolRegistrationsOverPeriodOfTime",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

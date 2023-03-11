mySchoolApp.factory("RouteChangeService", function ($rootScope) {
  var service = {};

  service.setRoute = function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $rootScope.currentRoute = newValue;
    }
  };

  return service;
});

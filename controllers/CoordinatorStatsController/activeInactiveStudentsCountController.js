mySchoolApp.controller(
  "activeInactiveStudentsCountController",
  function ($scope, $http) {
    var token = localStorage.getItem("token");

    console.log("Hi i am studnetsActiveInactiveCount controller!");

    $http({
      method: "GET",
      url: "http://localhost:5000/api/coordinator/studnetsActiveInactiveCount",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        $scope.labels = ["Actice Students" , "Inactive Students"];
        $scope.data = [response.data.activeStudentsCount,response.data.inActiveStudentsCount];
        $scope.colors = [ "#000080","#9370DB"];
      })
      .catch(function (err) {
        console.log(err);
      });
  }
);

mySchoolApp.service("BranchService", function ($http) {
  var baseUrl = "http://localhost:5000/";

  var self = this;

  self.registerBranch = function (
    token,
    username,
    password,
    location,
    imageUrl
  ) {
    var data = {
      username: username,
      password: password,
      branch: {
        location: location,
        image: imageUrl,
      },
    };

    return $http({
      method: "POST",
      url: "http://localhost:5000/api/school/branchRegister",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };

  //get branches
  self.getBranches = function (token, page, searchQuery, selectedLocation) {
    return $http({
      method: "GET",
      url: `http://localhost:5000/api/school/getBranches?page=${page}&limit=6&location=${selectedLocation}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Delete branch
  this.deleteBranch = function (token, branchId) {
    return $http({
      method: "PUT",
      url: "http://localhost:5000/api/school/deleteBranch/" + branchId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Update branch location
  this.updateBranchLocation = function (token, branchId, updatedlocation) {
    return $http({
      method: "PUT",
      url: "http://localhost:5000/api/school/updateBranch/" + branchId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        name: updatedlocation,
      },
    });
  };
});

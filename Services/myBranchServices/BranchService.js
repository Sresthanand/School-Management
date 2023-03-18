mySchoolApp.service("BranchService", function ($http) {
    var baseUrl = "http://localhost:5000/";

//   this.getAllBranches = function (token) {
//     return $http.get(`${baseUrl}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   };

//   this.updateBranchName = function (token, branchId, updatedBranchName) {
//     return $http.put(
//       `${baseUrl}/updateBranchName/${branchId}`,
//       { name: updatedBranchName },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//   };

  // Delete branch
  this.deleteBranch = function (token,branchId) {
    return $http({
      method: "PUT",
      url: baseUrl + "deleteBranch/" + branchId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };
});

mySchoolApp.service("BranchImageUploadService", function ($http) {
    function uploadImage(token, file, $http) {
      const fd = new FormData();
      fd.append("file", file);
      console.log(fd);
      return $http({
        method: "POST",
        url: "http://localhost:5000/api/upload/uploadImage",
        data: fd,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": undefined,
        },
      });
    }
  
    return {
      uploadImage: uploadImage,
    };
  });
  

// Define a new factory for handling tokens
mySchoolApp.factory("tokenService", function () {
    var tokenKey = "token";
    return {
      getToken: function () {
        return localStorage.getItem(tokenKey);
      },
      setToken: function (token) {
        localStorage.setItem(tokenKey, token);
      },
      clearToken: function () {
        localStorage.removeItem(tokenKey);
      },
    };
  });
  
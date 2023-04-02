mySchoolApp.service("studentService", function ($http) {
  var baseUrl = "http://localhost:5000/";

  //register

  var self = this;

  self.registerStudent = function (
    token,
    username,
    password,
    name,
    classofstudent,
    gender,
    enrollmentNumber,
    imageUrl
  ) {
    var data = {
      username: username,
      password: password,
      information: {
        name: name,
        classofstudent: classofstudent,
        gender: gender,
        enrollmentNumber: enrollmentNumber,
        image: imageUrl,
      },
    };

    return $http({
      method: "POST",
      url: "http://localhost:5000/api/coordinator/studentRegister",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };

  // Delete student
  this.deleteStudent = function (token, studentId) {
    console.log("Hi i am from student services" + studentId);
    return $http({
      method: "PUT",
      url: "http://localhost:5000/api/coordinator/deleteStudent/" + studentId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  // Get students
  this.getStudents = function (
    token,
    page,
    searchQuery,
    selectedClass,
    selectedGender
  ) {
    return $http({
      method: "GET",
      url: `http://localhost:5000/api/coordinator/getStudents?page=${page}&limit=6&search=${searchQuery}&class=${selectedClass}&gender=${selectedGender}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  //save marks
  // this.saveMarks = function (token, data) {
  //   return $http({
  //     method: "POST",
  //     url: baseUrl + "api/coordinator/registerMarks",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   });
  // };

  this.saveMarks = function (
    token,
    studentId,
    studentName,
    studentClass,
    subject1Name,
    subject1Marks,
    subject2Name,
    subject2Marks,
    subject3Name,
    subject3Marks,
    subject4Name,
    subject4Marks,
    subject5Name,
    subject5Marks,
    maximumMarks
  ) {
    var data = {
      studentId: studentId,
      studentName: studentName,
      studentClass: studentClass,
      subject1: {
        name: subject1Name,
        marks: subject1Marks,
      },
      subject2: {
        name: subject2Name,
        marks: subject2Marks,
      },
      subject3: {
        name: subject3Name,
        marks: subject3Marks,
      },
      subject4: {
        name: subject4Name,
        marks: subject4Marks,
      },
      subject5: {
        name: subject5Name,
        marks: subject5Marks,
      },
      maximumMarks: maximumMarks,
    };

    return $http({
      method: "POST",
      url: baseUrl + "api/coordinator/registerMarks",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };

  //exam register

  // this.examRegister = function (token, data) {
  //   return $http({
  //     method: "POST",
  //     url: "http://localhost:5000/api/coordinator/examRegistration",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   });
  // };

  this.examRegister = function (token, date, time, subject, roomnumber) {
    var data = {
      date: date,
      time: time,
      subject: subject,
      roomnumber: roomnumber,
    };

    return $http({
      method: "POST",
      url: baseUrl + "api/coordinator/examRegistration",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };

  //message
  // this.saveMessage = function (token, message) {
  //   return $http({
  //     method: "POST",
  //     url: baseUrl + "api/coordinator/saveMessage",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //     data: message,
  //   });
  // };

  this.saveMessage = function (token, messageTitle, messageContent) {
    var message = {
      messageTitle: messageTitle,
      messageContent: messageContent,
    };

    return $http({
      method: "POST",
      url: baseUrl + "api/coordinator/saveMessage",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: message,
    });
  };

  // Get student marks
  this.getStudentMarks = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/getMarksCoordinator",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStudentAttendance = function (token) {
    return $http({
      method: "GET",
      url: baseUrl + "api/coordinator/getStudentAttendance",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  //Delete Marks
  // Delete marks
  this.deleteMarks = function (token, marksId) {
    return $http({
      method: "PUT",
      url: baseUrl + "api/coordinator/deletMarks/" + marksId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  };

  //edit Marks
  this.editMarksOfStudent = function (
    token,
    MarksId,
    subject1Name,
    subject1Marks,
    subject2Name,
    subject2Marks,
    subject3Name,
    subject3Marks,
    subject4Name,
    subject4Marks,
    subject5Name,
    subject5Marks,
    maximumMarks
  ) {
    var data = {
      subject1: {
        name: subject1Name,
        marks: subject1Marks,
        maximumMarks: maximumMarks,
      },
      subject2: {
        name: subject2Name,
        marks: subject2Marks,
        maximumMarks: maximumMarks,
      },
      subject3: {
        name: subject3Name,
        marks: subject3Marks,
        maximumMarks: maximumMarks,
      },
      subject4: {
        name: subject4Name,
        marks: subject4Marks,
        maximumMarks: maximumMarks,
      },
      subject5: {
        name: subject5Name,
        marks: subject5Marks,
        maximumMarks: maximumMarks,
      },
    };


    console.log(data);

    return $http({
      method: "PUT",
      url: baseUrl + "api/coordinator/updateMarks/" + MarksId,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    });
  };
});

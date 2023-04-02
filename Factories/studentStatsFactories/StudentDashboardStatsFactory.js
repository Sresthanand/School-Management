mySchoolApp.factory("StudentDashboardStatsFactory", function () {
  var factory = {};

  factory.calculateCGPA = function (percentage) {
    return (percentage / 9.5).toFixed(2);
  };

  factory.calculateOverallGrade = function (percentage) {
    var overallGrade = "";
    if (percentage >= 90 && percentage <= 100) {
      overallGrade = "A+";
    } else if (percentage >= 80 && percentage < 90) {
      overallGrade = "A";
    } else if (percentage >= 70 && percentage < 80) {
      overallGrade = "B+";
    } else if (percentage >= 60 && percentage < 70) {
      overallGrade = "B";
    } else if (percentage >= 50 && percentage < 60) {
      overallGrade = "C";
    } else if (percentage >= 40 && percentage < 50) {
      overallGrade = "D";
    } else if (percentage < 30) {
      overallGrade = "F";
    }
    return overallGrade;
  };

  factory.calculateSubjectPercentage = function (subjectGrades) {
    var result = {};
    for (var i = 0; i < subjectGrades.length; i++) {
      var subject = subjectGrades[i];
      switch (i) {
        case 0:
          result.subject1Name = subject.subjectName;
          result.subject1Percentage = subject.percentage;
          break;
        case 1:
          result.subject2Name = subject.subjectName;
          result.subject2Percentage = subject.percentage;
          break;
        case 2:
          result.subject3Name = subject.subjectName;
          result.subject3Percentage = subject.percentage;
          break;
        case 3:
          result.subject4Name = subject.subjectName;
          result.subject4Percentage = subject.percentage;
          break;
        case 4:
          result.subject5Name = subject.subjectName;
          result.subject5Percentage = subject.percentage;
          break;
        default:
          console.log("Invalid subject index");
      }
    }
    return result;
  };

  return factory;
});

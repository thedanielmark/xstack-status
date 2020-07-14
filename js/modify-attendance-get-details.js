// hide error divs
document.getElementById("modifyAttendanceFormContainer").style.display = "none";
document.getElementById("modifyAttendanceFormLoader").style.display = "none";

var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
var subCode_dept_sem = localStorage.subCode_dept_sem;
$.ajax({
  type: "POST",
  url: "https://weareeverywhere.in/get-current-datetime-day.php",
  datatype: "html",
  data: {
    username: email,
    auth_token: auth_token
  },
  success: function (response) {
    var parsedResponse = JSON.parse(response);
    //console.log(parsedResponse);
    document.getElementById("modifyAttendanceDateInput").value = parsedResponse.displaydate;
  },
  error: function (error) { }
});

// to get first hour subject
$.ajax({
  type: "POST",
  url: "https://weareeverywhere.in/modify-attendance.php",
  datatype: "html",
  data: {
    username: email,
    auth_token: auth_token,
    hour: 1
  },
  success: function (response) {
    var parsedResponse = JSON.parse(response);
    console.log(parsedResponse);
    if (parsedResponse === "invalid-auth-token") {
      // handle auth error
      setTimeout(function () {
        localStorage.clear();
        window.location.reload();
      }, 1000);
    }
    else if (parsedResponse === "no-class" || parsedResponse === "not-taken") {
      document.getElementById("modifyAttendanceFormSecondHalf").classList.add("d-none");
      document.getElementById("modifyAttendanceFormContainerLoader").classList.add("d-none");
      document.getElementById("modifyAttendanceFormContainer").style.display = "block";
      document.getElementById("modifyAttendanceFormButton").setAttribute("disabled", "disabled");
    }
    else {
      document.getElementById("modifyAttendanceFormButton").removeAttribute("disabled", "disabled");
      document.getElementById("modifyAttendanceFormSecondHalf").classList.remove("d-none");
      document.getElementById("modifyAttendanceError").classList.add("d-none");
      document.getElementById("modifyAttendanceYearInput").value = parsedResponse.year;
      document.getElementById("modifyAttendanceSemesterInput").value = parsedResponse.semester;
      // get department
      if (parsedResponse.department === "dit") {
        var department = "Information Technology";
      }
      if (parsedResponse.department === "dcse") {
        var department = "Computer Science";
      }
      if (parsedResponse.department === "dece") {
        var department = "Electronics and Communication";
      }
      if (parsedResponse.department === "deee") {
        var department = "Eelctronics and Electrical";
      }
      if (parsedResponse.department === "dmea") {
        var department = "Mechanical Engineering A";
      }
      if (parsedResponse.department === "dmeb") {
        var department = "Mechanical Engineering B";
      }
      document.getElementById("modifyAttendanceDepartmentInput").value = department;
      document.getElementById("modifyAttendanceSubjectInput").value = parsedResponse.subject_name;
      // store values in localStorage
      localStorage.subCode_dept_sem = parsedResponse.subCode_dept_sem;
      localStorage.required_timestamp = parsedResponse.required_timestamp;
      document.getElementById("modifyAttendanceFormContainerLoader").classList.add("d-none");
      document.getElementById("modifyAttendanceFormContainer").style.display = "block";
    }
  },
  error: function (error) { }
});
// function for hour change
function getHourDetails(hour) {
  console.log("function called with hour " + hour);
  // get email from localStorage
  var email = localStorage.enteredEmail;
  var auth_token = localStorage.auth_token;
  $.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/modify-attendance.php",
    datatype: "html",
    data: {
      username: email,
      auth_token: auth_token,
      hour: hour
    },
    success: function (response) {
      var parsedResponse = JSON.parse(response);
      console.log(parsedResponse);
      if (parsedResponse === "invalid-auth-token") {
        // handle auth error
        setTimeout(function () {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
      else if (parsedResponse === "no-class" || parsedResponse === "not-taken") {
        document.getElementById("modifyAttendanceFormSecondHalf").classList.add("d-none");
        document.getElementById("modifyAttendanceError").classList.remove("d-none");
        document.getElementById("modifyAttendanceFormButton").setAttribute("disabled", "disabled");
      }
      else {
        document.getElementById("modifyAttendanceFormButton").removeAttribute("disabled", "disabled");
        document.getElementById("modifyAttendanceFormSecondHalf").classList.remove("d-none");
        document.getElementById("modifyAttendanceError").classList.add("d-none");
        document.getElementById("modifyAttendanceYearInput").value = parsedResponse.year;
        document.getElementById("modifyAttendanceSemesterInput").value = parsedResponse.semester;
        // get department
        if (parsedResponse.department === "dit") {
          var department = "Information Technology";
        }
        if (parsedResponse.department === "dcse") {
          var department = "Computer Science";
        }
        if (parsedResponse.department === "dece") {
          var department = "Electronics and Communication";
        }
        if (parsedResponse.department === "deee") {
          var department = "Eelctronics and Electrical";
        }
        if (parsedResponse.department === "dmea") {
          var department = "Mechanical Engineering A";
        }
        if (parsedResponse.department === "dmeb") {
          var department = "Mechanical Engineering B";
        }
        document.getElementById("modifyAttendanceDepartmentInput").value = department;
        document.getElementById("modifyAttendanceSubjectInput").value = parsedResponse.subject_name;
        // store values in localStorage
        localStorage.subCode_dept_sem = parsedResponse.subCode_dept_sem;
        localStorage.required_timestamp = parsedResponse.required_timestamp;
        document.getElementById("modifyAttendanceFormContainerLoader").classList.add("d-none");
        document.getElementById("modifyAttendanceFormContainer").style.display = "block";
      }
    },
    error: function (error) { }
  });
}

// dept and sem form
var modifyAttendanceForm = document.querySelector("#modifyAttendanceForm");
modifyAttendanceForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("modifyAttendanceFormLoader").style.display = "block";
  document.getElementById("modifyAttendanceFormButton").setAttribute("disabled", "disabled");
  window.location.replace("modify-attendance-page-list.php");
});

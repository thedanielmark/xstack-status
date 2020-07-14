// hiding error and loader
document.getElementById("takeAttendanceContainerError").style.display = "none";
document.getElementById("takeAttendanceContainer").style.display = "none";
document.getElementById("takeAttendanceError").style.display = "none";
document.getElementById("takeAttendancePageLoader").style.display = "block";
document.getElementById("takeAttendanceFormLoader").style.display = "none";

// get email from localStorage
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
$.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/get-attendance-details.php",
    datatype: "html",
    data: {
        username: email,
        auth_token: auth_token
    },
    success: function (response) {
        var parsedResponse = JSON.parse(response);
        console.log(parsedResponse);
        if (parsedResponse === "invalid-auth-or-access") {
            // handle auth error
            localStorage.clear();
            window.location.reload();
        }
        else if(parsedResponse === "no-class") {
            document.getElementById("takeAttendancePageLoader").style.display = "none";
            document.getElementById("takeAttendanceContainer").style.display = "none";
            document.getElementById("takeAttendanceContainerError").style.display = "block";
            document.getElementById("takeAttendanceContainer").style.display = "none";
        }
        else {
            console.log(parsedResponse);
            // success
            document.getElementById("takeAttendancePageLoader").style.display = "none";
            document.getElementById("takeAttendanceContainerError").style.display = "none";
            document.getElementById("takeAttendanceContainer").style.display = "block";
            document.getElementById("takeAttendanceDateInput").value = parsedResponse.datetime;
            localStorage.datetime_column = parsedResponse.datetime_column;

            // get department
            if (parsedResponse.semester === "1" || parsedResponse.semester === "2") {
                var year = "I";
            }
            if (parsedResponse.semester === "3" || parsedResponse.semester === "4") {
                var year = "II";
            }
            if (parsedResponse.semester === "5" || parsedResponse.semester === "6") {
                var year = "III";
            }
            if (parsedResponse.semester === "7" || parsedResponse.semester === "8") {
                var year = "IV";
            }
            document.getElementById("takeAttendanceYearInput").value = year;

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
            document.getElementById("takeAttendanceDepartmentInput").value = department;
            document.getElementById("takeAttendanceSemesterInput").value = parsedResponse.semester;
            document.getElementById("takeAttendanceSubjectInput").value = parsedResponse.subject_name;

            // get hours
            if (parsedResponse.hour === "1") {
                document.getElementById("hour1").classList.add("active");
            }
            if (parsedResponse.hour === "2") {
                document.getElementById("hour2").classList.add("active");
            }
            if (parsedResponse.hour === "3") {
                document.getElementById("hour3").classList.add("active");
            }
            if (parsedResponse.hour === "4") {
                document.getElementById("hour4").classList.add("active");
            }
            if (parsedResponse.hour === "5") {
                document.getElementById("hour5").classList.add("active");
            }
            if (parsedResponse.hour === "6") {
                document.getElementById("hour6").classList.add("active");
            }
            if (parsedResponse.hour === "7") {
                document.getElementById("hour7").classList.add("active");
            }
            if (parsedResponse.hour === "8") {
                document.getElementById("hour8").classList.add("active");
            }

            localStorage.subCode_dept_sem = parsedResponse.subCode_dept_sem;

        }
    },
    error: function (error) { }
});

function showHourSelectorFormError(error) {
    var div = document.getElementById("takeAttendanceError");
    div.style.display = "block";
    div.innerHTML = error;
}

function hideHourSelectorFormError(error) {
    var div = document.getElementById("takeAttendanceError");
    div.style.display = "none";
}

// listen for "submit" click
var takeAttendanceForm = document.querySelector("#takeAttendanceForm");
takeAttendanceForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("takeAttendanceFormLoader").style.display = "block";
  document.getElementById("takeAttendanceFormButton").setAttribute("disabled", "disabled");
  window.location.replace("take-attendance-page-cards.php");
});
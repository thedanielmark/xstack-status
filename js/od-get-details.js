// hide error divs
//document.getElementById("odFormContainer").style.display = "none";
document.getElementById("odFormLoader").style.display = "none";
document.getElementById("odFormContainerLoader").style.display = "none";

document.getElementById("departmentInput").value = localStorage.department;

$('#datepicker-popup').datepicker({
    format: "yyyy-mm-dd - DD"
});

var finalResponse = [];
var workingResponse = [];

var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
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
        var dateFromResponse = parsedResponse.displaydate;
        var date = dateFromResponse.substring(0, 10);
        localStorage.date = date;
        document.getElementById("dateInput").value = parsedResponse.displaydate;
    },
    error: function (error) { }
});


// ajax call to get default values
var departmentTemp = localStorage.department;
if (departmentTemp === "Information Technology") {
    var department = "dit";
}
if (departmentTemp === "Computer Science") {
    var department = "dcse";
}
if (departmentTemp === "Electronics and Communication") {
    var department = "dece";
}
if (departmentTemp === "Electronics and Electrical") {
    var department = "deee";
}
if (departmentTemp === "Mechanical A") {
    var department = "dmea";
}
if (departmentTemp === "Mechanical B") {
    var department = "dmeb";
}

var year = $("input[name='year']:checked").val();
//var year = document.getElementById("yearInput").value;
var date = localStorage.date;
var hour = $("input[name='hour']:checked").val();

// get email from localStorage
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;

$.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/od-superuser.php",
    datatype: "html",
    data: {
        username: email,
        auth_token: auth_token,
        department: department,
        year: year,
        date: date,
        hour: hour
    },
    success: function (response) {
        // success
        var parsedResponse = JSON.parse(response);
        console.log(parsedResponse);
        if (parsedResponse === "invalid-auth-or-access") {
            // handle auth error
            localStorage.clear();
            window.location.reload();
        }
        else if (parsedResponse === "no-class") {
            document.getElementById("subjectDropdown").innerHTML = "";
            document.getElementById("subjectDropdown").classList.add("disabledDivOpacity");
            document.getElementById("takeAttendanceError").style.display = "block";
            document.getElementById("odFormButton").setAttribute("disabled", "disabled");
        }
        else {
            // success
            finalResponse = [];
            workingResponse = [];

            // copying over parsedResponse to workingResponse
            workingResponse = parsedResponse;

            for (var i in workingResponse) {
                var working_subCode_dept_sem = workingResponse[i].subCode_dept_sem;

                // checking if the subCode_dept_sem exists in finalResponse
                if (
                    finalResponse.some(
                        (finalResponse) =>
                            finalResponse.subCode_dept_sem === working_subCode_dept_sem
                    )
                ) {
                    var sourceIndex = finalResponse.findIndex(obj => obj.subCode_dept_sem == working_subCode_dept_sem);

                    // checking if the source is super
                    if (finalResponse[sourceIndex].source === "regular") {
                        console.log(finalResponse[sourceIndex], 1, workingResponse[i]);
                        finalResponse.splice(sourceIndex, 1, workingResponse[i]);
                    }
                } else {
                    finalResponse.push(workingResponse[i]);
                }
            }

            document.getElementById("subjectDropdown").innerHTML = "";

            for (var i in finalResponse) {
                var option = document.createElement("option");
                var optionTextNode = document.createTextNode(finalResponse[i].subject_name);
                option.setAttribute("data-pk", finalResponse[i].subCode_dept_sem);
                option.setAttribute("data-timestamp", finalResponse[i].required_timestamp);
                option.appendChild(optionTextNode);
                document.getElementById("subjectDropdown").appendChild(option);
            }
            // making the dropdown accessible
            document.getElementById("subjectDropdown").classList.remove("disabledDivOpacity");
            document.getElementById("takeAttendanceError").style.display = "none";
            document.getElementById("odFormButton").removeAttribute("disabled", "disabled");
        }
    },
    error: function (error) { }
});

// DETECTING CHANGES IN INPUTS
$('#odForm').on('keyup change paste', 'input', function () {

    // ajax call to get default values
    var departmentTemp = localStorage.department;
    if (departmentTemp === "Information Technology") {
        var department = "dit";
    }
    if (departmentTemp === "Computer Science") {
        var department = "dcse";
    }
    if (departmentTemp === "Electronics and Communication") {
        var department = "dece";
    }
    if (departmentTemp === "Electronics and Electrical") {
        var department = "deee";
    }
    if (departmentTemp === "Mechanical A") {
        var department = "dmea";
    }
    if (departmentTemp === "Mechanical B") {
        var department = "dmeb";
    }

    var year = $("input[name='year']:checked").val();
    //var year = document.getElementById("yearInput").value;
    var dateTemp = document.getElementById("dateInput").value;
    var date = dateTemp.substring(0, 10);
    var hour = $("input[name='hour']:checked").val();

    // get email from localStorage
    var email = localStorage.enteredEmail;
    var auth_token = localStorage.auth_token

    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/od-superuser.php",
        datatype: "html",
        data: {
            username: email,
            auth_token: auth_token,
            department: department,
            year: year,
            date: date,
            hour: hour
        },
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            console.log(parsedResponse);
            if (parsedResponse === "invalid-auth-or-access") {
                // handle auth error
                localStorage.clear();
                window.location.reload();
            }
            else if (parsedResponse === "no-class") {
                document.getElementById("subjectDropdown").innerHTML = "";
                document.getElementById("subjectDropdown").classList.add("disabledDivOpacity");
                document.getElementById("takeAttendanceError").style.display = "block";
                document.getElementById("odFormButton").setAttribute("disabled", "disabled");
            }
            else {
                // success
                finalResponse = [];
                workingResponse = [];

                // copying over parsedResponse to workingResponse
                workingResponse = parsedResponse;

                for (var i in workingResponse) {
                    var working_subCode_dept_sem = workingResponse[i].subCode_dept_sem;

                    // checking if the subCode_dept_sem exists in finalResponse
                    if (
                        finalResponse.some(
                            (finalResponse) =>
                                finalResponse.subCode_dept_sem === working_subCode_dept_sem
                        )
                    ) {
                        var sourceIndex = finalResponse.findIndex(obj => obj.subCode_dept_sem == working_subCode_dept_sem);

                        // checking if the source is super
                        if (finalResponse[sourceIndex].source === "regular") {
                            console.log(finalResponse[sourceIndex], 1, workingResponse[i]);
                            finalResponse.splice(sourceIndex, 1, workingResponse[i]);
                        }
                    } else {
                        finalResponse.push(workingResponse[i]);
                    }
                }

                document.getElementById("subjectDropdown").innerHTML = "";

                for (var i in finalResponse) {
                    var option = document.createElement("option");
                    var optionTextNode = document.createTextNode(finalResponse[i].subject_name);
                    option.setAttribute("data-pk", finalResponse[i].subCode_dept_sem);
                    option.setAttribute("data-timestamp", finalResponse[i].required_timestamp);
                    option.appendChild(optionTextNode);
                    document.getElementById("subjectDropdown").appendChild(option);
                }
                // making the dropdown accessible
                document.getElementById("subjectDropdown").classList.remove("disabledDivOpacity");
                document.getElementById("takeAttendanceError").style.display = "none";
                document.getElementById("odFormButton").removeAttribute("disabled", "disabled");
            }
        },
        error: function (error) { }
    });
});


// LISTEN FOR FORM SUBMISSION
var odForm = document.querySelector("#odForm");
odForm.addEventListener("submit", e => {
    e.preventDefault();

    document.getElementById("odFormLoader").style.display = "block";
    document.getElementById("odFormButton").setAttribute("disabled", "disabled");

    var select = document.getElementById("subjectDropdown");
    localStorage.subCode_dept_sem =  select.options[select.selectedIndex].dataset.pk;
    localStorage.required_timestamp =  select.options[select.selectedIndex].dataset.timestamp;

    window.location.replace("on-duty-page-cards.php");
});
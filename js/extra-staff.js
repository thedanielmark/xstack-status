// hide error and loading div
document.getElementById("extrasFormLoader").style.display = "none";

// getting list of staff from default dropdown value
// AJAX to get list
// get email from localStorage
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
$.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/get-staff-list-by-department.php",
    datatype: "html",
    data: {
        username: email,
        auth_token: auth_token,
        department: "Information Technology"
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
        else {
            // success
            for (var i in parsedResponse) {
                // print each response to option
                var option = document.createElement("option");
                option.setAttribute("value", parsedResponse[i].username);

                // create textnode to hold each name
                var staffNameTextNode = document.createTextNode(parsedResponse[i].full_name);

                // assign options to dropdown
                option.appendChild(staffNameTextNode);
                document.getElementById("extrasFormStaffName").appendChild(option);
            }

            var staffName = $("#extrasFormStaffName :selected").text();
            localStorage.staffName = staffName;
        }
    },
    error: function (error) { }
});


// listen for dropdown list changes
$("#extrasFormStaffDepartment").change(function () {
    // clear dropdown list
    document.getElementById("extrasFormStaffName").innerHTML = "";
    // AJAX to get list
    var department = document.getElementById("extrasFormStaffDepartment").value;
    // get email from localStorage
    var email = localStorage.enteredEmail;
    var auth_token = localStorage.auth_token;
    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/get-staff-list-by-department.php",
        datatype: "html",
        data: {
            username: email,
            auth_token: auth_token,
            department: department
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
            else {
                // success
                for (var i in parsedResponse) {
                    // print each response to option
                    var option = document.createElement("option");
                    option.setAttribute("value", parsedResponse[i].username);

                    // create textnode to hold each name
                    var staffNameTextNode = document.createTextNode(parsedResponse[i].full_name);

                    // assign options to dropdown
                    option.appendChild(staffNameTextNode);
                    document.getElementById("extrasFormStaffName").appendChild(option);
                }
                console.log($("#extrasFormStaffName :selected").text());
                var staffName = $("#extrasFormStaffName :selected").text();
                localStorage.staffName = staffName;
            }
        },
        error: function (error) { }
    });
});

$("#extrasFormStaffName").change(function () {
    var staffName = $("#extrasFormStaffName :selected").text();
    localStorage.staffName = staffName;
});


// getting list of subjects from default dropdown value
// AJAX to get list
// get email from localStorage
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
$.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/get-subject-list-by-department.php",
    datatype: "html",
    data: {
        username: email,
        auth_token: auth_token,
        department: "Information Technology"
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
        else {
            // success
            for (var i in parsedResponse) {
                // print each response to option
                var option = document.createElement("option");
                option.setAttribute("value", parsedResponse[i].subject_code);

                // create textnode to hold each name
                var staffNameTextNode = document.createTextNode(parsedResponse[i].subject_name);

                // assign options to dropdown
                option.appendChild(staffNameTextNode);
                document.getElementById("extrasFormSubjectNameCode").appendChild(option);
            }
            var subjectName = $("#extrasFormSubjectNameCode :selected").text();
            localStorage.subjectNameFinal = subjectName;
        }
    },
    error: function (error) { }
});



// listen for dropdown list changes
$("#extrasFormSubjectDepartment").change(function () {
    console.log("change-detected");
    // clear dropdown list
    document.getElementById("extrasFormSubjectNameCode").innerHTML = "";
    // AJAX to get list
    var department = document.getElementById("extrasFormSubjectDepartment").value;
    // get email from localStorage
    var email = localStorage.enteredEmail;
    var auth_token = localStorage.auth_token;
    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/get-subject-list-by-department.php",
        datatype: "html",
        data: {
            username: email,
            auth_token: auth_token,
            department: department
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
            else {
                // success
                for (var i in parsedResponse) {
                    // print each response to option
                    var option = document.createElement("option");
                    option.setAttribute("value", parsedResponse[i].subject_code);

                    // create textnode to hold each code
                    var staffNameTextNode = document.createTextNode(parsedResponse[i].subject_name);

                    // assign options to dropdown
                    option.appendChild(staffNameTextNode);
                    document.getElementById("extrasFormSubjectNameCode").appendChild(option);
                }
                var subjectName = $("#extrasFormSubjectNameCode :selected").text();
                localStorage.subjectNameFinal = subjectName;
            }
        },
        error: function (error) { }
    });
});
$("#extrasFormSubjectNameCode").change(function () {
    var subjectName = $("#extrasFormSubjectNameCode :selected").text();
    localStorage.subjectNameFinal = subjectName;
});


// hour selector form
var extrasForm = document.querySelector("#extrasForm");
extrasForm.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("extrasFormLoader").style.display = "block";
    document.getElementById("extrasFormNext").setAttribute("disabled", "disabled");

    var extrasFormSubjectNameCode = document.getElementById("extrasFormSubjectNameCode");
    var subjectCode = extrasFormSubjectNameCode.options[extrasFormSubjectNameCode.selectedIndex].value;
    localStorage.subjectCodeFinal = subjectCode;

    var extrasFormSubjectUsername = document.getElementById("extrasFormStaffName");
    var staffUsername = extrasFormSubjectUsername.options[extrasFormSubjectUsername.selectedIndex].value;
    localStorage.staffUsername = staffUsername;

    var department = extrasForm["extrasFormClassDepartment"].value;
    var dept = department;

    // switching value of dept
    switch (dept) {
        case "Information Technology":
            var finalTransactionDepartment = "dit";
            break;
        case "Computer Science":
            var finalTransactionDepartment = "dcse";
            break;
        case "Electronics and Communication":
            var finalTransactionDepartment = "dece";
            break;
        case "Electronics and Electrical":
            var finalTransactionDepartment = "deee";
            break;
        case "Mechanical A":
            var finalTransactionDepartment = "dmea";
            break;
        case "Mechanical B":
            var finalTransactionDepartment = "dmeb";
            break;
    }

    localStorage.finalTransactionDepartment = finalTransactionDepartment;

    var semester = extrasForm["extrasFormSemester"].value;

    localStorage.extrasFormDepartment = department;
    localStorage.extrasFormSemester = semester;


    // get email from localStorage
    var email = localStorage.enteredEmail;
    var auth_token = localStorage.auth_token;
    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/assign-extra-staff.php",
        datatype: "html",
        data: {
            username: email,
            auth_token: auth_token,
            staff: localStorage.staffUsername,
            subject_name: localStorage.subjectNameFinal,
            subject_code: localStorage.subjectCodeFinal,
            department: localStorage.finalTransactionDepartment,
            semester: localStorage.extrasFormSemester,
        },
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            console.log(parsedResponse);
            if (parsedResponse === "failed") {
                // handle error
                window.location.replace("extras-page.php?popup=error");
            }
            else if (parsedResponse === "invalid-auth-or-access") {
                // handle auth error
                localStorage.clear();
                window.location.replace("home.php?redirect=extras-page.php?popup=error");
            }
            else {
                // success
                window.location.replace("extras-page.php?popup=success");
            }
        },
        error: function (error) { }
    });

});

// error functions
function showHourSelectorFormError(error) {
    document.getElementById("extrasFormError").innerHTML = error;
    document.getElementById("extrasFormError").style.display = "block";
    document.getElementById("extrasFormLoader").style.display = "none";
    document.getElementById("extrasFormNext").removeAttribute("disabled", "disabled");
}
function hideHourSelectorFormError() {
    document.getElementById("extrasFormError").style.display = "none";
}


// to check if the url has parameters
var url = window.location.href;
if (url.indexOf("?") > -1) {
    console.log("Url has params");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const popup = urlParams.get('popup');
    if (popup === "success") {
        // toast here
        showToastPosition('Done!', 'You have successfully assigned the staff to the class!', 'bottom-right', 'success');
    }
    if (popup === "error") {
        // toast here
        showToastPosition('Oops!', 'That did\'t work', 'bottom-right', 'error');
    }
}
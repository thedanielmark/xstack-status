// hide error divs
document.getElementById("modifyAttendanceFormLoader").style.display = "none";
document.getElementById("modifyAttendanceFormContainer").style.displa = "none";

// get student name list and generate swiper
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
var subCode_dept_sem = localStorage.subCode_dept_sem;
var required_timestamp = localStorage.required_timestamp;
$.ajax({
  type: "POST",
  url: "https://weareeverywhere.in/get-names-modify-attendance.php",
  datatype: "html",
  data: {
    username: email,
    auth_token: auth_token,
    subCode_dept_sem: subCode_dept_sem,
    required_timestamp: required_timestamp
  },
  success: function (response) {
    var parsedResponse = JSON.parse(response);
    console.log(parsedResponse);
    if (parsedResponse === "invalid-auth-or-access") {
      // handle auth error
      localStorage.clear();
      window.location.reload();
    }
    else {
      // success | generate cards here
      for (var i in parsedResponse) {
        // create tr
        var tableRow = document.createElement("tr");

        // create td
        var registerNoCell = document.createElement("td");
        var presentButtonCell = document.createElement("td");
        var absentButtonCell = document.createElement("td");
        var odButtonCell = document.createElement("td");
        odButtonCell.setAttribute("colspan", "2");

        // adding register number textnode to cell
        var registerNoCellTextNode = document.createTextNode(parsedResponse[i].full_name);
        registerNoCell.appendChild(registerNoCellTextNode);

        var presentButtonList = document.createElement("button");
        presentButtonList.classList.add("btn", "btn-sm", "btn-success", "font-weight-bold", "mr-2", "w-100");
        presentButtonList.setAttribute("onclick", "addToAttendanceListView(" + i + "," + parsedResponse[i].register_no + ")");
        presentButtonList.setAttribute("id", "presentButtonList" + i);

        var absentButtonList = document.createElement("button");
        absentButtonList.classList.add("btn", "btn-sm", "btn-danger", "font-weight-bold", "w-100");
        absentButtonList.setAttribute("onclick", "removeFromAttendanceListView(" + i + "," + parsedResponse[i].register_no + ")");
        absentButtonList.setAttribute("id", "absentButtonList" + i);

        var odButtonList = document.createElement("button");
        odButtonList.classList.add("btn", "btn-sm", "btn-primary", "font-weight-bold", "w-100");

        tableRow.appendChild(registerNoCell);

        // setting button state based on response
        if (parsedResponse[i].status === "1") {
          presentButtonList.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

          // absent button textnode
          var absentButtonListTextNode = document.createTextNode("Absent");
          absentButtonList.appendChild(absentButtonListTextNode);

          // add buttons to td
          presentButtonCell.appendChild(presentButtonList);
          absentButtonCell.appendChild(absentButtonList);

          tableRow.appendChild(presentButtonCell);
          tableRow.appendChild(absentButtonCell);
        }
        else if (parsedResponse[i].status === "0") {
          absentButtonList.innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

          // present button textnode
          var presentButtonListTextNode = document.createTextNode("Present");
          presentButtonList.appendChild(presentButtonListTextNode);

          // add buttons to td
          presentButtonCell.appendChild(presentButtonList);
          absentButtonCell.appendChild(absentButtonList);

          tableRow.appendChild(presentButtonCell);
          tableRow.appendChild(absentButtonCell);
        }

        else {
          // present button textnode
          var odButtonListTextNode = document.createTextNode("On - Duty");
          odButtonList.appendChild(odButtonListTextNode);
          // add buttons to td
          odButtonCell.appendChild(odButtonList);
          tableRow.appendChild(odButtonCell);
        }

        document.getElementById("modifyAttendanceTableBody").appendChild(tableRow);

        var register_no = parsedResponse[i].register_no;
        var status = parsedResponse[i].status;

        // add register_no and status to array
        attendanceList.push('"' + register_no + '"' + ':' + '"' + status + '"');

      }
      // hide error divs
      document.getElementById("modifyAttendanceFormContainerLoader").style.display = "none";
      document.getElementById("modifyAttendanceFormContainer").style.display = "block";

    }
  },
  error: function (error) { }
});

// attendance list array
var attendanceList = [];

// FOR LIST VIEW

// add to list
function addToAttendanceListView(i, register_no) {
  // add to array
  var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 0 + '"');
  if (index !== -1) {
    attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 1 + '"';
  }

  var presentButtonList = document.getElementById("presentButtonList" + i);

  presentButtonList.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

  document.getElementById("absentButtonList" + i).innerHTML = 'Absent';
}

// remove from list
function removeFromAttendanceListView(i, register_no) {

  // add to array
  var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 1 + '"');
  if (index !== -1) {
    attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 0 + '"';
  }

  document.getElementById("absentButtonList" + i).innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

  document.getElementById("presentButtonList" + i).innerHTML = 'Present';
}


// listen for "submit" click
var modifyAttendanceForm = document.querySelector("#modifyAttendanceForm");
modifyAttendanceForm.addEventListener("submit", e => {
  e.preventDefault();

  // load the form
  document.getElementById("modifyAttendanceFormLoader").classList.remove("d-none");
  document.getElementById("modifyAttendanceButton").setAttribute("disabled", "disabled");

  // get email from localStorage
  var email = localStorage.enteredEmail;
  var auth_token = localStorage.auth_token;
  var required_timestamp = localStorage.required_timestamp;
  var subCode_dept_sem = localStorage.subCode_dept_sem;
  
  var attendanceListString = attendanceList.toString();
  var attendanceListJSON = "{" + attendanceListString + "}";

  console.log(email + " " + auth_token + " " + required_timestamp + " " + subCode_dept_sem + " " + attendanceListJSON);
  
  $.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/update-attendance-modify-attendance.php",
    datatype: "html",
    data: {
      username: email,
      auth_token: auth_token,
      required_timestamp: required_timestamp,
      subCode_dept_sem: subCode_dept_sem,
      status_json: attendanceListJSON
    },
    success: function (response) {
      var parsedResponse = JSON.parse(response);
      console.log(parsedResponse);
      if (parsedResponse === "invalid-auth-or-access") {
        // handle auth error
        localStorage.clear();
        window.location.reload();
      }
      else if (parsedResponse === "update-failed") {
        error = "An insertion error occurred, please try again. Error code 1046.";
        showHourSelectorFormError(error);
        setTimeout(hideHourSelectorFormError, 10000);
      }
      else if (parsedResponse === "row-already-exists") {
        error = "The hour already has an existing entry. Error code 1047.";
        showHourSelectorFormError(error);
        setTimeout(hideHourSelectorFormError, 10000);
      }
      else if (parsedResponse === "update-success") {
        // success
        document.getElementById("modifyAttendanceFormContainer").style.display = "none";
        document.getElementById("afterRollCall").classList.remove("d-none");
      }
    },
    error: function (error) { }
  });
});

function showHourSelectorFormError(error) {
  var div = document.getElementById("takeAttendanceError");
  div.innerHTML = error;
  div.style.display = "block";
  document.getElementById("modifyAttendanceFormLoader").style.display = "none";
  document.getElementById("modifyAttendanceButton").removeAttribute("disabled", "disabled");
}

function hideHourSelectorFormError(error) {
  var div = document.getElementById("takeAttendanceError");
  div.style.display = "none";
  document.getElementById("modifyAttendanceFormLoader").style.display = "none";
  document.getElementById("modifyAttendanceButton").removeAttribute("disabled", "disabled");
}
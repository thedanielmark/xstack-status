// render to-do list on page load
// getting auth details from localStorage
var username = localStorage.email;
var auth_token = localStorage.auth_token;
$.ajax({
  type: "POST",
  url: "https://weareeverywhere.in/get-to-do-list.php",
  datatype: "html",
  data: {
    username: username,
    auth_token: auth_token,
  },
  success: function (response) {
    var parsedResponse = JSON.parse(response);
    //console.log(parsedResponse);
    if (parsedResponse === "db-insert-error") {
      // failed
      console.log("db-insert-error");

    }
    else if(parsedResponse === "invalid-auth-token") {
      // failed
      console.log("invalid-auth-token");
    }
    else {
      // render elements here
      for(var i in parsedResponse) {
        // create <li>
        var li = document.createElement("li");
        // set attributes for <li>
        li.setAttribute("id", parsedResponse[i].id);

        if(parsedResponse[i].checked === "1") {
          li.classList.add("completed");
        }
        
        // create form check
        var formCheck = document.createElement("div");
        // add class to form-check div
        formCheck.classList.add("form-check");

        // create label
        var label = document.createElement("label");
        // add class to label
        label.classList.add("form-check-label");

        // create checkbox
        var check = document.createElement("input");
        // set attributes for input
        check.classList.add("checkbox");
        check.setAttribute("type", "checkbox");
        check.setAttribute("id", "check"+ parsedResponse[i].id);

        check.setAttribute("onclick", "toggleCheckToDoItem(" + parsedResponse[i].id + ")");

        if(parsedResponse[i].checked === "1") {
          check.checked = true;
        }

        // textnode to hold the message
        var textnode = document.createTextNode(parsedResponse[i].message);

        // creating input helper
        var inputHelper = document.createElement("i");
        // adding class to i
        inputHelper.classList.add("input-helper");

        // creating delete button
        var x = document.createElement("i");
        x.classList.add("remove", "mdi", "mdi-close-circle-outline");
        x.setAttribute("onclick", "deleteToDoItem(" + parsedResponse[i].id + ")");

        // adding elements to their parents starting from innermost
        label.appendChild(check);
        label.appendChild(textnode);
        label.appendChild(inputHelper);
        formCheck.appendChild(label);
        li.appendChild(formCheck);
        li.appendChild(x);
        document.getElementById("toDoList").appendChild(li);
        }

      }

  },
  error: function (error) { }
});


// delete to-do item
function deleteToDoItem(id) {
    // getting auth details from localStorage
    var username = localStorage.email;
    var auth_token = localStorage.auth_token;
    $.ajax({
      type: "POST",
      url: "https://weareeverywhere.in/delete-to-do.php",
      datatype: "html",
      data: {
        username: username,
        auth_token: auth_token,
        id: id
      },
      success: function (response) {
        var parsedResponse = JSON.parse(response);
        //console.log(parsedResponse);
        if (parsedResponse === "delete-successful") {
          // delete element
          var element = document.getElementById(id);
          element.parentNode.removeChild(element);
        }
        else {
          // failure
        }
      },
      error: function (error) { }
    });
}

// toggle check to do item
function toggleCheckToDoItem(id) {
  // get checkbox
  var check = document.getElementById("check"+id);
  //console.log(check);
  // check status of checkbox
  if (check.checked == true){
    var action = "check";
  } else {
    var action = "uncheck";
  }
  console.log("action before sending: " + action);
  // getting auth details from localStorage
  var username = localStorage.email;
  var auth_token = localStorage.auth_token;
  $.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/check-to-do.php",
    datatype: "html",
    data: {
      username: username,
      auth_token: auth_token,
      id: id,
      action: action
    },
    success: function (response) {
      var parsedResponse = JSON.parse(response);
      console.log(parsedResponse);
      if (parsedResponse === "success") {
        // check element status and set attribute'
        //console.log(action);
        if(action === "check") {
          document.getElementById(id).setAttribute("class", "completed");
        }
        else {
          document.getElementById(id).removeAttribute("class", "completed");
        }
      }
      else {
        // failure
      }
    },
    error: function (error) { }
  });
}


// listen for "submit" click
var toDoForm = document.querySelector("#toDoForm");
toDoForm.addEventListener("submit", e => {
  //console.log("submitted");
  e.preventDefault();
  //document.getElementById("loginLoading").style.display = "block";
  //document.getElementById("signInButton").setAttribute("disabled", "disabled");

  var message = document.getElementById("toDoInput").value;

  // getting auth details from localStorage
  var username = localStorage.email;
  var auth_token = localStorage.auth_token;
  $.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/create-to-do.php",
    datatype: "html",
    data: {
      username: username,
      auth_token: auth_token,
      message: message
    },
    success: function (response) {
      var parsedResponse = JSON.parse(response);
      //console.log(parsedResponse);
      if (parsedResponse != "db-insert-error" || parsedResponse != "invalid-auth-token") {
        //console.log(parsedResponse);
        // clear the input
        document.getElementById("toDoInput").value = "";
        // add new element here
        // create <li>
        var li = document.createElement("li");
        // set attributes for <li>
        li.setAttribute("id", parsedResponse[0].id);

        if(parsedResponse[0].checked === "1") {
          li.classList.add("completed");
        }
        
        // create form check
        var formCheck = document.createElement("div");
        // add class to form-check div
        formCheck.classList.add("form-check");

        // create label
        var label = document.createElement("label");
        // add class to label
        label.classList.add("form-check-label");

        // create checkbox
        var check = document.createElement("input");
        // set attributes for input
        check.classList.add("checkbox");
        check.setAttribute("type", "checkbox");
        check.setAttribute("id", "check"+ parsedResponse[0].id);

        check.setAttribute("onclick", "toggleCheckToDoItem(" + parsedResponse[0].id + ")");

        if(parsedResponse[0].checked === "1") {
          check.checked = true;
        }

        // textnode to hold the message
        var textnode = document.createTextNode(parsedResponse[0].message);

        // creating input helper
        var inputHelper = document.createElement("i");
        // adding class to i
        inputHelper.classList.add("input-helper");

        // creating delete button
        var x = document.createElement("i");
        x.classList.add("remove", "mdi", "mdi-close-circle-outline");
        x.setAttribute("onclick", "deleteToDoItem(" + parsedResponse[0].id + ")");

        // adding elements to their parents starting from innermost
        label.appendChild(check);
        label.appendChild(textnode);
        label.appendChild(inputHelper);
        formCheck.appendChild(label);
        li.appendChild(formCheck);
        li.appendChild(x);
        var ul = document.getElementById("toDoList");
        ul.prepend(li);
      }
      else {
        // failure
      }
    },
    error: function (error) { }
  });

});
// hide loader and error
document.getElementById("formLoader").style.display = "none";
document.getElementById("passwordError").style.display = "none";


// listen for "submit" click
var changePasswordForm = document.querySelector("#changePasswordForm");
changePasswordForm.addEventListener("submit", e => {
  console.log("submitted");
  e.preventDefault();
  document.getElementById("formLoader").style.display = "block";
  document.getElementById("changePasswordButton").setAttribute("disabled", "disabled");

  var newPassword = changePasswordForm["newPassword"].value;
  var confirmPassword = changePasswordForm["confirmPassword"].value;
  var oldPassword = changePasswordForm["oldPassword"].value;

  if(newPassword != confirmPassword) {
    // show error
    document.getElementById("passwordError").style.display = "block";
    document.getElementById("formLoader").style.display = "none";
    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
  }

  else {
      // get email from localStorage
        var email = localStorage.enteredEmail;
        localStorage.email = email;
        $.ajax({
            type: "POST",
            url: "https://weareeverywhere.in/reset-password.php",
            datatype: "html",
            data: {
            username: email,
            password: oldPassword,
            newPassword: newPassword
            },
            success: function(response) {
                var parsedResponse = JSON.parse(response);
                console.log(response);
                if(parsedResponse === "invalid-password") {
                    // handle error
                    console.log("invalid-pass");
                    document.getElementById("passwordError").innerHTML = "Your current password is wrong.";
                    document.getElementById("passwordError").style.display = "block";
                    document.getElementById("formLoader").style.display = "none";
                    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
                }
                else if(parsedResponse === "password-update-error") {
                    // handle error
                    console.log("password-update-error");
                    document.getElementById("passwordError").innerHTML = "Sorry, there was an error updating your password. Please try again later.";
                    document.getElementById("passwordError").style.display = "block";
                    document.getElementById("formLoader").style.display = "none";
                    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
                }
                else {
                    localStorage.full_name = parsedResponse.full_name;
                    localStorage.auth_token = parsedResponse.auth_token;
                    localStorage.department = parsedResponse.department;
                    localStorage.picture_url = parsedResponse.picture_url;
                    console.log("Token from login: " + parsedResponse.auth_token);
                    logout();
                    console.log("Logged out");
                }
            },
            error: function(error) {}
        });
    }

});
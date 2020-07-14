// hiding error and loader divs
document.getElementById("newPasswordError").style.display = "none";
document.getElementById("newPasswordLoader").style.display = "none";

// getting URL parameters
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get("username")
console.log(username);

const forgotPasswordToken = urlParams.get("ygieyrtgbs7rse7rtgegie7gt32w420ty978ykhgb979fvhser7brhowsi7rhf9w4ty3987tbw97gw")
console.log(forgotPasswordToken);

// listen for "send link" click
var newPasswordForm = document.querySelector("#newPasswordForm");

newPasswordForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("newPasswordLoader").style.display = "block";
  document.getElementById("changePasswordButton").setAttribute("disabled", "disabled");

  var password = newPasswordForm["password"].value;
  var confirmPassword = newPasswordForm["confirmPassword"].value;

  if(password === "" || confirmPassword === "") {
    // show error
    document.getElementById("newPasswordError").style.display = "block";
    document.getElementById("newPasswordLoader").style.display = "none";
    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
  }

  else if(password != confirmPassword) {
    // show error
    document.getElementById("newPasswordError").innerHTML = "Passwords do not match";
    document.getElementById("newPasswordError").style.display = "block";
    document.getElementById("newPasswordLoader").style.display = "none";
    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
  }

  else {
        $.ajax({
            type: "POST",
            url: "https://weareeverywhere.in/reset-forgot-password.php",
            datatype: "html",
            data: {
            username: username,
            newPassword: password,
            forgotPasswordToken: forgotPasswordToken
            },
            success: function(response) {
                console.log(response);
                var parsedResponse = JSON.parse(response);
                if(parsedResponse.auth_token === "") {
                    // handle error
                    document.getElementById("newPasswordError").innerHTML = "There was a problem updating your password. Please try again.";
                    document.getElementById("newPasswordError").style.display = "block";
                    document.getElementById("newPasswordLoader").style.display = "none";
                    document.getElementById("changePasswordButton").removeAttribute("disabled", "disabled");
                }
                else {
                    localStorage.email = parsedResponse.username;
                    localStorage.full_name = parsedResponse.full_name;
                    localStorage.auth_token = parsedResponse.auth_token;
                    localStorage.department = parsedResponse.department;
                    localStorage.picture_url = parsedResponse.picture_url;

                    window.location.replace("https://weareeverywhere.in/passwordless-login-auth.php?username=" + localStorage.email + "&ygieyrtgbs7rse7rtgegie7gt32w420ty978ykhgb979fvhser7brhowsi7rhf9w4ty3987tbw97gw=" + localStorage.auth_token);
                }
            },
            error: function(error) {}
        });
    }

});
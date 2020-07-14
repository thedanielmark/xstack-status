// hide error divs
document.getElementById("emailError").style.display = "none";
document.getElementById("additionalLoginEmailError").style.display = "none";
document.getElementById("loginLoading").style.display = "none";
document.getElementById("sendLinkLoader").style.display = "none";
document.getElementById("passwordError").style.display = "none";
document.getElementById("forgotPasswordError").style.display = "none";
document.getElementById("forgotPasswordLoader").style.display = "none";

// autofocus email input
document.getElementById("email").focus();


// listen for "next" click
var loginNext = document.querySelector("#loginNext");
loginNext.addEventListener("submit", e => {
  e.preventDefault();

  var enteredEmail = loginNext["email"].value;

  if(enteredEmail === "") {
    // show error
    document.getElementById("emailError").style.display = "block";
  }

  else {
    var enteredEmail = loginNext["email"].value + "@licet.ac.in";
    localStorage.enteredEmail = enteredEmail;
    document.getElementById("loginEmailContainer").innerHTML = enteredEmail;
    $("#carouselExampleControls").carousel("next");
    // autofocus password input
    setTimeout(function(){document.getElementById("password").focus()}, 1000);
  }

});

// listen for "submit" click
var loginSubmit = document.querySelector("#loginSubmit");
loginSubmit.addEventListener("submit", e => {
  console.log("submitted");
  e.preventDefault();
  document.getElementById("loginLoading").style.display = "block";
  document.getElementById("signInButton").setAttribute("disabled", "disabled");

  var enteredPassword = loginSubmit["password"].value;

  if(enteredPassword === "") {
    // show error
    document.getElementById("passwordError").style.display = "block";
  }

  else {
      // get email from localStorage
        var email = localStorage.enteredEmail;
        localStorage.email = email;
        $.ajax({
            type: "POST",
            url: "https://weareeverywhere.in/login.php",
            datatype: "html",
            data: {
            username: email,
            password: enteredPassword
            },
            success: function(response) {
                var parsedResponse = JSON.parse(response);
                console.log(response);
                if(parsedResponse === "invalid-password") {
                    // handle error
                    console.log("invalid-pass");
                    document.getElementById("passwordError").style.display = "block";
                    document.getElementById("loginLoading").style.display = "none";
                    document.getElementById("signInButton").removeAttribute("disabled", "disabled");
                }
                else {
                    localStorage.full_name = parsedResponse.full_name;
                    localStorage.auth_token = parsedResponse.auth_token;
                    localStorage.department = parsedResponse.department;
                    localStorage.picture_url = parsedResponse.picture_url;

                    // to check if the url has parameters
                    var url = window.location.href;
                    if (url.indexOf("?") > -1) {
                      console.log("Url has params");
                      const queryString = window.location.search;
                      const urlParams = new URLSearchParams(queryString);
                      const pageName = urlParams.get('redirect');
                      window.location.replace(pageName);
                    }
                    else {
                      console.log("no params");
                      window.location.replace("home.php");
                    }
                }
            },
            error: function(error) {}
        });
    }

});


// for additional login
// listen for "submit" click
var additionalLoginSubmit = document.querySelector("#additionalLoginSubmit");

additionalLoginSubmit.addEventListener("submit", e => {
  e.preventDefault();
  console.log("submitted");
  document.getElementById("sendLinkLoader").style.display = "block";
  document.getElementById("sendLinkButton").setAttribute("disabled", "disabled");

  var additionalEmail = additionalLoginSubmit["additionalEmail"].value;

  if(additionalEmail === "") {
    // show error
    document.getElementById("additionalLoginEmailError").style.display = "block";
  }

  else {
      // construct email
        var email = additionalEmail + "@licet.ac.in";
        localStorage.email = email;
        console.log(email);
        $.ajax({
            type: "POST",
            url: "https://weareeverywhere.in/passwordless-login.php",
            datatype: "html",
            data: {
            username: email
            },
            success: function(response) {
                var parsedResponse = JSON.parse(response);
                console.log(response);
                if(parsedResponse === "mail-success") {
                    // mail successfully sent so redirect to gmail
                    window.location.replace("https://mail.google.com");
                }
                else if(parsedResponse === "invalid-email"){
                    document.getElementById("additionalLoginEmailError").style.display = "block";
                    document.getElementById("sendLinkLoader").style.display = "none";
                    document.getElementById("sendLinkButton").removeAttribute("disabled", "disabled");
                }
                else {
                    // handle error
                    console.log("mail-fail");
                    document.getElementById("additionalLoginEmailError").innerHTML = "There was a problem sending an email. Please try a different sign in method.";
                    document.getElementById("additionalLoginEmailError").style.display = "block";
                    document.getElementById("sendLinkLoader").style.display = "none";
                    document.getElementById("sendLinkButton").removeAttribute("disabled", "disabled");
                }
            },
            error: function(error) {}
        });
    }

});


// forgot password
// listen for "send link" click
var forgotPasswordForm = document.querySelector("#forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("forgotPasswordLoader").style.display = "block";
  document.getElementById("forgotPasswordSendMailButton").setAttribute("disabled", "disabled");

  var forgotPasswordEmail = forgotPasswordForm["forgotPasswordEmail"].value;

  if(forgotPasswordEmail === "") {
    // show error
    document.getElementById("forgotPasswordError").style.display = "block";
  }

  else {
      // construct email
        var email = forgotPasswordEmail + "@licet.ac.in";
        localStorage.email = email;
        console.log(email);
        $.ajax({
            type: "POST",
            url: "https://weareeverywhere.in/forgot-password.php",
            datatype: "html",
            data: {
            username: email
            },
            success: function(response) {
                var parsedResponse = JSON.parse(response);
                console.log(response);
                if(parsedResponse === "mail-success") {
                    // mail successfully sent so redirect to gmail
                    window.location.replace("https://mail.google.com");
                }
                else {
                    // handle error
                    document.getElementById("forgotPasswordError").style.display = "block";
                    document.getElementById("forgotPasswordLoader").style.display = "none";
                    document.getElementById("forgotPasswordSendMailButton").removeAttribute("disabled", "disabled");
                }
            },
            error: function(error) {}
        });
    }

});
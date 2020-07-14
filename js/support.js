// listen for "submit" click
var supportForm = document.querySelector("#supportForm");
supportForm.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("supportFormLoader").classList.remove("d-none");
    document.getElementById("supportFormButton").setAttribute("disabled", "disabled");

    var type = supportForm["type"].value;
    var category = supportForm["category"].value;
    var subject = supportForm["subject"].value;
    var description = supportForm["description"].value;

    // get email from localStorage
    // get email from localStorage
    var email = localStorage.enteredEmail;
    var auth_token = localStorage.auth_token;
    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/create-support-ticket.php",
        datatype: "html",
        data: {
            username: email,
            auth_token: auth_token,
            type: type,
            category: category,
            subject: subject,
            description: description
        },
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            console.log(response);
            if (parsedResponse === "invalid-auth-or-user") {
                // handle error
                document.getElementById("supportFormError").innerHTML = "Invalid user. Redirecting you to the login page.";
                document.getElementById("supportFormError").style.display = "block";
                document.getElementById("supportFormLoader").style.display = "none";
                document.getElementById("supportFormButton").removeAttribute("disabled", "disabled");
                setTimeout(() => {
                    localStorage.clear();
                    window.location.reload();
                }, 5000);
            }
            else if (parsedResponse === "mail-fail") {
                // handle error
                window.location.replace("support.php?popup=error");
            }
            else if (parsedResponse === "mail-success") {
                window.location.replace("support.php?popup=success");
            }
        },
        error: function (error) { }
    });
});

// to check if the url has parameters
var url = window.location.href;
if (url.indexOf("?") > -1) {
    console.log("Url has params");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const popup = urlParams.get('popup');
    if (popup === "success") {
        // toast here
        setTimeout(() => {
            showToastPosition('Done!', 'You have successfully created a ticket!', 'bottom-left', 'success');
        }, 500);
    }
    if (popup === "error") {
        // toast here
        setTimeout(() => {
            showToastPosition('Oops!', 'That did\'t work. Please try again.', 'bottom-left', 'error');
        }, 500);
    }
}
// getting auth details from localStorage
var username = localStorage.email;
$.ajax({
    type: "POST",
    url: "https://weareeverywhere.in/api-auth-status.php",
    datatype: "html",
    data: {
        username: username
    },
    success: function (response) {
        var parsedResponse = JSON.parse(response);
        //console.log(parsedResponse);
        if (parsedResponse === "yes") {
            // hide container error 
            document.getElementById("contentError").style.display = "none";
            // show content
            document.getElementById("mainContentContainer").classList.remove("d-none");
        }
        else {
            // failed

        }
    },
    error: function (error) { }
});

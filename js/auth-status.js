// getting auth details from localStorage
var username = localStorage.email;
var auth_token = localStorage.auth_token;
//console.log("Auth Token from Auth status: " + auth_token);

if(auth_token === "" || username === "") {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pageName = urlParams.get('page');
    //console.log(pageName);

    window.location.replace("index.html?redirect=" + pageName);
    //window.location.replace("index.html");
}
else {
    $.ajax({
        type: "POST",
        url: "https://weareeverywhere.in/auth-status.php",
        datatype: "html",
        data: {
        username: username,
        auth_token: auth_token
        },
        success: function(response) {
            var parsedResponse = JSON.parse(response);
            //console.log(parsedResponse);
            if(parsedResponse === "true") {
                // hide loader
                document.getElementById("mainPageLoader").style.display = "none";
                // show wrapper
                document.getElementById("wrapper").style.display = "block";
            }
            else {
                // clear the auth_token
                localStorage.clear();
                // redirect to index page
                var path = window.location.pathname;
                var pageName = path.split("/").pop();
                console.log(pageName);
                window.location.replace("index.html?redirect=" + pageName);
            }
        },
        error: function(error) {}
    });
}


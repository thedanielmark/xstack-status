// getting auth details from localStorage
var username = localStorage.email;
var auth_token = localStorage.auth_token;
//console.log("Auth Token from Auth status: " + auth_token);

if(auth_token == undefined || username == undefined) {
    // do nothing
}
else {
    window.location.replace("home.php");
}


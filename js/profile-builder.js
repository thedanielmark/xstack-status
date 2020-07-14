// building current user profile
document.getElementById("current-user-full-name-container").innerHTML = localStorage.full_name;
document.getElementById("current-user-department-container").innerHTML = localStorage.department;
var unformatted_picture_url = localStorage.picture_url;
var picture_url = unformatted_picture_url.replace(/\\/g, "");
document.getElementById("current-user-profile-picture").setAttribute("src", picture_url);
console.log(picture_url);
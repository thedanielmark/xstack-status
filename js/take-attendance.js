// hide error divs
document.getElementById("cardsFormContainer").style.display = "none";
document.getElementById("cardsFormContainerLoader").style.display = "block";
document.getElementById("cardsSubmitLoader").style.display = "none";

// attendance list array
var attendanceList = [];

// swiper init
var swiper = new Swiper('.blog-slider', {
  spaceBetween: 30,
  effect: 'fade',
  loop: false,
  mousewheel: {
    invert: false,
  },
  observer: true,
  observeParents: true,
  navigation: {
    nextEl: '.swiper-next',
    prevEl: '.swiper-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
});

// get student name list and generate swiper
// get email from localStorage
var email = localStorage.enteredEmail;
var auth_token = localStorage.auth_token;
var subCode_dept_sem = localStorage.subCode_dept_sem;
var datetime_column = localStorage.datetime_column;
$.ajax({
  type: "POST",
  url: "https://weareeverywhere.in/get-pk-list.php",
  datatype: "html",
  data: {
    username: email,
    auth_token: auth_token,
    subCode_dept_sem: subCode_dept_sem,
    required_timestamp: datetime_column
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
        // swiper slide div
        var swiperSlide = document.createElement("div");
        swiperSlide.classList.add("blog-slider__item", "swiper-slide");

        // image div
        var sliderImageDiv = document.createElement("div");
        sliderImageDiv.classList.add("blog-slider__img");

        // formatting picture URL
        var unformatted_picture_url = parsedResponse[i].picture_url;
        var picture_url = unformatted_picture_url.replace(/\\/g, "");

        // image
        var image = document.createElement("img");
        image.setAttribute("src", picture_url);

        // adding image to image div
        sliderImageDiv.appendChild(image);

        // slider content div
        var sliderContentDiv = document.createElement("div");
        sliderContentDiv.classList.add("blog-slider__content");

        // span to hold register number
        var span = document.createElement("span");
        span.classList.add("blog-slider__code");
        var registerNoTextNode = document.createTextNode(parsedResponse[i].register_no);
        span.appendChild(registerNoTextNode);

        // name div
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("blog-slider__title");
        var nameTextNode = document.createTextNode(parsedResponse[i].full_name);
        nameDiv.appendChild(nameTextNode);

        // div to hold sem and dept
        var semDeptContainer = document.createElement("div");
        semDeptContainer.classList.add("blog-slider__text");
        var semDeptTextNode = document.createTextNode(parsedResponse[i].semester + " " + parsedResponse[i].department);
        semDeptContainer.appendChild(semDeptTextNode);

        // create table
        var buttonsTable = document.createElement("table");
        buttonsTable.classList.add("table", "table-borderless");

        // create tr in card
        var tableRowCard = document.createElement("tr");

        // create td in card
        var presentButtonCardCell = document.createElement("td");
        var absentButtonCardCell = document.createElement("td");
        var odButtonCardCell = document.createElement("td");

        presentButtonCardCell.classList.add("p-0");
        absentButtonCardCell.classList.add("p-0");
        odButtonCardCell.classList.add("p-0");
        odButtonCardCell.setAttribute("colspan", "2");

        // present button
        var presentButton = document.createElement("a");
        presentButton.classList.add("btn", "btn-rounded", "btn-lg", "btn-success", "mt-2", "swiper-next", "font-weight-bold", "w-100");

        presentButton.setAttribute("href", "#");
        presentButton.setAttribute("onclick", "addToAttendanceListCardView(" + i + "," + parsedResponse[i].register_no + ")");
        presentButton.setAttribute("id", "presentButton" + i);

        // absent button
        var absentButton = document.createElement("a");
        absentButton.classList.add("btn", "btn-rounded", "btn-lg", "btn-danger", "mt-2", "swiper-next", "font-weight-bold", "ml-2", "w-100");
        absentButton.setAttribute("href", "#");
        absentButton.setAttribute("onclick", "removeFromAttendanceListCardView(" + i + "," + parsedResponse[i].register_no + ")");
        absentButton.setAttribute("id", "absentButton" + i);

        // od button
        var odButton = document.createElement("a");
        odButton.classList.add("btn", "btn-rounded", "btn-lg", "btn-primary", "mt-2", "swiper-next", "font-weight-bold", "w-100");
        odButton.setAttribute("href", "#");
        odButton.setAttribute("onclick", "nextCard()");

        // setting button state based on response
        if (parsedResponse[i].status === "1") {
          presentButton.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';
          var absentTextNode = document.createTextNode("Absent");
          absentButton.appendChild(absentTextNode);

          presentButtonCardCell.appendChild(presentButton);
          absentButtonCardCell.appendChild(absentButton);
          tableRowCard.appendChild(presentButtonCardCell);
          tableRowCard.appendChild(absentButtonCardCell);
        }
        else if (parsedResponse[i].status === "0") {
          var presentTextNode = document.createTextNode("Present");
          presentButton.appendChild(presentTextNode);
          absentButton.innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

          presentButtonCardCell.appendChild(presentButton);
          absentButtonCardCell.appendChild(absentButton);
          tableRowCard.appendChild(presentButtonCardCell);
          tableRowCard.appendChild(absentButtonCardCell);
        }
        else {
          var odTextNode = document.createTextNode("On - duty");
          odButton.appendChild(odTextNode);
          odButtonCardCell.appendChild(odButton);
          tableRowCard.appendChild(odButtonCardCell);
        }

        buttonsTable.appendChild(tableRowCard);

        // appending children of content div
        sliderContentDiv.appendChild(span);
        sliderContentDiv.appendChild(nameDiv);
        sliderContentDiv.appendChild(semDeptContainer);
        sliderContentDiv.appendChild(buttonsTable);

        // adding all children to the slide
        swiperSlide.appendChild(sliderImageDiv);
        swiperSlide.appendChild(sliderContentDiv);

        document.getElementById("swiperWrapper").appendChild(swiperSlide);

        // LIST VIEW

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

        document.getElementById("attendanceModalContent").appendChild(tableRow);

        var register_no = parsedResponse[i].register_no;
        var status = parsedResponse[i].status;

        // add register_no and status to array
        attendanceList.push('"' + register_no + '"' + ':' + '"' + status + '"');
      }

      // generate ending card
      var lastSlideSwiperSlide = document.createElement("div");
      lastSlideSwiperSlide.classList.add("blog-slider__item", "swiper-slide");

      // image div
      var lastSlideSliderImageDiv = document.createElement("div");
      lastSlideSliderImageDiv.classList.add("blog-slider__img");

      // formatting picture URL
      var picture_url = "images/assets/people.png";

      // image
      var lastSlideImage = document.createElement("img");
      lastSlideImage.setAttribute("src", picture_url);

      // slider content div
      var lastSlideSliderContentDiv = document.createElement("div");
      lastSlideSliderContentDiv.classList.add("blog-slider__content");

      // main container for last slide
      var lastSlideMainContainer = document.createElement("div");
      lastSlideMainContainer.classList.add("container", "h-100");

      var lastSlideRow = document.createElement("div");
      lastSlideRow.classList.add("row", "align-items-center", "h-100");

      var lastSlideMX = document.createElement("div");
      lastSlideMX.classList.add("mx-auto", "text-center");

      var lastSlideTick = document.createElement("i");
      lastSlideTick.classList.add("icon-check", "text-success", "h1");

      var lastSlideH4 = document.createElement("h4");
      lastSlideH4.classList.add("mt-5", "font-weight-bold");

      var lastSlideH4TextNode = document.createTextNode("You're All Caught Up");

      var lastSlideH5 = document.createElement("h5");
      lastSlideH5.classList.add("mt-3", "text-secondary");

      var lastSlideH5TextNode = document.createTextNode("You've marked all students in this class.");

      lastSlideH4.appendChild(lastSlideH4TextNode);
      lastSlideH5.appendChild(lastSlideH5TextNode);

      lastSlideMX.appendChild(lastSlideTick);
      lastSlideMX.appendChild(lastSlideH4);
      lastSlideMX.appendChild(lastSlideH5);

      lastSlideSliderImageDiv.appendChild(lastSlideImage);

      lastSlideRow.appendChild(lastSlideMX);
      lastSlideMainContainer.appendChild(lastSlideMX);

      lastSlideSliderContentDiv.appendChild(lastSlideMainContainer);
      lastSlideSwiperSlide.appendChild(lastSlideSliderImageDiv);
      lastSlideSwiperSlide.appendChild(lastSlideSliderContentDiv);

      document.getElementById("swiperWrapper").appendChild(lastSlideSwiperSlide);

      // hide error divs
      document.getElementById("cardsFormContainerLoader").style.display = "none";
      document.getElementById("cardsFormContainer").style.display = "block";

    }
  },
  error: function (error) { }
});

// FOR CARD VIEW

// add to list
function addToAttendanceListCardView(i, register_no) {

  // present button
  var presentButton = document.getElementById("presentButton" + i);
  // check innerHTML
  if (presentButton.innerHTML === '<span class="mdi mdi-account-check text-white font-weight-bold"></span>') {
    // slide to next slide
    swiper.slideNext(500);
  }
  else {
    presentButton.innerHTML === '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

    // add to array
    var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 0 + '"');
    if (index !== -1) {
      attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 1 + '"';
    }

    presentButton.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

    var presentButtonList = document.getElementById("presentButtonList" + i);

    presentButtonList.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

    var absentButton = document.getElementById("absentButton" + i);

    absentButton.innerHTML = 'Absent';

    var absentButtonList = document.getElementById("absentButtonList" + i);

    absentButtonList.innerHTML = 'Absent';

    // slide to next slide
    swiper.slideNext(500);
  }
}

// remove from list
function removeFromAttendanceListCardView(i, register_no) {

  var absentButton = document.getElementById("absentButton" + i);

  absentButton.innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

  document.getElementById("absentButtonList" + i).innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

  document.getElementById("presentButton" + i).innerHTML = 'Present';

  document.getElementById("presentButtonList" + i).innerHTML = 'Present';

  // add to array
  var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 1 + '"');
  if (index !== -1) {
    attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 0 + '"';
  }

  // slide to next slide
  swiper.slideNext(500);
}

// FOR LIST VIEW

// add to list
function addToAttendanceListView(i, register_no) {
  // add to array
  var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 0 + '"');
  if (index !== -1) {
    attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 1 + '"';
  }

  var presentButton = document.getElementById("presentButton" + i);

  presentButton.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

  var presentButtonList = document.getElementById("presentButtonList" + i);

  presentButtonList.innerHTML = '<span class="mdi mdi-account-check text-white font-weight-bold"></span>';

  document.getElementById("absentButton" + i).innerHTML = 'Absent';
  document.getElementById("absentButtonList" + i).innerHTML = 'Absent';
}

// remove from list
function removeFromAttendanceListView(i, register_no) {

  // add to array
  var index = attendanceList.indexOf('"' + register_no + '"' + ':' + '"' + 1 + '"');
  if (index !== -1) {
    attendanceList[index] = '"' + register_no + '"' + ':' + '"' + 0 + '"';
  }

  document.getElementById("absentButton" + i).innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

  document.getElementById("absentButtonList" + i).innerHTML = '<span class="mdi mdi-account-remove text-white font-weight-bold"></span>';

  document.getElementById("presentButton" + i).innerHTML = 'Present';

  document.getElementById("presentButtonList" + i).innerHTML = 'Present';
}

// listen for "submit" click
var takeAttendanceForm = document.querySelector("#takeAttendanceForm");
takeAttendanceForm.addEventListener("submit", e => {
  e.preventDefault();

  // load the form
  document.getElementById("cardsSubmitLoader").style.display = "block";
  document.getElementById("cardsSubmitButton").setAttribute("disabled", "disabled");
  document.getElementById("cardsEditButton").setAttribute("disabled", "disabled");

  // get email from localStorage
  var email = localStorage.enteredEmail;
  var auth_token = localStorage.auth_token;
  var subCode_dept_sem = localStorage.subCode_dept_sem;

  var attendanceListString = attendanceList.toString();
  var attendanceListJSON = "{" + attendanceListString + "}";

  console.log(attendanceListJSON);

  $.ajax({
    type: "POST",
    url: "take-attendance.php",
    datatype: "html",
    data: {
      username: email,
      auth_token: auth_token,
      subCode_dept_sem: subCode_dept_sem,
      required_timestamp: localStorage.datetime_column,
      attendance_list: attendanceListJSON
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
        error = "A database error occurred. Please try again.";
        showHourSelectorFormError(error);
        setTimeout(hideHourSelectorFormError, 10000);
      }
      else if (parsedResponse === "db-fetch-error") {
        error = "A database error occurred. Please try again.";
        showHourSelectorFormError(error);
        setTimeout(hideHourSelectorFormError, 10000);
      }
      else if ("update-success") {
        // success
        document.getElementById("cardsFormContainer").style.display = "none";
        document.getElementById("afterRollCall").classList.remove("d-none");
      }
      else {
        error = "An unknown error occurred. Please try again.";
        showHourSelectorFormError(error);
        setTimeout(hideHourSelectorFormError, 10000);
      }
    },
    error: function (error) { }
  });
});

function showHourSelectorFormError(error) {
  var div = document.getElementById("takeAttendanceError");
  div.innerHTML = error;
  div.style.display = "block";
}

function hideHourSelectorFormError(error) {
  var div = document.getElementById("takeAttendanceError");
  div.style.display = "none";
}

function nextCard() {
  // slide to next slide
  swiper.slideNext(500);
}
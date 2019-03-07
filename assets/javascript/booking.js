var config = {
  apiKey: "AIzaSyAKTJreq0OZgWl8ktgzhd2FvPyYyCYhN1M",
  authDomain: "blue-lama-retreat-7a0c6.firebaseapp.com",
  databaseURL: "https://blue-lama-retreat-7a0c6.firebaseio.com",
  projectId: "blue-lama-retreat-7a0c6",
  storageBucket: "blue-lama-retreat-7a0c6.appspot.com",
  messagingSenderId: "106620423709"
};

firebase.initializeApp(config);

var database = firebase.database();

//guest info
var firstName = "";
var lastName = "";
var email = "";
var phoneNumber = "";
//booking info
var locationChoice = "";
var room = 0;
var numberOfGuest = 0;
var checkInDate = "";
var checkOutDate = "";
var comments = "";

//on submit button click
$("#submitButton").on("click", function (event) {
  console.log("submit button clicked");
  event.preventDefault();
  //guest info
  firstName = $("#firstNameInput")
    .val()
    .trim();
  lastName = $("#lastNameInput")
    .val()
    .trim();
  email = $("#emailInput")
    .val()
    .trim();
  phoneNumber = $("#phoneNumberInput")
    .val()
    .trim();
  locationChoice = $("#locationInput")
    .val()
    .trim();
  room = $("#roomInput")
    .val()
    .trim();
  numberOfGuest = $("#peopleInput")
    .val()
    .trim();
  checkInDate = $("#checkInDate")
    .val()
    .trim();
  checkOutDate = $("#checkOutDate")
    .val()
    .trim();
  comments = $("#comments")
    .val()
    .trim();

  //push to firebase
  var myUserId = firebase.auth().currentUser.uid;
  console.log("submitting booking for", myUserId);
  database.ref("bookings/" + myUserId).push({
    //guest info
    First_name: firstName,
    Last_name: lastName,
    Email: email,
    Phone_number: phoneNumber,
    // Details
    locationChoice: locationChoice,
    room: room,
    Number_Of_Guest: numberOfGuest,
    check_In_Date: checkInDate,
    check_Out_Date: checkOutDate,
    special_Request: comments
  });

  window.location = "../templates/confirmation.html";

});

// recheck
database.ref().once(
  "value",
  function (snapshot) {
    if (firebase.auth().currentUser) {
      var myUserId = firebase.auth().currentUser.uid;
      // console.log(currentUser);
      var myUserIdEmail = firebase.auth().currentUser.email;
      $("#userMessage").text("Welcome " + myUserIdEmail);

      database.ref("bookings/" + myUserId).on(
        "child_added",
        function (snapshot) {
          renderRow(snapshot);

          console.log("in here");
        },
        function (errorObject) {
          console.log("Errors handled: " + errorObject.code);
        }
      );

      database.ref("Images/" + myUserId).on(
        "child_added",
        function (snapshot) {

          renderImage(snapshot);
          console.log("in here");
        },
        function (errorObject) {
          console.log("Errors handled: " + errorObject.code);
        }
      );

    } else {
      console.log("user not logged in");
    }
  },
  function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }


);

function renderRow(snap) {
  var child = snap.val();

  var nameLi = $("<li id='list-name' class='list-group-item'>").text("Name: " + child.First_name + child.Last_name);
  var emailLi = $("<li id='emailDisplay' class='list-group-item'>").text("Email: " + child.Email);
  var phoneNumberLi = $("<li id='tripDateDisplay' class='list-group-item'>").text("Phone Number : " + child.Phone_number);
  var locationLi = $("<li id='locationDisplay' class='list-group-item'>").text("Location: " + child.locationChoice);
  var roomLi = $("<li id='roomDisplay' class='list-group-item'>").text("Rooms: " + child.room);
  var numberOfGuestLi = $("<li id='numberOfGuestDisplay' class='list-group-item'>")
  .text("Number of Guests: " + child.Number_Of_Guest);
  var checkInDateLi = $("<li id='checkInDateDisplay' class='list-group-item'>")
  .text("Check In: " + child.check_In_Date);
  var checkOutDateLi = $("<li id='checkOutDateDisplay' class='list-group-item'>").text(
    "Check Out: " + child.check_Out_Date
  );
    var specialRequestLi= $("<li id='specialRequestDisplay' class='list-group-item'>").text(
      "Special Requests: " + child.special_Request
    );
  console.log("room Number " + child.room);
  console.log("checkInDate " + child.check_In_Date);
  // var tripDateTd = $("<td id='tripDateDisplay'>").text(child.Trip_date);

  // Append the newly created table data to the table row

  $("ul").append(
    nameLi,
    emailLi,
    phoneNumberLi,
    locationLi,
    roomLi,
    numberOfGuestLi,
    checkInDateLi,
    checkOutDateLi,
    specialRequestLi,
  );
}


// function renderImage(snap) {
//   var uploadTask = firebase.storage().ref().child('/Images/' + selectedFile.name).put(selectedFile);
//   var downloadURL = uploadTask.snap.downloadURL;
//   console.log(downloadURL);
//   var profileImage = $("<img class = 'profile-image'>").attr("src", downloadURL);
//   $(".image").imageDiv.append(profileImage);

// }


$("#logOut").on("click", function () {
  console.log("I am log out");
  firebase.auth().signOut();
  window.location = "../templates/index.html";
});



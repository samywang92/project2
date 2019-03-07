// Global Variables //
var threadTarget = localStorage.getItem('thread');
var currentUser = localStorage.getItem('currentUser');
var rUser = localStorage.getItem('rUser');
var userPicture = localStorage.getItem('userPicture');
var inPrivate = false;

// On load store variables //
window.onload = function () {
    console.log("omega lul");
    console.log(threadTarget);
    console.log(currentUser);
    console.log(rUser);
    $(".section").attr("id", threadTarget);
    database = firebase.database().ref(threadTarget);
    inPrivate = localStorage.setItem("inPrivate", true);
    initiPrivateMsg();
}

// Functions to pull from firebase //
function initiPrivateMsg() {
    database.on("child_added", function (snapshot) {
        var key = snapshot.ref.key;
        if (key !== "initMessage") {
            displayMessage(snapshot);
        }
    });
}

if (localStorage.getItem(inPrivate)) {
    database.on("child_added", function (snapshot) {
        var key = snapshot.ref.key;
        if (key !== "initMessage") {
            var mytext = `<h>Message : ${snapshot.val().message}</h> <br>`;
            $(`#${threadTarget}`).append(mytext);
        }
    });
}

// Functions to send a message //
$("#send-private").on("click", function (event) {
    event.preventDefault();
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {

        newMessage();
        return false;

    }
});

function newMessage() {
    if ($("#userMessage").val() !== "") {
        //name = $("#name-input").val();
        message = $("#userMessage").val();
        console.log(message);

        var newMessage = {
            sender: currentUser,
            message: message,
            //email: chatEmail,
            picture: userPicture
        };
        console.log(newMessage);

        database.push(newMessage);
        //initiPrivateMsg();
        //trigger = false;
        $("#userMessage").val("");
    }
}

// Functions to output messages with styling by taking in a snapshot
function displayMessage(snapshot) {
    var mytext = `<h>Message : ${snapshot.val().message}</h> <br>`;
    $(`#${threadTarget}`).append(mytext);
}


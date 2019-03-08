////////PSUEDO CODE FOR INBOX.JS////////

//on windows load do a get request to get all of the current user's information via UID 
//.. might carry over from init page load of socializing check with console log
var uid = localStorage.getItem("currentUser");
var hasInbox = false;
var rUser;
var rUserPicture;
var threadName;


window.onload = function () {
    console.log(uid);
    console.log("WE HERE BOIS");
    database = firebase.database().ref(`1on1`);
    database.once("value").then(function (snapshot) {
        if (snapshot.child(uid).exists()) {
            hasInbox = true;
            createThreads();
        }
    });

}


function createThreads() {
    console.log(uid);
    console.log(hasInbox);
    if (hasInbox) {
        database = firebase.database().ref(`1on1/${uid}`);
        database.on("child_added", function (snapshot) {
            console.log("tn" + snapshot.val().threadName);
            console.log("chatwith" + snapshot.val().chatwith);
            threadName = snapshot.val().threadName;
            var chatwith = snapshot.val().chatwith;
            console.log("VOID" + chatwith);
            $.get("/api/users/" + chatwith, function (data) {
                //console.log("sql data"+data);
                rUser = data.displayName;
                rUserPicture = data.picture;
                console.log(`receiving: ${rUser} picture: ${rUserPicture}`);
                drawIcons(rUserPicture, rUser, threadName);
            });
        });
    }
}

function drawIcons(picture, userName, threadName) {
    var template = `<div class ="valign center" style="border-radius: 50%;  height: 4em; width: 4em; display:inline-block; margin-right: .5em;">
    <!-- Avatar -->
    <img class="valign center inbox-thread" src="${picture}" id="${threadName}" alt="Avatar" style="width: 100%; transform: scale(1.1);">
    <p class="valign center inbox-thread" id="${threadName}" style='margin-top: -.05em'>${userName}</p>
    </div>`;
    $(".inbox-bar").append(template);
}

$("body").on("click", ".inbox-thread", function () {
    console.log("VOID MASTER ENTERED");
    var self = this;
    $.get("/api/users/" + uid, function (data) {
        //console.log("sql data"+data);
        var target = $(self).attr('id');
        console.log(this);
        console.log("mastervoid"+target);
        var username = data.displayName;
        var userPicture = data.picture;
        localStorage.setItem('thread', target);
        localStorage.setItem('currentUser', uid);
        localStorage.setItem('name', username);
        localStorage.setItem('userPicture', userPicture);
        localStorage.setItem("inPrivate", false);
        window.location.href = '../privateChat';
    });

});

//then write to the index bar
//search through firebase to find in 1:1 to see if UID exists
//if exists create circles bases off of how many nodes there are


//need to CHANGE the sturcture of 1:1 when created to include the person the user is chatting with's UID

//then perform a get request using the person chatting with's UID
//get picture and name

//output to the circles

//create redirect or a href links to privateChat
//store current user's information in local storage
//need: 
// var threadTarget = localStorage.getItem('thread');  //this should be the parent key name
// var currentUser = localStorage.getItem('currentUser'); //pulled from firebase or it might be avail from init page
// var username = localStorage.getItem('name'); //pulled from firebase or it might be avail from init page
// var userPicture = localStorage.getItem('userPicture'); //pulled from firebase or it might be avail from init page
// var inPrivate = false;
$(document).ready(function () {
    M.AutoInit();
    //Global Variables//
    var uid = localStorage.getItem("currentUser");
    var hasInbox = false;
    var rUser;
    var rUserPicture;
    var threadName;
    var database;

    //Function for onload of inbox//
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

    //Function to create threads//
    function createThreads() {
        console.log(uid);
        console.log(hasInbox);
        if (hasInbox) {
            database = firebase.database().ref(`1on1/${uid}`);
            database.on("child_added", function (snapshot) {
                console.log("tn: " + snapshot.val().threadName);
                console.log("chatwith" + snapshot.val().chatwith);
                //threadName = snapshot.val().threadName;
                var chatwith = snapshot.val().chatwith;
                console.log("VOID" + chatwith);
                $.get("/api/users/" + chatwith, function (data) {
                    //console.log("sql data"+data);
                    rUser = data.displayName;
                    rUserPicture = data.picture;
                    console.log("tn in api call: " + snapshot.val().threadName);
                    console.log(`receiving: ${rUser} picture: ${rUserPicture}`);
                    drawIcons(rUserPicture, rUser, snapshot.val().threadName);
                });
            });
        }
    }

    //Function to draw icons//
    function drawIcons(picture, userName, threadName) {
        console.log("thread name in draw icon: "+ threadName);
        var template = `<div class ="center-align" style="border-radius: 50%;  height: 4em; width: 4em; display:inline-block; margin-right: .5em;">
    <!-- Avatar -->
    <img class="center-align inbox-thread" src="${picture}" id="${threadName}" alt="Avatar" style="width: 100%; transform: scale(1.1);">
    </div>`;
        $(".inbox-bar").append(template);
    }
    //<p class="center-align inbox-thread" id="${threadName}" style='margin-top: -.05em'>${userName}</p>

    //Function on click of an icon//
    $("body").on("click", ".inbox-thread", function () {
        console.log("VOID MASTER ENTERED");
        var self = this;
        $.get("/api/users/" + uid, function (data) {
            //console.log("sql data"+data);
            var target = $(self).attr('id');
            console.log(this);
            console.log("mastervoid" + target);
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

});
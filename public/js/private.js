$(document).ready(function () {
    M.AutoInit();
    // Global Variables //
    var threadTarget = localStorage.getItem('thread');
    var currentUser = localStorage.getItem('currentUser');
    var username = localStorage.getItem('name');
    var userPicture = localStorage.getItem('userPicture');
    var inPrivate = false;
    var dly;
    var database;

    // if (window.attachEvent) { window.attachEvent('onload', onload); }
    // else if (window.addEventListener) { window.addEventListener('load', onload, false); }
    // else { document.addEventListener('load', onload, false); }

    // $( document ).load(function() {
    //     Run code
    //     onload();
    // });
    onload();
    // On load store variables //
    function onload() {
        console.log("omega lul");
        console.log(threadTarget);
        console.log(currentUser);
        console.log(username);
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

    //this part actually might not be used but leaving for the sake of demo day and not breaking code//
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
                name: username,
                picture: userPicture
            };
            console.log(newMessage);

            database.push(newMessage);
            $("#userMessage").val("");
        }
    }

    // Functions to output messages with styling by taking in a snapshot
    function displayMessage(snapshot) {

        if (snapshot.val().sender === currentUser) {
            // console.log('they match');

            if (window.location.href === window.location.origin + "/privateChat") {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                var userMessageTemp1 = ` <div id="chat-box" class="row too-chat chatAnimateLeft ${text}">
            <div class="col s12">
                <div class="card horizontal">
                    <div class="card-content">
                        <div class="">
                            <div class="col s4 m4">
                                <div class="card-image">
                                    <img src="${snapshot.val().picture}" >
                                </div>
                            </div>
                            <div class="col s8 m8">
                                <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
                                <p>${snapshot.val().message}</p>
                            </div>
        
                        </div>
                    </div>
                </div>
            </div>
        </div>`
                $(`#${threadTarget}`).append(userMessageTemp1);

                window.scrollBy(0, 250);
                TweenLite.from('.' + text, .5, { x: 200, opacity: 0, delay: dly });
                dly += 1;
            }

        } else {
            // console.log('no match');
            if (window.location.href === window.location.origin + "/privateChat") {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                var messageTemplate1 = // ` <div id="chat-box"> <div class="row from-chat"> <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s3 m3" style= "margin-left: -1.5em; margin-right: 10px"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> <div class="col s9 m9"> <p style="color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> </div> </div> <div class="card-stacked"> <div class="fixed-action-btn"> <a class="btn-floating btn-medium red"> <i class="large material-icons">dehaze</i> </a> <ul style="margin-right: -2em;"> <li> <a class="btn-floating btn-small red"> <i class="material-icons">error</i> </a> </li> <li> <a class="btn-floating btn-small yellow darken-1"> <i class="material-icons">thumb_down</i> </a> </li> <li> <a class="btn-floating btn-small green"> <i class="material-icons">thumb_up</i> </a> </li> <li> <a class="btn-floating btn-small blue"> <i class="material-icons">textsms</i> </a> </li> </ul> </div> </div> </div> </div> </div>`
                    ` <div id="chat-box" class="chatAnimate ${text}">
            <div class="row from-chat">
                <div class="col s12">
                    <div class="card horizontal">
                        <div class="card-content">
                            <div class="">
                                <div class="col s4 m4">
                                    <div class="card-image">
                                        <img src="${snapshot.val().picture}" style="width: 100%;">
                                    </div>
                                </div>
                                <div class="col s8 m8">
                                    <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
                                    <p>${snapshot.val().message}</p>
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>`

                $(`#${threadTarget}`).append(messageTemplate1);
                TweenLite.from('.' + text, .5, { x: -200, opacity: 0, delay: dly });
                window.scrollBy(0, 250);
                dly += 1;
            }
        }

        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
            direction: 'left'
        });
        M.AutoInit();
    }

});


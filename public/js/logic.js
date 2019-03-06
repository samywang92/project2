$(document).ready(function () {
    M.AutoInit();


    /////////////// Firebase stuff /////////////
    var config = {
        apiKey: "AIzaSyCRJr6G6YJvC5nDaJgopuiXh-9qbsG8Wu0",
        authDomain: "chat-bf734.firebaseapp.com",
        databaseURL: "https://chat-bf734.firebaseio.com",
        projectId: "chat-bf734",
        storageBucket: "chat-bf734.appspot.com",
        messagingSenderId: "436211675000"
    };

    firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();


    ///////// avriables /////////////////
    var nickname;
    var avatarArr = ['../images/astronaut.png', '../images/detective.png', '../images/diver.png', '../images/RandomAnimals_brown_bear.svg'];
    var randomItem = '../images/RandomAnimals_brown_bear.svg';
    var userEmail = "thisIsAnEmail@gmaail.com";
    var stageName;
    var mysqlEmail;


    ///// chat varieable ///
    var Usersnickname;
    var UsersPicture;
    var chatEmail;
    var distLimit = 1; /// distance limit
    var mylat;
    var mylon;
    var trigger = true;
    var message = "";
    var userID;

    //////////// generate random nickname ////////////////////
    var generate = function () {
        $.ajax({
            type: 'POST',
            url: 'https://api.codetunnel.net/random-nick',
            dataType: 'json',
            data: JSON.stringify({})
        }).done(function (r) {
            // $("#generated").html(r.nickname);
            // console.log(r.nickname);
            nickname = r.nickname;
        });
    };
    generate();

    var initFB = localStorage.getItem('gotToken');
    if (initFB) {
        firebase.auth().getRedirectResult().then(function (result) {
            console.log("HELLO");

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;

            // The signed-in user info.
            var user = result.user;
            console.log(result.user);
            userEmail = user.email;
            stageName = user.displayName;
            userID = user.uid;
            console.log(user.uid);
            // checkUserBeforeCreating(result.user.email);


            var newPost = {
                actualName: result.user.displayName,
                displayName: nickname,
                email: result.user.email,
                picture: randomItem,
                userID: result.user.uid
            };
            console.log("sql" + newPost);
            submitPost(newPost);

        }).catch(function (err) {
            console.log(err)
            console.log('Failed to do');
        });
    }


    ///////////// Login //////////////////////////////////////
    $('#login-btn').click(function () {
        $('#preloader').removeClass('hide');
        $('#login-btn').addClass('hide');
        console.log('hello');

        base_provider = new firebase.auth.GoogleAuthProvider();

        var gotToken = localStorage.getItem('gotToken') || false;
        if (!gotToken) {
            localStorage.setItem('gotToken', true);
            firebase.auth().signInWithRedirect(base_provider);
        }

    })


    ///////////////    Push user info to mysql     /////////////// 
    function submitPost(Post) {
        $.post("/api/posts/", Post, function () {
            window.location.href = '../option';
        });
    }




    ///////////////////    get user info from mysql ( reffrencing through email)   /////////////////////////
    function checkUser(email) {
        // console.log('hello');
        var categoryString = email || "";
        if (categoryString) {
            categoryString = "/" + categoryString;
        }
        $.get("/api/posts" + categoryString, function (data) {
            // console.log("data Stored in mysql :", data.displayName);
            Usersnickname = data.displayName;
            UsersPicture = data.picture;
            chatEmail = data.email;
            userID = data.userID;
            $(".avator").attr("src", data.picture);
            $("#displayName").html(data.displayName);
            //   $('#actualName').append('<span id="add_here" style ="color: black;>' + data.actualName + '</span>');
            $('#actualName').html(data.actualName);
        });
    }


    //////////////////   check if exist in mysql before creating new table /////////////////////////


    // function checkUserBeforeCreating(email) {
    //   console.log('hello');
    //   var categoryString = email || "";
    //   if (categoryString) {
    //     categoryString = "/" + categoryString;
    //   }
    //   $.get("/api/posts" + categoryString, function (data) {

    //     console.log("data please be null", data);

    //   });
    // }






    ////////////////////// this function checks if the user is logged in, if not logged in take to login page ///////////////
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // console.log('user info :' + user.email);
            // console.log('user is Logged In!');

            // if (window.location.href === 'http://localhost:3000/option' || window.location.href === 'http://localhost:3000/chat') {
            //     // console.log('you need to login');

            // } else {
            //     window.location.href = '../option';
            // }
            if (window.location.href === "http://localhost:3000/") {
                window.location.href = '../option';
            }
            mysqlEmail = user.email;
            checkUser(mysqlEmail);
            localStorage.clear();
            console.log("first"+mysqlEmail);
        } else {
            // No user is signed in.
            console.log('user not logged in!');
            if (window.location.href === 'http://localhost:3000/') {
                console.log('you need to login');

            } else {
                window.location.href = '../';
            }


        }
    });




    // Loging Out
    $('#logiut-btn').click(function () {
        firebase.auth().signOut().then(function () {
            console.log('Sign-out successful.');
            window.location.href = '../';
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        });
    });


    /////////////// move to groupchat ////////////////
    $('#groupButton').click(function () {
        window.location.href = '../chat';
    });




    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Chat section

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////   get user location ///////////////////////////////
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }
    function showPosition(position) {

        mylat = position.coords.latitude;
        mylon = position.coords.longitude;
        displayMessage();
        trigger = false;
    }
    getLocation();





    //////////////////// push message to firebase ////////////////////////

    $("#sendMessage").on("click", function (event) {
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
if($("#userMessage").val() !== ""){
         
        navigator.geolocation.getCurrentPosition(showPosition);
        name = "tempName";
        //name = $("#name-input").val();
        message = $("#userMessage").val();
        /////// Use form ong / lat for testing purpouses comments////
        // mylat = $("#lat-input").val();
        // mylon = $("#long-input").val();
        console.log(message);

        var newUser = {
            name: Usersnickname,
            message: message,
            lon: mylon,
            lat: mylat,
            email: chatEmail,
            picture: UsersPicture,
            uid: userID
        };

        database.ref().push(newUser);
        // Code for handling the push
        displayMessage();
        trigger = false;
        $("#userMessage").val("");
    }
    }

    ///////////////////////// calc distance ///////////////////////////
    function distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            console.log("distance is : " + 0);
            mainDistance = 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "M") { dist = dist * 0.8684 }
            // console.log("distance is : " + dist);
            mainDistance = dist;
        }
    }


    /////////////////////////////// display messages ////////////////////////////
    function displayMessage() {
        if (trigger) {
            database.ref().on("child_added", function (snapshot) {

                /////// calc distance ///////
                distance(mylat, mylon, snapshot.val().lat, snapshot.val().lon, "M");


                //  var messageTemplete = `<div class="row from-chat"> <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s9 m9"> <p style="color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> <div class="col s3 m3"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> </div> </div> </div> </div> </div>`

                // ` <div class="row from-chat" > <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s10 m10" style="overflow:hidden;"> <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> <div class="col s2 m2"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> </div> </div> </div> </div> </div>`
                /////// display image if in rang ///////
                if (mainDistance <= distLimit) {
                    // console.log('snapshot.val().email : ' + snapshot.val().email);
                    // console.log('myEmail : ' + chatEmail);
                    if (snapshot.val().email === chatEmail) {
                        // console.log('they match');

                        if (window.location.href === 'http://localhost:3000/chat') {
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
                                                <p style="min-width: 50px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
                                                <p class=" width: 100%">${snapshot.val().message}</p>
                                            </div>
                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                            $("#chat-group").append(userMessageTemp1);

                            window.scrollBy(0, 250);
                            TweenLite.from('.' + text, .5, { x: 200, opacity: 0, });

                        }

                    } else {
                        // console.log('no match');
                        if (window.location.href === 'http://localhost:3000/chat') {
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
                                                    <p style="min-width: 50px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
                                                    <p>${snapshot.val().message}</p>
                                                </div>
                        
                                            </div>
                                        </div>
                                        <div class="card-stacked">
                                            <div class="fixed-action-btn">
                                                <a class="btn-floating btn-large " style=" background-image: linear-gradient(-90deg, #ffc107, #ff6f00);">
                                                    <i class="large material-icons">dehaze</i>
                                                </a>
                                                <ul>
                                                    <li> <a class="btn-floating red">
                                                            <i class="material-icons">error</i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="btn-floating yellow darken-1">
                                                            <i class="material-icons">thumb_down</i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="btn-floating green">
                                                            <i class="material-icons">thumb_up</i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a id="msg-btn" class="btn-floating blue" data-uid="${snapshot.val().uid}">
                                                            <i class="material-icons">textsms</i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                        
                                    </div>
                                </div>`

                            $("#chat-group").append(messageTemplate1);
                            TweenLite.from('.' + text, .5, { x: -200, opacity: 0, });
                            window.scrollBy(0, 250);

                        }


                    }

                    var elems = document.querySelectorAll('.fixed-action-btn');
                    var instances = M.FloatingActionButton.init(elems, {
                        direction: 'left'
                    });
                    M.AutoInit();
                } else {
                    // console.log('out of range');
                }
                // Handle the errors
            }, function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            });

        }
    }

    $('#backButton').click(function () {
        window.location.href = '../option';
    });
    var db = firebase.database().ref('/');
    $("body").on("click", "#msg-btn", function () {
        console.log("ENTERED THE VOID");
        console.log("second"+mysqlEmail);
        console.log("pls"+UsersPicture)
        console.log(this);
        var user = $(this).attr('data-uid');
        var curentUser = userID;
        var threadName = user + curentUser;
        firebase.database().ref("/").once("value").then(function (snapshot) {
            if (snapshot.child(threadName).exists()) { // will need to check both dummys with an || statement
                console.log("IT EXISTS");
                var ref = firebase.database().ref(threadName);
                ref.push({
                    user_id1: curentUser,
                    user_id2: user,
                    message: "tester"
                    //maybe add a field for undreaduser1 and unreaduser2
                });
                ref.child("initMessage").update({
                    user_id4: "foook"
                });
                //set db ref to this instead of main db
            } else {
                console.log("IT NOT EXISTS");
                db.update({
                    [threadName]: {
                        initMessage: {
                            user_id1: curentUser,
                            user_id2: user,
                            message: "message"
                            //maybe add a field for undreaduser1 and unreaduser2
                        }
                    }
                });
                console.log("created.")
            }
        });
    });





    ///////////////////////////////////////// animations! /////////////////////////////////////////
    var dly = 0;
    for (i = 0; i < 10; i++) {
        TweenLite.from('.animate' + i, .5, { y: 50, opacity: 0, delay: dly });
        dly += .3;
    }






});

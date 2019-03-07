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
    var randomItem = avatarArr[Math.floor(Math.random() * avatarArr.length)];
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
    var dly;
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
                displayName: "testinging",
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
            $("#preloader").removeClass("hide");
            $("#login-btn").addClass("hide");
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
        } else {
            // No user is signed in.
            console.log('user not logged in!');
            $("#preloader").addClass("hide");
            $("#login-btn").removeClass("hide");
            if (window.location.href === 'http://localhost:3000/') {
                console.log('you need to login');

            } else {
                //user logged in
                window.location.href = '../';
                $("#preloader").removeClass("hide");
                $("#login-btn").addClass("hide");
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
        if ($("#userMessage").val() !== "") {
            dly = 0;
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
                                                <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
                                                <p>${snapshot.val().message}</p>
                                            </div>
                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                            $("#chat-group").append(userMessageTemp1);

                            window.scrollBy(0, 250);
                            TweenLite.from('.' + text, .5, { x: 200, opacity: 0, delay: dly });
                            dly += 1;
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
                                                    <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p>
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
        console.log(this);
        var user = $(this).attr('data-uid');
        var currentUser = userID;
        console.log("wtf: "+currentUser);
        var threadName = user + currentUser;
        firebase.database().ref("/").once("value").then(function (snapshot) {
            if (snapshot.child(threadName).exists() || snapshot.child(posthreadName).exists()) {
                console.log("IT EXISTS");
                var actThreadName;
                var ref;
                if (snapshot.child(threadName).exists()) {
                    ref = firebase.database().ref(threadName);
                    actThreadName = threadName;
                    console.log(threadName);
                } else if (snapshot.child(posthreadName).exists()) {
                    ref = firebase.database().ref(posthreadName);
                    actThreadName = posthreadName;
                    console.log(posthreadName);
                }
                localStorage.setItem('thread', actThreadName);
                localStorage.setItem('currentUser', currentUser);
                localStorage.setItem('rUser', user);
                sendToPrivate();

                //comment this and ref.push out after testing // remove competely 
                db = ref;
                ref.push({
                    user_id1: currentUser,
                    user_id2: user,
                    message: "tester"
                    //maybe add a field for undreaduser1 and unreaduser2
                });

            } else {
                console.log("IT NOT EXISTS");
                db.update({
                    [threadName]: {
                        initMessage: {
                            user_id1: curentUser,
                            user_id2: user,
                            message: "Hello"
                            //maybe add a field for undreaduser1 and unreaduser2
                        }
                    }
                });
                console.log("created.")
                localStorage.setItem('thread', actThreadName);
                localStorage.setItem('currentUser', currentUser);
                localStorage.setItem('rUser', user);
                sendToPrivate();
            }
        });
    });

    function sendToPrivate() {
        window.location.href = '../privateChat';
    }

    // 88888888888888888888888888888  Chat Questions   88888888888888888888888888888
    var q1Laurel = '';
    var q1Yanny = '';
    var q2Selection = '';
    var q3Selection = '';
    var q4Selection = '';

    /////////////////////////////// question 1 /////////////////////////////////

    $(".q1-btn").click(function (e) {
        e.preventDefault();

        // store information from questions
        var q1Chosen = $(this).attr("value");
        console.log(q1Chosen + " was selected")
        //add to selected answer array
        if (q1Chosen === "laurel") {
            // grab user email and ID and push it to array
            // $.get("/api/posts" + mysqlEmail, function (data) {
            //     UsersPicture = data.picture;
            // });

            database.ref("/").once("value").then(function (snapshot) {
                if (snapshot.child("question1")) {
                    console.log("Found question1");
                } else {
                    database.update({
                        question1: {
                            laurel: {

                            }
                        }
                    })
                }
                database.ref().on("child_added", function (displaySnapshot) {
                    var picLaurel = `<img src="${displaySnapshot.val().laurel.img}" class="vote-icon responsive-img" >`;
                    var picYanny = `<img src="${displaySnapshot.val().yanny.img}" class="vote-icon responsive-img" >`;
                    $("#questionLaurel").append(picLaurel);
                    $("#questionYanny").append(picYanny);
                });
            })
        }
        if (q1Chosen === "yanny") {
            // grab user email and ID and push it to array
        }
        // remove the ability to change answer
        $(".q1-btn").remove();
    });



    /////////////////////////////// question 2 /////////////////////////////////
    $('.q2-btn').click(function (e) {
        e.preventDefault();
        // set the selected value
        q2Selection = $(this).text();
        console.log(q2Selection);
        // remove the ability to change answer
        $('.q2-btn').remove();
    })
    /////////////////////////////// question 3 /////////////////////////////////
    $('.q3-btn').click(function (e) {
        e.preventDefault();
        q3Selection = $(this).text();
        console.log(q3Selection);
        $('.q3-btn').remove();
    })

    /////////////////////////////// question 4 /////////////////////////////////
    $('.q4-btn').click(function (e) {
        e.preventDefault();
        q4Selection = $(this).text();
        console.log(q4Selection);
        $('.q4-btn').remove();
    });
    // 88888888888888888888888888888  End Chat Questions   88888888888888888888888888888
});

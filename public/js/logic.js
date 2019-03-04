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
    var avatarArr = ['../images/astronaut.png', '../images/detective.png', '../images/diver.png', '../images/disc-jockey.png'];
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






    ///////////// Login //////////////////////////////////////
    $('#login-btn').click(function () {
        $('#preloader').removeClass('hide');
        $('#login-btn').addClass('hide');
        console.log('hello');

        base_provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(base_provider).then(function (result) {

            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(result.user);

            userEmail = result.user.email;
            stageName = result.user.displayName;
            // checkUserBeforeCreating(result.user.email);


            var newPost = {
                actualName: result.user.displayName,
                displayName: nickname,
                email: result.user.email,
                picture: randomItem
            };
            submitPost(newPost);

        }).catch(function (err) {
            console.log(err)
            console.log('Failed to do');
        })
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

            if (window.location.href === 'http://localhost:3000/option' || window.location.href === 'http://localhost:3000/chat') {
                // console.log('you need to login');

            } else {
                window.location.href = '../option';
            }
            mysqlEmail = user.email;
            checkUser(mysqlEmail);
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
            picture: UsersPicture
        };

        database.ref().push(newUser);
        // Code for handling the push
        displayMessage();
        trigger = false;
    });




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
                var messageTemplate = // ` <div id="chat-box"> <div class="row from-chat"> <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s3 m3" style= "margin-left: -1.5em; margin-right: 10px"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> <div class="col s9 m9"> <p style="color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> </div> </div> <div class="card-stacked"> <div class="fixed-action-btn"> <a class="btn-floating btn-medium red"> <i class="large material-icons">dehaze</i> </a> <ul style="margin-right: -2em;"> <li> <a class="btn-floating btn-small red"> <i class="material-icons">error</i> </a> </li> <li> <a class="btn-floating btn-small yellow darken-1"> <i class="material-icons">thumb_down</i> </a> </li> <li> <a class="btn-floating btn-small green"> <i class="material-icons">thumb_up</i> </a> </li> <li> <a class="btn-floating btn-small blue"> <i class="material-icons">textsms</i> </a> </li> </ul> </div> </div> </div> </div> </div>`
                    ` <div id="chat-box">
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
                                        <a class="btn-floating btn-large red">
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
                                                <a class="btn-floating blue">
                                                    <i class="material-icons">textsms</i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                
                            </div>
                        </div>`

                //  var messageTemplete = `<div class="row from-chat"> <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s9 m9"> <p style="color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> <div class="col s3 m3"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> </div> </div> </div> </div> </div>`
                var userMessageTemp = ` <div class="row from-chat">
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
                // ` <div class="row from-chat" > <div class="col s12"> <div class="card horizontal"> <div class="card-content"> <div class=""> <div class="col s10 m10" style="overflow:hidden;"> <p style="min-width: 280px; color: #386895; font-size: 10px;">${snapshot.val().name}</p> <p>${snapshot.val().message}</p> </div> <div class="col s2 m2"> <div style=" height: 3.5em; width: 3.5em; "> <img src="${snapshot.val().picture}" style="width: 100%;"> </div> </div> </div> </div> </div> </div> </div>`
                /////// display image if in rang ///////
                if (mainDistance <= distLimit) {
                    // console.log('snapshot.val().email : ' + snapshot.val().email);
                    // console.log('myEmail : ' + chatEmail);
                    if (snapshot.val().email === chatEmail) {
                        // console.log('they match');

                        if (window.location.href === 'http://localhost:3000/chat') {

                            $("#chat-group").append(userMessageTemp);
                            window.scrollBy(0, 300);

                        }

                    } else {
                        // console.log('no match');
                        if (window.location.href === 'http://localhost:3000/chat') {

                            $("#chat-group").append(messageTemplate);
                            window.scrollBy(0, 300);

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



});

////////PSUEDO CODE FOR INBOX.JS////////

//on windows load do a get request to get all of the current user's information via UID 
//.. might carry over from init page load of socializing check with console log
var uid = localStorage.getItem("currentUser");
var hasInbox = false;
var counter = 0;
var username;
var userPicture;


window.onload = function () {
    console.log(uid);
    database = firebase.database().ref(`1on1`);
    database.once("value").then(function (snapshot) {
        if(snapshot.child(uid).exists()){
            hasInbox = true;
            checkNumofThreads();
        }
    });

}


$("#test-ava").on("click", function (event) {

});

function checkNumofThreads(){
    console.log(uid);
    console.log(hasInbox);
    if(hasInbox){
        database = firebase.database().ref(`1on1/${uid}`);
        database.on("child_added", function (snapshot) {
            counter++;
            console.log("in loop"+counter);
        });
        console.log("out loop"+counter);
        $.get("/api/users" + uid, function (data) {
            // console.log("data Stored in mysql :", data.displayName);
            username = data.displayName;
            userPicture = data.picture;
            $(".avator").attr("src", data.picture);
            $("#displayName").html(data.displayName);
            //   $('#actualName').append('<span id="add_here" style ="color: black;>' + data.actualName + '</span>');
            $('#actualName').html(data.actualName);
        });
    }
}
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
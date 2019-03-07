var threadTarget = localStorage.getItem('thread');
var currentUser = localStorage.getItem('currentUser');
var rUser = localStorage.getItem('rUser');
window.onload = function (){
    console.log("omega lul");
    console.log(threadTarget);
    console.log(currentUser);
    console.log(rUser);
    $(".section").attr("id",threadTarget);
    database = firebase.database().ref(threadTarget);
    initiPrivateMsg();
}

function initiPrivateMsg(){
    database.on("child_added", function (snapshot) {
        console.log(snapshot.val().message);
        console.log(database);
        //console.log("current user"+userID);
        var mytext = `<h>Message : ${snapshot.val().message}</h> <br>` ;
        $(`#${threadTarget}`).append(mytext);
    });
}
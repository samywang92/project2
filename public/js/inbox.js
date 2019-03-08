////////PSUEDO CODE FOR INBOX.JS////////

//on windows load do a get request to get all of the current user's information via UID 
//.. might carry over from init page load of socializing check with console log


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
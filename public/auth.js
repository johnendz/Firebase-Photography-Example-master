firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User is signed in.");
        $("#user-menu-on").show();
        $("#user-menu-dropdown").text(user.displayName);
    } else {
        console.log("No user is signed in.");
        $("#user-menu-off").show();
    }
});
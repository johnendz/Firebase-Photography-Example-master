firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User is signed in.");
    } else {
        console.log("No user is signed in.");
        $("#user-menu").html("<a href='/login' class='btn btn-outline-dark'>Iniciar sessão <i class='far fa-user' style='font-size: 15px;'></i></a>");
    }
  });
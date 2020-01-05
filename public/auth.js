firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("Usuario logado.");
        $("#user-menu-on").show();//mostrar menu de usuario logado
        $("#user-menu-off").hide();//ocultar menu de usuario deslogado
        $("#user-menu-dropdown").text(user.displayName);//inserir texto com nome do github (o nome ja vem por termos usado o provedor github)
        $("#myprofile").attr("href", "/profile/?user=" + user.uid);//para colocar o link com uid do usuario no menu
        console.log(user);//mostrar informacoes da sessao
    } else {
        console.log("Usuario deslogado.");
        $("#user-menu-off").show();//mostrar menu de usuario deslogado
        $("#user-menu-on").hide();//ocultar menu de usuario logado
    }
});
$( document ).ready(function() {
    var provider = new firebase.auth.GithubAuthProvider();
    $("#conect").click(function() {
        $("btnlogin").text("Acessando...");
        $("#conect").prop('disabled', true);
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;//github token
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log(error);
            $("#conect").addClass("btn-danger");$("#conect").removeClass("btn-primary");
			$("btnlogin").text(errorMessage);
			setTimeout(function(){
				$("#conect").addClass("btn-primary");$("#conect").removeClass("btn-danger");$("#conect").text("Conectar com GitHub");$("#conect").prop('disabled', false);
			}, 3000);
        });
    });
});
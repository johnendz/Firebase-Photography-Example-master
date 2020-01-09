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
        $("#conect").addClass("btn-primary");$("#conect").removeClass("btn-danger");$("btnlogin").text("Conectar com GitHub");$("#conect").prop('disabled', false);
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
            let token = result.credential.accessToken;//GitHub OAuth Access Token
            let user = result.user;
            //usando o token para puxar informacoes do usuario do github
            fetch('https:////api.github.com/user', {
                headers: {
                    Authorization: 'token ' + token
                }
            })
            .then(res => res.json())
            .then(res => {
                db.collection("users").doc(user.uid).get().then(function(doc) {
                    if (doc.exists) {
                        db.collection("users").doc(user.uid).update({
                            logindate: Date.now(),
                            name: res.name,
                            username: res.login
                        });//em caso do usuario trocar de username, atualiza toda vez que fizer login
                    } else {
                        db.collection("users").doc(user.uid).set({
                            id: user.uid,
                            src: user.photoURL,
                            registration: Date.now(),
                            logindate: Date.now(),
                            name: res.name,
                            username: res.login
                        });//defenir um a primeira view já que ela nao existe
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            });            
        }).catch(function(error) {
            //var errorCode = error.code;
            //var errorMessage = error.message;
            //var email = error.email;
            //var credential = error.credential;
            //apenas se voce quiser separar os erros
            console.log(error);
            $("#conect").addClass("btn-danger");$("#conect").removeClass("btn-primary");
			$("btnlogin").text(errorMessage);
			setTimeout(function(){
				$("#conect").addClass("btn-primary");$("#conect").removeClass("btn-danger");$("btnlogin").text("Conectar com GitHub");$("#conect").prop('disabled', false);
			}, 3000);
        });
    });
});

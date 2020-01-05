$( document ).ready(function() {
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }// essa funcao serve apenas para ler os parametros na barra de endereco "?id=89789798"
    let user = $.urlParam('user');//para pegar o conteudo do ?user=
    if(user == null){
        window.location.href = "/";
    }else{
        db.collection("users").doc(user).get().then(function(doc) {
            if (doc.exists) {// vereficar se o usuario existe no banco de dados
                let useruid = doc.data().username;
                if(doc.data().name == null){
                    var name = "desconhecido";
                }else{
                    var name = doc.data().name;
                }
                //buscar da api do github informações do ususario
                fetch(`https://api.github.com/users/${useruid}`)
                .then(response => response.json())
                .then(data => {
                    $("#username").html(data.login + " <small>(" + name + ")</small>");
                    $("#userphoto").attr("src", data.avatar_url);
                    let bio = data.bio;
                    let company = data.company;
                    let location = data.location;
                    let blog = data.blog;
                    let email = data.email;
                    if(bio != null){
                        $("#bio").text(data.bio);
                    }
                    if(company != null){
                        $("#company").text(data.company);
                    }
                    if(location != null){
                        $("#location").text(data.location);
                    }
                    if(blog != null){
                        $("#blog").html("<a href='" + data.blog + "'>Meu Site</a>");
                    }
                    if(email != null){
                        $("#email").html("<a href='mailto:" + data.email + "'>Enviar Email</a>");
                    }                
                })
                .catch(error => window.location.href = "/");
                //mostrar as fotos dos ususarios
                db.collection("photos").where("user", "==", user).get().then(function(querySnapshot) {//buscar todas as fotos com campo user igual do usuario a ser buscado
                    $("#listphotos").html("");//redefinir toda vez que um dado for adicionado no banco de dados
                    querySnapshot.forEach(function(doc) {
                        $("#listphotos").append("<div class='col-md-3 col-sm-6 mb-4'><a href='/photo/?id=" + doc.id + "'><img class='img-fluid' src='" + doc.data().src + "'></a></div>");//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
                    });
                    //ocultar tela de carregamento e mostrar perfil
                    $("#loader").hide();
                    $("#displayprofile").show();
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
            } else {
                window.location.href = "/";
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
});
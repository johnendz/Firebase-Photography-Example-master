$( document ).ready(function() {
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }// essa funcao serve apenas para ler o parametros na barra de endereco "?id=89789798"
    let id = $.urlParam('id');//para pegar o conteudo do &id=
    if(id == null){//vereficar se for null o parametros
        window.location.href = "/";
    }else{
        db.collection("photos").doc(id).get().then(function(doc) {
            if (doc.exists) {// vereficar se a foto existe no banco de dados
                $("body").css('background', 'url(' + doc.data().src + ') no-repeat center center fixed');//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
                $("body").css('background-size', 'cover');
                $("#loader").hide();// ocultar tela de carregamento
                newview(id, doc.data().src, doc.data().user);
            } else {
                window.location.href = "/";
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
});
function getCookie(name) {
    var cookies = document.cookie;
    var prefix = name + "=";
    var begin = cookies.indexOf("; " + prefix);
 
    if (begin == -1) {
 
        begin = cookies.indexOf(prefix);
         
        if (begin != 0) {
            return null;
        }
 
    } else {
        begin += 2;
    }
 
    var end = cookies.indexOf(";", begin);
     
    if (end == -1) {
        end = cookies.length;                        
    }
 
    return unescape(cookies.substring(begin + prefix.length, end));
}//funcao para ler cookies
function newview(id, src, user) {
    let cookie = "photo" + id;
    if(getCookie(cookie) != "true"){
        db.collection("views").doc(id).get().then(function(doc) {
            if (doc.exists) {
                var views = doc.data().view + 1;
                db.collection("views").doc(id).update({
                    view: views
                });//defenir um a primeira view já que ela nao existe
            } else {
                db.collection("views").doc(id).set({
                    photo: id,
                    src: src,
                    user: user,
                    view: 1
                });//defenir um a primeira view já que ela nao existe
            }
            document.cookie = "photo" + id + "=true";//para escrever um cookie
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }    
}
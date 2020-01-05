$( document ).ready(function() {
    //header photos
    db.collection("views").orderBy("view", "desc").limit(3)//buscar as 3 fotografias mais visualizadas
    .onSnapshot(function(querySnapshot) {
        var postcont = 0;
        querySnapshot.forEach(function(doc) {
            postcont++;
            if(postcont == "1"){
                $(".carousel-inner").html("<div class='carousel-item active' style='background-image: url(" + doc.data().src + ")'></div>");//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
            }
            $(".carousel-inner").append("<div class='carousel-item' style='background-image: url(" + doc.data().src + ")'></div>");//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
        });
        if(postcont == "3"){
            $("#headerphotos").show();
        }
    });
    db.collection("photos").orderBy("date", "desc").limit(12)//buscar as 12 fotografias mais recentes
    .onSnapshot(function(querySnapshot) {
        var postcont = 0;
        $("#listphotos").html("");//redefinir html ao adicionar novas fotografias
        querySnapshot.forEach(function(doc) {
            postcont++;
            $("#listphotos").append("<div class='col-lg-3 col-md-4 col-6'><a href='/photo/?id=" + doc.id + "' class='d-block mb-4'><img class='img-fluid img-thumbnail' src='" + doc.data().src + "'></a></div>");//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
        });
        if(postcont <= "11"){
            $("#avs1").show();
            $("#avs2").show();
        }
        if(postcont > "11"){
            $("#containerphotos").show();
            $("#usersphotos").show();
        }
    });
    db.collection("users").orderBy("registration", "desc").limit(12)//buscar os 12 fotografos mais recentes
    .onSnapshot(function(querySnapshot) {
        $("#listusers").html("");//redefinir html ao adicionar novos fotografos
        querySnapshot.forEach(function(doc) {
            if(doc.data().name == null){
                var name = "desconhecido";
            }else{
                var name = doc.data().name;
            }
            $("#listusers").append("<div class='col-xl-3 col-md-6 mb-4'><div class='card border-0 shadow'><a href='/profile/?user=" + doc.data().id + "'><img src='" + doc.data().src + "' class='card-img-top'></a><div class='card-body text-center'><h5 class='card-title mb-0'>" + doc.data().username + "</h5><div class='card-text text-black-50'>" + name + "</div></div></div></div>");//doc.data().src onde ".src" seria o nome do campo e "doc.data()" é usado para ver os dados retornado
        });
        $("#loader").hide();
    });
});

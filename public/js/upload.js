$(document).ready(function() {
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }//ler imagem selecionada
   
    $(".file-upload").on('change', function(){
        readURL(this);$(".fa-arrow-circle-up").css('opacity', '0');
    });//detectar uma mudanca no input file
    
    $(".upload-button").on('click', function() {
        $(".file-upload").click();
	});// ao clicar na seta pressionar o input file
	
	function dataURLtoBlob(dataURL) {
        var binary = atob(dataURL.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
	}//saber o tamanho da fotografia
	function functioncompress(docid) {
		var file = document.getElementById("imagem").files[0];
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext("2d");
		var image = new Image();
		image.onload = function() {
			ctx.canvas.width = image.width;
			ctx.canvas.height = image.height;
			ctx.drawImage(image, 0, 0,image.width,image.height);
			var compress = canvas.toDataURL('image/jpeg', 0.6);
			var imgfile = dataURLtoBlob(compress);//para executar a funcao e ver tamanho
			var size = imgfile.size;//definir uma variavel com o tamanho
			upload(docid, compress, size);//executar funcao para enviar imagem
		};
		image.src = URL.createObjectURL(file);
		$("#add").text("Comprimindo...");
	}//compremir a fotografia
	function upload(docid, compress, size) {
        var uploadTask = storage.ref().child('/photos/' + docid + '.jpg').putString(compress, 'data_url');
        uploadTask.on('state_changed', function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;//fazer uma conta e retornar a porcentagem ex: 100.545415416125
		    var textprogress = progress.toFixed(0);//selecionar somente os primeiros numeros ex: 100
		    $("#add").text("Enviando (" + textprogress + "%)...");
        }, function(error) {
            $("#add").text("Ocorreu um Erro");
			console.log("Error getting documents: ", error);
        }, function() {
            $("#add").text("Salvando...");
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {//funcao para retornar a url do arquivo enviado para nuvem
                db.collection("photos").doc(docid).update({//atualizar dados com informacoes de tamanho e caminho da imagem
                    "src": downloadURL,
                    "size": size
                }).then(function(doc) {
                    window.location.href = "/";
                });
            });	
        });
	}
	$("#add").click(function() {
		$("#add").text("Adicionando...");
		$("#add").prop('disabled', true);
		var files = $("#imagem")[0].files;//pegar o input file
		if(files.length != 0){//vereficar se nao esta vazio
			var foto = "1";
		}
		if(foto != null){
            var user = firebase.auth().currentUser;//pegar informacoes do usuario logado
			db.collection("photos").add({//adicionar dados com informacoes da data e dono da fotografia
				"date": Date.now(),
                "user": user.uid
			})
			.then(function(docRef) {
				var docid = docRef.id;
				functioncompress(docid);//apos ser salvo as informacoes executar funcao para comprimir imagem
			})
			.catch(function(error) {
				$("#add").text("Ocorreu um Erro");
				setTimeout(function(){
					$("#add").text("Adicionar");
					$("#add").prop('disabled', false);
				}, 3000);
				console.error("Error adding document: ", error);
			});  
		}else{
			$("#add").text("Você esqueceu de alguma coisa");
			setTimeout(function(){
				$("#add").text("Adicionar");
				$("#add").prop('disabled', false);
			}, 3000);
		}
	});
});
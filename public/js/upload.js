$(document).ready(function() {
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
   
    $(".file-upload").on('change', function(){
        readURL(this);$(".fa-arrow-circle-up").css('opacity', '0');
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
	function dataURLtoBlob(dataURL) {
        var binary = atob(dataURL.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
	}
	function functioncompress(docid) {
		var file = document.getElementById("imagem").files[0];
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext("2d");
		var image = new Image();
		image.onload = function() {
			ctx.canvas.width = image.width;
			ctx.canvas.height = image.height;
			ctx.drawImage(image, 0, 0,image.width,image.height);
			var compress = canvas.toDataURL('image/jpeg', 0.8);
			var imgfile = dataURLtoBlob(compress);
			var size = imgfile.size;
			upload(docid, compress, size);
		};
		image.src = URL.createObjectURL(file);
		$("#add").text("Comprimindo...");
	}
	function upload(docid, compress, size) {
        var uploadTask = storage.ref().child('/photos/' + docid + '.jpg').putString(compress, 'data_url');
        uploadTask.on('state_changed', function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    var textprogress = progress.toFixed(0);
		    $("#add").text("Enviando (%" + textprogress + ")...");
        }, function(error) {
            $("#add").text("Ocorreu um Erro");
			console.log("Error getting documents: ", error);
        }, function() {
            $("#add").text("Salvando...");
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                db.collection("photos").doc(docid).update({
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
		var files = $("#imagem")[0].files;
		if(files.length != 0){
			var foto = "1";
		}
		if(foto != null){
            var user = firebase.auth().currentUser;
			db.collection("photos").add({
				"date": Date.now(),
                "user": user.uid
			})
			.then(function(docRef) {
				var docid = docRef.id;
				functioncompress(docid);
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
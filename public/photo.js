$( document ).ready(function() {
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }
    if($.urlParam('id') == null){
        $("body").css("background", "url('http://placehold.it/1920x1080') no-repeat center center fixed");
    }else{
        $("body").css('background', 'url(' + $.urlParam('id') + ') no-repeat center center fixed');
    }
});
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
    if($.urlParam('user') == null || $.urlParam('id') == null){
        window.location.href = "/";
    }else{
        window.location.href = "/";
        //$("body").css('background', 'url(' + $.urlParam('id') + ') no-repeat center center fixed');
    }
});
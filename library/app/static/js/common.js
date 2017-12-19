var profileButton = document.querySelector('.name');
var logout = document.querySelector('.logout');

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString() + ";path = /";
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


var user_id = 2;
user_id = getCookie('id')

profileButton.addEventListener('click',function(){
	window.location = '/profile/' + user_id + '/'
})

logout.addEventListener('click',function(){
	window.location = '/login/';
	setCookie("id","",-1);
})
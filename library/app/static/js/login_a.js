var email = document.getElementById('email');
var password = document.getElementById('password');
var submit = document.getElementById('login-button');
var mask = document.querySelector('.mas');
var modal = mask.querySelector('.modal');

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString() + ";path = /";
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


function checkEmail(str) {
    var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    return pattern.test(str);
}
submit.addEventListener('click', function() {
    if (!checkEmail(email.value)) {
        modal.innerHTML = "您的邮箱格式不正确"
        mask.style.display = "block"
        setTimeout(function() {
            mask.style.display = "none";
        }, 2000)
        return
    }
    fetch('http://120.24.4.254:5477/api/admin/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then(res => {
        if (res.ok)
            return res.json()
    }).then(value => {
        if (value.user_id) {
            console.log(value)
            setCookie("id", value.user_id)
            setCookie("token", value.token)
            window.location = '/management/manage/'
        } else {
            mask.style.display = "block"
            setTimeout(function() {
                mask.style.display = "none";
            }, 2000)
        }
    })
})
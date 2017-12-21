// jQuery & Velocity.js
var log = false
var mask = document.querySelector('.mask');
var modal = mask.querySelector('.modal');

setCookie("id", "", -1)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString() + ";path = /";
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function slideUpIn() {
    $("#login").velocity("transition.slideUpIn", 1250)
};

function slideLeftIn() {
    $(".row").delay(500).velocity("transition.slideLeftIn", { stagger: 500 })
}

function shake() {
    $(".password-row").velocity("callout.shake");
}

slideUpIn();
slideLeftIn();
$("button").on("click", function() {
    console.log(log)
    if (!log) {
        fetch('http://120.24.4.254:5477/api/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: $("#email_input")[0].value,
                password: $("#password_input")[0].value
            })
        }).then(res => {
            if (res.ok)
                return res.json()

        }).then(value => {
            if (value.user_id) {
                setCookie("id", value.user_id)
                window.location = "/"
            } else {
                mask.style.display = "block"
                setTimeout(function() {
                    mask.style.display = "none";
                }, 2000)
            }
        })
    } else {
        fetch('http://120.24.4.254:5477/api/register/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: $("#username_input")[0].value,
                email: $("#email_input")[0].value,
                password: $("#password_input")[0].value
            })
        }).then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(value => {
            // console.log(value)
            if (value.status == "User exists.") {
                modal.innerHTML = "该邮箱或用户名已被注册"
                mask.style.display = "block"
                setTimeout(function() {
                    mask.style.display = "none";
                }, 2000)
            } else {
                window.location = "/login/"
            }
        })
    }

});
$('#toRegister').on('click', function() {
    if (!log) {
        $(".row1").delay(500).velocity("transition.slideLeftIn", { stagger: 500 })
        $('button')[0].innerHTML = "注册"
        $('#toRegister')[0].innerHTML = "登录"
        log = true
    } else {
        $(".row1")[0].style.display = "none";
        $('button')[0].innerHTML = "登录"
        $('#toRegister')[0].innerHTML = "注册"
        log = false
    }

})
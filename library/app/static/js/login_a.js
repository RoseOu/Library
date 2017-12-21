var email = document.getElementById('email');
var password = document.getElementById('password');
var submit = document.getElementById('login-button');
var mask = document.querySelector('.mas');
var modal = mask.querySelector('.modal');

submit.addEventListener('click', function() {
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
            window.location = '/management/manage/'
        else {
            mask.style.display = "block"
            setTimeout(function() {
                mask.style.display = "none";
            }, 2000)
        }
    })
    console.log("email = ", email.value, "password = ", password.value);
})
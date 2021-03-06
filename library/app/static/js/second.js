var pic = document.querySelectorAll('#pic-view');
var title = document.querySelector('.book-item_title');
var author = document.querySelector('.a_name');
var description = document.querySelector('.description');
var button = document.querySelector('button');
var isbn = document.querySelector('.-ISBN');
var author_des = document.querySelector('.-author');
var field = document.querySelector('.-field');
var press = document.querySelector('.-publisher');
var press_time = document.querySelector('.-publish-time');
var bookList = window.location.pathname.split('/')
var length = bookList.length
var book_id = bookList[length - 2];
var mask = document.querySelector('.mask');
var modal = mask.querySelector('.modal');
// console.log(url)

console.log("second", "'" + getCookie("id") + "'")

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
fetch('http://120.24.4.254:5477/api/book/' + book_id + '/').then(res => {
    return res.json()
}).then(value => {
    console.log(pic.src)
    pic[0].src = value.image
    title.innerHTML = value.name
    author.innerHTML = value.author
    description.innerHTML = value.book_introduction
    isbn.innerHTML = value.isbn
    author_des.innerHTML = value.author_introduction
    field.innerHTML = value.filed
    press.innerHTML = value.press
    press_time.innerHTML = value.publication_time
})
button.addEventListener('click', function() {
    if (getCookie("id") == "") {
        mask.style.display = "block"
        setTimeout(function() {
            mask.style.display = "none";
        }, 1000)
        return
    }
    fetch('http://120.24.4.254:5477/api/borrow/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: getCookie('id'),
            book_id: book_id
        })
    }).then(res => {
        if (res.ok)
            return res.json()
    }).then(value => {
        button.innerHTML = "已借阅"
    })
})
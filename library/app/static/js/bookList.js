var grid = document.getElementById('grid');
var url = window.location.pathname + window.location.search
console.log(url)
var createBookList = function(data, num) {
    while (grid.hasChildNodes()) {
        grid.removeChild(grid.firstChild)
    }
    for (var i = 0; i < num; i++) {
        var col = document.createElement('div');
        col.className = "col"
        var img = document.createElement('img');
        img.src = data[i].image;
        img.className = "img"
        var h3 = document.createElement('h3');
        h3.innerHTML = data[i].name
        var author = document.createElement('p');
        author.className = "author";
        author.innerHTML = data[i].author
        var intro = document.createElement('p');
        intro.innerHTML = data[i].book_introduction;
        col.appendChild(img);
        col.appendChild(h3);
        col.appendChild(author);
        col.appendChild(intro);
        col.addEventListener('click', toSecond.bind(this, data[i].book_id))
        grid.appendChild(col)
    }
}

var toSecond = function(id) {
    window.location = "/book/" + id + "/"
}
var searchBook = function(url) {
    fetch('http://120.24.4.254:5477/api' + url).then(res => {
        return res.json()
    }).then(value => {
        console.log(value)
        createBookList(value.book, value.count)
    })
}
// createBookList(data, 4)
searchBook(url);
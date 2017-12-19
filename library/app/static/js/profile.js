var sorter = document.getElementById('sorter');
var row = document.querySelector('.row');
var username = document.querySelector('.name');
var borrow = document.getElementById('borrow');
var re = document.getElementById('return');
var overdue = document.getElementById('overdue');

var li = 1;
var a1 = ['借书日期：', '应还日期：', '剩余天数：'];
var a2 = ['borrow', 'return', 'days'];

var user_id = getCookie('id');

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

var createPage = function(sorter, i) {
    console.log("haha")
    var p = document.createElement("span");
    p.innerHTML = i + 1;
    p.addEventListener("click", get.bind(this, i));
    p.className = "page"
    sorter.appendChild(p);
};
var createSorter = function(sorter, count) {
    while (sorter.hasChildNodes()) {
        sorter.removeChild(sorter.firstChild)
    }
    var page = Math.ceil(count / 9);
    var p = document.createElement("span");
    p.innerHTML = "共" + count + "条";
    p.className = "pageCount";
    sorter.appendChild(p);
    for (var i = 0; i < page; i++) {
        createPage(sorter, i);
    }
};

var get = function(i) {
    getList(i + 1, li);
};

var returnbook = function(num) {
    if (li != 1)
        return
    fetch('http://120.24.4.254:5477/api/return/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "borrow_id": num
        })
    }).then(res => {
        return res.json()
    }).then(value => {
        location.reload()
    })
}


var buildList = function(data, num) {
    while (row.hasChildNodes()) {
        row.removeChild(row.firstChild)
    }
    for (var i = 0; i < num; i++) {
        var box = document.createElement("div");
        box.className = "col";
        row.appendChild(box);
        var item = document.createElement("img");
        item.className = "bookface";
        item.src = data[i].image;
        box.appendChild(item);
        item = document.createElement("div");
        item.className = "caption"
        box.appendChild(item);
        var it = document.createElement("h4");
        it.innerHTML = data[i].name;
        item.appendChild(it);
        it = document.createElement("table");
        createTable(it, data[i]);
        item.appendChild(it);
        it = document.createElement("div");
        it.className = "input";
        if (li == 1)
            it.innerHTML = "还书";
        else if (li == 2)
            it.innerHTML = "还书中...";
        else {
            it.innerHTML = "已超期"
        }
        it.addEventListener("click", returnbook.bind(this, data[i].borrow_id))
        item.appendChild(it);
    }
}

var createTable = function(node, data) {
    for (var i = 0; i < 3; i++) {
        var tr = node.insertRow();
        var td = tr.insertCell();
        td.innerHTML = a1[i];
        td = tr.insertCell();
        td.innerHTML = data[a2[i]];
    }
}
var getList = function(page, status) {
    console.log("hshsh")
    fetch('http://120.24.4.254:5477/api/profile/' + user_id + '/?page=' + page + '&num=9&status=' + status).then(res => {
        return res.json()
    }).then(value => {
        username.innerHTML = '您好，' + value.username
        var now = value.count - (page - 1) * 9
        if (now < 9)
            buildList(value.book, now)
        else
            buildList(value.book, 9)
        createSorter(sorter, value.count)
    })
}
getList(1, 1);
borrow.addEventListener('click', function() {
    li = 1;
    getList(1, li);
})
re.addEventListener('click', function() {
    li = 2;
    getList(1, li);
})
overdue.addEventListener('click', function() {
    li = 3;
    getList(1, li);
})
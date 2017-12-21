var tableNode = document.getElementById("table");
var tableNode2 = document.getElementById("table2");
var submit = document.getElementById("submit");
var sorter = document.getElementById("sorter");
var sorter2 = document.getElementById("sorter2");
var main1 = document.getElementById("main1");
var main2 = document.getElementById("main2");
var side1 = document.getElementById("manageBook");
var side2 = document.getElementById("checkBook");
var input = document.querySelectorAll(".input");
var logout = document.getElementById("logout");
var mask = document.querySelector('.mask');
var modal = mask.querySelector('.modal');
var th = ['编号', '书名', '作者', '书的简介', '操作', '操作'];
var th2 = ['借书人', '借书编号', '书名', '书的编号', '借阅总天数', '还书'];
var tt2 = ['username', 'borrow_id', 'name', 'book_id', 'days'];
var tt = ['book_id', 'name', 'author', 'book_introduction'];
var modify = 0; //0代表加书，1代表修改书
var now_id;
var returnB = 0; //0代表还书，1代表管理书

var deleteTable = function(tableNode) {
    if (tableNode.rows.length) {
        var len = tableNode.rows.length
        for (var i = 0; i < len; i++) {
            tableNode.deleteRow(i)
            len = len - 1
            i = i - 1
        }
    }
}

var createTable = function(tableNode, tableData, th, trow, tcol, tt, flag) {
    deleteTable(tableNode)
    var trNode = tableNode.insertRow();
    var tdNode;
    for (var l = 0; l < tcol; l++) {
        tdNode = trNode.insertCell();
        tdNode.innerHTML = th[l];
        tdNode.style.fontWeight = 'bold';
        tdNode.style.background = "#e4e8f1";
    }
    for (var row = 0; row < trow; row++) {
        var rcol;
        if (flag == 1)
            rcol = tcol - 2;
        else if (flag == 2)
            rcol = tcol - 1;
        trNode = tableNode.insertRow();
        for (var col = 0; col < rcol; col++) {
            tdNode = trNode.insertCell();
            tdNode.innerHTML = tableData[row][tt[col]];
        }
        var div;
        if (flag == 1) {
            tdNode = trNode.insertCell();
            div = document.createElement("div");
            div.innerHTML = "移除";
            div.addEventListener('click', removeRow.bind(this, tableData, tableData[row], row));
            tdNode.appendChild(div);
            tdNode = trNode.insertCell();
            div = document.createElement("div");
            div.innerHTML = "修改";
            div.addEventListener('click', modifyRow.bind(this, tableData, tableData[row], row, tableData));
            tdNode.appendChild(div);
        } else {
            tdNode = trNode.insertCell();
            div = document.createElement("div");
            div.innerHTML = "同意";
            div.addEventListener('click', returnRow.bind(this, tableData[row].borrow_id));
            tdNode.appendChild(div);
        }
    }
};

var createPage = function(sorter, i) {
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
    var page = Math.ceil(count / 5);
    var p = document.createElement("span");
    p.innerHTML = "共" + count + "条";
    p.className = "pageCount";
    sorter.appendChild(p);
    for (var i = 0; i < page; i++) {
        createPage(sorter, i);
    }
};
var getBookList = function(page, num) {
    fetch('http://120.24.4.254:5477/api/admin/book/?page=' + page + "&num=5", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.astWYN5RPh0SMfonvMrCwmuPEPgCx8iCq0IGpFj_Qpo'
        },
    }).then(res => {
        return res.json()
    }).then(value => {
        var now_count = value.count - (page - 1) * num
        if (now_count < num)
            createTable(tableNode, value.book, th, now_count, 6, tt, 1);
        else
            createTable(tableNode, value.book, th, num, 6, tt, 1);
        createSorter(sorter, value.count);
    })
};

var getReturnBooks = function(page, num) {
    fetch('http://120.24.4.254:5477/api/admin/return/?page=' + page + "&num=5", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.astWYN5RPh0SMfonvMrCwmuPEPgCx8iCq0IGpFj_Qpo'
        },
    }).then(res => {
        return res.json()
    }).then(value => {
        var now_count = value.count - (page - 1) * num
        if (now_count < num)
            createTable(tableNode2, value.book, th2, now_count, 6, tt2, 2);
        else
            createTable(tableNode2, value.book, th2, num, 6, tt2, 2);
        createSorter(sorter2, value.count);
    })
};

var postBooks = function(data, url) {
    for (var i = 0; i < 9; i++) {
        if (data[i].value == "") {
            modal.innerHTML = "请完善信息"
            mask.style.display = "block"
            setTimeout(function() {
                mask.style.display = "none";
            }, 2000)
            return;

        }
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.astWYN5RPh0SMfonvMrCwmuPEPgCx8iCq0IGpFj_Qpo'
        },
        body: JSON.stringify({
            name: data[0].value,
            author: data[2].value,
            isbn: data[4].value,
            press: data[5].value,
            publication_time: data[1].value,
            book_introduction: data[8].value,
            author_introduction: data[7].value,
            filed: data[3].value,
            image: data[6].value,
        })
    }).then(res => {
        return res.json()
    }).then(value => {
        mask.style.display = "block"
        setTimeout(function() {
            mask.style.display = "none";
        }, 2000)
        getBookList(1, 5);
    })
};

var get = function(i) {
    if (returnB)
        getReturnBooks(i + 1, 5)
    else
        getBookList(i + 1, 5);
};

var removeRow = function(e, data, id, row) {
    fetch('http://120.24.4.254:5477/api/admin/book/' + data.book_id + '/', {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.astWYN5RPh0SMfonvMrCwmuPEPgCx8iCq0IGpFj_Qpo'
        },
    }).then(res => {
        return res.json()
    }).then(value => {
        getBookList(1, 5);
    })
};

var modifyRow = function(tableData, table, row, tableData) {
    now_id = table.book_id
    input[0].value = table.name
    input[1].value = table.publication_time
    input[2].value = table.author
    input[3].value = table.filed
    input[4].value = table.isbn
    input[5].value = table.press
    input[6].value = table.image
    input[7].value = table.author_introduction
    input[8].value = table.book_introduction
    modify = 1
};
var returnRow = function(id) {
    fetch('http://120.24.4.254:5477/api/admin/return/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.astWYN5RPh0SMfonvMrCwmuPEPgCx8iCq0IGpFj_Qpo'
        },
        body: JSON.stringify({
            borrow_id: id
        })
    }).then(res => {
        return res.json()
    }).then(value => {
        getReturnBooks(1, 5);
    })
};

var showTable1 = function() {
    main1.style.display = "inline-block";
    main2.style.display = "none";
    returnB = 0;
}
var showTable2 = function() {
    main1.style.display = "none";
    main2.style.display = "inline-block";
    returnB = 1;
}

getBookList(1, 5);
getReturnBooks(1, 5);
showTable1();

submit.addEventListener('click', function() {
    if (modify) {
        postBooks(input, "http://120.24.4.254:5477/api/admin/book/" + now_id + "/");
        modify = 0
    } else {
        postBooks(input, "http://120.24.4.254:5477/api/admin/book/add/")
    }
})
side1.addEventListener('click', function() {
    showTable1()
})
side2.addEventListener('click', function() {
    showTable2()
})
logout.addEventListener('click', function() {
    window.location = "/management/login/"
})
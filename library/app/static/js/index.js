var content = document.querySelectorAll('.content');
var tab = document.querySelectorAll('.tab');
var book_item = document.querySelectorAll('.book-item');
var choice = document.querySelectorAll('.choice');
var way = 1;
var filed = "文学"
$(function() {
    $('.select').click(function() {
        $('.select_pop').stop().toggle();
    });
    $('.search .button').hover(function() {
        $(this).addClass('button_hover');
    }, function() {
        $(this).removeClass('button_hover');
    });
    $("#s_all a").click(function() {
        var sval = $(this).find("span").html();
        var stype = $(this).find("span").attr("class");
        $("#lm").html(sval);
        $("#stype").val(stype);
    })

});

function check() {
    if ($("#stype").val() == "zz") {
        way = 2;
    } else if ($("#stype").val() == "mb") {
        way = 1;
    }
    window.location = "/search/?body=" + $(".text")[0].value + "&page=1&num=20&way=" + way;
}
var changeTabStyle = function() {
    for (var i = 0; i < choice.length; i++) {
        choice[i].addEventListener('click', function() {
            console.log("hahah")
            for (var j = 0; j < choice.length; j++) {
                choice[j].className = "choice";
            }
            this.className += " nowChoice"
            filed = this.innerHTML;
            console.log(filed)
            getBorrowbook()
        })
    }
}

var wrap = document.getElementById("wrap");
var inner = document.getElementById("inner");
var spanList = document.getElementById("paganation").getElementsByTagName("span");
var left = document.getElementById("left");
var right = document.getElementById("right");

var clickFlag = true; //设置左右切换标记位防止连续按
var time //主要用来设置自动滑动的计时器
var index = 0; //记录每次滑动图片的下标
var Distance = wrap.offsetWidth; //获取展示区的宽度，即每张图片的宽度
//定义图片滑动的函数
function AutoGo() {
    var start = inner.offsetLeft; //获取移动块当前的left的开始坐标
    var end = index * Distance * (-1); //获取移动块移动结束的坐标。
    //计算公式即当移动到第三张图片时，图片下标为2乘以图片的宽度就是块的left值。
    var change = end - start; //偏移量

    var timer; //用计时器为图片添加动画效果
    var t = 0;
    var maxT = 30;
    clear(); //先把按钮状态清除,再让对应按钮改变状态
    if (index == spanList.length) {
        spanList[0].className = "selected";
    } else {
        spanList[index].className = "selected";
    }
    clearInterval(timer); //开启计时器前先把之前的清
    timer = setInterval(function() {
        t++;
        if (t >= maxT) { //当图片到达终点停止计时器
            clearInterval(timer);
            clickFlag = true; //当图片到达终点才能切换
        }
        inner.style.left = change / maxT * t + start + "px"; //每个17毫秒让块移动
        if (index == spanList.length && t >= maxT) {
            inner.style.left = 0;
            index = 0;
            //当图片到最后一张时把它瞬间切换回第一张，由于都同一张图片不会影响效果
        }
    }, 17);
}
//编写图片向右滑动的函数
function forward() {
    index++;
    //当图片下标到最后一张把小标换0
    if (index > spanList.length) {
        index = 0;
    }
    AutoGo();
}
//编写图片向左滑动函数
function backward() {
    index--;
    //当图片下标到第一张让它返回到倒数第二张，
    //left值要变到最后一张才不影响过渡效果
    if (index < 0) {
        index = spanList.length - 1;
        inner.style.left = (index + 1) * Distance * (-1) + "px";
    }
    AutoGo();
}

//开启图片自动向右滑动的计时器
time = setInterval(forward, 3000);

//设置鼠标悬停动画停止
wrap.onmouseover = function() {
    clearInterval(time);
}
wrap.onmouseout = function() {
    time = setInterval(forward, 3000);
}

//遍历每个按钮让其切换到对应图片
for (var i = 0; i < spanList.length; i++) {
    spanList[i].onclick = function() {
        index = this.innerText - 1;
        AutoGo();
    }
}

//左切换事件
left.onclick = function() {
        if (clickFlag) {
            backward();
        }
        clickFlag = false;
    }
    //右切换事件
right.onclick = function() {
    if (clickFlag) {
        forward();
    }
    clickFlag = false;
}

//清除页面所有按钮状态颜色
function clear() {
    for (var i = 0; i < spanList.length; i++) {
        spanList[i].className = "";
    }
}
var getBorrowbook = function() {
    fetch('http://120.24.4.254:5477/api/rank/?filed=' + filed).then(res => {
        return res.json()
    }).then(value => {
        for (var i = 0; i < value.count; i++) {
            var img = content[i].getElementsByTagName('img')[0];
            var p = content[i].getElementsByTagName('p')[0];
            var title = tab[i].getElementsByTagName('a')[0];
            img.src = value.book[i].image
            p.innerHTML = value.book[i].book_introduction
            title.href = '/book/' + value.book[i].book_id + '/'
            title.innerHTML = value.book[i].name
        }
    })
}

var getNewbook = function() {
    fetch('http://120.24.4.254:5477/api/new/').then(res => {
        return res.json()
    }).then(value => {
        for (var i = 0; i < 5; i++) {
            var img = book_item[i].getElementsByTagName('img')[0];
            var title = book_item[i].getElementsByTagName('h3')[0];
            var author = book_item[i].querySelector('.author');
            var intro = book_item[i].querySelector('.intro');
            img.src = value.book[i].image;
            title.innerHTML = value.book[i].name;
            author.innerHTML = value.book[i].author;
            intro.innerHTML = value.book[i].book_introduction;
            title.addEventListener('click', toSecond.bind(this, value.book[i].book_id))
        }
    })
}

var toSecond = function(id) {
    window.location = '/book/' + id + '/'
}

getBorrowbook()
getNewbook()
changeTabStyle()
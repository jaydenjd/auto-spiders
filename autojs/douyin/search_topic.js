
let appName = '抖音短视频'

function startAPP() {
    // console.show(); //开启日志（悬浮窗权限）
    console.info(appName);
    if (currentPackage() != "com.ss.android.ugc.aweme") {
        toastLog("即将打开" + appName);
        // 启动APP
        // app.launch("com.ss.android.ugc.aweme");
        app.launchApp(appName);
        sleep(random(3000, 8000));

    } else {
        // toastLog("已经在抖音，即将开始进行下一步操作！");
        log("已经在抖音，即将开始进行下一步操作！")
    };
}

function clickByXY(widget){
    // 有些组件是不可点击的，这里封装下，改成点击其坐标
    if (!widget.clickable()){
        var b = widget.bounds();
        click(b.centerX(), b.centerY());
    }
    else {
        widget.click()
    }
}

// 返回首页
function back2HomePage() {
    // 每次都回到首页，首页的标识特征之一，就是有搜索按钮
    while(!desc("搜索").exists()) {
        back();
        sleep(random(500, 1000))
    }
}

function searchTopic(keyword) {
    // toast('已经返回到首页');
    sleep(random(2000, 3000))
    // 直到`搜索框`出现
    while (!id("aoh").exists()){
        // 点击搜索
        clickByXY(desc("搜索").findOne(1000));
        sleep(random(1000, 3000));
    }
    sleep(random(500, 1000));
    if (id("aoh").exists()) {
        setText(keyword) ; //在光标处输入数据
    }
    else {
        searchTopic(keyword)
    }
    sleep(random(1000, 2000));
    // 根据坐标选择第一个词条，但这样可能得适配不同手机？
    click(127,242);
    sleep(random(2000, 3000));
}

function douyinSearch(keyword) {
    searchTopic(keyword) // 搜索
    while (!text('话题').exists()) {
        sleep(random(500, 1000));
    }
    clickByXY(text("话题").findOne());
    // 判断 `话题` 是否被选中
    sleep(random(1000, 1500));
    if (text("话题").findOne().selected()){
        scrollDown("暂时没有更多了");
    }
    sleep(3000, 5000);
    back2HomePage()
}


//防止封号,模拟滚动
function randomSwipeDown(startY, endY) {
    swipe(random(200, 300), random(startY - 100, startY + 100), random(200, 300), random(endY - 100, endY + 100), random(300, 400))
}

//滑动到最后
function scrollDown(end_word) {
    while (!(textContains(end_word).exists())) {
        sleep(random(500, 1000));
        randomSwipeDown(1100, 300);
    }
    toast('滑到最后啦');
    sleep(random(1000, 3000));
}

// 读取文件
function getFileContent(_file) {
    // var keywords = new Array();
    if (!files.exists(_file)) {
        toastLog(_file + ' 文件不存在')
        return []
    }
    var fileContents = files.read(_file);
    contents = fileContents.split('\n');
    return contents;
}

function run() {
    let _file = '/sdcard/word.txt'
    var fileContents = getFileContent(_file)
    toastLog(fileContents.length)
    fileContents.forEach(keyword=>{
        // 每次都去判断 APP 是否打开，如是则忽略，反之打开。以防 app 中途卡死退出了
        startAPP()
        toastLog('下一关键词: ' + keyword)
        sleep(random(2000, 3000))
        douyinSearch(keyword)
    })
    ding('关键词搜索完毕')

}


function ding(msg){
    // 钉钉机器人
    url = 'https://oapi.dingtalk.com/robot/send?access_token=0d3989197bd0454f362dd75030ef8756815a66929c50cc7aa615cc64ad5f3da13'
    msg = '### frida 真机异常监控 \n\n\r' + msg+'\n'
    r = http.postJson(url, {
        msgtype: "markdown",
        markdown: {
            "title": 'frida 真机群控监控',
            "text": msg
        },
        at: {"isAtAll": false}
    });
    toastLog(r.body.string());

}


run()

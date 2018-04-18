/*这部分代码会动态拆入到每个页面对应的controller中 实现aop*/
/*ng-if domReady事件循环器*/
var whiteNameList = ["price"];//防止刷新页面重复执行controller白名单补丁
var checkDomReady = function(eventName, callback) {
    setTimeout(function() {
        var ngReadyEle = $("div[ng-ready=" + eventName + "]");
        if(ngReadyEle.length == 0) {
            checkDomReady();
        } else {
            return callback();
        }
    }, 100);
}
$scope.regist = function(eventName, callback) {
    checkDomReady(eventName, callback);
}
function isInWhiteNameList(pageName) {
    for(var index = 0; index < whiteNameList.length; index++) {
        if(whiteNameList[index] == pageName) {
            return true;
        }
    }
    return false;
}
for(route in routeConfig) {//无侵入性解决路由加载两次的问题
    var pageName = routeConfig[route].pageName;
    if(window.location.href.indexOf("/" + pageName) > -1 && isInWhiteNameList(pageName)) {
        if(!easySpa.isRouteFastReload) {//防止执行两遍
            easySpa.isRouteFastReload = true;
        } else {
            easySpa.isRouteFastReload = false;
            break;
        }
    }
}
$scope.$on("$destroy", function() {//路由跳转前销毁垃圾对象
    if(typeof Select != "undefined") {//析构select
        for(var select in Select.sharePool) {
            select = null;
        }
        Select.sharePool = {};
    }
    $(".ui-datepicker").remove();
})
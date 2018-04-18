(function() {
    var htmlPool = [];
    var historyUrlPool = [];
    var includeTplPool = {};
    String.prototype.replaceAll  = function(s1,s2) {
        return this.replace(new RegExp(s1,"gm"),s2);
    }
    function delQueStr(url, ref) {
        var str = "";
        if (url.indexOf('?') != -1) {
            str = url.substr(url.indexOf('?') + 1);
        }
        else {
            return url;
        }
        var arr = "";
        var returnurl = "";
        var setparam = "";
        if (str.indexOf('&') != -1) {
            arr = str.split('&');
            for (i in arr) {
                if (arr[i].split('=')[0] != ref) {
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                }
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
        }
        else {
            arr = str.split('=');
            if (arr[0] == ref) {
                return url.substr(0, url.indexOf('?'));
            }
            else {
                return url;
            }
        }
    }
    function isPathChanged() {
        if(historyUrlPool.length >= 2) {
            var prevUrl = historyUrlPool[historyUrlPool.length - 2];
            var currentUrl = historyUrlPool[historyUrlPool.length - 1];
            prevUrl = delQueStr(prevUrl, "t");
            currentUrl = delQueStr(currentUrl, "t");
            if(prevUrl != currentUrl) {
                return true;
            }
        }
        return false;
    }
    function isHashChanged(next, current) {
        if(next && current && next.$$route && current.$$route && next.$$route.templateUrl != current.$$route.templateUrl || isPathChanged()) {
            return true;
        }
        return false;
    }
    function changeRouteModel(next, current) {
        if(next.$$route && next.$$route.isReload && isHashChanged(next, current)) {
            $("body").css({
                "display": "none"
            });
            //setTimeout(function() {
                top.isGoToPage = false;
                window.location.reload();
            //}, 50);
            easySpa.isReloadPage = true;//防止reload后继续执行
        } else {
            //easySpa.clearTimer();//清理定时器
            easySpa.clearCssTpl();//清理css样式
            easySpa.clearEventLoop();//清理事件循环器
            easySpa.delayTime = null;
            easySpa.relateJs = {};
            easySpa.jsTree = {};//存放js的多叉树容器
            easySpa.callbackPool = [];
            easySpa.requireCount = 1;
            easySpa.jsCount = 0;
        }
    }
    function getTpl(url) {
        return $.ajax({
            url: url,
            type: "GET",
            cache: easySpa.isAjaxCache,
            dataType: "html",
            async: false
        }).responseText;
    }
    function compileTpl(tpl, data) {
        return template("", tpl)(data);
    }
    function loadNeededController() {
        var relyJsPath = easySpa.config.relyJsPath;
        for(var key in relyJsPath) {
            if(location.href.indexOf(".html") == -1 && key.indexOf(".html") == -1) {
                var jsArray = relyJsPath[key];
                for(var index = 0; index < jsArray.length; index++) {
                    easySpa.use([jsArray[index]]);

                }
            } else if(key.indexOf(".html") > -1 && location.href.indexOf(key) > -1) {
                var jsArray = relyJsPath[key];
                for(var index = 0; index < jsArray.length; index++) {
                    easySpa.use([jsArray[index]]);

                }
            }
        }
    }
    function isTplInCache(gotoUrl) {
        var tpl = false;
        for(var index = 0; index < htmlPool.length; index++) {
            if(gotoUrl == htmlPool[index]["gotoUrl"]) {
                tpl = htmlPool[index]["gotoUrl"];
                break;
            }
        }
        return tpl;
    }
    function parseInclude(tpl, langData) {
        tpl = tpl.replaceAll("<%", "#%");
        tpl = tpl.replaceAll("%>", "%#");
        tpl = "<div>" + tpl + "</div>";
        var tpl = $(tpl);
        var includeEles = $("[include]", tpl);
        if(!easySpa.isUseCombine) {
            for (var index = 0; index < includeEles.length; index++) {
                var url = $(includeEles[index]).attr("include");
                var html = "";
                if(!includeTplPool[url]) {
                    html = easySpa.getRemoteText(url);
                    includeTplPool[url] = html;
                } else {
                    html = includeTplPool[url];
                }
                html = template("", html)(langData);
                $(includeEles[index]).html(html);
            }
        } else {
            var urls = [];
            for (var index = 0; index < includeEles.length; index++) {
                urls.push($(includeEles[index]).attr("include"));
            }
            if(urls.length == 0) {
                tpl = tpl.html();
                tpl = tpl.replaceAll("#%", "<%");
                tpl = tpl.replaceAll("%#", "%>");
                return tpl;
            }
            var htmls = easySpa.getRemoteText(easySpa.combineLoadUrl + "?urls=" + urls.join(","));
            if(!$.trim(htmls)) {
                tpl = tpl.html();
                tpl = tpl.replaceAll("#%", "<%");
                tpl = tpl.replaceAll("%#", "%>");
                return tpl;
            }
            htmls = htmls.split(easySpa.responseTextMark);
            for(var index = 0; index < htmls.length; index++) {
                var html = template("", htmls[index])(langData);
                $(includeEles[index]).html(html);
            }
        }
        tpl = tpl.html();
        tpl = tpl.replaceAll("#%", "<%");
        tpl = tpl.replaceAll("%#", "%>");
        return tpl;
    }
    /*监听路由改变start*/
    app = angular.module('app', ['ngRoute']);
    app.run(function ($rootScope) {
        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
                historyUrlPool.push(location.href);
                changeRouteModel(next, current);
                if(easySpa.isReloadPage) {
                    return;
                }
                if(next.$$route) {
                    var gotoUrl = next.$$route.templateUrl;
                    var template = next.$$route.template;
                    if(typeof template != "string") {
                        var tpl = isTplInCache(gotoUrl);
                        if(!tpl) {
                            tpl = getTpl(gotoUrl);
                            htmlPool.push({
                               "gotoUrl": tpl
                            });
                        }
                        var route = next.$$route.originalPath;
                        var pageName = route.split("/")[route.split("/").length - 1];
                        var langType = Lang.getCurrentLanguage();
                        var langData = JSON.parse(Lang.getLangData(pageName, langType, "page"));
                        tpl = parseInclude(tpl, langData);
                        tpl = compileTpl(tpl, langData);
                    } else {
                        tpl = template;
                    }
                    if(!easySpa.isReloadPage) {
                        next.$$route.template = tpl;
                    }
                }
                $("div[ng-view]").css("display", "none");
        });
        $rootScope.$on('$routeChangeSuccess', function (evt, next, current) {
            $("div[ng-view]").css("display", "block");
        });
    });
    /*监听路由改变end*/
    app.config(['$routeProvider', "$controllerProvider", "$compileProvider", "$provide", "$httpProvider", function ($routeProvider, $controllerProvider, $compileProvider, $provide, $httpProvider) {
        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory,
            directive: $compileProvider.directive
        };
        app.controller = app.register.controller;//开发者不用修改接口
        app.factory = app.register.factory;//开发者不用修改接口
        /*同步加载资源start*/
        easySpa.insertJsToPage(easySpa.loadCombinAssets(easySpa.combineLoadUrl + "?urls=public/common/minify/ajax.js,public/common/minify/cookie.js,public/common/minify/routeConfig.js,public/common/minify/tplEngine.js,public/common/minify/common.js"));
        //easySpa.use(["public/common/interface.js", "public/common/ajax.js", "public/common/cookie.js","public/common/routeConfig.js", "public/common/tplEngine.js", "public/common/common.js"]);
        /*同步加载资源end*/
        loadNeededController();
        app.directive = app.register.directive;
        var directive = app.directive;
        app.directive = function(widgetName, callback) {//组件国际化
            var config = callback();
            var resetCallBack = function() {
                return config;
            }
            if(config.templateUrl) {
                var templateUrl = "public/widget/" + config.widgetName + "/" + config.templateUrl;
                var langType = Lang.getCurrentLanguage();
                var langContent = !config.isChild ? Lang.getLangData(config.widgetName, langType, "widget") : "{}";
                var langData = langContent ? JSON.parse(langContent) : {};
                config.template = compileTpl(easySpa.getRemoteText(templateUrl), langData);
                delete config.templateUrl;
            } else {
                resetCallBack = callback;
            }
            return directive.apply(this, [widgetName, resetCallBack]);
        }
        var when = $routeProvider.when;
        $routeProvider.when = function(route, config) {
            if(!route) {
                return this;
            }
            return when.apply(this, [route, config]);
        }
        for(var route in routeConfig) {
            routeConfig[route].resolve = easySpa.getController().setAssets(routeConfig[route].pageName, routeConfig[route].timstamp);
            $routeProvider = $routeProvider.when(route, routeConfig[route]);
        }
    }]);
})();

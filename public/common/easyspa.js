(function() {
    var timePool = [];
    var clock = setInterval;
    var exceptionConfig;
    var requireLoadFinishCallback = null;
    var AssetsCache = {};
    var widgetCache = {};
    var minifyDir = "minify";
    //ajax拦截器
    var jqueryAjax = $.ajax;
    $.ajax = function(config) {
        if(config.url.indexOf("?") > -1) {
            config.url = config.url + "&timestamp=" + cacheTime;
        } else {
            config.url = config.url + "?timestamp=" + cacheTime;
        }
        config.cache = isUseCache;
        var success = config.success;
        var error = config.error;
        if(success) {
            config.success = function(data) {
                data = easySpa.httpResponseInterceptor(data);
                success(data);
            }
            jqueryAjax.call(this, config);
        } else if(config.async == false) {
            return jqueryAjax.call(this, config);
        }
    }
    easySpa = {
        isReloadPage: false,//禁止随意改动
        isUseCombine: false,//禁止随意改动
        isAjaxCache: isUseCache,//禁止随意改动
        isRouteFastReload: false//不要随意改动
    };
    easySpa.delayTime = null;//执行页面controller的defer
    easySpa.relateJs = {};//依赖js的存储容器
    easySpa.jsTree = {};//存放js的多叉树容器
    easySpa.callbackPool = [];//存放并行加载的回调函数
    easySpa.requireCount = 1;
    easySpa.jsCount = 0;
    easySpa.combineLoadUrl = "loadAssets.php";
    easySpa.responseTextMark = "/*^~~^*/";
    easySpa.eventLoop = {};
    easySpa.config = {
        paths: {
            widget: "public/widget",
            pageCss: "public/stylesheets",
            pageJs: "public/javascripts",
            service: "public/javascripts/service"
        },
        isDebug: !isUseCache,
        relyJsPath: {}    //配置初次'】加载的controller,如：{"/": ["public/common/initController.js"]}
    }
    easySpa.delQueStr = function(url, ref) {
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
    easySpa.queryUrlValByKey = function(key) {
        var url = window.location.href;
        if(url.indexOf("?") == -1) {
            return;
        }
        var search = url.split('?')[1];
        search = search.split("&");
        for(var index = 0; index < search.length; index++) {
            var searchList = search[index].split("=");
            if(searchList[0] == key) {
                return decodeURIComponent(search[index].split("=")[1]);
            }
        }
        return "";
    }
    easySpa.async = {
        done: function(key, callback, result, taskCount) {
            return function(err, data) {
                var index = 0;
                result[key] = data;
                for(var item in result) {
                    index++;
                    if(index == taskCount) {
                        callback(null, result);
                    }
                }
            }
        },
        parallel : function(config, callback) {
            var result = {};
            var taskCount = 0;
            for(var key in config) {
                taskCount++;
            }
            for(var key in config) {
                config[key](this.done(key, callback, result, taskCount));
            }
        }
    }
    easySpa.httpResponseInterceptor = function(res) {
        if(!exceptionConfig) {
            exceptionConfig = $.ajax({
                url: "public/common/exceptionConfig.json",
                type: "GET",
                async: false,
                cache: easySpa.isAjaxCache
            }).responseText;
            exceptionConfig = JSON.parse(exceptionConfig);
        }
        for(var code in exceptionConfig) {

            if(res[code]) {
                for(var val in exceptionConfig[code]) {
                    if(val == res[code]) {
                        var gotoUrl = exceptionConfig[code][val];
                        if(window.location.href.indexOf("login.html") == -1 && val == "401") {
                            top.location.href = "http://"+ location.host +"/login.html#/login?errorCode=401";
                        } else if(val != "401") {
                           top.location.href = gotoUrl;
                        }
                        break;
                    }
                }
            }
        }
        return res;
    }
    easySpa.clearEventLoop = function() {
        easySpa.eventLoop = {};
    }
    easySpa.clearTimer = function () {
        for(var index = 0; index < timePool.length; index++) {
            clearInterval(timePool[index]);
            timePool[index] = null;
        }
        timePool = [];
    }
    easySpa.clearCssTpl = function() {
        $("#css-box").html("");
    }
    easySpa.getController = function() {
        return new myCtrl();
    }
    function insertJs(path, jsText) {
        $.globalEval(jsText);
    }
    function insertCss(path, cssText) {
        var cssBoxEle = createCommonCssBoxEle();
        var cssId = hex_md5(path);
        if($("#" + cssId).length == 0) {
            var styleEle = document.createElement("style");
            styleEle.id = cssId;
            styleEle.innerHTML = cssText;
            cssBoxEle.append(styleEle);
        }
    }
    function requireJs(path) {
        return function(done) {
            if(path.indexOf("widget/") > -1) {
                done(null, "");
            } else {
                done(null, easySpa.relateJs[path]);
            }
        }
    }
    easySpa.require = function(jsArray, callback) {
        var jsPool = {};
        var isNoUse = false;
        easySpa.callbackPool.push(callback);
        for(var index = 0; index < jsArray.length; index++) {
            if(!AssetsCache[jsArray[index]]) {
                jsPool[jsArray[index]] = requireJs(jsArray[index]);
                AssetsCache[jsArray[index]] = true;
                isNoUse = true;
            }
        }
        if(!isNoUse) {
            easySpa.jsCount++;
            if (easySpa.jsCount == easySpa.requireCount) {
                for (var index = 0; index < easySpa.callbackPool.length; index++) {
                    easySpa.callbackPool[index]();
                }
                easySpa.delayTime.resolve();
            }
        } else {
            easySpa.async.parallel(jsPool, function (err, result) {
                easySpa.jsCount++;
                if (easySpa.jsCount == easySpa.requireCount) {
                    for (var index = 0; index < easySpa.callbackPool.length; index++) {
                        easySpa.callbackPool[index]();
                    }
                    easySpa.delayTime.resolve();
                }
                for (jsPath in result) {
                    if (result[jsPath]) {
                        insertJs(jsPath, result[jsPath]);
                    }
                }
            });
        }
    }
    easySpa.use = function(jsArray, callback) {
        loadJs(jsArray, 0, callback);
    }
    easySpa.getRemoteText = function(url) {
        return $.ajax({
            url: url,
            type: "get",
            dataType: "html",
            cache: easySpa.isAjaxCache,
            async:false
        }).responseText;
    }
    easySpa.loadCombinAssets = function(url) {
        return easySpa.getRemoteText(url);
    }
    easySpa.insertJsToPage = function(jsText) {
        var jsTexts = jsText.split(easySpa.responseTextMark);
        for(var index = 0; index < jsTexts.length; index++) {
            var scriptEle = document.createElement("script");
            scriptEle.innerHTML = jsTexts[index];
            $("head")[0].appendChild(scriptEle);
        }
    }
    window.setInterval = function (cb, timer) {
        var timeId = clock(cb, timer);
        timePool.push(timeId);
        return timeId;
    }
    function createCssBoxEle() {
        var cssBoxEle = $("#css-box");
        var bodyEle = $("body");
        if (cssBoxEle.length == 0) {
            cssBoxEle = $("<div id='css-box'></div>");
            bodyEle.prepend(cssBoxEle);
        }
        return cssBoxEle;
    }
    function createCommonCssBoxEle() {
        var cssBoxEle = $("#common-css-box");
        var bodyEle = $("body");
        if (cssBoxEle.length == 0) {
            cssBoxEle = $("<div id='common-css-box'></div>");
            bodyEle.prepend(cssBoxEle);
        }
        return cssBoxEle;
    }
    function requireCurrentWidget(path) {
        return function(done) {
            var fileName = path.split("/")[2];
            if(path.indexOf(".lang") > -1) {
                $.ajax({
                    url: path,
                    type: "get",
                    dataType: "html",
                    cache: easySpa.isAjaxCache,
                    success: function(langData) {
                        /*加载widget lang start*/
                        if(typeof Lang == "object") {
                            if (!Lang.dataPool["widget/" + fileName]) {
                                Lang.dataPool["widget/" + fileName] = JSON.parse(langData);
                            }
                        }
                        done(null, "");
                        /*加载widget lang end*/
                    }
                });
            } else if(path.indexOf(".js") > -1) {
                $.ajax({
                    url: path,
                    type: "get",
                    dataType: "html",
                    cache: easySpa.isAjaxCache,
                    success: function(jsText) {
                        insertJs(path, jsText);
                        done(null, "");
                    }
                });
            } else if(path.indexOf(".css") > -1) {
                $.ajax({
                    url: path,
                    type: "get",
                    dataType: "html",
                    cache: easySpa.isAjaxCache,
                    success: function(cssText) {
                        insertCss(path, cssText);
                        done(null, "");
                    }
                });
            }
        }
    }
    function requireWidget(url, done) {
        if(widgetCache[url]) {
            done(null, "");
            return;
        }
        var headEle = $("head")[0];
        var cssBoxEle = createCommonCssBoxEle();
        var fileName = url.split("/")[1];
        var cssUrl;
        var directiveUrl;
        var assetsPool = [];
        if(easySpa.config.isDebug) {
            cssUrl = easySpa.config.paths.widget + "/" + fileName + "/" + fileName + ".css";
            directiveUrl = easySpa.config.paths.widget + "/" + fileName + "/" + fileName + "Directive.js";
            assetsPool.push(cssUrl);
            assetsPool.push(directiveUrl);
        } else {
            cssUrl = easySpa.config.paths.widget + "/" + fileName + "/" + minifyDir + "/" + fileName + ".css";
            directiveUrl = easySpa.config.paths.widget + "/" + fileName + "/" + minifyDir + "/" + fileName + "Directive.js";
            assetsPool.push(cssUrl);
            assetsPool.push(directiveUrl);
        }
        if(typeof Lang == "object") {
            var languageName = Lang.getCurrentLanguage();
            var langUrl = easySpa.config.paths.widget + "/" + fileName + "/" + languageName + ".lang";
            assetsPool.push(langUrl);
        }
        var jsPool = {};
        for(var index = 0; index < assetsPool.length; index++) {
            jsPool[assetsPool[index]] = requireCurrentWidget(assetsPool[index]);
        }
        easySpa.async.parallel(jsPool, function(err, result) {
            widgetCache[url] = true;
            done(null, "");
        });
    }
    function loadWidget(url) {
        if(widgetCache[url]) {
            return;
        }
        var headEle = $("head")[0];
        var cssBoxEle = createCommonCssBoxEle();
        var fileName = url.split("/")[1];
        var cssUrl;
        var directiveUrl;
        if(easySpa.config.isDebug) {
            cssUrl = easySpa.config.paths.widget + "/" + fileName + "/" + fileName + ".css";
            directiveUrl = easySpa.config.paths.widget + "/" + fileName + "/" + fileName + "Directive.js";
        } else {
            cssUrl = easySpa.config.paths.widget + "/" + fileName + "/" + minifyDir + "/" + fileName + ".css";
            directiveUrl = easySpa.config.paths.widget + "/" + fileName + "/" + minifyDir + "/" + fileName + "Directive.js";
        }
        /*加载widget lang start*/
        if(typeof Lang == "object") {
            var languageName = Lang.getCurrentLanguage();
            var langUrl = easySpa.config.paths.widget + "/" + fileName + "/" + languageName + ".lang";
            if (!Lang.dataPool["widget/" + fileName]) {
                var langData = easySpa.getRemoteText(langUrl);
                Lang.dataPool["widget/" + fileName] = JSON.parse(langData);
            }
        }
        /*加载widget lang end*/
        /*同步加载样式start*/
        var cssTpl = easySpa.getRemoteText(cssUrl);
        var directiveTpl = easySpa.getRemoteText(directiveUrl);
        var cssId = hex_md5(cssUrl);
        var directiveId = hex_md5(directiveUrl);
        var styleEle = document.createElement("style");
        styleEle.id = cssId;
        styleEle.innerHTML = cssTpl;
        cssBoxEle.append(styleEle);
        /*同步加载样式end*/
        /*同步加载directive start*/
        var scriptEle = document.createElement("script");
        scriptEle.id = directiveId;
        scriptEle.innerHTML = directiveTpl;
        headEle.appendChild(scriptEle);
        widgetCache[url] = true;
        /*同步加载directive end*/
    }
    function loadService(url) {
        var headEle = $("head")[0];
        var fileName = url.split("/")[1];
        var serviceUrl;
        if(easySpa.config.isDebug) {
            serviceUrl = easySpa.config.paths.service + "/" + fileName + ".js";
        } else {
            serviceUrl = easySpa.config.paths.service + "/" + minifyDir + "/" + fileName + ".js";
        }

        var serviceTpl = easySpa.getRemoteText(serviceUrl);
        var serviceId = hex_md5(serviceUrl);
        var scriptEle = document.createElement("script");
        scriptEle.id = serviceId;
        scriptEle.innerHTML = serviceTpl;
        headEle.appendChild(scriptEle);
    }
    function loadJs(jsArray, index, callback) {
        if(!easySpa.isUseCombine) {
            if (index == jsArray.length) {
                if (callback) {
                    return callback();
                }
                return;
            }
            if (jsArray[index].indexOf(".css") > -1) {
                var cssBoxEle = createCssBoxEle();
                var styleEle = document.createElement("style");
                styleEle.id = hex_md5(jsArray[index]);
                var cssTpl;
                if ($("#" + styleEle.id).length == 0) {
                    cssTpl = $.ajax({
                        url: jsArray[index],
                        type: "GET",
                        dataType: "html",
                        async: false,
                        cache: easySpa.isAjaxCache
                    }).responseText;
                    styleEle.innerHTML = cssTpl;
                    cssBoxEle.append(styleEle);
                    index++;
                    return loadJs(jsArray, index, callback);
                }
            }
            var scriptId = hex_md5(jsArray[index]);
            if ($("#" + scriptId).length > 0) {
                index++;
                return loadJs(jsArray, index, callback);
            }
            if (jsArray[index].indexOf("widget") == -1 && jsArray[index].indexOf("service") == -1) {
                var headEle = $("head")[0];
                var scriptEle = document.createElement("script");
                scriptEle.id = scriptId;
                var scriptTpl = $.ajax({
                    url: jsArray[index],
                    type: "get",
                    dataType: "html",
                    async: false,
                    cache: easySpa.isAjaxCache
                }).responseText;
                scriptEle.innerHTML = scriptTpl;
                headEle.appendChild(scriptEle);
            } else if (jsArray[index].indexOf("widget") != -1) {
                loadWidget(jsArray[index]);
            } else {
                loadService(jsArray[index]);
            }
            index++;
            loadJs(jsArray, index, callback);
        } else {
            var jsPool = [];
            for(var index = 0; index < jsArray.length; index++) {
                if(jsArray[index].indexOf("widget") == -1 && jsArray[index].indexOf("service") == -1) {
                    jsPool.push(jsArray[index]);
                } else if(jsArray[index].indexOf("widget") != -1) {
                    jsPool.push(easySpa.config.paths.widget + "/" + jsArray[index].split("/")[1] + "/" + jsArray[index].split("/")[1] + ".css");
                    jsPool.push(easySpa.config.paths.widget + "/" + jsArray[index].split("/")[1] + "/" + jsArray[index].split("/")[1] + "Directive.js");
                } else {
                    jsPool.push(easySpa.config.paths.service + "/" + jsArray[index].split("/")[1] + ".js");
                }
            }
            if(jsPool.length > 0) {
                var assetsTpl = $.ajax({
                    url: easySpa.combineLoadUrl,
                    type: "get",
                    dataType: "html",
                    data: {urls: jsPool.join(",")},
                    async: false,
                    cache:easySpa.isAjaxCache
                }).responseText;
                if(!$.trim(assetsTpl)) {
                    return;
                }
                var assetsTpls = assetsTpl.split(easySpa.responseTextMark);
                for(var index = 0; index < assetsTpls.length; index++) {
                    var assetsId = hex_md5(jsPool[index]);
                    if ($("#" + assetsId).length > 0) {
                         continue;
                    }
                    if(jsPool[index].indexOf("widget") > -1) {//如果包含组件
                        var headEle = $("head")[0];
                        var cssBoxEle = createCommonCssBoxEle();
                        if(jsPool[index].indexOf(".js") > -1) {
                            if(typeof Lang == "object") {
                                var languageName = Lang.getCurrentLanguage();
                                var fileName = jsPool[index].split("/")[2];
                                var langUrl = easySpa.config.paths.widget + "/" + fileName + "/" + languageName + ".lang";
                                if (!Lang.dataPool["widget/" + fileName]) {
                                    var langData = easySpa.getRemoteText(langUrl);
                                    Lang.dataPool["widget/" + fileName] = JSON.parse(langData);
                                }
                            }
                            var scriptEle = document.createElement("script");
                            scriptEle.id = assetsId;
                            scriptEle.innerHTML = assetsTpls[index];
                            $("head")[0].appendChild(scriptEle);
                        } else if(jsPool[index].indexOf(".css") > -1) {
                            var styleEle = document.createElement("style");
                            styleEle.id = assetsId;
                            styleEle.innerHTML = assetsTpls[index];
                            cssBoxEle.append(styleEle);
                        }
                    } else {
                        var scriptEle = document.createElement("script");
                        scriptEle.id = assetsId;
                        scriptEle.innerHTML = assetsTpls[index];
                        $("head")[0].appendChild(scriptEle);
                    }
                }
            }
        }
    }
    function loadCssTpl(assetId, cssPath, callback) {
        var cssBoxEle = createCssBoxEle();
        var styleEle = document.createElement("style");
        styleEle.id = assetId;
        if ($("#" + styleEle.id).length == 0) {
            $.ajax({
                url: cssPath,
                type: "GET",
                dataType: "html",
                cache: easySpa.isAjaxCache,
                success: function (cssTpl) {
                    styleEle.innerHTML = cssTpl;
                    cssBoxEle.append(styleEle);
                    callback();
                },
                error: function (error) {
                    callback();
                }
            });
        } else {
            callback();
        }
    }
    function insertScriptHtml(scriptHtml) {
        var reflectJs = easySpa.getRemoteText("public/common/reflect.js");
        var insertStartPoint = scriptHtml.indexOf("{", scriptHtml.indexOf("app.controller"));
        var firstJsFragment = scriptHtml.substring(0, insertStartPoint + 1);
        var lastJsFragment = scriptHtml.substring(insertStartPoint + 1, scriptHtml.length);
        scriptHtml = firstJsFragment + "\n" + reflectJs + "\n" + lastJsFragment;
        return scriptHtml;
    }
    function requireAssets(path) {
        return function(done) {
            $.ajax({
                url: path,
                type: "get",
                dataType: "html",
                cache: easySpa.isAjaxCache,
                success: function(data) {
                    done(null, data);
                }
            });
        }
    }
    function parseJS(controllerText) {
        var startJs = "easySpa.require([";
        var endJs = "]";
        var startJsPos = controllerText.indexOf(startJs);
        var endJsPos = controllerText.indexOf(endJs, startJsPos);
        var pathArray = [];
        if(startJsPos > -1) {
            var pathArrayCopy = controllerText.substring(startJsPos + startJs.length, endJsPos).split(",");
            for(var index = 0; index < pathArrayCopy.length; index++) {
                if(pathArrayCopy[index].indexOf("'") > -1) {
                    pathArray.push($.trim(pathArrayCopy[index].replaceAll("'", "")));
                } else {
                    pathArray.push($.trim(pathArrayCopy[index].replaceAll('"', "")));
                }
            }
        }
        return pathArray;
    }
    function requireRalateJs(path) {
        return function(done) {
            if(path.indexOf("widget/") > -1) {
                requireWidget(path, done);
            } else {
                if(path.indexOf("service/") > -1) {
                    var fileName = path.split("/")[1];
                    if(!easySpa.config.isDebug) {
                        path = easySpa.config.paths.service + "/" + minifyDir + "/" + fileName + ".js";
                    } else {
                        path = easySpa.config.paths.service + "/" + fileName + ".js";
                    }
                } else if(path.indexOf("common/") > -1) {
                    var headPath = path.substring(0, path.lastIndexOf("/"));
                    var footPath = path.substring(path.lastIndexOf("/"), path.length);
                    if(!easySpa.config.isDebug) {
                        path = headPath + "/" + minifyDir + footPath;
                    }
                } else if(path.indexOf("fragment/") > -1) {
                    var headPath = path.substring(0, path.lastIndexOf("/"));
                    var footPath = path.substring(path.lastIndexOf("/"), path.length);
                    if(!easySpa.config.isDebug) {
                        path = headPath + "/" + minifyDir + footPath;
                    }

                } else if(path.indexOf("javascripts/") > -1) {
                    if(!easySpa.config.isDebug) {
                        path = path.replaceAll("20161224", minifyDir);
                    }
                }
                $.ajax({
                    url: path,
                    type: "get",
                    dataType: "html",
                    cache: easySpa.isAjaxCache,
                    success: function (data) {
                        done(null, data);
                    }
                });
            }
        }
    }
    function checkJsLoadFinish(jsTree, controllerPath) {
        var isOk = true;
        for(var key in jsTree) {
            var nextNode = jsTree[key].nextNode;
            var isLeaf = jsTree[key].isLeaf;
            if(!isLeaf) {
                for(var index = 0; index < nextNode.length; index++) {
                    if(!jsTree[nextNode[index]]) {//只要有一个节点还没有加载进来
                        isOk = false;
                    }
                }
            }
        }
        if(isOk) {
            requireLoadFinishCallback(controllerPath);
        }
    }
    function getAllRelateJs(jsPath, controllerText, controllerPath, callback) {
        var pathArray = parseJS(controllerText);
        if(callback && pathArray.length == 0) {
            requireLoadFinishCallback(controllerPath);
            return;
        }
        var jsPool = {};
        for(var index = 0; index < pathArray.length; index++) {
            jsPool[pathArray[index]] = requireRalateJs(pathArray[index]);
        }
        easySpa.async.parallel(jsPool, function(err, result) {
             var parentNode = easySpa.jsTree[jsPath];
             for(var key in result) {
                 easySpa.relateJs[key] = result[key];
                 if(parentNode.nextNode.indexOf(key) == -1) {
                     parentNode.nextNode.push(key);
                 }
                 easySpa.jsTree[key] = {//为下一个节点分配存储空间
                     prevNode: parentNode,
                     nextNode: []
                 };
                 if(result[key]) {//存储树杈
                     var pa = parseJS(result[key]);
                     if(pa.length > 0) {
                         easySpa.requireCount++;
                         easySpa.jsTree[key].nextNode = pa;
                         easySpa.jsTree[key].isLeaf = false;
                     } else {
                         easySpa.jsTree[key].isLeaf = true;
                     }
                     getAllRelateJs(key, result[key], controllerPath, false);
                 } else {
                     easySpa.jsTree[key].isLeaf = true;
                 }
             }
            checkJsLoadFinish(easySpa.jsTree, controllerPath);
        });
    }
    function loadAssets(delay, assetsArray, index) {
        var count = 0;
        easySpa.delayTime = delay;
        var jsPool = {};
        for(var index = 0; index < assetsArray.length; index++) {
            jsPool[assetsArray[index]] = requireAssets(assetsArray[index]);
        }
        easySpa.async.parallel(jsPool, function(err, result) {
            for(jsPath in result) {
                if(jsPath.indexOf(".js") > -1) {
                    if(jsPath.indexOf("Controller") > -1) {
                        easySpa.jsTree[jsPath] = {//放入根结点
                            nextNode: [],
                            preNode: null,
                            isLeaf: false
                        };
                        var isCallbackCanExec = true;
                        requireLoadFinishCallback = function(controllerPath) {
                            count++;
                            insertJs(controllerPath, result[controllerPath]);
                            if(count == assetsArray.length) {
                                if(result[controllerPath].indexOf("easySpa.require([") == -1) {
                                    resolve();
                                }
                            }
                        };
                        getAllRelateJs(jsPath, result[jsPath], jsPath, true);
                    } else {
                        count++;
                        insertJs(jsPath, result[jsPath]);
                        if(count == assetsArray.length) {
                            resolve();
                        }
                    }
                } else if(jsPath.indexOf(".css") > -1) {
                    count++;
                    insertCss(jsPath, result[jsPath]);
                    if(count == assetsArray.length) {
                        resolve();
                    }
                }
            }
            function resolve() {
                delay.resolve();
            }
        });
    }
    function buildAssetPath(pageName, timestamp) {
        var assetsPath;
        if(easySpa.config.isDebug) {
            assetsPath = [
                easySpa.config.paths.pageCss + "/" + pageName + "/" + timestamp + "/" + pageName + ".css",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + timestamp + "/" + pageName + "Service.js",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + timestamp + "/" + pageName + "Controller.js",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + timestamp + "/" + pageName + "View.js"
            ];
        } else {
            assetsPath = [
                easySpa.config.paths.pageCss + "/" + pageName + "/" + minifyDir + "/" + pageName + ".css",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + minifyDir + "/" + pageName + "Service.js",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + minifyDir + "/" + pageName + "Controller.js",
                easySpa.config.paths.pageJs + "/" + pageName + "/" + minifyDir + "/" + pageName + "View.js"
            ];
        }
        return assetsPath;
    }
    function myCtrl() {
        var self = this;
        this.AssetsPath = [];
        this.resolve = {
            delay: function ($q) {
                if(easySpa.isReloadPage) { //防止reload后继续执行
                    return;
                }
                var delay = $q.defer();
                loadAssets(delay, self.AssetsPath, 0);
                return delay.promise;
            }
        };
        this.setAssets = function (pageName, timestamp) {
            this.AssetsPath = buildAssetPath(pageName, timestamp);
            return this.resolve;
        }
    }
})();

(function() {
    var cookie = {
        set: function (key, val, time) {//设置cookie方法
            var date = new Date(); //获取当前时间
            var expiresDays = time;  //将date设置为n天以后的时间
            date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
            document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
        },
        get: function (key) {//获取cookie方法
            /*获取cookie参数*/
            var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
            var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
            var tips;  //声明变量tips
            for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
                var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
                if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                    tips = arr[1];   //将cookie的值赋给变量tips
                    break;   //终止for循环遍历
                }
            }
            return tips;
        },
        delete: function (key) { //删除cookie方法
            var date = new Date(); //获取当前时间
            date.setTime(date.getTime() - 10000); //将date设置为过去的时间
            document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
        }
    }
    Lang = {
        dataPool: {},
        langData: {}
    };
    Lang.langLibrary = function() {
        return {
            "zh-CN":"简体中文",
            "zh-HK":"繁體中文",
            "en-US":"English"
        };
    }
    Lang.getCurrentLanguage = function() {
        return cookie.get("language") ? cookie.get("language") : "zh-CN";
    }
    Lang.defaultTxt = function(key) {
        return Lang.langLibrary()[Lang.getCurrentLanguage()];
    }
    Lang.getBrowserLang = function() {
        return navigator.language ? navigator.language : navigator.browserLanguage;
    }
    Lang.getValByKey = function(pageName, key) {
        if(Lang.dataPool[pageName]) {
            return Lang.dataPool[pageName][key];
        }
    }
    Lang.getLangData = function(pageName, languageName, type) {
        var url = "";
        var commonUrl = "";
        var commonLangText = "";
        var commonLangJson = {};
        var langTextJson = {};
        if(type == "page" || type == "common") {
            url = "languages/" + pageName + "/" + languageName + ".lang";
        } else if(type == "widget") {
            url = "public/widget/" + pageName + "/" + languageName + ".lang";
        }
        if(type == "page") {
            commonUrl = "languages/" + "common" + "/" + languageName + ".lang";
        }
        var langText = $.ajax({
            url: url,
            dataType: "html",
            type: "GET",
            async: false,
            cache:easySpa.isAjaxCache
        }).responseText;
        if(commonUrl) {
            commonLangText = $.ajax({
                url: commonUrl,
                dataType: "html",
                type: "GET",
                async: false,
                cache:easySpa.isAjaxCache
            }).responseText;
        }
        try {
            commonLangJson = commonLangText ?  JSON.parse(commonLangText) : {};
            langTextJson = JSON.parse(langText);
            $.extend(true, commonLangJson, langTextJson);
            Lang.dataPool[pageName] = commonLangJson;
            langText = JSON.stringify(commonLangJson);
        } catch(e) {
            commonLangJson = commonLangText ?  JSON.parse(commonLangText) : {};
            Lang.dataPool[pageName] = commonLangJson;
            langText = JSON.stringify(commonLangJson);
        }
        return langText;
    }
    Lang.switchLang = function(language) {
        cookie.set("language", language, 30);
    }
})();
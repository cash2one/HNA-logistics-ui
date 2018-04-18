;(function(){
    "use strict";
    window.isGoToPage = true;
    function setIframeUrl() {
        var hrefs = location.href.split("#");
        if(hrefs.length > 0 && hrefs[1]) {
            if(hrefs[1].indexOf("?") == -1) {
                $("#iframe")[0].src = "iframe.html#" + hrefs[1] + "?t=" + new Date().getTime();
            } else {
                $("#iframe")[0].src = "iframe.html#" + hrefs[1] + "&t=" + new Date().getTime();
            }
        }
    }
    window.onload = function() {
        setIframeUrl();
    };
    window.onhashchange = function() {
        isGoToPage = true;
        setIframeUrl();
    };

    window.setIframeLayerMostHigh = function() {
        $("#iframe-box").css("z-index", 1008);
    };
    window.resetIframeLayerZindex = function() {
        $("#iframe-box").css("z-index", 1000);
    };
    window.hideDropDownList = function() {
        $(".navbar-custom-menu .dropdown").removeClass("open");
    };

    //jQuery extend function
    $.extend({
        dropdown:function(btobj, clickobj){
            $(btobj).click(function(e) {
                if($(this).hasClass('open')){
                    $(btobj).removeClass('open');
                }else{
                    $(btobj).removeClass('open');
                    $(this).addClass('open');
                }
                e.stopPropagation();
            });
            $(document).click(function() {
                $(btobj).removeClass('open');
            });
        }
    });
    $.dropdown(".dropdown");

    //ajax基础配置
    var token = cookie.get("token");
    $.ajaxSetup({
        headers: {
            "x-token": token
        },
        async: true,
        cache: true
    });

    /**
     * 获取用户基本信息
     */
    function getUserInfo(){
        $.ajax({
            url:"/api/v1/u/profile",
            success:function(res){
                if(res.errorCode === 0){
                    var data = res.data || {};

                    var language = data.uc != null ? data.uc.i18n : '';

                    if(language && language != currentLanguageKey){    //用户配置了语言，但是和当前cookie里面的语言不一致。
                        cookie.set("language", language, 30);    //更新cookie为用户设置的语言
                        window.location.reload();
                    }else if(!language){    //用户未曾配置过语言
                        setUserConf({"i18n": currentLanguageKey});
                    }else{    //用户配置过语言，且和当前本地语言一致。
                        //显示个人头像和账号信息
                        $('#user-info span').text(data.fullName);

                        if(data.avatarPath){
                            var src = data.avatarPath;
                        }else{    //默认图片。1：男 ； 2：女； 3：未知
                            var src = data.sex == 'f' ? 'public/img/avatar2.png' : 'public/img/avatar1.png';
                        }
                        cookie.set("sex",data.sex);
                        cookie.set("fullName",data.fullName);
                        cookie.set("userId",data.userId);
                        $('#user-info img').attr('src', src);
                        $('#user-info').show();
                    }
                }else{
                    window.location.href = "http://"+ window.location.host +"/login.html#/login?errorCode=401";
                }
            }
        });
    }
    getUserInfo();

    /**
     * 设置用户个性化语言
     * @param config
     */
    function setUserConf(config) {
        var language = config.i18n;
        config = JSON.stringify(config);
        $.ajax({
            url: "/api/v1/u/userconfig",
            data: config,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            success:function(res){
                if(res.errorCode === 0){
                    cookie.set("language", language, 30);
                    window.location.reload();
                }
            }
        });
    }

    /**
     * 语言模块
     */
    //语言库
    var langLibrary = {
        "zh-CN":"简体中文",
        "zh-HK":"繁體中文",
        "en-US":"English"
    };
    //当前语言
    var currentLanguageKey = cookie.get("language") ? cookie.get("language") : "zh-CN";
    var currentLanguageTxt = langLibrary[currentLanguageKey];

    function languageList(){
        $('#language a span').text(currentLanguageTxt);

        var src = 'public/img/lang-' + currentLanguageKey + '.png';
            $('#language a img').attr('src', src);


        var html = '';
        for(var key in langLibrary){
            var addClass = key == currentLanguageKey ? ' active' : '';
            html += '<li data-key="' + key + '" class="language' + addClass + '">';
            html += '<img src="public/img/lang-' + key + '.png" class="image" width="29" height="21"/> ';
            html +=  langLibrary[key] + '</li>';
        }
        $('#language ul').html(html);

        //jQuery绑定事件
        $('#language li.language').click(function (index, item) {
            if($(this).hasClass('active')){ return; }

            var key = $(this).data('key');
            //设置用户语言配置。
            setUserConf({"i18n": key});
        });
    }
    languageList();

    /**
     * 退出
     */
    $('#logout').click(function(){
        $.ajax({
            url:"/api/v1/auth/logout",
            success:function(res){
                if(res.errorCode === 0){
                    cookie.delete('token');
                    cookie.delete("loginSuccess");
                    try{
                        var protocol = window.location.protocol,
                            hostname = window.location.hostname,
                            port = window.location.port;
                        window.location.href = protocol + '//' + hostname + ':' + port + '/' + 'login.html#/login';
                    }catch(e){
                        window.location.reload();
                    }
                }
            }
        });
    });

    $('#updatepd').click(function () {
        console.log("hihihihi");
        window.location.href = "http://"+ window.location.host +"/#/updatePassword";

    });

    /**
     * 菜单
     */
    function getMenu(){
        $.ajax({
            url:"/api/v1/u/usertree",
            success:function(res){
                if(res.errorCode === 0){
                    try{
                        var html = showMenu(res.data.children, 1);

                        $('#menu').html(html);
                        $.Frame.expendTree('.sidebar', window.location.hash);
                    }catch(e){}
                }
            }
        });
    }
    getMenu();

    //一级导航icon图片
    var menuIconArr = [
        'icon-System-management',
        'icon-Data-management',
        'icon-Logistics',
        'icon-The-financial-management',
        'icon-The-dashboard',
        'icon-Customer-service',
        'icon-male',
        'icon-bug'
    ];
    function showMenu(data, level){
        var result = '';
        for(var i=0,l=data.length; i<l; i++){
            var isHasChild = data[i].children && data[i].children.length;

            if(level == 1){
                result += '<li data-level="' + level + '" class="treeview">';
            }else{
                result += '<li data-level="' + level + '">';
            }

            if(isHasChild){
                result += '<a href="javascript:void(0);">';
            }else{
                result += '<a data-hash="' + data[i].url + '" class="url-link" href="' + data[i].url + '">';
            }

            if(level == 1){
                result += '<i class="menu-icon-logo ' + menuIconArr[i] + '"></i>';
                result += '<span class="menu-info">' + data[i].name + '</span>';
            }else{
                result += data[i].name;
            }

            if(isHasChild){
                result += '<i class="icon-angle-right menu-has-child"></i>';
            }

            result += '</a>';

            if(isHasChild){
                result += '<ul class="treeview-menu">';

                result += showMenu(data[i].children, level+1);

                result += '</ul>';
            }

            result += '</li>';
        }
        return result;
    }


    $.Frame = {};

    /* *
     * Frame Options
     */
    $.Frame.options = {
        sidebarSlimScroll: false,
        sidebarOpen: false,
        animationSpeed: 500,
        sidebarToggleSelector: "[data-toggle='offcanvas']",
        mouseLeaveCanvas: "[data-toggle='leaveAside']",
        screenSizes: {
            xs: 480,
            sm: 768,
            md: 992,
            lg: 1200
        }
    };

    $(function () {
        "use strict";

        var o = $.Frame.options;

        _init();

        $.Frame.layout.activate();

        $.Frame.tree('.sidebar');

        $.Frame.pushMenu.activate(o.sidebarToggleSelector);

        //$.Frame.expendTree('.sidebar', window.location.hash);

        $.Frame.mouseLeave.activate(o.mouseLeaveCanvas);
    });

    function _init() {
        'use strict';

        $.Frame.pushMenu = {
            activate: function (toggleBtn) {
                var screenSizes = $.Frame.options.screenSizes;

                $(document).on('click', toggleBtn, function (e) {
                    e.preventDefault();

                    if ($("body").hasClass('sidebar-collapse')) {
                        $.Frame.options.sidebarOpen = false;
                        $("body").removeClass('sidebar-collapse');
                        $("#iframe").contents().find('body').removeClass('sidebar-collapse');
                    } else {
                        $.Frame.options.sidebarOpen = true;
                        $("body").addClass('sidebar-collapse');
                        $("#iframe").contents().find('body').addClass('sidebar-collapse');
                    }
                });

            }
        };

        $.Frame.layout = {
            activate: function () {
                var _this = this;
                _this.fixSidebar();
                $(window).resize(function () {
                    _this.fixSidebar();
                });
            },
            fixSidebar: function () {
                if (!$("body").hasClass("fixed")) {
                    if (typeof $.fn.slimScroll != 'undefined') {
                        $(".sidebar").slimScroll({destroy: true}).height("auto");
                    }
                    return;
                } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
                    window.console.error("Error: the fixed layout requires the slimscroll plugin!");
                }

                if ($.Frame.options.sidebarSlimScroll) {
                    if (typeof $.fn.slimScroll != 'undefined') {
                        $(".sidebar").slimScroll({destroy: true}).height("auto");
                        $(".sidebar").slimscroll({
                            height:$('.menu-sidebar').height()
                        });
                    }
                }
            }
        };

        $.Frame.tree = function (menu) {
            var _this = this;
            var animationSpeed = $.Frame.options.animationSpeed;

            $(document).off('click', menu + ' li a')
                .on('click', menu + ' li a', function (e) {
                    var $this = $(this);
                    var parentLi = $this.parent('li'),
                        nextUl = $this.next(),
                        icon = $('.menu-has-child');
                    if($('body').hasClass('sidebar-collapse')){
                        return false;
                    }
                    //收起
                    if(nextUl.is('.treeview-menu') && nextUl.is(':visible')){
                        var parent = $this.parents('ul').first();
                        var ul = parent.find('ul:visible').slideUp(animationSpeed);

                        //右侧图标处理
                        icon.each(function(){
                            $(this).removeClass('icon-angle-down').addClass('icon-angle-right');
                        });
                        if(!parentLi.hasClass('treeview')){
                            $this.parent('li').parents('li').children('a').children('.menu-has-child').removeClass('icon-angle-right').addClass('icon-angle-down');
                        }
                        //nextUl处理
                        nextUl.slideUp(animationSpeed, function () {
                            nextUl.removeClass('menu-open');
                            parentLi.removeClass('active');
                        });
                    }
                    //展开
                    else if(nextUl.is('.treeview-menu') && (!nextUl.is(':visible'))){
                        var parent = $this.parents('ul').first();
                        parent.find('li.active').removeClass('active');
                        parentLi.addClass('active');

                        var ul = parent.find('ul:visible').slideUp(animationSpeed);
                        ul.removeClass('menu-open');
                        nextUl.addClass('menu-open');
                        nextUl.slideDown(animationSpeed);

                        icon.each(function () {
                            $(this).removeClass('icon-angle-down').addClass('icon-angle-right');
                        });
                        $this.parents('li').each(function(){
                            $(this).children('a').children('.menu-has-child').removeClass('icon-angle-right').addClass('icon-angle-down');
                        });
                    }

                    if (nextUl.is('.treeview-menu')) {
                        e.preventDefault();
                    }else{
                        $(menu).find("li a.selected").removeClass("selected");
                        $this.addClass("selected").siblings("li").removeClass("active");

                        if(!nextUl.is('.treeview-menu')){
                            parentLi.siblings('li').each(function(){
                                $(this).removeClass('active');
                                $(this).children('a').children('.menu-has-child').removeClass('icon-angle-down').addClass('icon-angle-right');
                                $(this).children('.treeview-menu').removeClass('.menu-open').hide();
                            });
                        }

                        if(parentLi.is('.treeview')){
                            parentLi.addClass('active');
                        }
                    }
                });
        };

        $.Frame.mouseLeave = {
            activate: function (toggleBtn) {
                $(document).off('click', toggleBtn).on('mouseleave', toggleBtn, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if($.Frame.options.sidebarOpen){
                        $("body").addClass('sidebar-collapse');
                        $("#iframe").contents().find('body').addClass('sidebar-collapse');
                    }
                }).on('mouseover', toggleBtn, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse');
                        $("#iframe").contents().find('body').removeClass('sidebar-collapse');
                    }
                });
            }
        };

        $.Frame.expendTree = function(menu, hash){
            if(!hash || hash == '#/'){
                return false;
            }
            $(menu).find('a').each(function(){
                if($(this).attr('href') == hash){
                    $(this).addClass('selected');
                    $(this).parent('li').addClass('active');
                    $(this).parent('li').parents('ul').each(function(){
                        $(this).css('display','block');
                        $(this).parent('li').addClass('active');
                    });
                    $(this).parents('li').each(function(){
                        $(this).children('a').children('.menu-has-child').removeClass('icon-angle-right').addClass('icon-angle-down');
                    });
                }
            });
        };
    }
})();

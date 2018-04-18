/* *
 * 全局空间 SearchBox
 * */
var SearchBox = {};
/* *
 * 静态方法集
 * @name _method
 * */
SearchBox._method = {
    /* 选择元素 */
    $:function (arg, context) {
        var tagAll, n, eles = [], i, sub = arg.substring(1);
        context = context || document;
        if (typeof arg == 'string') {
            switch (arg.charAt(0)) {
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                    tagAll = SearchBox._method.$('*', context);
                    n = tagAll.length;
                    for (i = 0; i < n; i++) {
                        if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                    }
                    return eles;
                    break;
                default:
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },

    /* 绑定事件 */
    on:function (node, type, handler) {
        node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
    },

    /* 获取事件 */
    getEvent:function(event){
        return event || window.event;
    },

    /* 获取事件目标 */
    getTarget:function(event){
        return event.target || event.srcElement;
    },

    /* 获取元素位置 */
    getPosition:function (node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrolly = document.documentElement.scrollTop || document.body.scrollTop;
        var position = node.getBoundingClientRect();
        return {top:position.top + scrolly, right:position.right + scrollx, bottom:position.bottom + scrolly, left:position.left + scrollx }
    },

    /* 添加样式名 */
    addClass:function (c, node) {
        if(!node)return;
        node.className = SearchBox._method.hasClass(c,node) ? node.className : node.className + ' ' + c ;
    },

    /* 移除样式名 */
    removeClass:function (c, node) {
        var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
        if(!SearchBox._method.hasClass(c,node))return;
        node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
    },

    /* 是否含有CLASS */
    hasClass:function (c, node) {
        if(!node || !node.className)return false;
        return node.className.indexOf(c)>-1;
    },

    /* 阻止冒泡 */
    stopPropagation:function (event) {
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    /* 去除两端空格 */
    trim:function (str) {
        return str.replace(/^\s+|\s+$/g,'');
    }
};

//构造函数
SearchBox.init = function () {
    this.initialize.apply(this, arguments);
};

SearchBox.init.prototype = {

    constructor:SearchBox.init,

    initialize :function (options) {
        this.destroy();
        var input = options.inputId;
        var navItem = options.navItem;
        this.tip = options.tip || '';
        this.defaultText = options.defaultText;
        this.multipleSign = options.multipleSign;
        this.multipleData = [];
        SearchBox.toggleTab = options.toggleTab;
        SearchBox.onSearchValueChange = options.onSearchValueChange;
        SearchBox.attrTextModel = options.attrTextModel;
        SearchBox.contentList = options.contentList;
        SearchBox.searchData = options.searchData;
        this.currentPage = 1;
        this.searchValue = [];
        this.input = SearchBox._method.$('#'+ input);
        this.createNavbar(navItem);
        this.inputEvent();
    },

    scrollEvent: function(){
        var that = this;
        $(this.rootDiv).find('.item-box').scroll(function(){
            if($(this).scrollTop() == 0){    // 到顶了
                if(that.currentPage > 1){
                    $(".loading-bottom").remove();
                    $(this).prepend("<div class='loading loading-top'><img src='../public/img/loading.gif'/></div>");

                    that.currentPage--;
                    SearchBox.contentList = SearchBox.toggleTab(that.currentPage, that.index);

                    that.createItemBox(true);
                }
            }else if(($(this).scrollTop() + $(this).outerHeight()) >= $(this)[0].scrollHeight){  // 到底了
                if (that.currentPage < that.pagination.totalPage) {
                    $(".loading-top").remove();
                    $(this).append("<div class='loading loading-bottom'><img src='../public/img/loading.gif'/></div>");

                    that.currentPage++;
                    SearchBox.contentList = SearchBox.toggleTab(that.currentPage, that.index);

                    that.createItemBox(true);
                    $(this).scrollTop(10);
                }
            }
        });
    },

    scrollSearchEvent: function(){
        var that = this;
        $(this.rootDiv).find('.mCustomScrollbar').scroll(function(){
            var value = SearchBox._method.trim(that.searchInputValue);
            if($(this).scrollTop() == 0){    // 到顶了
                if(that.currentPage > 1){
                    $(".loading-bottom").remove();
                    $(this).prepend("<div class='loading loading-top'><img src='../public/img/loading.gif'/></div>");

                    that.currentPage--;
                    SearchBox.searchData = SearchBox.onSearchValueChange(value,that.currentPage);

                    that.searchValue = SearchBox.searchData.data;
                    that.searchPagination = SearchBox.searchData.pagination;

                    that.createUl();
                }
            }else if(($(this).scrollTop() + $(this).outerHeight()) >= $(this)[0].scrollHeight){  // 到底了
                if (that.currentPage < that.searchPagination.totalPage) {
                    $(".loading-top").remove();
                    $(this).append("<div class='loading loading-bottom'><img src='../public/img/loading.gif'/></div>");

                    that.currentPage++;
                    SearchBox.searchData = SearchBox.onSearchValueChange(value,that.currentPage);

                    that.searchPagination = SearchBox.searchData.pagination;
                    if(that.searchPagination.currentPage == that.searchPagination.totalPage && SearchBox.searchData.data.length < 10){
                        that.searchValue = that.searchValue.concat(SearchBox.searchData.data)
                    }else{
                        that.searchValue = SearchBox.searchData.data;
                    }

                    $(this).scrollTop(10);
                    that.createUl();
                }
            }
        });
    },

    destroy: function(){
        if($('.search-box-wrap')) {
            $('.search-box-wrap').remove();
        }
    },
    

    //创建navbar
    createNavbar: function(navItem){
        var _html = '';
        if(navItem && navItem.length){
            _html += '<ul>';
            _html += '<li class="on">'+ '热门' +'</li>';
            navItem.forEach(function(val, index){
                if(index==navItem.length-1){
                    _html += '<li>'+ '其他' +'</li>';
                }else{
                    _html += '<li>'+ val +'</li>';
                }
            });
            _html += '</ul>';
        }
        SearchBox.navItem = _html;
    },


    //生成BOX HTML 框架
    createWarp:function(element){
        var div = this.rootDiv = document.createElement('div');

        $(div).prepend("<input class='search-input-box' placeholder=' "+this.tip+" '/>");

        var that = this;
        // 设置DIV阻止冒泡
        SearchBox._method.on(this.rootDiv,'click',function(event){
            SearchBox._method.stopPropagation(event);
        });

        // 设置点击文档隐藏弹出的城市选择框
        SearchBox._method.on(document, 'click', function (event) {
            event = SearchBox._method.getEvent(event);
            var target = SearchBox._method.getTarget(event);
            if (target == that.input) return false;
            if (that.searchBox)SearchBox._method.addClass('hide', that.searchBox);
            if (that.searchInputBox) {
                that.searchInputBox.hide();
                that.searchInputBox.val('')
            }
            if (that.ul)SearchBox._method.addClass('hide', that.ul);
        });

        div.className = 'search-box-wrap';
        div.style.position = 'absolute';
        div.style.zIndex = 999999;

        var childdiv = this.searchBox = document.createElement('div');
        childdiv.className = 'search-box';
        childdiv.id = 'searchBox';

        childdiv.innerHTML = SearchBox.navItem;
        var itemBox = this.itemBox =  document.createElement('div');
        itemBox.className = 'item-box';
        childdiv.appendChild(itemBox);
        div.appendChild(childdiv);
        this.createItemBox(false);

        this.searchInputBox = $('.search-input-box');
        this.searchInputBox.on('click',function(event){
        });

        this.searchInputBox.on('keyup',function(event){
            event = event || window.event;
            var keycode = event.keyCode;
            SearchBox._method.addClass('hide',that.searchBox);

            var value = that.searchInputValue = SearchBox._method.trim(this.value);
            // 下拉菜单显示的时候捕捉按键事件
            if(that.ul && !SearchBox._method.hasClass('hide',that.ul) && !that.isEmpty){
                that.KeyboardEvent(event,keycode);
            }

            SearchBox.searchData = SearchBox.onSearchValueChange(value,1);
            that.searchValue = SearchBox.searchData.data;
            that.searchPagination = SearchBox.searchData.pagination;

            that.createUl();
            that.scrollSearchEvent();
        });
    },

    //创建TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
    createItemBox:function(flag){
        var contentList = SearchBox.contentList.data;
        this.pagination = SearchBox.contentList.pagination;

        var _html = '';

        $(".loading").remove();
        if(contentList && contentList.length){
            if(this.defaultText){
                _html += '<a href="javascript:;" data-name='+JSON.stringify({})+'>'+ this.defaultText +'</a>'
            }
            if(flag && this.pagination.currentPage == this.pagination.totalPage && contentList.length < 10){
                _html += this.itemBox.innerHTML;
            }
            contentList.forEach(function(val, index){
                _html += '<a href="javascript:;" data-name='+JSON.stringify(val)+'>'+ val.name +'</a>';
            });
        }
        this.itemBox.innerHTML = _html || '';
        this.input.parentNode.appendChild(this.rootDiv);

        this.tabChange();
        this.linkEvent();
    },

    //tab按字母顺序切换
    tabChange:function(){
        var lis = SearchBox._method.$('li',this.searchBox);
        var divs = SearchBox._method.$('div',this.itemBox);
        var that = this;
        for(var i=0,n=lis.length;i<n;i++){
            lis[i].index = i;
            lis[i].onclick = function(){
                for(var j=0;j<n;j++){
                    SearchBox._method.removeClass('on',lis[j]);
                    SearchBox._method.addClass('hide',divs[j]);
                }
                that.index = this.innerHTML;
                SearchBox.contentList = SearchBox.toggleTab(1,this.innerHTML);
                that.createItemBox(false);
                SearchBox._method.addClass('on',this);
                SearchBox._method.removeClass('hide',divs[this.index]);
            };
        }
    },

    //产品按字母展示项,点击选中
    linkEvent:function(){
        var links = SearchBox._method.$('a',this.itemBox);
        var that = this;
        for(var i=0,n=links.length;i<n;i++){
            links[i].onclick = function(){
                var dataName = $(this).attr('data-name');

                if(dataName == '{}'){
                    that.input.value = '';
                    that.multipleData = [];
                    SearchBox.attrTextModel(that.input.value, []);

                    SearchBox._method.addClass('hide',that.searchBox);
                    that.searchInputBox.hide();
                    that.searchInputBox.val('')
                }else{
                    if(that.multipleSign){
                        if(!that.isExistInVal(this.innerHTML)){
                            that.input.value ? that.input.value = that.input.value + that.multipleSign + this.innerHTML : that.input.value = this.innerHTML;
                            that.multipleData.push(JSON.parse(dataName));
                            SearchBox.attrTextModel(that.input.value, that.multipleData);
                        }
                    }else{
                        that.input.value = this.innerHTML;
                        SearchBox.attrTextModel(that.input.value,JSON.parse(dataName));
                        SearchBox._method.addClass('hide',that.searchBox);
                        that.searchInputBox.hide();
                        that.searchInputBox.val('')
                    }
                }
            }
        }
    },

    //INPUT输入框事件,点击生成组件
    inputEvent:function(){
        var that = this;
        SearchBox._method.on(this.input,'click',function(event){
            event = event || window.event;

            that.selectionStart = that.input.selectionStart;
            that.selectionEnd  = that.input.selectionEnd;

            if(!that.searchBox){
                that.createWarp();
            }else if(!!that.searchBox && SearchBox._method.hasClass('hide',that.searchBox)){
                if(!that.ul || (that.ul && SearchBox._method.hasClass('hide',that.ul))){
                    SearchBox._method.removeClass('hide',that.searchBox);
                    that.searchInputBox.show();
                }
            }

            that.scrollEvent();
        });

        SearchBox._method.on(this.input,'keyup',function(event){
            event = event || window.event;

            if(event.keyCode == 39 || event.keyCode == 37){
                that.selectionEnd = that.input.selectionEnd;
            }else if(event.keyCode == 8){
                var firstPart = that.input.value.slice(0,that.selectionEnd),
                    firstList = firstPart.split(","),
                    nameList = that.input.value.split(","),
                    delResArr = [];

                nameList.splice(firstList.length-1, 1);

                nameList.forEach(function(value){
                    that.multipleData.find(function (item){
                        if(item.name && item.name.indexOf('(') != -1){
                            item.name = item.name.split('(')[0];
                        }
                        if(item.name == value){
                            delResArr.push(item)
                        }
                    });
                });

                that.multipleData = delResArr;
                that.input.value = nameList.join(",");

                that.selectionEnd = that.input.selectionEnd;

                SearchBox.attrTextModel(that.input.value,that.multipleData);
            }
        });

        function setCaretPosition(textDom, pos){
            if(textDom.setSelectionRange) {
                textDom.focus();
                textDom.setSelectionRange(pos, pos);
            }else if (textDom.createTextRange) {
                var range = textDom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }

    },

    //输入搜索条件生成搜索结果下拉选择列表
    createUl:function () {
        var that = this;
        var str = '';
        var value = SearchBox._method.trim(that.searchInputValue);
        $(".loading").remove();
        // 当value不等于空的时候执行
        if (value !== '') {
            // 此处需设置中文输入法也可用onpropertychange
            var searchResult = [];
            if(that.defaultText && that.searchValue.length !== 0){
                str = '<li class="cityname" data-name='+JSON.stringify({})+'>' + that.defaultText + '</li>';
                searchResult.push(str);
            }
            for (var i = 0, n = that.searchValue.length; i < n; i++) {
                if (searchResult.length !== 0) {
                    str = '<li class="cityname" data-name='+JSON.stringify(that.searchValue[i])+'>' + that.searchValue[i].name + '</li>';
                } else {
                    str = '<li class="cityname" data-name='+JSON.stringify(that.searchValue[i])+'>' + that.searchValue[i].name + '</li>';
                }
                searchResult.push(str);
            }
            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到 "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'cityslide mCustomScrollbar';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && SearchBox._method.hasClass('hide', this.ul)) {
                this.count = 0;
                SearchBox._method.removeClass('hide', this.ul);
            }
            this.ul.innerHTML = searchResult.join('');

            // 绑定Li事件
            this.liEvent();
        }else{
            SearchBox._method.addClass('hide',this.ul);
            SearchBox._method.removeClass('hide',this.searchBox);
            that.searchInputBox.show();
            that.searchInputBox.val('')
        }
    },

    //定键盘事件，上、下、Enter键
    KeyboardEvent:function(event,keycode){
        var lis = SearchBox._method.$('li',this.ul);
        var len = lis.length;
        var that = this ;
        switch(keycode){
            case 40: //向下箭头↓
                this.count++;
                if(this.count > len-1) this.count = 0;
                for(var i=0;i<len;i++){
                    SearchBox._method.removeClass('on',lis[i]);
                }
                SearchBox._method.addClass('on',lis[this.count]);
                break;
            case 38: //向上箭头↑
                this.count--;
                if(this.count<0) this.count = len-1;
                for(i=0;i<len;i++){
                    SearchBox._method.removeClass('on',lis[i]);
                }
                SearchBox._method.addClass('on',lis[this.count]);
                break;
            default:
                break;
        }
    },


    //搜索结果下拉列表的li事件
    liEvent:function(){
        var that = this;
        var lis = SearchBox._method.$('li',this.ul);
        for(var i = 0,n = lis.length;i < n;i++){

            SearchBox._method.on(lis[i],'click',function(event){
                event = SearchBox._method.getEvent(event);
                var target = SearchBox._method.getTarget(event);
                var dataName = $(target).attr('data-name');

                if(dataName == '{}'){
                    that.input.value = '';
                    that.multipleData = [];
                    SearchBox.attrTextModel(that.input.value, []);

                    SearchBox._method.addClass('hide', that.ul);
                    that.searchInputBox.hide();
                    that.searchInputBox.val('')
                }else if(dataName &&  dataName != '{}'){
                    if(that.multipleSign){
                        if(!that.isExistInVal(target.innerHTML)) {
                            that.input.value ? that.input.value = that.input.value + that.multipleSign + target.innerHTML : that.input.value = target.innerHTML;
                            that.multipleData.push(JSON.parse(dataName));
                            SearchBox.attrTextModel(that.input.value, that.multipleData);
                        }
                    }else{
                        that.input.value = target.innerHTML;
                        SearchBox.attrTextModel(that.input.value, JSON.parse(dataName));
                        SearchBox._method.addClass('hide', that.ul);
                        that.searchInputBox.hide();
                        that.searchInputBox.val('')
                    }
                }
            });

            SearchBox._method.on(lis[i],'mouseover',function(event){
                event = SearchBox._method.getEvent(event);
                var target = SearchBox._method.getTarget(event);
                SearchBox._method.addClass('on',target);
            });

            SearchBox._method.on(lis[i],'mouseout',function(event){
                event = SearchBox._method.getEvent(event);
                var target = SearchBox._method.getTarget(event);
                SearchBox._method.removeClass('on',target);
            })
        }
    },

    //去重
    isExistInVal: function(val) {
        if(val && val.indexOf('(') != -1){
            val = val.split('(')[0];
        }
        var inputVal = this.input.value;
        if(!$.trim(inputVal) || inputVal.indexOf(val) == -1) {
            return false;
        }
        return true;
    }
};
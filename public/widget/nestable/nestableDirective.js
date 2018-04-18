
(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in document;
    var movingPrevUid;
    /**
     * 原插件nestable,已经改到与原插件大相径庭，增加了增删改查的功能
     * 当前刷新数据的事件有：添加节点，删除节点，移动节点
     * 如果有唯一父节点isRoot=true
     * 如果非唯一父节点isRoot=false
     * 检索时只传检索框
     * 参数data暂时没有任何用途，预留
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var defaults = {
        listNodeName    : 'ol',
        itemNodeName    : 'li',
        rootClass       : 'dd',
        listClass       : 'dd-list',
        itemClass       : 'dd-item',
        dragClass       : 'dd-dragel',
        handleClass     : 'dd-handle',
        collapsedClass  : 'dd-collapsed',
        placeClass      : 'dd-placeholder',             /** 移动占位节点 */
        noDragClass     : 'dd-nodrag',
        emptyClass      : 'dd-empty',
        iconOpen        : 'icon-Open',                  /** 带加号图标 */
        iconClose       : 'icon-Close',                 /** 带减号图标 */
        iconSeat        : 'icon-inoperable',            /** 无展开图标 */
        group           : 0,
        threshold       : 20,
        maxDepth        : 5,
        isRoot          : false,                        /** 根目录是否收起 */
        isSearch        : true,                         /** 默认有检索功能，false去掉检索能够 */
        searchUrl       : '',                           /** 模糊搜索接口 */
        resetNode       : '',                           /** 刷新子组织个数时获取详情接口 */
        searchInput     : undefined,                    /** 检索框 */
        searchKeyNodes  : undefined,                    /** 检索组织详情事件 */
        searchTip       : '',                           /** 检索组织返回null时的提示语 */
        deleteNodes     : undefined,                    /** 删除子节点事件 */
        addChildNodes   : undefined,                    /** 新增子节点事件 */
        clickNode       : undefined ,                   /** 点击子节点事件 */
        loadFirstNode   : undefined,                    /** 默认加载第一个子节点事件 */
        collapseAllNode : undefined,                    /** 全部收起默认加载点击第一节点事件 */
        childUrl        : '',                           /** 节点获取数据接口 */
        newItemUid      : '',                           /** 新增节点ID */
        isMove          : false,                        /** 是否移动节点，默认false可以移动 */
        isOperate       : false,                        /** 是否可以操作，默认可以操作 */
        id              : 'id',                         /** id */
        orgShortName    : 'orgShortName',               /** 简称 */
        name            : 'name',                       /** 全称 */
        userCount       : 'userCount',                  /** 用户数 */
        parentId        : 'parentId',                   /** 父id */
        parameter       : 0,                            /** 非树，无根节点，平级传参 */
        isTree          : true,                         /** 是否树结构，默认是树结构 */
        treeScrollHeight: '',                           /** 加载树隐藏滚动条的高度 */
        callback        : function(){},                 /** 根节点数据加载完成，回调函数 */
        newNodeText     : '新增组织',                           /** 新建组织占位文案 */
        maxDepthText    : '当前组织只支持添加到第5级！'            /** 超过五级提示文案 */
    };
    function Plugin(element, options, data)
    {
        this.w  = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init(data);
    }

    Plugin.prototype = {

        init: function(data, firstUid)
        {

            var list = this;

            /** 树每一列前的icon图标 */
            var icon = {
                expandBtn       : 'button[data-action="expand"]',
                collapseBtn     : 'button[data-action="collapse"]',
                newNodes        : 'new-nodes',
                //maxDepth        : list.options.isRoot == true? 6 : 5,                            /** 默认组织深度为5 */
                expandBtnHTML   : '<button data-action="expand" class="'+list.options.iconOpen+' ic-open" type="button"></button>',
                collapseBtnHTML : '<button data-action="collapse" class="'+list.options.iconClose+' ic-close" type="button"></button>',
                seatBtnHTML     : '<button data-action="seat" class="'+list.options.iconSeat+' ic-seat" type="button"></button>',
                collapseAllBtnHTML     : '<button data-action="collapseAll" class="'+list.options.iconClose+' ic-close" type="button"></button>',
                newNodesHTML : '<li class="new-nodes dd-item dd3-item"><div class="dd3-content">'+ list.options.newNodeText +'</div></li>'
            };
            this.options = $.extend({}, icon, list.options);

            /** 载入数据 */
            if(list.options.isRoot == true){
                $.ajax({
                    url: list.options.childUrl+0,
                    type: "GET",
                    async: true,
                    dataType: "json",
                    success: function(response){
                        if(response.errorCode == 0){
                            list.dataInit(list.el, response.data, firstUid);
                        };
                    }
                });
            }else{
                list.dataInit(list.el, null, firstUid);
            };

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            list.el.on('click', 'button', function(e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName),
                    pid = item.data('uid');

                if (action === 'collapse') {
                    list.collapseItem(item,target);
                };
                if (action === 'expand') {
                    list.expandItem(item);
                    //如果树结构有子节点，展开当前节点，不请求后台接口
                    if(item.children('ol').find('.'+list.options.itemClass).length == 0){
                        list.appendChildData(item,pid);
                    };
                };

            });

            /** 初始加载检索事件 */
            if(list.options.isSearch == true){
                list.retrieval();
            };

            /** 绑定点击列事件 */
            list.el.on('click', 'div.dd3-content', function(e){
                list.getNodes($(this));
            });

            /** 新增节点 */
            list.el.on('click', 'li.add-node', function(e){
                list.addNewNodes($(this));
            });

            /** 删除节点 */
            list.el.on('click', 'li.delete-node', function(e){
                var thisNode = $(this).parent().parent().parent();

                list.el.find('.dd-item').removeClass('click');
                thisNode.addClass('click');

                list.el.find('.dd3-content').removeClass('active');
                thisNode.children('div.dd3-content').addClass('active');

                var userArr = thisNode.find('.user-count span').text();
                var thisNodeChildLength;

                if(thisNode.hasClass('dd-collapsed') && thisNode.children('ol').css("display") !=="block"){
                    thisNodeChildLength = 1;
                }else{
                    thisNodeChildLength = thisNode.find('.dd-item').length;
                    if(thisNode.find('.dd-item').length == 1){
                        if(thisNode.find('.dd-item').hasClass('new-nodes')){
                            thisNodeChildLength = 0
                        };
                    };
                };

                list.el.find('.new-nodes').remove();
                list.options.deleteNodes(thisNode.data('uid'),thisNodeChildLength,Number(userArr),thisNode.parent().parent());
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e, data);
                }
            };

            if(list.options.isMove == true){
                //no move
            }else{
                if (hasTouch) {
                    list.el[0].addEventListener('touchstart', onStartEvent, false);
                    window.addEventListener('touchmove', onMoveEvent, false);
                    window.addEventListener('touchend', onEndEvent, false);
                    window.addEventListener('touchcancel', onEndEvent, false);
                };

                var moveIndex = 0;

                list.el.on('mousedown', onStartEvent);
                list.w.on('mousemove', onMoveEvent);
                list.w.on('mouseup', onEndEvent);
            };

        },
        dataInit: function(element, data, firstUid){
            var list = this;
            var root = list.options.isRoot;

            if(data == null){
                list.options.callback(false);
            };

            element.addClass('dd');

            if(root == true){
                list.appendItem(element, data);
                list.appendChildData(list.el.children().children('li'), 1);

                var firstNodes = list.el.find('.' + list.options.itemClass).first();
                list.getFirstNodes(firstNodes);
                /** 去掉根目录删除和移动 */
                list.el.find('.operate').eq(0).children().find('.delete-node').remove();
                //list.el.find('.operate').eq(0).children().children(':last').remove();
                list.el.find('.'+list.options.itemClass).children('.'+list.options.handleClass).remove();
            }else{
                list.appendChildData(element, list.options.parameter, firstUid);
            };

            if(list.options.isRoot == true){
                list.el.find('.' +list.options.handleClass).remove();
                list.el.children().children().find('.operate').addClass('root-item');
                list.el.children().children().find('.dd3-content').addClass('root');
            };
        },
        addNewNodes: function(li){
            var list = this;
            var operateNode = li.parent().parent(),
                operateNodeParent = operateNode.parent('li');

            var newIdHtml = '<input type="hidden" name="organizationId" data-value=""/>';
            $(newIdHtml).remove();
            list.el.after(newIdHtml);

            $('input[name="organizationId"]').data('value', operateNodeParent.data('uid'));

            if(li.parents('ol').length > 4){
                $(document).promptBox({isDelay:true, contentDelay:list.options.maxDepthText, type: 'warning', manualClose:true});
            }else{
                list.appendChildData(operateNodeParent, operateNodeParent.data('uid'), true);

                operateNodeParent.addClass('dd-collapsed');

                list.options.addChildNodes(operateNodeParent.data('uid'));
            };
        },
        //列点击返回数据
        appendChildData: function(li,pid,addNews){
            if(!pid){
                pid = 0;
            }
            var list = this;
            var url = list.options.childUrl+pid;

            $.ajax({
                url:url,
                type: "GET",
                async: true,
                dataType: "json",
                success: function(response){
                    if(response.errorCode == 0){
                        list.appendItem(li,response.data,addNews);
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    }
                }
            });

        },
        //植入数据
        appendItem: function(ele,json,addNews){
            if(ele.hasClass('dd')){
                ele.find('ol').remove();
            };

            var list = this;

            var ol = $('<ol class="dd-list"></ol>');

            var item = '';
            for(var i=0; i<json.length; i++){
                if(json[i]['leaf'] == true){
                    item += '<li class="dd-item dd3-item"  title="'+json[i][list.options.orgShortName]+'" data-uid="'+json[i][list.options.id]+'">'
                    if(list.options.isTree == true){
                        item += this.options.seatBtnHTML
                    };
                }else{
                    item += '<li class="dd-item dd3-item dd-collapsed" title="'+json[i][list.options.orgShortName]+'"  data-uid="'+json[i][list.options.id]+'">'
                    if(list.options.isTree == true){
                        item += this.options.expandBtnHTML
                        item += '<button class="'+list.options.iconClose+'" data-action="collapse" type="button" style="display:none;"></button>'
                    };
                };
                var userCount = json[i][list.options.userCount] == undefined ? '' : json[i][list.options.userCount];
                if(list.options.isRoot == true){
                    item += '<div class="dd3-content" title="'+json[i][list.options.orgShortName]+'" data-name="'+json[i][list.options.orgShortName]+'" data-orgname="'+json[i][list.options.orgShortName]+'"><span class="item-text">'
                        +json[i][list.options.orgShortName]+'</span><div class="user-count"><span>'+userCount+'</span></div></div>'
                }else{
                    if(i == 0){
                        if(json[0][list.options.parentId] == 0){
                            item += '<div class="dd3-content active" title="'+json[i][list.options.orgShortName]+'" data-name="'+json[i][list.options.orgShortName]+'" data-orgname="'+json[i][list.options.orgShortName]+'"><span class="item-text">'
                                +json[i][list.options.orgShortName]+'</span><div class="user-count"><span>'+userCount+'</span></div></div>'

                            if(typeof(addNews) == 'object'){
                                list.options.loadFirstNode(addNews.value);
                            }else{
                                list.options.loadFirstNode(json[0][list.options.id]);
                            };
                        }else{
                            item += '<div class="dd3-content" title="'+json[i][list.options.orgShortName]+'"  data-name="'+json[i][list.options.orgShortName]+'" data-orgname="'+json[i][list.options.orgShortName]+'"><span class="item-text">'
                                +json[i][list.options.orgShortName]+'</span><div class="user-count"><span>'+userCount+'</span></div></div>'
                        };
                    }else{
                        item += '<div class="dd3-content" title="'+json[i][list.options.orgShortName]+'"  data-name="'+json[i][list.options.orgShortName]+'" data-orgname="'+json[i][list.options.orgShortName]+'"><span class="item-text">'
                            +json[i][list.options.orgShortName]+'</span><div class="user-count"><span>'+userCount+'</span></div></div>'
                    };
                };

                if(list.options.isOperate != true){
                    item +='<a class="operate" data-parent="' + json[i][list.options.parentId] + '"><ul>'
                    if(list.options.isTree == true){
                        item += '<li class="add-node icon-add"></li>';
                    }
                    if(!json[i].isSystem){
                        item += '<li class="delete-node icon-delete"></li>';
                    }

                    item += '</ul></a>'
                };
                if(list.options.isMove == false){
                    item += '<a class="dd-handle handle-move icon-remov"></a>'
                };
                if(json[i]['leaf'] != true){
                    item += '<ol class="dd-list" style="display:none;"></ol>'
                };
                item += '</li>';

            };

            if(ele.hasClass('dd-item')){
                ele.find('ol').remove();
            }
            ol.append(item);
            ele.append(ol);

            this.treeIsRoot();
            list.mouseoverEvent();

            if(addNews == true){//新增组织占位
                ele.children(list.options.expandBtn).hide();
                ele.children(list.options.collapseBtn).show();

                if($('.'+list.options.newNodes).length >0 ){
                    $('.'+list.options.newNodes).remove();
                };
                ele.addClass('click');
                ele.children('ol').append(list.options.newNodesHTML);

                list.el.find('.dd3-content').removeClass('active');
                $('.'+list.options.newNodes).find('.dd3-content').addClass('active');
                ele.removeClass('click');
                this.treeIsRoot();

                if($('.new-nodes').offset().top - 40 > list.scrollHeight().height()){
                    list.el.scrollTop(80+($('.dd-item').length+1)*40);
                }else if($('.new-nodes').offset().top < 200){
                    list.el.scrollTop(80);
                }else{
                    if(list.el.scrollTop() == 0){
                        list.el.scrollTop(0);
                    }else{
                        list.el.scrollTop(0 + list.el.scrollTop());
                    };
                };

            }else if(typeof(addNews) == 'object'){

                var addNewNode = $('.dd-item[data-uid="'+addNews.value+'"]');
                list.el.find('.dd3-content').removeClass('active');
                addNewNode.children('.dd3-content').addClass('active');
                if(addNewNode.parent().find('.dd-item').length == 1){
                    var newSeat = addNewNode.parent().parent().children('button[data-action="seat"]');

                    newSeat.after('<button style="display: none;" data-action="expand" class="'+list.options.iconOpen+' ic-open" type="button"></button>');
                    newSeat.after(list.options.collapseBtnHTML);

                    newSeat.remove();
                };

                $('.dd-item').each(function (i) {
                    if($('.dd-item').eq(i).data('uid') == addNews.value){
                        if($('.dd-item').eq(i).offset().top - 40 > list.scrollHeight().height()){
                            list.el.scrollTop(80+(i+1)*40);
                        }else{
                            list.el.scrollTop(0);
                        };
                    };
                });

            }else if(typeof(addNews) == 'number'){
                var addNewNode = $('.dd-item[data-uid="'+addNews+'"]');
                list.el.find('.dd3-content').removeClass('active');
                addNewNode.children('.dd3-content').addClass('active');

                if(addNewNode.find('.dd-item').length == 0){
                    var newCollapse = addNewNode.children('button[data-action="collapse"]');
                    newCollapse.after(list.options.seatBtnHTML);
                    addNewNode.children('button[data-action="expand"]').remove();
                    newCollapse.remove();
                };

                $('.dd-item').each(function (i) {
                    if($('.dd-item').eq(i).data('uid') == addNews){
                        if($('.dd-item').eq(i).offset().top - 40 > list.scrollHeight().height()){
                            list.el.scrollTop(80+(i+1)*40);
                        }else{
                            list.el.scrollTop(0);
                        };
                    };
                });
            };


        },
        mouseoverEvent: function(){
            var list = this;
            var operateIcon;
            $('.dd3-content').mouseenter(function(){
                operateIcon = $(this).next('.operate')
                operateIcon.show();
                if($(this).hasClass('active')){
                    $(this).parent().addClass('click');
                };
                operateIcon.next('.' + list.options.handleClass).show().mouseenter(function(){
                    operateIcon.show();
                    operateIcon.next('.' + list.options.handleClass).show();
                    if($(this).parent().children('.dd3-content').hasClass('active')){
                        $(this).parent().addClass('click');
                    };
                });
                operateIcon.mouseenter(function(){
                    operateIcon.show();
                    operateIcon.next('.' + list.options.handleClass).show();
                    if($(this).parent().children('.dd3-content').hasClass('active')){
                        $(this).parent().addClass('click');
                    };
                });
            }).mouseleave(function(){
                operateIcon = $(this).next('.operate')
                operateIcon.hide();
                if($(this).hasClass('active')){
                    $(this).parent().removeClass('click');
                };
                operateIcon.next('.' + list.options.handleClass).hide().mouseleave(function(){
                    operateIcon.hide();
                    operateIcon.next('.' + list.options.handleClass).hide();
                    if($(this).parent().children('.dd3-content').hasClass('active')){
                        list.el.find('.dd-item').removeClass('click');
                    };
                });
                operateIcon.mouseleave(function(){
                    operateIcon.hide();
                    operateIcon.next('.' + list.options.handleClass).hide();
                    if($(this).parent().children('.dd3-content').hasClass('active')){
                        list.el.find('.dd-item').removeClass('click');
                    };
                });
            });

            function setScroll(){
                list.el.slimscroll({
                    height: list.scrollHeight().height()
                });

                list.el.slimscroll({
                    height: list.scrollHeight().height()
                });
            };

            setScroll();

            $(window).on("resize",setScroll);

        },
        scrollHeight: function(){
            var scrollHeight;
            var list = this;

            if(list.options.treeScrollHeight.length >1) {
                list.options.treeScrollHeight.each(function(i){
                    if(list.options.treeScrollHeight.eq(i).height() != 0){
                        scrollHeight =  list.options.treeScrollHeight.eq(i);
                    };
                });
            }else{
                scrollHeight = list.options.treeScrollHeight;
            };
            return scrollHeight;
        },
        //列点击事件
        getNodes: function(li){
            var list = this;
            if(list.options.searchInput != undefined){
                list.options.searchInput.val('');
            };

            list.el.find('.dd3-content').removeClass('active');
            li.addClass('active');
            $(".list-box").html("");
            list.el.find('.dd-item').removeClass('click');
            li.parent().addClass('click');
            if(list.options.clickNode != undefined){
                list.options.clickNode(li.parent('.dd-item').data('uid'));
            };
        },

        //默认父节点第一列选中
        getFirstNodes: function(firstNodes){
            var list = this;

            firstNodes.children('.dd3-content').addClass('active');
            if(list.options.isSearch == true){
                list.options.loadFirstNode(firstNodes.data('uid'));
            };
        },
        //刷新整个树
        resetTreeGroup : function(){
            var list = this;
            list.el.empty();

            if(list.options.isRoot == true){
                $.ajax({
                    url: list.options.childUrl+0,
                    type: "GET",
                    async: true,
                    dataType: "json",
                    success: function(response){
                        if(response.errorCode == 0){
                            list.dataInit(list.el, response.data);
                        };
                    }
                });
            }else{
                list.dataInit(list.el, null);
            };
        },
        //刷新整个树展开指定节点
        resetSearchNode : function(){
            var list = this,
                newOrgId;

            if(list.options.newItemUid.length == 0){
                newOrgId = $(list.options.newItemUid.selector).data();
            }else{
                newOrgId = list.options.newItemUid.data();
            };
            if(typeof(newOrgId) == 'object'){
                newOrgId = newOrgId.value
            };

            var url = list.options.resetNode + newOrgId;
            var isReturn = false;
            fn();
            function fn(){
                list.resetTreeGroup();
                isReturn = true;
            };

            if(isReturn == true){
                $.ajax({
                    url:url,
                    type: "GET",
                    async: true,
                    dataType: "json",
                    success: function(response){
                        if (response.errorCode == 0){
                            var pids = response.data.parentIds;
                            if(list.options.isRoot == true){
                                pids.splice(0, 0, 1);
                            }else{
                                pids.splice(0, 0, 0);
                            };
                            list.appendRetrievalChildData(list.el.find('li[data-uid='+pids[0]+']'),pids[0],pids,newOrgId);
                        };
                    }
                });
            };
        },
        //无根节点新增刷新整个树（用户组和角色）
        resetAllGroup : function(){
            var list = this,
                newOrgId;
            var url = list.options.childUrl+0;
            if(list.options.newItemUid.length == 0){
                newOrgId = $(list.options.newItemUid.selector).data();
            }else{
                newOrgId = list.options.newItemUid.data();
            };

            list.el.empty();
            list.init(null, newOrgId);

        },
        //新增局部刷新树
        resetGroup : function(){

            var list = this,newOrgId,
                newPid = $('input[name="organizationId"]').data();
            if(list.options.newItemUid.length == 0){
                newOrgId = $(list.options.newItemUid.selector).data();
            }else{
                newOrgId = list.options.newItemUid.data();
            };

            newPid = typeof(newPid) == 'object' ? newPid.value : '';
            list.appendChildData($('.dd-item[data-uid="'+newPid+'"]'), newPid, newOrgId);

            $('.dd-item[data-uid="'+newPid+'"]').addClass('dd-collapsed');
            $('.new-nodes').remove();

            this.treeIsRoot();

        },
        //删除局部刷新树
        resetDeleteGroup : function(){
            var list = this,
                newOrgId;
            if(list.options.newItemUid.length == 0){
                newOrgId = $(list.options.newItemUid.selector).data();
            }else{
                newOrgId = list.options.newItemUid.data();
            };
            if(typeof(newOrgId) == 'object'){
                newOrgId = newOrgId.value
            };

            var pid = $('.dd-item[data-uid="'+newOrgId+'"]').parent().parent().data('uid');
            list.appendChildData($('.dd-item[data-uid="'+pid+'"]'), pid, newOrgId);
        },

        //检索查询树自动展开
        retrieval : function(){

            var list = this,
                searchInput = list.options.searchInput,
                listBox = $('<ul class="press-word list-box" style="display:none;"></ul>'),
                comText;

            if(searchInput.next('.slimScrollDiv').length > 0){
                searchInput.next('.slimScrollDiv').remove();
                searchInput.next('i').remove();
            };

            searchInput.after($('<i class="icon-search search-group"></i>'));
            searchInput.after(listBox);

            var tip = Lang.getValByKey("common", "common_tree_search");
            searchInput.on('mouseenter', function(event){
                if(listBox.find('li').length != 0){
                    listBox.show();
                    if(listBox.find('span').length == 1){
                        if(listBox.find('span').text() == tip){
                            listBox.slimscroll({
                                height: 30
                            });
                        }else{
                            listBox.slimscroll({
                                height: 200
                            });
                        };
                    }else{
                        listBox.slimscroll({
                            height: 200
                        });
                    };
                };
                seachOrganization(event, searchInput.val());
            }).on('mouseleave', function(){
                listBox.hide();
                listBox.slimscroll({
                    height: 0
                });
            });
            listBox.on('mouseenter', function(){
                listBox.show();
                if(listBox.find('span').length == 1){
                    if(listBox.find('span').text() == tip){
                        listBox.slimscroll({
                            height: 30
                        });
                    }else{
                        listBox.slimscroll({
                            height: 200
                        });
                    };
                }else{
                    listBox.slimscroll({
                        height: 200
                    });
                };
            }).on('mouseleave', function(){
                listBox.hide();
                $('.slimScrollBar').remove();
                listBox.slimscroll({
                    height: 0
                });
            });
            searchInput.on('keyup', function(event){
                seachOrganization(event, searchInput.val());
            });

            var seachIcon = $('.search-group');
            seachIcon.on('click', function(){
                seachKeyWord(searchInput.val());
            });
            var activeIndex = -1;   //高亮
            function seachOrganization(event, keyWord){

                var autoNodes = listBox.find('li');

                var myEvent = event || window.event;
                var keyCode = myEvent.keyCode;
                if (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111
                    || keyCode >= 186 && keyCode <= 222 || keyCode == 8 || keyCode == 46 || keyCode == 32 ) {
                    getSeachData(keyWord);
                    if (activeIndex != -1) {
                        activeIndex = -1;
                    }
                }else if (keyCode == 38 || keyCode == 40){

                    if (keyCode == 40){
                        activeIndex++;
                        if (activeIndex != -1) {
                            autoNodes.eq(activeIndex).removeClass('active');
                        }
                        if (activeIndex == autoNodes.length) {
                            activeIndex = 0;
                        }
                    };
                    if (keyCode == 38) {       //向上
                        if (activeIndex != -1) {
                            autoNodes.eq(activeIndex).removeClass('active');
                            activeIndex--;
                        } else {
                            activeIndex = autoNodes.length - 1;
                        }
                        if (activeIndex == -1) {
                            activeIndex = autoNodes.length - 1;
                        }
                    };

                    autoNodes.removeClass('active');
                    autoNodes.eq(activeIndex).addClass('active');

                    comText = autoNodes.eq(activeIndex).text();
                    searchInput.val(comText);

                    listBox.scrollTop(activeIndex*26);

                    if(activeIndex*26 > 200){
                        listBox.scrollTop(activeIndex*26);
                    }else{
                        listBox.scrollTop(0);
                    }

                }else if (keyCode == 13){
                    if (activeIndex != -1) {//下移查询
                        comText = autoNodes.eq(activeIndex).text();

                        searchInput.val(comText);
                        var pids = autoNodes.eq(activeIndex).data('pids').toString().indexOf(',') == -1 ? autoNodes.eq(activeIndex).data('pids').toString() : listBox.find('.active').data('pids').split(',');
                        var id = listBox.find('.active').data('sid');
                        var spids = pids == 1 ? pids : pids[0]
                        list.appendRetrievalChildData(list.el.find('li[data-uid='+spids+']'),spids,pids,id,listBox);
                        activeIndex = -1;
                    } else {//直接回车查询查询
                        comText = searchInput.val();
                        searchInput.val(comText);
                        searchInput.get(0).blur();
                        seachKeyWord(keyWord);
                    };
                    listBox.slimscroll({
                        height: 0,
                    });
                };
            }

            function getSeachData(keyWord) {
                var url,searchPid = list.el.find('.dd3-content.active').parent().data('uid') || 0;
                if(keyWord != ''){
                    if (keyWord != undefined && keyWord.length != 0) {
                        if(list.options.searchUrl.indexOf("usergroups") > -1){
                            url = list.options.searchUrl + '?q=' + keyWord
                        } else{
                            url = list.options.searchUrl + '?q=' + keyWord + '&porgid=' + searchPid
                        }
                        $.ajax({
                            url: url,
                            type: "GET",
                            async: true,
                            dataType: "json",
                            success: function(response){
                                if (response.errorCode == 0) {
                                    var data = response.data;
                                    listBox.empty();
                                    listBox.show();
                                    var item = '';
                                    if (data != null) {
                                        if(data.length == 0){
                                            listBox.slimscroll({
                                                height: 30
                                            });
                                            var tip = Lang.getValByKey("common", "common_tree_search");
                                            listBox[0].innerHTML = '<li><span style="color: red;">' + tip + '</span></li>';
                                        }else{
                                            if(data.length != 0){
                                                listBox.show();
                                                for (var i = 0; i < data.length; i++) {
                                                    var parentIds = data[i].parentIds.length ==  0 ? 0 : data[i].parentIds;

                                                    var p = /[a-z]/i;
                                                    var reg = /[A-Z]/g;

                                                    function replaceReg(reg,str){
                                                        str = str.toLowerCase();
                                                        return str.replace(reg,function(m){return m.toUpperCase()})
                                                    };
                                                    var name = p.test(data[i].name) == true ? replaceReg(reg,data[i].name) : data[i].name;
                                                    var shortName = p.test(data[i].shortName) == true ? replaceReg(reg,data[i].shortName) : data[i].shortName;
                                                    var code = p.test(data[i].code) == true ? replaceReg(reg,data[i].code) : data[i].code;

                                                    keyWord = p.test(keyWord) == true ? replaceReg(reg,keyWord) : keyWord;

                                                    if (name.indexOf(keyWord) != -1){
                                                        item += '<li data-sid="'+data[i].id+'" data-pids="'+parentIds+'"><span>' + data[i].name + '</span></li>';
                                                    } else if (shortName.indexOf(keyWord) != -1){
                                                        item += '<li data-sid="'+data[i].id+'" data-pids="'+parentIds+'"><span>' + data[i].shortName + '</span></li>';
                                                    } else if (code.indexOf(keyWord) != -1){
                                                        item += '<li data-sid="'+data[i].id+'" data-pids="'+parentIds+'"><span>' + data[i].code + '</span></li>';
                                                    }
                                                };
                                                listBox[0].innerHTML = item;
                                                listBox.slimscroll({
                                                    height: 200
                                                });
                                                listBox.find('li').first().addClass('active');

                                                listMouseEvent();
                                            };
                                        }
                                    } else {
                                        listBox.slimscroll({
                                            height: 0
                                        });
                                        listBox.hide();
                                        listBox[0].innerHTML = '';
                                    };
                                } else {
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                };
                            }
                        });

                    };
                }else{
                    listBox[0].innerHTML = '';
                    listBox.hide();
                    listBox.slimscroll({
                        height: 0
                    });
                };
            };

            function listMouseEvent(){

                listBox.on('mouseenter', 'li', function(event){
                    listBox.find('li').removeClass('active');
                    $(this).addClass('active');
                });

                listBox.on('click', 'li', function(){
                    searchInput.val($(this).text());
                    var pids=[];
                    $(this).data('pids').toString().indexOf(',') == -1 ? pids.push($(this).data('pids').toString()) : pids = $(this).data('pids').split(',');
                    var id = $(this).data('sid');
                    var spids = $(this).data('pids').toString().indexOf(',') == -1 ? pids : pids[0];
                    list.appendRetrievalChildData(list.el.find('li[data-uid='+spids+']'),spids,pids,id,listBox);
                    listBox.slimscroll({
                        height: 0
                    });
                });
            };

            function seachKeyWord(value){
                var searchPid = list.el.find('.dd3-content.active').parent().data('uid') || 0;
                if(value != ''){

                    $.ajax({
                        url: list.options.searchUrl + '?q=' + value + '&porgid=' + searchPid,
                        type: "GET",
                        async: true,
                        dataType: "json",
                        success: function(response){
                            if(response.errorCode == 0){
                                if(response.data != null){
                                    if(response.data.length != 0){
                                        listBox.empty();

                                        var orgId = response.data[0].id;
                                        var pids = response.data[0].parentIds;

                                        list.appendRetrievalChildData(list.el.find('li[data-uid='+pids[0]+']'),pids[0],pids,orgId,listBox);
                                        list.options.searchInput.val(value);
                                    };
                                }else{
                                    $(document).promptBox({isDelay:true, contentDelay:list.options.searchTip, type: 'errer', manualClose:true});
                                };
                            }else{
                                $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                            }
                        }
                    });

                };
            };

            this.treeIsRoot();
        },

        appendRetrievalChildData: function(li,pid,pidata,id,listBox){
            var index = pidata.length,
                list = this,
                url = list.options.childUrl + pid,
                i,
                pidsArray = [];

            index --;
            
            if(typeof (pidata) == 'string'){
                pidsArray.push(pidata);
            }else{
                pidsArray = pidata;
            };
            i = pidata.length - index - 1;
            list.el.find('li[data-uid='+pidsArray[i]+']').find('button[data-action="expand"]').hide();
            list.el.find('li[data-uid='+pidsArray[i]+']').find('button[data-action="collapse"]').show();
            if(index>-1){

                $.ajax({
                    url:url,
                    type: "GET",
                    async: true,
                    dataType: "json",
                    success: function(response){
                        if (response.errorCode == 0) {

                            if(listBox != undefined){
                                listBox.hide();
                            };

                            list.appendItem(li, response.data);

                            if(pidata.length == 1){
                                list.options.searchKeyNodes(id);
                            };

                            if(listBox != undefined){
                                listBox.empty();
                            };

                            $('.dd3-content').removeClass('active');
                            $('.dd-item[data-uid='+id+']').children('.dd3-content').addClass('active');
                            pidsArray.shift();
                            list.appendRetrievalChildData(list.el.find('li[data-uid='+pidsArray[i]+']'),pidsArray[i],pidsArray,id);

                            //检索定位滚动条
                            if($('.dd-item[data-uid='+id+']')[0] != undefined){
                                $('.dd-item').each(function (i) {
                                    if($('.dd-item').eq(i).data('uid') == id){
                                        if($('.dd-item').eq(i).offset().top - 40 > list.scrollHeight().height()){
                                            list.el.scrollTop(80+(i+1)*40);
                                        }else{
                                            list.el.scrollTop(0);
                                        };
                                    };
                                });

                            };

                        } else {
                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                        };
                    }
                });

            };

            return index;
        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
            step  = function(level, depth)
            {
                var array = [ ],
                    items = level.children(list.options.itemNodeName);
                items.each(function()
                {
                    var li   = $(this),
                        item = $.extend({}, li.data()),
                        sub  = li.children(list.options.listNodeName);
                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }
                    array.push(item);
                });
                return array;
            };
            data = step(list.el.find(list.options.listNodeName).first(), depth);

            return data;
        },

        serialise: function()
        {
            return this.serialize();
        },

        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.isTouch    = false;
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;
        },
        treeIsRoot: function(){
            var root = this.options.isRoot,
                list = this;
            if(root == true){
                if(this.el.children().children().children().find('button[data-action="collapseAll"]')){
                    this.el.children().children().children('button[data-action="collapseAll"]').remove();
                }
                this.el.children().children().append(list.options.collapseAllBtnHTML);
                this.el.children().children().children('[data-action="collapse"]').remove();
                this.el.children().children().children('[data-action="expand"]').remove();

                $('button[data-action="collapseAll"]').on('click', function(){
                    list.buttonCollapseAll();
                    if(list.options.collapseAllNode != undefined){
                        list.options.collapseAllNode(1);
                    };
                });
            };
        },
        //展开单个
        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },
        //收起单个
        collapseItem: function(li,ele)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            };

            if(ele != undefined){
                ele.parent().parent().parent().siblings().find('ol').remove();
            };

            this.treeIsRoot();
        },
        //展开节点全部
        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });

        },
        //收起节点全部
        collapseAll: function(li)
        {
            var list = this;
            var root = this.options.isRoot;
            list.el.find(list.options.itemNodeName).each(function() {
                if(root == true){
                    list.collapseItem($(this).children(),li);
                    $(this).children('[data-action="expand"]').show();
                    $(this).children('[data-action="collapse"]').hide();
                }else{
                    list.collapseItem($(this),li);
                };
            });

            if(root == true){
                list.expandItem(this.el.children().children('li'));
            };
            this.treeIsRoot();

        },
        //收起树全部
        buttonCollapseAll: function()
        {
            var list = this;
            var root = this.options.isRoot;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });

            if(root == true){
                list.expandItem(this.el.children().children('li'));
            };
            this.treeIsRoot();

            $('.dd3-content').removeClass('active');
            list.el.children().children().children('.dd3-content').addClass('active');

        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
                li.find('button[data-action="seat"]').remove();
            }
            li.children('[data-action="expand"]').hide();

            this.treeIsRoot();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
            li.prepend($(this.options.seatBtnHTML));
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX - $('.'+this.options.itemClass).width() + 60,
                'top'  : e.pageY - mouse.offsetY
            });

            movingPrevUid = this.placeEl.prev().data('uid');

            this.el.find('li.dd-item').removeClass('moving');
            this.dragEl.children().addClass('moving');

            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);

            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e, data)
        {
            var list = this;
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);

            var arr = [],Arr = [];
            this.placeEl.parent().parent().find('.dd3-content').each(function(){
                arr.push($(this).text());
                Arr.push($(this).data('name'));
            });

            if($.inArray(el.find('.dd3-content').text(), arr) == -1 || $.inArray(el.find('.dd3-content').data('name'), Arr) == -1){
                var movingStopPrevUid = this.placeEl.prev().data('uid');
                list.placeEl.replaceWith(el);
                list.placeEl.remove();
                if(movingPrevUid != movingStopPrevUid){
                    list.el.trigger('change');
                    if (list.hasNewRoot) {
                        list.dragRootEl.trigger('change');
                    }
                };
                list.reset();
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("widget/nestable", 'nestable_prompt_tip'), type: 'errer', manualClose:true});
                list.resetTreeGroup();
            };

        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX - $('.'+this.options.itemClass).width() + 60,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);

                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;

                    var el = this.dragEl.children(this.options.itemNodeName).first();
                    if(!el.hasClass(opt.collapsedClass)){
                        if (depth + this.dragDepth <= opt.maxDepth) {
                            // create new sub-level if one doesn't exist
                            if (!list.length) {
                                list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                                list.append(this.placeEl);
                                prev.append(list);
                                this.setParent(prev);
                            } else {
                                // else append to next level up
                                list = prev.children(opt.listNodeName).last();
                                list.append(this.placeEl);

                            }
                        }
                    };

                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    var root = this.options.isRoot;
                    if(root == true){

                        if(this.placeEl.parents('li').length == 1){
                            this.placeEl.replaceWith(this.placeEl);
                        }
                        else if(this.placeEl.parents('ol').length == 1){
                            this.placeEl.replaceWith(this.placeEl);
                        }
                        else{
                            parent = this.placeEl.parent();
                            this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                            if (!parent.children().length) {
                                this.unsetParent(parent.parent());
                            };
                        };
                    }else{
                        if (!next.length) {
                            parent = this.placeEl.parent();
                            this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                            if (!parent.children().length) {
                                this.unsetParent(parent.parent());
                            };

                        }
                    };

                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    if(this.pointEl.parent().parent().hasClass('dd')){
                        if(this.options.isRoot == true){
                            /** 移动不允许根节点有多个并行dd-item */
                            this.placeEl.replaceWith(this.placeEl);
                        }else{
                            this.pointEl.before(this.placeEl);
                        };
                    }else{
                        this.pointEl.before(this.placeEl);
                    };
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params, data)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params, data));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);



/*
 * 提示弹框 boxTip
 * 提示框 boxDelay
 * 表单弹框 box
 */
;(function ($, window, document, undefined ){
    var defaults = {
        /***=========== 弹框提示 */
        isHidden: false,
        boxWidth: false,            /*** 三栏框 */
        title: '标题',               /*** 标题,默认是字符串，表单弹框是function */
        isNest: false,              /*** 是否嵌套内容 */
        isMiddle: false,            /*** 是否居中弹框 */
        loadData : undefined,
        loadEvent: false,
        loadTitle : undefined,
        height: 600,                /*** 居中弹框默认高度 */
        content: {
            tip : '',               /*** 提示框 */
            nest : ''               /*** 嵌套框 */
        },
        boxTip:[
            {
                icon: 'icon-Warning',
                color: '#8D6A32',
                bgColor: '#FCF8E3',
                type: 'warning',
                application: '' /*** delete时调整按钮位置 */
            },
            {
                icon: 'icon-Error',
                color: '#A93538',
                bgColor: '#F5DEDE',
                type: 'errer',
                application: ''
            },
            {
                icon: 'icon-Success',
                color: '#326B31',
                bgColor: '#DFF0D8',
                type: 'success',
                application: ''
            }
        ],
        operation: [
            /*{
             type: 'submit',
             description: '提交',
             operationEvent: undefined   /!*** operation event *!/
             }*/
        ],
        /***=========== 延时提示 */
        isDelay:false,                   /*** 是否是延时提示框 */
        contentDelay:'',
        type: 'warning',
        manualClose: false,         /*** 是否手动关闭 */
        time: 1000,
        tip:[
            {
                icon: 'icon-Warning',
                bgColor: '#FCF8E3',
                color: '#8D6A32',
                type: 'warning',
                border:'1px solid #E8D7B1'
            },
            {
                icon: 'icon-Error',
                bgColor: '#F5DEDE',
                color: '#A93538',
                type: 'errer',
                border:'1px solid #E9B4B4'
            },
            {
                icon: 'icon-Success',
                bgColor: '#DFF0D8',
                color: '#326B31',
                type: 'success',
                border:'1px solid #B5CFB5'
            },
        ]
    };

    function plugin(element, options){
        this.el = $(element);                          /*** 调用时默认为$(document)即可，其实除了绑定事情，暂无其他用途 */
        this.options = $.extend({}, defaults, options) ;
        this.init();
    };

    plugin.prototype = {
        init: function (){
            var prompt = this;

            if(this.options.isDelay == true){
                prompt.boxDelay(this.options);
            }else{
                if(this.options.isNest == true){
                    if(this.options.isMiddle == true){
                        prompt.middleBox(this.options);
                    }else{
                        prompt.box(this.options);
                    };
                }else if(this.options.isNest == false){
                    prompt.boxTip(this.options);
                };
            };
        },
        boxDelay: function(options){
            if($('.tip-box').length > 0){
                $('.tip-box').remove();
            };

            for(var i in options.tip){
                var tipPrompt = '';
                if(options.type == options.tip[i]['type']){
                    tipPrompt += '<div class="tip-box"><div class="tip-contnet" style="background-color: '
                    tipPrompt += options.tip[i]['bgColor'] + ';color:'
                    tipPrompt += options.tip[i]['color'] + ';border:'
                    tipPrompt += options.tip[i]['border']
                    tipPrompt +='"><i class="'+options.tip[i]['icon']+' tip-icon"></i>'
                    tipPrompt += options.contentDelay
                    if(options.manualClose == true){
                        tipPrompt += '<b class="icon-Close-Popup close-icon"></b>'
                    };
                    tipPrompt += '</div></div>';
                    $('body').append(tipPrompt);
                };
            };
            if(options.manualClose == false){
                setTimeout('$(".tip-box").remove()',options.time);
            }else if(options.manualClose == true){
                $('.box-tip').remove();
            }
            $('.close-icon').on('click', function(){
                $('.tip-box').remove();
            });
        },
        boxTip: function(options){

            $('.box-tip').remove();

            for(var i in options.boxTip){
                if(options.type == options.tip[i]['type']){
                    var bomb = '<div class="prompt-modal box-tip">'
                        + '<div class="prompt-wrap">'
                        + '<div class="bomb-box" style="background: '+options.boxTip[i]['bgColor']+'">'
                        + '<div class="title" style="color: '+options.boxTip[i]['color']+'"><i class="'+options.boxTip[i]['icon']+' tip-box-icon"></i>'+options.title+'</div>'
                        + '<div class="prompt-content">'+options.content.tip+'</div>'
                        + '<div class="operation">'
                        + '<button name="prompt-operation" class="btn btn-default '+options.tip[i]['type']+'" data-event="close">'+(options.cancelDescription ? options.cancelDescription : Lang.getValByKey("common", 'common_page_cancel'))+'</button>'
                        + '<span class="other-btn"></span>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
                };
            };


            $('body').append($(bomb));

            this.tipButtonEvent(options);
        },
        box: function(options){

            var nestId = options.content.nest.attr('id') || options.content.nest.attr('class');

            if($('#nest-'+nestId+'').length == 0){

                var bomb = '';
                if(options.isHidden == true){
                    if(options.boxWidth == true){
                        bomb += '<div id="nest-'+nestId+'" class="prompt-modal box-form hidden box-width">'
                    }else{
                        bomb += '<div id="nest-'+nestId+'" class="prompt-modal box-form hidden">'
                    };
                }else{
                    if(options.boxWidth == true){
                        bomb += '<div id="nest-'+nestId+'" class="prompt-modal box-form box-width">'
                    }else{
                        bomb += '<div id="nest-'+nestId+'" class="prompt-modal box-form">'
                    };
                };
                bomb += '<div class="prompt-wrap">'
                bomb += '<div class="bomb-box">'
                bomb += '<div class="title"></div>'
                bomb += '<div class="prompt-content"></div>'
                bomb += '<div class="operation">'
                bomb += '<button name="prompt-operation" class="btn btn-default" data-event="close">'+Lang.getValByKey("common", 'common_page_cancel')+'</button>';
                bomb += '<span class="other-btn"></span>'
                bomb += '</div>'
                bomb += '</div>'
                bomb += '</div>'
                bomb += '</div>'

                $('body').append($(bomb));
                options.content.nest.show();
                $('#nest-'+nestId+' .prompt-content').append(options.content.nest);
                options.loadData();

                $('#nest-'+nestId+' .title').append(options.title);
                if(options.title.indexOf('span') != -1){
                    $('#nest-'+nestId+' .title span').attr('id', 'title');
                }
                if(typeof(options.loadTitle) == 'function'){
                    $('#title')[0].innerHTML = options.loadTitle();
                };

                this.formButtonEvent(options, nestId);
            }else{
                if($('#nest-'+nestId).find('.prompt-content').children('.slimScrollDiv').length != 0){
                    $('#nest-'+nestId).find('.prompt-content').children('.slimScrollDiv').prepend(options.content.nest);
                }else{
                    $('#nest-'+nestId+' .prompt-content').append(options.content.nest);
                };

                $('#nest-'+nestId).show();

                options.loadData();
                if(typeof(options.loadTitle) == 'function'){
                    $('#title')[0].innerHTML = options.loadTitle();
                };
            };
        },
        middleBox: function(options){
            var nestId = options.content.nest.attr('id') || options.content.nest.attr('class');
            if($('#nest-'+nestId+'').length == 0) {

                var bomb =
                    '<div id="nest-' + nestId + '" class="prompt-modal middle-box">'
                    + '<div class="prompt-wrap">'
                    + '<div class="bomb-box">'
                    + '<div class="title">'+options.title+'</div>'
                    + '<div class="prompt-content"></div>'
                    + '<div class="operation">'
                    + '<button name="prompt-operation" class="btn btn-default" data-event="close">' + Lang.getValByKey("common", 'common_page_cancel') + '</button>'
                    + '<span class="other-btn"></span>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';

                $('body').append($(bomb));
                $('#nest-'+nestId+'.middle-box .bomb-box').css('height',options.height);
                $('#nest-'+nestId+'.middle-box .prompt-content').css({'height':options.height-164,'overflow':'auto'});
                options.content.nest.show();
                $('#nest-'+nestId+' .prompt-content').append(options.content.nest);

                this.formButtonEvent(options, nestId);
                options.loadData();

                if(options.loadTitle){
                    if(typeof(options.loadTitle) == 'function'){
                        $('#nest-'+nestId+' .title')[0].innerHTML = options.loadTitle();
                    };
                };
            }else{
                $('#nest-'+nestId).show();
                $('#nest-'+nestId+' .prompt-content').append(options.content.nest);
                options.loadData();

                if(options.loadEvent==true){
                    options.content.nest.find('ul').eq(0).show();
                    barClick();
                };
                if(options.loadTitle){
                    if(typeof(options.loadTitle) == 'function'){
                        $('#nest-'+nestId+' .title')[0].innerHTML = options.loadTitle();
                    };
                };
            };

            if(options.loadEvent==true){
                var container =  $('#nest-'+nestId+' .prompt-content');
                var title = options.content.nest.find('.isContainer');

                loadFrom(options.content.nest, title);

                function loadFrom(element, title){
                    if(element.find('div').length == 0){
                        element.empty();
                        var item = '';
                        title.each(function(i){
                            //item += '<form name="'+nestId+'" novalidate="novalidate">'
                            if(i == 0){
                                item += '<div class="label-text">'+title.eq(i).data('title')+'<i class="icon-more-down icon-angle-down"></i></div><ul class="switch-list">'+title.eq(i).html()+'</ul>';
                            }else{
                                item += '<div class="label-text">'+title.eq(i).data('title')+'<i class="icon-more-down icon-angle-down"></i></div><ul class="switch-list" style="display: none;">'+title.eq(i).html()+'</ul>';
                            };
                            //item += '</form>'
                        });

                        element.append(item);
                        container.empty();

                        container.append(element);
                        container.find(element).show();
                    }else{
                        return false;
                    };
                };
                barClick();
            };

            function barClick(){
                var bar = $('#nest-'+nestId+' .label-text');
                bar.on('click', function(){
                    if($(this).next().is(':visible')){
                        $(this).next().hide();
                    }else{
                        bar.next().hide();
                        $(this).next().show();
                    }
                })
            }
        },
        closePrompt: function(options){
            $('.box-tip').remove();
            if(!options) return;
            if(typeof options.cancelEvent === 'function'){
                options.cancelEvent();
            }

            /*$('.box-form').hide();
             $('.middle-box').hide();*/
        },
        closeSlideBox: function(){
            $('.box-tip').remove();
            $('.box-form').hide();
        },
        closeFormPrompt: function(){
            $('.box-tip').remove();
            $('.box-form').hide();
            $('.middle-box').hide();
        },
        closeAllPrompt: function(){
            $('.box-tip').remove();
            $('.box-form').remove();
            $('.middle-box').remove();
        },
        tipButtonEvent: function(options){
            var item = '',
                prompt = this;

            $('.box-tip .other-btn').empty();
            for(var i=0; i<options.operation.length; i++){
                item += '<button name="prompt-operation" class="btn btn-primary '+options.type+'" data-event="'
                    +options.operation[i]['type']+'">'
                    +options.operation[i]['description']+'</button>'

                if(options.operation[i]['application'] == 'delete'){
                    $('.box-tip .operation').prepend($('.box-tip .other-btn'));
                }else{
                    $('.box-tip .operation').append($('.box-tip .other-btn'));
                };

                $('.box-tip .other-btn').append(item);
            };

            $('.box-tip button[name=prompt-operation]').on('click', function(){
                var index = $(this).index();

                if($(this).data('event') == 'close'){
                    prompt.closePrompt(options);
                }else{
                    if(typeof(options.operation[index].operationEvent) == 'function'){
                        options.operation[index].operationEvent();
                    };
                };
            });
        },
        formButtonEvent: function(options, nestId){
            var item = '',
                prompt = this;

            $('#nest-'+nestId+' .other-btn').empty();
            for(var i=0; i<options.operation.length; i++){
                item += '<button name="prompt-operation" class="btn btn-primary" data-event="'
                    +options.operation[i]['type']+'">'
                    +options.operation[i]['description']+'</button>'

                if(options.operation[i]['application'] == 'delete'){
                    $('#nest-'+nestId+' .operation').prepend($('#nest-'+nestId+' .other-btn'));
                }else{
                    $('#nest-'+nestId+' .operation').append($('#nest-'+nestId+' .other-btn'));
                };

                $('#nest-'+nestId+' .other-btn').append(item);
            };

            $('#nest-'+nestId+' button[name=prompt-operation]').on('click', function(){
                var index = $(this).index();
                if($(this).data('event') == 'close'){
                    $('#nest-'+nestId).hide();
                }else{
                    if(typeof(options.operation[index].operationEvent) == 'function'){
                        options.operation[index].operationEvent();
                    };
                };
            });

        }
    };

    $.fn.promptBox = function (params){
        var list = this,
            retval = this;

        var prompt = $(this).data("promptBox");

        list.each(function(){

            $(this).data("promptBox", new plugin(this, params));

            if(prompt){
                if (typeof params === 'string' && typeof prompt[params] === 'function') {
                    retval = prompt[params]();
                };
            };
        });
        return list || retval;
    };

})(jQuery, window, document);
/*$(document).promptBox({
 isDelay:true,                   /!*** 是否是延时提示 *!/
 contentDelay:'警告提示',
 type: 'warning',
 manualClose:true
 })*/


/*$(document).promptBox({
 title: '新建机场',
 isMiddle: true,
 isNest:true,
 content: {
 nest: $('#box'),
 },
 loadData: function(){
 console.log(0)
 },
 loadEvent: true,
 operation: [
 {
 type: 'submit',
 description: '保存',
 operationEvent: function(){

 }
 }
 ]
 });*/

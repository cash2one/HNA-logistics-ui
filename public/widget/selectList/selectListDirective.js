
;(function ($, window, document, undefined ){

    var defaults = {
        maxHeight: 240,
        minHeight: 34,
        offset: 4,
        startLoadCount: 10,
        id: '',
        name: '',
        value: '',
        isBlur: true,
        getFirst: false,
        getName: undefined,
        getId: undefined
    };

    function plugin(element, options, data){
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init(data);
    };

    plugin.prototype = {
        init: function(data){

            var list = this,
                comText,
                idText,
                ulName,
                autoNodes;

            list.el.addClass('select-list');

            if(list.el.val() == ''){
                data = data.slice(0, list.options.startLoadCount);
                if(!data.length){
                    ulName.empty();
                    ulName.hide();
                }
            };

            list.getListData(data);
            ulName = list.el.next();

            list.el.on('focus', function(){
                ulName.empty();
                ulName.hide();
            });

            //暂时未用到该属性判断    
            if(list.options.isBlur == true){
                list.el.parents().on('click', function(e){
                    if(!$(e.target).hasClass('select-list')){
                        ulName.hide();
                        if(!list.el.val()){
                            if(data.length){
                                //list.el.val(data[0][list.options.name]);
                                list.options.getName(data[0][list.options.name]);
                                list.options.getId(data[0][list.options.id]);
                                return false;
                            };
                        }else{
                            return false;
                        };
                    };
                    return false;
                });
            };

            ulName.on('click', 'li', function(){
                idText = $(this).data('id');
                comText = $(this).text();
                if(idText){
                    //list.el.val(comText);
                    list.options.getName(comText);
                    list.options.getId(idText);
                }else{
                    list.el.val('');
                }
                list.getListData(null);
                $('.lpp-select-list').hide();
                return false;
            });

            var activeIndex = -1;
            $(document).on('keydown',  function(event){

                autoNodes = $('.'+list.el.attr('id')).find('li');

                var myEvent = event;
                var keyCode = myEvent.keyCode;

                if($(myEvent.target)[0].id != ''){
                    if(keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111
                        || keyCode >= 186 && keyCode <= 222 || keyCode == 8 || keyCode == 46 || keyCode == 32 ){

                        list.getListData(data);

                        if (activeIndex != -1) {
                            activeIndex = -1;
                        };
                    }else if(keyCode == 38 || keyCode == 40){
                        if(keyCode == 40){
                            activeIndex++;

                            if(activeIndex != -1) {
                                autoNodes.eq(activeIndex).removeClass('active');
                            }
                            if(activeIndex == autoNodes.length) {
                                activeIndex = 0;
                            }
                        };
                        if(keyCode == 38) {     //向上
                            if(activeIndex != -1) {
                                autoNodes.eq(activeIndex).removeClass('active');
                                activeIndex--;
                            }else{
                                activeIndex = autoNodes.length - 1;
                            }
                            if(activeIndex == -1) {
                                activeIndex = autoNodes.length - 1;
                            }
                        };

                        autoNodes.removeClass('active');
                        autoNodes.eq(activeIndex).addClass('active');

                        comText = autoNodes.eq(activeIndex).text();
                        if(list.options.getFirst == true){
                            $(myEvent.target).val(comText.split('，')[0]);
                        }else{
                            $(myEvent.target).val(comText);
                        };

                        ulName.scrollTop(activeIndex*34);

                        if(activeIndex*34 > ulName.height()){
                            ulName.scrollTop(activeIndex*34);
                        }else{
                            ulName.scrollTop(0);
                        }

                    }else if(keyCode == 13){
                        if(activeIndex != -1){//下移回车查询

                            if(autoNodes.eq(activeIndex).text()){
                                comText = autoNodes.eq(activeIndex).text();
                                idText = autoNodes.eq(activeIndex).data('id');
                                //$(myEvent.target).val(comText);
                                list.options.getName(comText);
                                list.options.getId(idText);
                                activeIndex = -1;
                                list.getListData(null);
                                $('.lpp-select-list').hide();
                                return false;
                            };

                        }else{//输入框直接回车查询
                            comText = list.el.val();
                            if(data.length != 0){
                                list.options.getName(data[0][list.options.name]);
                                list.options.getId(data[0][list.options.id]);
                                //$(myEvent.target).val(data[0][list.options.name]);
                                list.getListData(null);
                                $('.lpp-select-list').hide();
                                return false;
                            }else{
                                list.el.val(Lang.getValByKey("widget/selectList", 'selectList_list_tip'));
                            };
                        };
                        $(document).unbind('keydown');
                        list.el.get(0).blur();
                    };
                }


            });


        },
        getListData: function(data){
            var list = this;
            var select = '<ul class="select-list-box lpp-select-list '+ list.el.attr('id') +'"></ul>';
            $('.lpp-select-list').hide().empty();
            if(list.el.next().hasClass('lpp-select-list')){
                list.el.next().remove();
            };
            list.el.after(select);

            var item = '';
            if(data){
                if(data.length > 0){
                    for(var i in data){
                        if(i == 0){
                            item += '<li class="active" data-id="'+data[i][list.options.id]+'">'+data[i][list.options.name]+'</li>'
                        }else{
                            item += '<li data-id="'+data[i][list.options.id]+'">'+data[i][list.options.name]+'</li>'
                        }
                    };
                }else{
                    item = '<li style="color: red;">'+Lang.getValByKey("widget/selectList", 'selectList_list_tip')+'</li>'
                };
            };

            if($('.'+list.el.attr('id'))[0]){
                $('.'+list.el.attr('id'))[0].innerHTML = item;
            };

            $('.'+list.el.attr('id')).css({
                'min-height': list.options.minHeight,
                'max-height': list.options.maxHeight
            });

            if(list.el.next().hasClass('lpp-select-list')){
                list.el.next().hide();
            }

            $('.'+list.el.attr('id')).show();

            $('.'+list.el.attr('id')).on('mouseenter', 'li', function(){
                $('.'+list.el.attr('id')).find('li').removeClass('active');
                $(this).addClass('active');
            }).on('mouseleave', 'li', function(){
                $(this).removeClass('active');
            });

            var inputOffset = list.el.offset();
            var inputX = inputOffset.left;
            var inputY = inputOffset.top;


            var browerBottom = $(window).scrollTop() + $(window).height();
            var selectBottom = inputY + list.el.outerHeight() + list.el.outerHeight();
            if(selectBottom - browerBottom < -list.options.offset) {
                //改变下拉的位置
                $('.'+list.el.attr('id')).offset({//下拉在下面的位置
                    left: inputX,
                    top: inputY + list.el.height()
                });
            } else {
                //改变下拉的位置
                $('.'+list.el.attr('id')).offset({//下拉在下面的位置
                    left: inputX,
                    top: inputY - $('.'+list.el.attr('id')).outerHeight()
                });
            }
        }
    }

    $.fn.selectList = function (params, data){
        var list = this,
            retval = this;

        var select = $(this).data("selectList");

        $(this).data("selectList", new plugin(this, params, data));

        list.each(function(){

            if(select){
                if (typeof params === 'string' && typeof select[params] === 'function') {
                    retval = select[params]();
                };
            };


        });

        return list || retval;
    };

})(jQuery, window, document);
/**
 * Package: htable.js
 * Function: htable 可锁定左侧列和表头
 * Author: liutao.
 * Date: 2017-04-07 14:00:00.
 */
(function(root,factory){
    factory(root.jQuery);
})(window,function($){
    var opts = {

    };

    function plugin(elm, data, options){
        var _this = this;

        //DOM节点
        _this.$elm = $(elm);
        _this.$lockLeftElm = $(elm).find('.lock-left');
        _this.$lockTopElm = $(elm).find('.lock-top');
        _this.$contentElm = $(elm).find('.table-content-box');



        _this.data = data;    //data包含两部分：left：左侧数据（包含表头），right：右侧数据（包含表头）；

        _this.opts = $.extend({}, opts, options);

        _this.init();
    }

    plugin.prototype = {
        init: function(){
            var _this = this;

            //数据视图渲染
            _this.render(_this.data);

            //视图事件监听
            _this.handle();

        },
        render: function(data){
            var _this = this,
                html = '';

            var lData = data.left,
                rData = data.right;

            var lLength = lData.length,
                rLength = rData.length;

            if(lLength){
                html += '<div class="m-lock-left">';

                html += '<table class="table-corner" cellspacing="0" cellpadding="0" border="0">';
                html += '<thead><tr>';
                for(var i=0, l=lData[0].length; i<l; i++){
                    if(lData[0][i].indexOf('/') != -1){
                        html += '<th style="position: relative;"><div class="u-backslash"><span class="u-backslash-left">'+ lData[0][i].split('/')[0] + '<i class="i-unit">(千克)</i>'  +'</span><span class="u-backslash-right">'+ lData[0][i].split('/')[1]  +'</span></div></th>';
                    }else{
                        html += '<th>' + lData[0][i] + '</th>';
                    }
                }
                html += '</tr></thead>';
                html += '</table>';

                html += '<div class="lock-left">';
                html += '<table class="table-left" cellspacing="0" cellpadding="0" border="0">';
                html += '<thead><tr>';
                for(var i=0; i<l; i++){
                    html += '<th>' + lData[0][i] + '</th>';
                }
                html += '</tr></thead>';
                html += '<tbody>';
                var tmpnum = 0;
                for(var i=1; i<lLength; i++){
                    html += '<tr>';
                    for(var j=0; j<l; j++){
                        if(j == 1){
                            html += '<td><a data-indexnum="'+ (tmpnum++) + '" class="u-price-edit" href="javascript:;">' + lData[i][j] + '</a></td>';
                        }else{
                            html += '<td>' + lData[i][j] + '</td>';
                        }

                    }
                    html += '</tr>';
                }
                html += '</tbody>';
                html += '</table>';
                html += '</div>';

                html += '</div>';
            }
            if(rLength){
                html += '<div class="m-lock-right">';
                html += '<div class="lock-top">';
                html += '<table class="table-top" cellspacing="0" cellpadding="0" border="0">';
                html += '<thead><tr>';
                for(var i=0, l=rData[0].length; i<l; i++){
                    html += '<th data-uid="">' + rData[0][i] + '</th>';
                }
                html += '</tr></thead>';
                html += '</table>';
                html += '</div>';

                html += '<div class="table-content-box">';
                html += '<table class="table-content" cellspacing="0" cellpadding="0" border="0">';
                html += '<thead><tr>';
                for(var i=0; i<l; i++){
                    html += '<th>' + rData[0][i] + '</th>';
                }
                html += '</tr></thead>';
                html += '<tbody>';
                var tmpnum = 0;
                for(var i=1; i<rLength; i++){
                    html += '<tr>';
                    for(var j=0; j<l; j++){
                        html += '<td><div class="u-cell"><input data-indexnum="'+(tmpnum++)+'" readonly="readonly" type="text" class="u-edit-input" maxlength="10" /><a class="u-edit-btn" href="javascript:;">…</a>' + rData[i][j] + '</div></td>';
                    }
                    html += '</tr>';
                }
                html += '</tbody>';
                html += '</table>';
                html += '</div>';
                html += '</div>';
            }

            _this.$elm.html(html);
        },
        handle: function(){
            var _this = this;


            //计算DOM宽高
            _this.layout();

            //监听滚动条滚动事件
            _this.$elm.find('.table-content-box').scroll(function(){
                _this.$elm.find('.lock-top').scrollLeft($(this).scrollLeft());
                _this.$elm.find('.lock-left').scrollTop($(this).scrollTop());
            });

            $(window).resize(function(){
                _this.layout();
            });
        },
        layout: function(){
            var _this = this;
            var width = _this.$elm.width(),
                height = _this.$elm.height();

            //右侧宽度设置
            var leftWidth = _this.$elm.find('.m-lock-left').width();
            _this.$elm.find('.m-lock-right').width(Math.floor(width-leftWidth-0.5));


            // var isScroll = _this.isScroll();
            // if(isScroll.horizontal){    //水平滚动条
            //     _this.$elm.find('.lock-left').height(Math.ceil(height));
            // }else{
            //     _this.$elm.find('.lock-left').height(height);
            // }
            // if(isScroll.vertical){    //垂直滚动条
            //     _this.$elm.find('.lock-top').width(Math.floor(width-leftWidth));
            // }else{
            //     _this.$elm.find('.lock-top').width('auto');
            // }
        },
        isScroll: function(){    //判断table-content-box是否出现滚动条。
            var _this = this;

            var ret = {
                horizontal: false,    //横向
                vertical: false    //纵向
            };

            var tableBoxWidth = _this.$elm.find('.table-content-box').width(),
                tableBoxHeight = _this.$elm.find('.table-content-box').height();

            var tableWidth = _this.$elm.find('.table-content').width(),
                tableHeight = _this.$elm.find('.table-content').height();

            if(tableWidth > tableBoxWidth){
                ret.horizontal = true;
            }else{
                ret.horizontal = false;
            }
            if(tableHeight >= tableBoxHeight){
                ret.vertical = true;
            }else{
                ret.vertical = false;
            }

            if(ret.horizontal){
                if(tableHeight+17 >= tableBoxHeight){
                    ret.vertical = true;
                }else{
                    ret.vertical = false;
                }
            }

            return ret;
        },
        editCell: function(callback, blurCallback){    //编辑单元内容
            var _this = this;

            var cellDiv = _this.$elm.find('.u-cell');

            //添加样式及取消input的readonly属性
            cellDiv.each(function(){
                $(this).addClass('u-edit-box');
                $(this).children('.u-edit-input').removeAttr('readonly').removeAttr('data-tootips');
            });

            //表格点击切换样式
            cellDiv.click(function(){
                if($(this).hasClass('u-edit-box')){
                    _this.$elm.find('.u-edit-box.active').removeClass('active');
                    $(this).addClass('active');
                }
            });

            //单元格失去焦点时将值写入input的data中，缓存下来。
            cellDiv.children('.u-edit-input').blur(function(){
                var val = $.trim($(this).val());
                var reg = /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/;
                if(val && !reg.test(val)){
                    $(this).parent('.u-cell').addClass('u-edit-error');
                    $(this).data('price','');
                }else{
                    $(this).parent('.u-cell').removeClass('u-edit-error');
                    $(this).data('price',$.trim($(this).val()));
                }

                var idx = parseInt($(this).parent().parent('td').index()) + 1;

                blurCallback('cell', {'price': $(this).data('price'), 'idx': idx}, $(this).data('indexnum'));
            });

            //点击编辑单元格详情
            cellDiv.children('.u-edit-btn').click(function(){
                var data = $(this).parent().children('.u-edit-input').data() || {};

                var latitudeIndex = $(this).parent().parent('td').parent('tr').index(),    //行
                    longitudeIndex =$(this).parent().parent('td').index();    //列

                var longitude = _this.$elm.find('.table-top tr').find('th').eq(longitudeIndex).text(),
                    latitude = _this.$elm.find('.table-left tbody').find('tr').eq(latitudeIndex).children('td').eq(2).text();

                data.latitude = latitude;
                data.longitude = longitude;

                if(typeof callback == "function") {
                    callback(data);
                }
            });
        },
        editRow: function(callback){    //行编辑功能事件绑定
            var _this = this;

            var rowDiv = _this.$elm.find('.u-price-edit');

            //取消提示信息
            rowDiv.each(function(){
                $(this).removeAttr('data-tootips');
            });

            rowDiv.click(function(){
                var data = $(this).data();

                _this.$elm.find('.u-price-edit.active').removeClass('active');
                $(this).addClass('active');

                var latitudeIndex = $(this).parent('td').parent('tr').index();    //行
                var latitude = _this.$elm.find('.table-left tbody').find('tr').eq(latitudeIndex).children('td').eq(2).text();
                data.latitude = latitude;

                if(typeof callback == "function") {
                    callback(data);
                }
            });
        },
        cancelEditCell: function(){    //取消编辑功能
            var _this = this;

            _this.$elm.find('.u-cell').each(function(){
                $(this).removeClass('u-edit-box');
            });

            _this.$elm.find('.u-edit-input').each(function(){
                $(this).attr('readonly','readonly');
            });
        },
        setCellData: function(data, callback){    //设置单元格的值，data为对象
            var _this = this;

            _this.$elm.find('.u-edit-box.active').children('.u-edit-input').val(data.price).data(data);

            try{
                var index = _this.$elm.find('.u-edit-box.active').children('.u-edit-input').data('indexnum');
                callback('cell', data, index);
            }catch(e){}
        },
        setRowData: function(data, callback){    //设置单元格的值，data为对象
            var _this = this;

            //获取单元格为tbody tr第几行
            var activeDom = _this.$elm.find('.u-price-edit.active');

            var index = activeDom.parent('td').parent('tr').index();

            var trDom = _this.$elm.find('.table-content tbody').find('tr').eq(index);
            trDom.find('.u-edit-input').each(function(){
                var thisData = $(this).data(),
                    newData = $.extend({}, thisData, data);

                try{
                    callback('cell', newData, $(this).data('indexnum'));
                }catch(e){}
                $(this).data(newData);
            });

            activeDom.html(data.calcName).data(data);

            try{
                callback('row', data, activeDom.data('indexnum'));
            }catch(e){}
        }
    };

    $.fn.htable = function(data, options){
        return new plugin(this, data, options);
    }
});
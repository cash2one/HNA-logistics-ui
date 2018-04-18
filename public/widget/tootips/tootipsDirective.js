/**
 * Package: tootips.js
 * Function: tootips 提示信息
 * Author: liutao.
 * Date: 2017-04-18 11:00:00.
 */
(function(root,factory){
    factory(root.jQuery);
})(window,function($){
    var opts = {
        mouseWidth: 10,    //鼠标宽
        mouseHeight: 20,    //鼠标高度
    };

    function plugin(elm, options){
        var _this = this;

        _this.$elm = $(elm);

        _this.opts = $.extend({}, opts, options);

        _this.init();
    }

    plugin.prototype = {
        init: function(){
            var _this = this;

            //视图事件监听
            _this.handle();
        },
        handle: function(){
            var _this = this;

            _this.$elm.mouseover(function(e){

                $('#tootips').length ? $('#tootips').remove() : '';
                $('body').append('<div id="tootips"></div>');

                var html = _this.$elm.attr('data-tootips');

                if(html){
                    $('#tootips').html(html);

                    _this.seat(e);

                    $('#tootips').show();
                }else{
                    if(typeof _this.opts.mouseoverfn == "function") {
                        var html = _this.opts.mouseoverfn($(this).data());
                        if(html){
                            $('#tootips').html(html);

                            _this.seat(e);
                            $('#tootips').show();

                            _this.$elm.attr('data-tootips',html);
                        }
                    }
                }
            }).mouseout(function(){
                $('#tootips').remove();
            }).mousemove(function(e){
                _this.seat(e);
            });
        },
        seat: function(e){
            var _this = this;

            var Left = e.pageX + _this.opts.mouseWidth,
                Top = e.pageY + _this.opts.mouseHeight;

            var tWidth = $('#tootips').outerWidth(),
                tHeight = $('#tootips').outerHeight();

            var wWidth = $(window).width()-210,
                wHeight = $(window).height();

            if((Left + tWidth) > wWidth){    //显示到左边
                Left = Left - tWidth - _this.opts.mouseWidth;
            }
            if((Top + tHeight) > wHeight){    //显示到上边
                Top = Top - tHeight - _this.opts.mouseHeight;
            }

            Left = Left < 195 ? 195 : Left;
            Top = Top < 0 ? 0 : Top;

            $('#tootips').css({
                "top": Top + "px",
                "left": Left  + "px",
                "max-width":400,
                "max-height":wHeight
            });
        }
    };

    $.fn.tootips = function(options){
        var _this = this;

        _this.each(function(){
            return new plugin(this, options);
        });

    }
});
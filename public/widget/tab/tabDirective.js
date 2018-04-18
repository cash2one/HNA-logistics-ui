;(function(root, factory){
    factory(root.jQuery);
})(window, function($){
    var opts = {

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

            _this.handle();

            //初始化显示第一个
            _this.toggle(0, true);
        },
        handle: function(){
            var _this = this;

            //节点展开
            _this.$elm.children('.nav-tabs').children('li').on('click', function(e){
                _this.toggle($(this).index());
            });
        },
        toggle: function(index, isInit){
            var _this = this;
            var dom = _this.$elm.children('.nav-tabs').children('li').eq(index);

            if(dom.hasClass('active') || dom.hasClass('disabled')){
                return;
            }

            _this.selected(index);

            var callback = _this.opts.callback || '';
            if(typeof callback == "function" && !isInit) {
                callback(index);
            }
        },
        disable: function(index){
            //禁止某个tab
            var _this = this;

            _this.$elm.children('.nav-tabs').children('li').eq(index).addClass('disabled').siblings('li').each(function(){
                $(this).removeClass('disabled');
            });
        },
        exdisable: function(index){
            //除过index，禁止其他的tab
            var _this = this;

            _this.$elm.children('.nav-tabs').children('li').eq(index).removeClass('disabled').siblings('li').each(function(){
                $(this).addClass('disabled');
            });

            _this.selected(index);
        },
        enableAll: function(){
            var _this = this;

            _this.$elm.children('.nav-tabs').children('li').each(function(){
                $(this).removeClass('disabled');
            });
        },
        selected: function(index){
            var _this = this;

            _this.$elm.children('.nav-tabs').children('li').eq(index).addClass('active').siblings('li').each(function(){
                $(this).removeClass('active');
            });

            _this.$elm.children('.tab-content').children('.table-pane').eq(index).addClass('active').siblings('.table-pane').each(function(){
                $(this).removeClass('active');
            });
        },
        getIndex: function(){
            var _this = this;
            var ret = 0;
            _this.$elm.children('.nav-tabs').children('li').each(function(index){
                if($(this).hasClass('active')){
                    ret = index;
                    return index;
                }
            });
            return ret;
        }
    };

    $.fn.tab = function(options){
        return new plugin(this, options);
    }
});
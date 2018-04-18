/**
 * Package: jquery.vercode.js
 * Function: Verification Code
 * Author: liutao.
 * Date: 2016-11-09 11:20:00.
 */
;(function($, window, document, undefined){
    function verCode(elm, imgelm, options, callback){
        var _this = this;
        var $elm = _this.checkElm(elm) ? $(elm) : $,
            $imgelm = _this.checkElm(imgelm) ? $(imgelm) : $;

        callback = _this.checkFn(callback) ? callback : function(){};

        var opts = {
            tips: "",
            duration:  300,
            swipestart:  false,
            min:  0,
            max:  $elm.width(),
            index:  0,
            isLock:  false,
            lableIndex:  0
        };
        opts = $.extend(opts, options||{});


        //$elm
        _this.elm = $elm;
        //$imgelm
        _this.imgelm = $imgelm;
        //opts
        _this.opts = opts;
        //tips
        _this.tips = opts.tips;
        //是否开始滑动
        _this.swipestart = opts.swipestart;
        //最小值
        _this.min = opts.min;
        //最大值
        _this.max = opts.max;
        //当前滑动条所处的位置
        _this.index = opts.index;
        //是否进行滑动锁定
        _this.isLock = opts.isLock;
        //滑块宽度
        _this.labelWidth = _this.elm.find('#code_label').width();
        //滑块elm
        _this.label = _this.elm.find('#code_label');
        //滑块背景elm
        _this.sliderBg = _this.elm.find('#code_bg');
        //切块elm
        _this.smallImg = _this.imgelm.find("#small-img");
        //鼠标在滑动按钮的位置
        _this.lableIndex = opts.lableIndex;
        //滑块是否移动过
        _this.isMoved = false;
        //callback
        _this.callback = callback;

        //set tips
        _this.elm.find("#code_Tips").text(_this.tips);

        //timer 定时器句柄
        _this.timer = "";
    }

    verCode.prototype.init = function () {
        var _this = this;

        _this.updateView();
        _this.label.on("mousedown", function (event) {
            var e = event || window.event;
            _this.lableIndex = e.clientX - this.offsetLeft;
            _this.isOnSileBox = true;
            _this.handerIn();
        }).on("mouseover",function(){
            _this.isOnSileBox = true;
        }).on("mouseout", function(){
            _this.isOnSileBox = false;
        });

        $(document).on("mousemove", function (event) {
            _this.handerMove(event);
            if(_this.swipestart){
                _this.imgelm.show();

                event.stopPropagation();
                event.preventDefault();
            }
        }).on("mouseup", function (event) {
            _this.handerOut();
        });

        _this.elm.hover(function(){
            _this.show();
        },function(){
            if(!_this.swipestart){
                _this.hide();
            }
        });
    };

    /**
     * imgElm 显示
     */
    verCode.prototype.show = function(){
        var _this = this;
        _this.timer ? clearTimeout(_this.timer) : "";
        _this.imgelm.fadeIn();
    };

    /**
     * imgElm 隐藏
     */
    verCode.prototype.hide = function(){
        var _this = this;
        if(_this.isMoved){
            _this.timer = setTimeout(function(){  //注意这里需要使用闭包，否则this指向有问题。
                _this.imgelm.fadeOut();
            }, 1000);
        }else{
            _this.imgelm.fadeOut();
        }
    };

    /**
     * 鼠标/手指接触滑动按钮
     */
    verCode.prototype.handerIn = function () {
        var _this = this;
        _this.swipestart = true;
        _this.min = 0;
        _this.max = _this.elm.width();
        if(!_this.isLock){
            _this.isMoved = true;
            $("#login-callback-tips").html("");
        }

        _this.elm.find("#code_Tips").animate({'opacity':0}, _this.opts.duration);
    };

    /**
     * 鼠标/手指移出
     */
    verCode.prototype.handerOut = function () {
        var _this = this;

        //松开滑动进行锁定
        if(_this.swipestart == true && _this.isLock == false){    //执行回调
            _this.isLock = true;
            _this.callback();
        }
        //停止
        _this.swipestart = false;
    };

    /**
     * 鼠标/手指移动
     * @param event
     * @param type
     */
    verCode.prototype.handerMove = function (event, type) {
        var _this = this;
        if (_this.swipestart && !_this.isLock) {
            event.preventDefault();
            event = event || window.event;
            if (type == "mobile") {
                _this.index = event.originalEvent.touches[0].pageX - _this.lableIndex;
            } else {
                _this.index = event.clientX - _this.lableIndex;
            }
            _this.move();
        }
    };

    /**
     * 鼠标/手指移动过程
     */
    verCode.prototype.move = function () {
        var _this = this;
        if(_this.index < 0){
            _this.index = _this.min;
        }else if ((_this.index + _this.labelWidth) >= _this.max) {
            _this.index = _this.max - _this.labelWidth;
        }
        _this.updateView();
    };


    /**
     * 更新视图
     */
    verCode.prototype.updateView = function () {
        var _this = this;

        _this.sliderBg.css('width', _this.index);
        _this.label.css("left", _this.index + "px");
        _this.smallImg.css("left", _this.index + "px");
    };

    /**
     * 重置slide的起点
     */
    verCode.prototype.reset = function () {
        var _this = this;

        _this.index = 0;
        _this.sliderBg.animate({'width':0},_this.opts.duration);
        _this.label.animate({left: _this.index}, _this.opts.duration)
            .next("#code_Tips").animate({opacity: 1}, _this.opts.duration);
        _this.smallImg.animate({left: _this.index}, _this.opts.duration);
        _this.isLock = false;
        _this.isMoved = false;

        if(!_this.isOnSileBox){
            _this.imgelm.fadeOut();
        }
    };

    /**
     * 获取滑块百分比
     */
    verCode.prototype.percent = function(){
        var _this = this;

        return Math.floor(_this.index * 100 / _this.max);
    };

    /**
     * 验证码验证成功
     */
    verCode.prototype.success = function(){
        var _this = this;

        //显示提示框
        _this.imgelm.find("#msg-tips")
            .show()
            .delay(1000)
            .fadeOut(100, function(){
                _this.isMoved = false;

                if(!_this.isOnSileBox){
                    _this.imgelm.fadeOut();
                }
            })
            .removeClass("msg-tips-warn, msg-tips-error")
            .addClass("msg-tips-success")
            .find(".u-tips").text(Lang.getValByKey("login", "login_code_valiPassed"))
            .next(".u-msg").text("");

    };

    /**
     * 验证码验证失败
     */
    verCode.prototype.failure = function(){
        var _this = this;

        _this.imgelm.find("#msg-tips")
            .show()
            .delay(1000)
            .hide(0)
            .removeClass("msg-tips-warn, msg-tips-success")
            .addClass("msg-tips-error")
            .find(".u-tips").text(Lang.getValByKey("login", "login_code_valiFailed"))
            .next(".u-msg").text(Lang.getValByKey("login", "login_code_sliderDrag"));

        //滑块动画特效
        _this.imgelm.find("#small-img")
            .fadeOut(200)
            .delay(100)
            .fadeIn(200)
            .fadeOut(200)
            .delay(100)
            .fadeIn(200, function(){
                _this.reset();
            });
    };

    /**
     * 重刷验证码
     */
    verCode.prototype.refresh = function(){
        var _this = this;

        //显示提示框
        _this.imgelm.find("#msg-tips")
            .show()
            .delay(1000)
            .fadeOut(100,function(){
                _this.reset();
            })
            .hide(0)
            .removeClass("msg-tips-success, msg-tips-error")
            .addClass("msg-tips-warn")
            .find(".u-tips").text(Lang.getValByKey("login", "login_code_reTry"))
            .next(".u-msg").text(Lang.getValByKey("login", "login_code_reTryMsg"));
    };

    /**
     * 检测元素是否存在
     * @param elm
     * @returns {boolean}
     */
    verCode.prototype.checkElm = function (elm) {
        if($(elm).length > 0){
            return true;
        }else{
            throw "this element does not exist.";
        }
    };

    /**
     * 检测传入参数是否是function
     * @param fn
     * @returns {boolean}
     */
    verCode.prototype.checkFn = function (fn) {
        if(typeof fn === "function"){
            return true;
        }else{
            throw "the param is not a function.";
        }
    };

    window['verCode'] = verCode;
})(jQuery, window, document);
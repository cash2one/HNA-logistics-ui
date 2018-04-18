app.factory('accountView', [function() {
    var accountView = {};

    accountView.propmtCostEvent = function(elm){
        elm.on('click', function(){
            if($(this).next().is(':visible')){
                $(this).next().hide();
                $(this).children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
                return false;
            }else{
                elm.next().hide();
                elm.children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
                $(this).next().show();
                $(this).children('.icon-more-down').removeClass('icon-angle-right').addClass('icon-angle-down');
                return false;
            }
        });
    };

    accountView.loadBarEvent = function(elm){
        elm.next().hide();
        elm.children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
        if(!elm.next('ul').eq(0).is(':visible')){
            elm.next('ul').eq(0).show();
            elm.eq(0).children('.icon-more-down').removeClass('icon-angle-right').addClass('icon-angle-down');
        }

        elm.next('.switch-list').css('height', 400 - elm.length*40);
    };

    accountView.displayErrorBox = function(elm){
        if(elm.eq(0).next('.switch-list').is(":hidden")){
            accountView.loadBarEvent(elm);
        }
    };

    /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
    accountView.height = function(type){
        var height = 0;
        switch (type){
            case 'acTable': height = $('.m-table-page').height() - 255;
                break;
        }
        return height;
    };

    /**
     * 滚动条设置
     * @param elm    选择器，#id 或 .class
     * @param height    高度
     */
    accountView.slimscroll = function(elm, height){
        $(elm).slimscroll({ height: height });
    };

    /**
     * 弹出层
     * @param opt    弹出层options，值可为对象或者字符串
     */
    accountView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    return accountView;
}]);
app.factory('priceDetailView', [function() {
    var priceDetailView = {};

    priceDetailView.initCalander = function(){
        Calander.init({
            ele: ["#begin-time", "#end-time"],
            difference: 1000    //两个时间选择框相差1秒。即1000毫秒
        });
    };

    /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
    priceDetailView.height = function(type){
        var height = 0;
        switch (type){
            case 'table': height = $('#m-show-region').height() - 185;
                break;
        }
        return height;
    };

    /**
     * 滚动条设置
     * @param elm    选择器，#id 或 .class
     * @param height    高度
     */
    priceDetailView.slimscroll = function(elm, height){
        $(elm).slimscroll({ height: height });
    };

    return priceDetailView;
}]);
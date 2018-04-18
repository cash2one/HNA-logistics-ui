app.factory('regionDetailView', [function() {
    var regionDetailView = {};

    /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
    regionDetailView.height = function(type){
        var height = 0;
        switch (type){
            case 'table': height = $('.master-table').height() - 350;
                break;

            case 'selectedUser' : height = window.innerHeight - 252;
                break;
        }
        return height;
    };

    /**
     * 滚动条设置
     * @param elm    选择器，#id 或 .class
     * @param height    高度
     */
    regionDetailView.slimscroll = function(elm, height){
        $(elm).slimscroll({ height: height });
    };

    /**
     * 弹出层
     * @param opt    弹出层options，值可为对象或者字符串
     */
    regionDetailView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    regionDetailView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return regionDetailView;
}]);
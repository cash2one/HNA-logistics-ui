app.factory('roleView', [function() {
    var roleView = {};

    roleView.tab = function(selector, callback){
      return $(selector).tab({'callback':callback});
    };

    /**
     * 弹出层
     * @param opt    弹出层options，值可为对象或者字符串
     */
    roleView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
    roleView.height = function(type){
        var height = 0;
        switch (type){
            case 'getResources': height = $('.layout-right').height() - $('.layout-right ul').outerHeight()-160;
                break;
            case 'getSeniorResources': height = $('.layout-right').height() - $('.layout-right ul').outerHeight()-195;
                break;
            case 'getRoleUser': height = $('.layout-right').height() - 320;
                break;
            case 'getSeniorRoleUser' : height = $('.layout-right').height() - 354;
                break;
            case 'getGroupCandidate': height = window.innerHeight - 252;
                break;
        }
        return height;
    };

    /**
     * 滚动条设置
     * @param elm    选择器，#id 或 .class
     * @param height    高度
     */
    roleView.slimscroll = function(elm, height){
        $(elm).slimscroll({ height: height });
    };

    roleView.getResourcesView = function(){
        $("#wrap-resources").html('').html('<ul id="resources" class="htree" style="text-align:left;padding-left:45px;"></ul>');
    };

    return roleView;
}]);
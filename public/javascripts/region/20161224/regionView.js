app.factory('regionView', [function() {
    var regionView = {};

    /** tab切换事件 */
    regionView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return regionView;
}]);
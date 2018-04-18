app.factory('addProductView', [function() {
    var addProductView = {};
    /** tab切换事件 */
    addProductView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return addProductView;
}]);
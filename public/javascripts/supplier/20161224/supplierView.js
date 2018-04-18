app.factory('supplierView', [function() {
    var supplierView = {};

    /** tab切换事件 */
    supplierView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return supplierView;
}]);
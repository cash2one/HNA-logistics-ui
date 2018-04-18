app.factory('servicesView', [function() {
    var servicesView = {};

    /** tab切换事件 */
    servicesView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return servicesView;
}]);
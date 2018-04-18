app.factory('usergroupView', ['usergroupService', '$rootScope', function(usergroupService, $rootScope) {
    var usergroupView = {};

    usergroupView.tab = function(selector, callback){
        return $(selector).tab({'callback':callback});
    };

    return usergroupView;
}]);
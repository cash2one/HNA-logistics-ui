app.factory('flightSettingView', [function() {
    var flightSettingView = {};

    flightSettingView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    return flightSettingView;
}]);
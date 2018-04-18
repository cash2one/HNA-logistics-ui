app.factory('fundsAccountView', [function() {
    var fundsAccountView = {};

    var defaultTime = "2100-01-01 00:00:00";

    fundsAccountView.initCalander = function(){
        Calander.init({
            ele: ["#begin-time", "#end-time"],
            isClear: true,
            showTime: false,
            showSecond: false,
            showMinute:false,
            showHour: false
        });
    };

    return fundsAccountView;
}]);
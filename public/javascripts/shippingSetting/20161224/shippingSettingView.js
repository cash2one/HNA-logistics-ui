app.factory('shippingSettingView', [function() {
    var shippingSettingView = {};

    var defaultTime = "2100-01-01 00:00:00";

    shippingSettingView.initCalander = function($scope){
        Calander.init({
            ele: ["#startTime", "#endTime"],
            isClear: true,
            showHour:false,
            showMinute:false,
            showSecond:false,
            showTime:false
        });

        shippingSettingView.initTime($scope);
    };

    shippingSettingView.initTime = function($scope){
        function fix(num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        }

        var nowdate = new Date();
        var oneweekdate = new Date(nowdate-6*24*3600*1000);
        var y = oneweekdate.getFullYear();
        var m = fix(oneweekdate.getMonth()+1,2);
        var d = fix(oneweekdate.getDate(),2);
        // var hour = fix(oneweekdate.getHours(),2);
        // var min = fix(oneweekdate.getMinutes(),2);
        // var sec = fix(oneweekdate.getSeconds(),2);
        $scope.tableModel.restData.startTime = y+'-'+m+'-'+d;
        $scope.tableModel.restData.endTime = new Date().format('yyyy-MM-dd');
    };

    shippingSettingView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    return shippingSettingView;
}]);
app.factory('tryBillingView', [function() {
    var tryBillingView = {};

    var defaultTime = "2100-01-01 00:00:00";

    tryBillingView.initCalander = function(){
        $('#begin-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            beforeShow: function() {

            },
            onChangeMonthYear: function() {

            },
            onSelect: function(date) {

            },
            onClose: function() {

            }
        });
    };

    return tryBillingView;
}]);
app.factory('orderNumberView', [function() {
    var orderNumberView = {};

    orderNumberView.initCalander = function(){
        Calander.init({
            ele: ["#invertory-begin-time", "#invertory-end-time"]
        });
    };

    orderNumberView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    orderNumberView.rebuildServiceName = function(data){
        var data = data.data;
        for (var index = 0; index < data.length; index++) {
            data[index].name = data[index].name + '(' + data[index].code + ')';
        }
    };

    orderNumberView.rebuildClienteleName = function(data){
        var data = data.data;
        for (var index = 0; index < data.length; index++) {
            data[index].userName = data[index].userName + '(' + data[index].code + ')';
        }
    };

    return orderNumberView;
}]);
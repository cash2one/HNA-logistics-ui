app.factory('ordersView', [function() {
    var ordersView = {};
    var defaultTime = "2100-01-01 00:00:00";
    ordersView.initCalander = function(){
        Calander.init({
            ele: ["#begin-time", "#end-time"]
        });
        Calander.init({
            ele: ["#begin-time1", "#end-time1"]
        });
    };

    ordersView.promptBox = function(data){
        var config = {
            isDelay:true,
            contentDelay: data.msg,
            time : 3000
        };
        if(data.errorCode == 0) {
            config.type = 'success';
        }else{
            config.manualClose = true;
            config.type = 'errer';
        }
        $(document).promptBox(config);
        !config.time || $(document).promptBox('closePrompt');
    };

    ordersView.promptMidBox = function(title, data, btnText, fn,type,opr,cancelDes){
        $(document).promptBox({
            title : title ? title : '提示',
            type : type || 'success',
            width : '400px',
            content: {
                tip: data.msg
            },
            cancelDescription: cancelDes,
            operation: [
                {
                    type: 'submit',
                    application : opr,
                    description : btnText || Lang.getValByKey("common", 'common_pagination_confirm'),
                    operationEvent: function () {
                        fn();
                        return false;
                    }
                }
            ]
        });
    };
    return ordersView;
}]);
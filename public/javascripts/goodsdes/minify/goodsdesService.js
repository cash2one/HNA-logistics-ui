app.factory("goodsdesService",["easyHttp",function(t){var e={};return e.getBillTaskDetail=function(e,a){return t.get("logistics.getBillTaskDetail",{urlParams:{taskCode:e}},a)},e}]);
app.factory("ordersStatusService",["$http","easyHttp",function(t,r){var e={};return e.getOrderStatus=function(t,e){return r.get("logistics.getOrderStatus",t,e)},e.getOrderInfoByorderNo=function(t,e){return r.get("logistics.getOrderInfoByorderNo",t,e)},e}]);
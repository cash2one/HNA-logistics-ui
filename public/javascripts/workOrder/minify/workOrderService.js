app.factory("workOrderService",["easyHttp",function(t){var e={};return e.deleteWorkOrder=function(e,r){t.post("logistics.deleteWorkOrderList",{urlParams:e},r)},e.getCustomerList=function(){return t.get("logistics.getCurrentUserVisibleUserList")},e.getStaffList=function(e){return t.get("logistics.getUserSelect",e)},e.getCustomerFullNameList=function(e){return t.get("logistics.searchAllCustomerList",e)},e}]);
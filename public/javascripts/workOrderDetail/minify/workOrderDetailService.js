app.factory("workOrderDetailService",["$http","easyHttp",function(r,e){var t={};return t.getWorkOrderTypeList=function(r,t){return e.get("logistics.getWorkOrderTypeList",r,t)},t.getCodeList=function(r,t){return e.get("logistics.getCodeList",r,t)},t.checkWorkOrder=function(r,t){return e.get("logistics.checkWorkOrder",r,t)},t.checkorderNo=function(r,t){return e.get("logistics.checkorderNo",r,t)},t.getStaffList=function(r,t){return e.get("logistics.getUserSelect",r,t)},t.getWorkOrderDetailById=function(r,t){return e.get("logistics.getWorkOrderDetailById",r,t)},t.createWorkOrder=function(r,t){return e.post("logistics.createWorkOrder",r,t)},t.handleWorkOrder=function(r,t){return e.post("logistics.handleWorkOrder",r,t)},t}]);
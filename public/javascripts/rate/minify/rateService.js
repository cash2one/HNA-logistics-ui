app.factory("rateService",["easyHttp",function(t){var e={};return e.getRateList=function(e){return t.get("logistics.getRateList",e)},e.getCurrencyList=function(e){return t.get("logistics.getCurrencyList",{seatParams:{language:"zh-CN"},urlParams:{pageSize:"10000"}},e)},e.deleteRateList=function(e,r){return t.post("logistics.deleteRateList",{urlParams:e},r)},e.createNewRate=function(e,r){return t.post("logistics.createNewRate",{urlParams:e},r)},e.updateRate=function(e,r){return t.put("logistics.updateRate",{urlParams:e},r)},e.getServerTime=function(e){return t.get("logistics.getServerTime",e)},e}]);
app.factory("historyRateService",["easyHttp",function(t){var e={};return e.getRateList=function(e){return t.get("logistics.getRateList",{async:!1},e)},e.deleteRateList=function(e,a){return t.post("logistics.deleteRateList",{urlParams:e,async:!1},a)},e.createNewRate=function(e,a){return t.post("logistics.createNewRate",{urlParams:e},a)},e.updateRate=function(e,a){return t.put("logistics.updateRate",{urlParams:e},a)},e}]);
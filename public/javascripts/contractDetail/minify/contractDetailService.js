app.factory("contractDetailService",["easyHttp",function(t){var e={};return e.getContractType=function(e){return t.get("logistics.getContractType",e)},e.getContractTemplateByType=function(e,a){return t.get("logistics.getContractTemplateByType",{urlParams:e},a)},e.saveContract=function(e,a){return t.post("logistics.saveContract",{urlParams:e},a)},e.getContractById=function(e,a){return t.get("logistics.getContractById",{seatParams:{id:e}},a)},e.getContractTemplateById=function(e,a){return t.get("logistics.getContractTemplateById",{seatParams:{id:e}},a)},e.updateContract=function(e,a){return t.post("logistics.updateContract",{urlParams:e,seatParams:{id:e.id}},a)},e.delContract=function(e,a){return t.del("logistics.delContract",{urlParams:e},a)},e}]);
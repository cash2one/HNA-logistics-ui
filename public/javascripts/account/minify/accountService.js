app.factory("accountService",["easyHttp",function(t){var c={};return c.getLanguage=function(c){return t.get("logistics.getInternational",c)},c.delAccount=function(c,n){return t.post("logistics.delAccount",{urlParams:c},n)},c.saveAccount=function(c,n){return t.post("logistics.saveAccount",c,n)},c.saveEditAccount=function(c,n){return t.post("logistics.saveEditAccount",c,n)},c.getAccountDetail=function(c,n){return t.get("logistics.getAccountDetail",{seatParams:{id:c}},n)},c.checkCode=function(c,n){return t.get("logistics.checkAccountCode",c,n)},c}]);
app.factory("service",["easyHttp",function(e){var r={};return r.deleteSalePrice=function(r,t){return e.post("logistics.deleteSalePrice",{urlParams:r},t)},r.submitSalePrice=function(r,t){return e.post("logistics.submitSalePrice",{urlParams:r},t)},r}]);
app.factory("confirmOrderService",["$http","easyHttp",function(t,e){var r={};return r.getOrderStatus=function(t,r){return e.get("logistics.getOrderStatus",t,r)},r.getOrderInfoByorderNo=function(t,r){return e.get("logistics.getOrderInfoByorderNo",t,r)},r.getCargoTypes=function(t,r){return e.get("logistics.getGoodTypes",t,r)},r.getProductList=function(t,r){return e.get("logistics.getProductsListMin",t,r)},r.getCargoUnitList=function(t){return e.get("logistics.getWeightUnitList",t)},r.getUserList=function(t){return e.get("logistics.getCurrentUserVisibleUserList-confirmOrder",t)},r.getServiceList=function(t,r){return e.get("logistics.getProductServiceTypes",t,r)},r.getAddressList=function(t,r){return e.get("logistics.queryAddressList",t,r)},r.getCountryList=function(t,r){return e.get("logistics.productCountryList",t,r)},r.getAddressData=function(t){return e.get("logistics.productAreaList",t)},r.saveOrUpdateAddress=function(t,r){return e.post("logistics.saveOrModifyAddress",t,r)},r.setDefaultAddress=function(t,r){return e.post("logistics.setDefaultAddress",t,r)},r.delUserAddress=function(t,r){return e.post("logistics.delUserAddress",t,r)},r.getOrderInfoByOrderId=function(t,r){return e.get("logistics.getOrderInfoByOrderId",t,r)},r.submitOrder=function(t,r){return e.post("logistics.getOrdersTable",t,r)},r.updateOrder=function(t,r){return e.post("logistics.updateOrder",t,r)},r.getUnitDictionary=function(t,r){return e.get("logistics.getUnitDictionary",t,r)},r.isAddressAccessForCurrentProduce=function(t,r){return e.get("logistics.isAddressAccessForCurrentProduce",t,r)},r.isWeightInRange=function(t,r){return e.post("logistics.isWeightInRange",t,r)},r.getCurrencyByAccountId=function(t,r){return e.get("logistics.getCurrencyByAccountId",t,r)},r.getClientNum=function(t,r){return e.get("logistics.getClientNum",t,r)},r.checkExternalNo=function(t,r){return e.post("logistics.checkExternalNo",t,r)},r.getAddressType=function(t){return e.get("logistics.queryProductGroup",t)},r.getAirSeaData=function(t,r){return e.get("logistics.getProAirSeaData",t,r)},r.getProductReceived=function(t,r){return e.get("logistics.getProductReceived",t,r)},r.getProductGroupRootId=function(t,r){return e.get("logistics.getProductGroupRootId",t,r)},r.getProductCargoData=function(t){return e.get("logistics.getProductCargoData",t)},r.getPayInfo=function(t,r){return e.get("logistics.getPayInfo",t,r)},r.getServiceInfo=function(t,r){return e.get("logistics.getOrderServiceInfo",t,r)},r.getProductAllData=function(t){return e.get("logistics.getProductAllData",t)},r.getProductNavItem=function(){return e.get("logistics.getProductNavItem")},r}]);
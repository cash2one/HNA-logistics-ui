app.factory("areaService",["easyHttp","$http",function(t,e){return{getAddressData:function(e,r){return t.get("logistics.search",{urlParams:{countryCode:e,parentId:r,pageSize:1e3}})},getAddrData:function(e){return t.get("logistics.search",e)}}}]);
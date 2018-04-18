easySpa.require(["widget/tab","widget/select","widget/calander","widget/prompt"],function(){app.controller("tryBillingCtrl",["$scope","tryBillingService","tryBillingView",function(e,t,a){e.type="service",e.groupType=[{id:1,name:"海运",checked:!1},{id:6,name:"空运",checked:!1},{id:11,name:"速递",checked:!1}],a.initCalander();var r,i,n,o,u,l,c,s,d,p,g,m;e.getServicesData=function(e,a){e=e||"",a=a||1;var r={urlParams:{q:e,pageIndex:a,pageSize:10,status:4},seatParams:{serviceTypeId:-1}},i=t.getServices(r);return angular.forEach(i.data,function(e,t){e.name+="("+e.code+")"}),i},e.getServices=function(){r||(r=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-service",showTextField:"name",pagination:!0,attrTextField:{"ng-value":"uid"},closeLocalSearch:!0,isSaveInputVal:!0,onSearchValueChange:function(t,a,r){e.servicesData=e.getServicesData(a,r),t.setData(e.servicesData)},attrTextId:function(t){e.iInputServicesValue=t,e.$apply()},attrTextModel:function(t){e.iInputServices=t,e.$apply()}}),r.open())},e.getProductData=function(a,r){a=a||"",r=r||1;var i={urlParams:{q:a,pageIndex:r,pageSize:10,groupId:e.topGrade,isForCalculate:!1}};11==e.topGrade&&(i.urlParams.isForCalculate=!0);var n=t.getProducts(i);return angular.forEach(n.data,function(e,t){e.name+="("+e.code+")"}),n},e.getProducts=function(){i||(i=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,searchPlaceHoder:"请输入名称或编码",defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-product",showTextField:"name",pagination:!0,attrTextField:{"ng-value":"uid"},isSaveInputVal:!0,closeLocalSearch:!0,onSearchValueChange:function(t,a,r){e.productsData=e.getProductData(a,r),t.setData(e.productsData)},attrTextId:function(t){e.iInputProductsValue=t,e.$apply()},attrTextModel:function(t){e.iInputProducts=t,e.$apply()}}),i.open())},e.getClientData=function(e,a){e=e||"",a=a||1;var r={urlParams:{q:e,refCombos:"",isLocked:-1,evaluateLeval:-1,beyondLeval:!1,pageIndex:a,pageSize:10,sortName:"evaluateLeval",isAsc:!1}},i=t.getClient(r);return angular.forEach(i.data,function(e,t){e.userName+="("+e.code+")"}),i},e.getClient=function(){n||(n=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-client",showTextField:"userName",closeLocalSearch:!0,pagination:!0,isSaveInputVal:!0,onSearchValueChange:function(t,a,r){e.clientData=e.getClientData(a,r),t.setData(e.clientData)},attrTextField:{"ng-value":"id"},attrTextId:function(t){e.iInputClientValue=t,e.$apply()},attrTextModel:function(t){e.iInputClient=t,e.$apply()}}),n.open())},e.getAccountData=function(e,a){e=e||"",a=a||1;var r={urlParams:{q:e,pageIndex:a,pageSize:10}},i=t.getAccount(r);return angular.forEach(i.data,function(e,t){e.name+="("+e.code+")"}),i},e.getAccount=function(){o||(o=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-account",showTextField:"name",closeLocalSearch:!0,pagination:!0,isSaveInputVal:!0,onSearchValueChange:function(t,a,r){e.accountData=e.getAccountData(a,r),t.setData(e.accountData)},attrTextField:{"ng-value":"id"},attrTextId:function(t){e.iAccountValue=t},attrTextModel:function(t){e.iAccount=t,e.$apply()}}),o.open())},e.getGoods=function(){u||(e.goodsData=t.getGoods(),u=selectFactory({data:e.goodsData,defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-goods",showTextField:"name",attrTextField:{"ng-value":"code"},attrTextId:function(t){e.iInputGoodsTypeValue=t},attrTextModel:function(t){e.iInputGoodsType=t,e.$apply()}}),u.setData(e.goodsData),u.open(),$("#select-goods").val(e.iInputGoodsType))},e.getWeightUnit=function(){l||(e.weightUnitList=t.getWeightUnitList(),l=selectFactory({data:e.weightUnitList,defaultText:Lang.getValByKey("common","common_select_tips"),id:"select-weight-unit",showTextField:"name",attrTextField:{"ng-value":"code"},attrTextId:function(t){e.iInputWeightUnitValue=t},attrTextModel:function(t){e.iInputWeightUnit=t,e.$apply()}}),l.setData(e.weightUnitList),l.open(),$("#select-weight-unit").val(e.iInputWeightUnit))},e.getCountry=function(a){e.countryData=t.getCountry(),angular.forEach(e.countryData.data,function(e,t){e.name+="("+e.figureCode+")"}),id="start"==a?"select-start-address":"select-end-address",c=selectFactory({data:e.countryData,isSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:id,showTextField:"name",pagination:!0,onSearchValueChange:function(a,r,i){e.countryData=t.getCountry({urlParams:{pageIndex:i,q:r}}),angular.forEach(e.countryData.data,function(e,t){e.name+="("+e.figureCode+")"}),c.setData(e.countryData)},closeLocalSearch:!0,attrTextField:{"ng-value":"code"},attrTextId:function(t){"start"==a?(e.iInputStartValue=t,e.iOtherStart=e.iOtherStartValue="",e.iProvinceStart=e.iProvinceStartValue="",e.iCityStart=e.iCityStartValue="",e.iAreaStart=e.iAreaStartValue="",e.iStreetStart=e.iStreetStartValue=""):(e.iInputEndValue=t,e.iOtherEnd=e.iOtherEndValue="",e.iProvinceEnd=e.iProvinceEndValue="",e.iCityEnd=e.iCityEndValue="",e.iAreaEnd=e.iAreaEndValue="",e.iStreetEnd=e.iStreetEndValue=""),e.$apply()},attrTextModel:function(t){"start"==a?e.iInputStart=t:e.iInputEnd=t,e.$apply()}}),c.setData(e.countryData),c.open(),"start"==a?$("#select-start-address").val(e.iInputStart):$("#select-end-address").val(e.iInputEnd)},e.getAddressData=function(e){return t.getAddressSearch(e)},e.getOther=function(t){if("start"==t)var a="select-start-other";else var a="select-end-other";Select.sharePool[a]=null,m=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:a,pagination:!0,showTextField:"name",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(a,r,i){var n="start"==t?e.iInputStartValue:e.iInputEndValue,o={urlParams:{countryCode:n,parentId:n,q:r||"",pageIndex:i||1,pageSize:10}};e.otherData=e.getAddressData(o),a.setData(e.otherData)},attrTextId:function(a){"start"==t?e.iOtherStartValue=a:e.iOtherEndValue=a,e.$apply()},attrTextModel:function(a){"start"==t?e.iOtherStart=a:e.iOtherEnd=a,e.$apply()}}),m.open()},e.getProvince=function(t){if("start"==t)var a="select-start-province";else var a="select-end-province";Select.sharePool[a]=null,s=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:a,defaultCount:100,showTextField:"name",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(a,r){var i="start"==t?e.iInputStartValue:e.iInputEndValue,n={urlParams:{countryCode:i,parentId:i,q:r||"",pageIndex:1,pageSize:100}};e.provinceData=e.getAddressData(n),console.log(e.provinceData),a.setData(e.provinceData)},attrTextId:function(a){"start"==t?(e.iProvinceStartValue=a,e.iCityStart=e.iCityStartValue="",e.iAreaStart=e.iAreaStartValue="",e.iStreetStart=e.iStreetStartValue=""):(e.iProvinceEndValue=a,e.iCityEnd=e.iCityEndValue="",e.iAreaEnd=e.iAreaEndValue="",e.iStreetEnd=e.iStreetEndValue=""),e.$apply()},attrTextModel:function(a){"start"==t?e.iProvinceStart=a:e.iProvinceEnd=a,e.getCity(t),e.$apply()}}),s.open()},e.getCity=function(t){if("start"==t){if(!e.iProvinceStartValue)return;var a="select-start-city"}else{if(!e.iProvinceEndValue)return;var a="select-end-city"}Select.sharePool[a]=null,d=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:a,defaultCount:100,showTextField:"name",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(a,r){if("start"==t)var i=e.iInputStartValue,n=e.iProvinceStartValue;else var i=e.iInputEndValue,n=e.iProvinceEndValue;var o={urlParams:{countryCode:i,parentId:n,q:r,pageIndex:1,pageSize:1e3}};e.cityData=e.getAddressData(o),a.setData(e.cityData)},attrTextId:function(a){"start"==t?(e.iCityStartValue=a,e.iAreaStart=e.iAreaStartValue="",e.iStreetStart=e.iStreetStartValue=""):(e.iCityEndValue=a,e.iAreaEnd=e.iAreaEndValue="",e.iStreetEnd=e.iStreetEndValue=""),e.getArea(t),e.$apply()},attrTextModel:function(a){"start"==t?e.iCityStart=a:e.iCityEnd=a,e.$apply()}}),d.open()},e.getArea=function(t){if("start"==t){if(!e.iCityStartValue)return;var a="select-start-area"}else{if(!e.iCityEndValue)return;var a="select-end-area"}Select.sharePool[a]=null,p=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultCount:100,defaultText:Lang.getValByKey("common","common_select_tips"),id:a,showTextField:"name",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(a,r){if("start"==t)var i=e.iInputStartValue,n=e.iCityStartValue;else var i=e.iInputEndValue,n=e.iCityEndValue;var o={urlParams:{countryCode:i,parentId:n,q:r,pageIndex:1,pageSize:100}};e.areaData=e.getAddressData(o),a.setData(e.areaData)},attrTextId:function(a){"start"==t?(e.iAreaStartValue=a,e.iStreetStart=e.iStreetStartValue=""):(e.iAreaEndValue=a,e.iStreetEnd=e.iStreetEndValue=""),e.$apply()},attrTextModel:function(a){"start"==t?e.iAreaStart=a:e.iAreaEnd=a,e.getStreet(t),e.$apply()}}),p.open()},e.getStreet=function(t){if("start"==t){if(!e.iAreaStartValue)return;var a="select-start-street"}else{if(!e.iAreaEndValue)return;var a="select-end-street"}Select.sharePool[a]=null,g=selectFactory({data:[],isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:a,defaultCount:100,showTextField:"name",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(a,r){if("start"==t)var i=e.iInputStartValue,n=e.iAreaStartValue;else var i=e.iInputEndValue,n=e.iAreaEndValue;var o={urlParams:{countryCode:i,parentId:n,q:r,pageIndex:1,pageSize:100}};e.streetData=e.getAddressData(o),a.setData(e.streetData)},attrTextId:function(a){"start"==t?e.iStreetStartValue=a:e.iStreetEndValue=a,e.$apply()},attrTextModel:function(a){"start"==t?e.iStreetStart=a:e.iStreetEnd=a,e.$apply()}}),g.open()},e.checkGroupType=function(t){e.selLength=0,angular.forEach(e.groupType,function(a,r){t==a.id&&(e.groupType[r].checked=!e.groupType[r].checked),a.checked&&(++e.selLength,e.topGrade=a.id)}),e.iInputProducts="",e.iInputProductsValue="",1!=e.selLength&&(e.topGrade="")},e.count=function(){e.iInputStartValue&&"CN"!=e.iInputStartValue&&(e.iCityStartValue=e.iOtherStartValue),e.iInputEndValue&&"CN"!=e.iInputEndValue&&(e.iCityEndValue=e.iOtherEndValue);var a={urlParams:{packages:[],calcDate:e.iInputBeginTime,cargoTypeCode:e.iInputGoodsTypeValue,fromCountry:e.iInputStartValue,fromProvince:e.iProvinceStartValue,fromCity:e.iCityStartValue,fromArea:e.iAreaStartValue,fromStreet:e.iStreetStartValue,toCountry:e.iInputEndValue,toProvince:e.iProvinceEndValue,toCity:e.iCityEndValue,toArea:e.iAreaEndValue,toStreet:e.iStreetEndValue}};"service"==e.type?(a.urlParams.serviceUid=e.iInputServicesValue,a.urlParams.settleMentId=e.iAccountValue):(a.urlParams.productUid=e.iInputProductsValue,a.urlParams.customerId=e.iInputClientValue,a.urlParams.groupType=[],angular.forEach(e.groupType,function(e,t){e.checked&&a.urlParams.groupType.push(e.id)})),$("#weight-box .row").each(function(t){var r={},i=$.trim($(this).find(".weight-value").val()),n=$("#volume-box .row").eq(t),o=$.trim(n.find(".volume-length").val()),u=$.trim(n.find(".volume-width").val()),l=$.trim(n.find(".volume-height").val());r={weight:i,unitCode:e.iInputWeightUnitValue,length:o,width:u,height:l},a.urlParams.packages.push(r)}),e.msg="",e.calcMsgs=[],e.result=[],"service"==e.type?t.calcService(a,function(t){e.serviceCache=t,e.msg=t.msg,e.errorCode=t.errorCode,e.calcMsgs=t.data.calcMsgs,e.result=t.data.result,e.serviceCacheReq={packages:[],weightUnit:e.iInputWeightUnitValue,weightUnitName:e.iInputWeightUnit,calcDate:e.iInputBeginTime,cargoTypeCode:e.iInputGoodsTypeValue,cargoTypeName:e.iInputGoodsType,fromCountry:e.iInputStartValue,fromCountryName:e.iInputStart,fromProvince:e.iProvinceStartValue,fromProvinceName:e.iProvinceStart,fromCity:e.iCityStartValue,fromCityName:e.iCityStart,fromArea:e.iAreaStartValue,fromAreaName:e.iAreaStart,fromStreet:e.iStreetStartValue,fromStreetName:e.iStreetStart,toCountry:e.iInputEndValue,toCountryName:e.iInputEnd,toProvince:e.iProvinceEndValue,toProvinceName:e.iProvinceEnd,toCity:e.iCityEndValue,toCityName:e.iCityEnd,toArea:e.iAreaEndValue,toAreaName:e.iAreaEnd,toStreet:e.iStreetEndValue,toStreetName:e.iStreetEnd};for(var r=0,i=a.urlParams.packages.length;r<i;r++){var n={height:a.urlParams.packages[r].height,length:a.urlParams.packages[r].length,unitCode:a.urlParams.packages[r].unitCode,weight:a.urlParams.packages[r].weight,width:a.urlParams.packages[r].width};e.serviceCacheReq.packages.push(n)}}):t.calcProduct(a,function(t){e.productCache=t,e.msg=t.msg,e.errorCode=t.errorCode,e.calcMsgs=t.data.calcMsgs,e.result=t.data.result,e.productCacheReq={packages:[],weightUnit:e.iInputWeightUnitValue,weightUnitName:e.iInputWeightUnit,calcDate:e.iInputBeginTime,cargoTypeCode:e.iInputGoodsTypeValue,cargoTypeName:e.iInputGoodsType,fromCountry:e.iInputStartValue,fromCountryName:e.iInputStart,fromProvince:e.iProvinceStartValue,fromProvinceName:e.iProvinceStart,fromCity:e.iCityStartValue,fromCityName:e.iCityStart,fromArea:e.iAreaStartValue,fromAreaName:e.iAreaStart,fromStreet:e.iStreetStartValue,fromStreetName:e.iStreetStart,toCountry:e.iInputEndValue,toCountryName:e.iInputEnd,toProvince:e.iProvinceEndValue,toProvinceName:e.iProvinceEnd,toCity:e.iCityEndValue,toCityName:e.iCityEnd,toArea:e.iAreaEndValue,toAreaName:e.iAreaEnd,toStreet:e.iStreetEndValue,toStreetName:e.iStreetEnd};for(var r=0,i=a.urlParams.packages.length;r<i;r++){var n={height:a.urlParams.packages[r].height,length:a.urlParams.packages[r].length,unitCode:a.urlParams.packages[r].unitCode,weight:a.urlParams.packages[r].weight,width:a.urlParams.packages[r].width};e.productCacheReq.packages.push(n)}})},e.goods={weight:[{value:"",unitVal:"",unitName:""}],volume:[{length:"",width:"",height:""}]},e.addGoodsAttr=function(){if(!e.iInputWeightUnit)return void $(document).promptBox({isDelay:!0,contentDelay:"请先选择重量单位",type:"errer",manualClose:!0});var t={value:"",unitVal:"",unitName:""};e.goods.weight.push(t),t={length:"",width:"",height:""},e.goods.volume.push(t)},e.resetGoodsAttr=function(){e.goods={weight:[{value:"",unitVal:"",unitName:""}],volume:[{length:"",width:"",height:""}]},Select.sharePool["select-weight-unit"]="",l=null},e.tabChange=function(t){e.type=t;var a=null,r=null;if("service"==t?(a=e.serviceCache||{},r=e.serviceCacheReq||{}):(a=e.productCache||{},r=e.productCacheReq||{}),a.msg||(a={msg:"",errorCode:"",data:{calcMsgs:"",result:""}}),a&&(e.msg=a.msg,e.errorCode=a.errorCode,e.calcMsgs=a.data.calcMsgs,e.result=a.data.result),e.iInputWeightUnitValue=r.weightUnit||"",e.iInputWeightUnit=r.weightUnitName||"",e.iInputBeginTime=r.calcDate||"",e.iInputGoodsTypeValue=r.cargoTypeCode||"",e.iInputGoodsType=r.cargoTypeName||"",e.iInputStartValue=r.fromCountry||"",e.iInputStart=r.fromCountryName||"",e.iProvinceStartValue=r.fromProvince||"",e.iProvinceStart=r.fromProvinceName||"",e.iCityStartValue=r.fromCity||"",e.iCityStart=r.fromCityName||"",e.iAreaStartValue=r.fromArea||"",e.iAreaStart=r.fromAreaName||"",e.iStreetStartValue=r.fromStreet||"",e.iStreetStart=r.fromStreetName||"",e.iInputEndValue=r.toCountry||"",e.iInputEnd=r.toCountryName||"",e.iProvinceEndValue=r.toProvince||"",e.iProvinceEnd=r.toProvinceName||"",e.iCityEndValue=r.toCity||"",e.iCityEnd=r.toCityName||"",e.iAreaEndValue=r.toArea||"",e.iAreaEnd=r.toAreaName||"",e.iStreetEndValue=r.toStreet||"",e.iStreetEnd=r.toStreetName||"",e.goods={weight:[],volume:[]},r.packages&&r.packages.length)for(var i=0,n=r.packages.length;i<n;i++){var o={value:r.packages[i].weight,unitVal:r.packages[i].unitCode,unitName:""};e.goods.weight.push(o),o={length:r.packages[i].length,width:r.packages[i].width,height:r.packages[i].height},e.goods.volume.push(o)}else e.resetGoodsAttr()}}])});
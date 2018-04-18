easySpa.require(["widget/slimscroll","widget/prompt","widget/tab","widget/select","widget/parseUrl","public/common/tableController.js","public/common/pictureController.js","public/common/areaController.js","public/javascripts/fragment/supplier/supplierCtrl.js","public/javascripts/fragment/selectTypes/selectTypesCtrl.js","public/javascripts/fragment/selectTypes/selectTypesService.js"],function(){app.controller("servicesApprovalCtrl",["$scope","servicesApprovalService","servicesApprovalView","tableService","areaService","suppliersService","pictureService","selectTypesService",function(e,t,a,i,o,r,s,n){function l(t){e.index=t,0==t&&(e.tableUnCheckModel.restData.status=2,e.getTypeTable(e.typeId,null,e.tableUnCheckModel)),1==t&&(e.tableCheckDoneModel.restData.status=3,e.onlineStatusValue=3,e.onlineStatusName=Lang.getValByKey("servicesApproval","servicesApproval_state_audit"),e.getTypeTable(e.typeId,null,e.tableCheckDoneModel)),e.$apply()}function c(e){angular.forEach(e.tableBody,function(t,a){if(t.areas&&t.areas.length){e.tableBody[a].serviceArea="";for(var i=0,o=t.areas.length;i<o;i++)e.tableBody[a].serviceArea?e.tableBody[a].serviceArea+="，"+y(t.areas[i].name,"/"):e.tableBody[a].serviceArea+=y(t.areas[i].name,"/")}})}function p(e,t){for(var t=t.data,a=0;a<t.length;a++)if(t[a].name==e)return t[a]}function d(){e.selectTypesModel.selectedGoods=[],t.getGoodTypes(function(t){if(0==t.errorCode){var a=e.listGoodsTypeIds;for(var i in t.data){t.data[i].id=t.data[i].code,t.data[i].checked=!1;for(var o in a)t.data[i].id==a[o]&&(t.data[i].checked=!0)}var r=[];for(var i in t.data)t.data[i].name&&r.push(t.data[i]);e.selectTypesModel.listGoodsTypes=r,e.selectTypesModel=n.init(e.selectTypesModel)}})}function m(){var t=$("#getUnGoodTypes input.active"),a=[],i="";t.each(function(e){a.push(t.eq(e).data("id")),e==t.length-1?i+=t.eq(e).parent().data("name"):i+=t.eq(e).parent().data("name")+"，"}),e.goodsTypeIdsInfo=i,e.listGoodsTypeIds=a,$(document).promptBox("closeFormPrompt"),e.$apply()}function u(e){var t=e.next;if(null!=t)return t.clearData(),t.id=null,u(t)}function p(e,t){for(var t=t.data,a=0;a<t.length;a++)if(t[a].name==e)return t[a]}function v(e){for(var t=e?e.length:0,a={},i=[],o=0;o<t;o++)a={picUrlID:e[o],delshow:!1},i.push(a);return i}function y(e,t){if(!e||!t)return"";var a=e.lastIndexOf(t);return-1!=a&&(e=e.slice(a+1)),e}function g(t){1===t&&(e.getWeightRule(e.currentServicesId),e.initSelect()),2===t&&f(),e.serviceSpanInfo(e.serviceId),e.visible=!0,e.isVisible=!1;try{e.$apply()}catch(e){console.log("$apply() is error")}}function f(){e.serviceRangeModel={tableHeader:["序号","类型范围","编码","创建者","创建时间","分区详情","备注"],tableBody:[],restURL:"logistics.getServiceRange",restData:{id:e.currentServicesId},selectNumber:0,selectFlag:!1};var t={seatParams:e.serviceRangeModel.restData};i.getTable(e.serviceRangeModel.restURL,t,function(a){if(0==a.errorCode){a.pagination={currentPage:1,currentResult:0,pageSize:10,totalPage:0,totalResult:0},e.serviceRangeModel=i.table(e.serviceRangeModel,t,a);var o=e.serviceRangeModel&&e.serviceRangeModel.tableBody;if(e.startDisabled=!1,e.endDisabled=!1,e.disabledAdd=!1,o){for(var r=0,s=o.length;r<s;r++)"s"===o[r].type?e.startDisabled=!0:"e"===o[r].type&&(e.endDisabled=!0);e.startDisabled&&e.endDisabled&&(e.disabledAdd=!0)}$("#serviceRangeTable").removeAttr("style")}})}function D(e){if(e)for(var t=0;t<e.length;t++)e[t].name=e[t].name+"("+e[t].code+")"}e.tabIndex=$("#m-tab-index").tab({callback:l}),e.intertype="logistics",e.onlineStatusName=Lang.getValByKey("servicesApproval","servicesApproval_online_all"),e.onlineStatusValue=1,e.mainBlock="list",e.onlineStatusData={data:[{id:"-2",name:Lang.getValByKey("servicesApproval","servicesApproval_online_all")},{id:"3",name:Lang.getValByKey("servicesApproval","servicesApproval_state_audit")},{id:"4",name:Lang.getValByKey("servicesApproval","servicesApproval_online_enable")},{id:"5",name:Lang.getValByKey("servicesApproval","servicesApproval_online_stop")}]},e.tableUnCheckModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("servicesApproval","servicesApproval_table_name"),Lang.getValByKey("common","common_code_code"),Lang.getValByKey("servicesApproval","servicesApproval_table_content"),Lang.getValByKey("servicesApproval","servicesApproval_table_type"),Lang.getValByKey("servicesApproval","servicesApproval_online_state")],tableBody:[],restURL:"logistics.getServicesList",restData:{q:"",status:2,orderby:"submittime",pageIndex:1,pageSize:10},selectNumber:0,selectFlag:!1},e.tableCheckDoneModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("servicesApproval","servicesApproval_table_name"),Lang.getValByKey("common","common_code_code"),Lang.getValByKey("servicesApproval","servicesApproval_table_content"),Lang.getValByKey("servicesApproval","servicesApproval_table_type"),Lang.getValByKey("servicesApproval","servicesApproval_online_state")],tableBody:[],restURL:"logistics.getServicesList",restData:{q:"",status:-2,orderby:"submittime",pageIndex:1,pageSize:10,asc:!1},selectNumber:0,selectFlag:!1},e.index=0,e.$on("$viewContentLoaded",function(){t.getServiceTypes(function(t){0==t.errorCode&&(e.types=t.data,e.typeId=-1,e.getTypeTable(e.typeId,null,e.tableUnCheckModel))})}),e.getTypeTable=function(t,a,o){o||(o=0==e.index?e.tableUnCheckModel:e.tableCheckDoneModel),a&&(e.seniorChecked=!1,e.showSenior=!1,e.tableUnCheckModel.restData.q="",e.tableUnCheckModel.restData.pageIndex=1,e.tableCheckDoneModel.restData.q="",e.tableCheckDoneModel.restData.pageIndex=1,e.qUnCheck="",e.qCheckDone="",e.onlineStatusValue=3,e.onlineStatusName=Lang.getValByKey("servicesApproval","servicesApproval_state_audit"),e.tableCheckDoneModel.restData.status=3),e.typeId=t;var r={seatParams:{serviceTypeId:e.typeId},urlParams:o.restData};i.getTable(o.restURL,r,function(e){0==e.errorCode&&(o=i.table(o,r,e),c(o))})},e.$watch("tableUnCheckModel",function(t,a){t!==a&&c(e.tableUnCheckModel)},!0),e.$watch("tableCheckDoneModel",function(t,a){t!==a&&c(e.tableCheckDoneModel)},!0),e.initOnLineSelectList=function(){var t=e.onlineStatusData;selectFactory({data:t,id:"onlineSelect",defaultText:"",attrTextModel:function(a){var i;i=a?p(a,t):{},e.onlineStatusName!==a&&(e.onlineStatusName=a,e.onlineStatusValue=i.id,e.tableCheckDoneModel.restData.status=e.onlineStatusValue,e.tableCheckDoneModel.restData.pageIndex=1,e.getTypeTable(e.typeId,null,e.tableCheckDoneModel),e.$apply())}})},e.getUnCheckServiceLists=function(){e.tableUnCheckModel.restData.pageIndex=1,e.qUnCheck=e.tableUnCheckModel.restData.q,e.getTypeTable(e.typeId,null,e.tableUnCheckModel)},e.getCheckDoneServiceLists=function(){e.tableCheckDoneModel.restData.pageIndex=1,e.qCheckDone=e.tableCheckDoneModel.restData.q,e.getTypeTable(e.typeId,null,e.tableCheckDoneModel)},e.editUnCheckServiceDetail=function(t){e.serviceTitle=Lang.getValByKey("servicesApproval","servicesApproval_title_detail"),e.isAudit=!0,e.validateCodeError=!1,e.mainBlock="detail",e.detailTabIndex.selected(0),e.visible=!0,e.isVisible=!1,e.showAuthor=!0,e.serviceId=t,e.serviceSpanInfo(t),e.serviceForm.$setPristine(),e.serviceForm.$setUntouched(),e.auditSubmitStatus=!1,e.auditStatus=e.auditRemark="",e.auditForm.$setPristine(),e.auditForm.$setUntouched(),setTimeout(function(){$(".from-box").scrollTop(0)},10)},e.serviceSpanInfo=function(a){var i={seatParams:{uid:a}};t.getServiceById(i,function(t){if(console.log(t.data.status),0==t.errorCode){switch(3===t.data.status?("已停用"===t.data.statusName?e.showEdit=!0:e.showEdit=!1,"boolean"==typeof t.data.isOnline?e.isOffline=!t.data.isOnline:e.isOffline=!1):e.isOffline=!1,e.currentServicesId=t.data.id,e.currentServicesStatus=t.data.status,e.serviceData=t.data,e.name=e.serviceData.name,e.code=e.serviceData.code,e.serviceTypeName=e.serviceData.serviceTypeName,e.serviceTypeIds=e.serviceData.serviceTypeCodes,e.subServiceTypeCode=e.serviceData.subServiceTypeCode,e.serviceData.subServiceTypeCode){case"MAINLINESHIP":e.subServiceTypeName="海运";break;case"MAINLINEAIR":e.subServiceTypeName="空运";break;case"MAINLINEOTHER":e.subServiceTypeName="其他"}e.lineName=e.serviceData.lineName?e.serviceData.lineName+"("+e.serviceData.lineCode+")":"",e.lineId=e.serviceData.lineId,e.className=e.serviceData.className,e.classIds=e.serviceData.classId,e.serviceContent=e.serviceData.serviceContent,e.supplierName=e.serviceData.supplierName,e.supplierId=e.serviceData.supplierId,e.description=e.serviceData.description,e.userName=e.serviceData.userName,e.createTime=e.serviceData.createTime,e.estimatedTime=e.serviceData.estimatedTime,e.estimatedUnitValue=e.serviceData.estimatedUnitName,e.weightLimitMin=e.serviceData.weightLimitMin,e.weightLimitMax=e.serviceData.weightLimitMax,e.weightLimitUnitCode=e.serviceData.weightLimitUnitCode,e.getFlightsData(e.lineId,!1),e.choosedData=[];var a={};angular.forEach(e.serviceData.areas,function(t,i){a={figureCode:t.figureCode,name:t.name.split("/")[t.name.split("/").length-1]},e.choosedData.push(a)});var i="";angular.forEach(e.choosedData,function(e,t){i+="，"+e.name.split("/")[e.name.split("/").length-1]}),i&&(i=i.slice(1)),e.regionZone=i,e.listGoodsTypeIds=e.serviceData.cargoTypes,e.goodsTypeIdsInfo=e.serviceData.cargoTypeName}})},e.initLineType=function(){var t={data:[{id:1,code:"MAINLINESHIP",name:"海运"},{id:2,code:"MAINLINEAIR",name:"空运"},{id:3,code:"MAINLINEOTHER",name:"其他"}]};selectFactory({data:t,defaultText:"",id:"initLineType",attrTextField:{"ng-value":"code"},attrTextId:function(t){e.subServiceTypeCode=t,e.$apply()},attrTextModel:function(t){e.subServiceTypeName=t,e.$apply()}}).open()},e.initLineIds=function(){selectFactory({data:[],id:"lineId",defaultText:"请选择",showTextField:"nameCode",isSearch:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入航线名称或编码",pagination:!0,onSearchValueChange:function(a,i,o){t.getLines({subServiceTypeCode:e.subServiceTypeCode,params:{q:i,pageIndex:o||1}},function(e){e.data.forEach(function(e){e.nameCode=e.name+"("+e.code+")"}),a.setData(e)})},attrTextField:{"ng-value":"id"},attrTextModel:function(t){e.lineName=t,e.$apply()},attrTextId:function(t){if(!t)return e.flightTable.tableBody=[],e.lineId="0",void e.$apply();e.lineId=t,e.getFlightsData(t,!0),e.$apply()}}).open()},e.flightTable={tableHeader:[Lang.getValByKey("common","common_thead_number"),"航班号","承运公司","出发时间","到达时间"],tableBody:[],selectNumber:0,selectFlag:!1},e.getFlightsData=function(t,a){if(!t||0===t)return void(e.flightTable.tableBody=[]);var o={urlParams:{lineId:t,pageSize:1e3}},r="MAINLINESHIP"===e.subServiceTypeCode?"logistics.getShipFlights":"logistics.getAirFlights";i.getTable(r,o,function(t){if(0===t.errorCode){var r=angular.copy(t),s=[];if(!a){if(e.serviceData.classId&&e.serviceData.classId.length)for(var n=0,l=e.serviceData.classId.length;n<l;n+=1)for(var c=0,p=r.data.length;c<p;c+=1)e.serviceData.classId[n]===r.data[c].id&&s.push(r.data[c]);r.data=s}if(e.flightTable=i.table(e.flightTable,o,r),a&&e.serviceData.classId&&e.serviceData.classId.length)for(var n=0,l=e.serviceData.classId.length;n<l;n+=1)for(var c=0,p=e.flightTable.tableBody.length;c<p;c+=1)e.serviceData.classId[n]===e.flightTable.tableBody[c].id&&(e.flightTable.tableBody[c].checkbox=!0)}})},e.submitFlights=function(){var a=i.getSelectTable(e.flightTable.tableBody);if(e.lineName&&!a.length)return void $(document).promptBox({isDelay:!0,contentDelay:"请至少选择一个航班！",type:"errer",manualClose:!0});e.flightTable.tableBody=JSON.parse(JSON.stringify(a)),e.classIds=a.map(function(e){return e.id});var o={seatParams:{uid:e.serviceId},urlParams:{lineId:e.lineId,classIds:e.classIds}};t.submitFlights(o,function(t){0===t.errorCode?(e.setGrey=!1,e.isVisibleDraft=!0,e.isVisible=!1,e.isVisibleEdit=!0,e.visible=!0,e.serviceId=t.data,e.serviceSpanInfo(t.data),e.mainlineForm.$setPristine(),e.mainlineForm.$setUntouched(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})},e.goBack=function(){e.mainBlock="list",e.getTypeTable(e.typeId)},e.editService=function(){e.serviceForm.$setPristine(),e.serviceForm.$setUntouched(),e.validateCodeError=!1,e.visible=!1,e.isVisible=!0;var a={seatParams:{uid:e.serviceId}};t.getServiceById(a,function(t){if(0==t.errorCode){e.serviceData=t.data,e.nameInfo=e.serviceData.name,e.codeInfo=e.serviceData.code,e.serviceTypeName=e.serviceData.serviceTypeName,e.serviceTypeIds=e.serviceData.serviceTypeCodes,e.serviceContentInfo=$.trim(e.serviceData.serviceContent),e.supplierName=e.serviceData.supplierName,e.supplierId=e.serviceData.supplierId,e.descriptionInfo=$.trim(e.serviceData.description),e.getFlightsData(e.lineId,!0),e.choosedData=[];var a={};angular.forEach(e.serviceData.areas,function(t,i){a={figureCode:t.figureCode,name:t.name.split("/")[t.name.split("/").length-1]},e.choosedData.push(a)});var i="";angular.forEach(e.choosedData,function(e,t){i+="，"+e.name.split("/")[e.name.split("/").length-1]}),i&&(i=i.slice(1)),e.regionZone=i,e.listGoodsTypeIds=e.serviceData.cargoTypes,e.goodsTypeIdsInfo=e.serviceData.cargoTypeName}})},e.cancelService=function(){e.visible=!0,e.isVisible=!1,e.serviceSpanInfo(e.serviceId)},e.selectRegion=function(){e.initCtrl(),$(document).promptBox({title:Lang.getValByKey("servicesApproval","servicesApproval_prompt_title_area"),isHidden:!0,boxWidth:!0,isNest:!0,loadData:function(){e.loadRegionData()},content:{nest:$("#serviceZone")},operation:[{type:"submit",description:Lang.getValByKey("common","common_prompt_confirm"),operationEvent:function(){$(document).promptBox("closeFormPrompt");var t="";angular.forEach(e.areaModel.selectedData,function(e,a){t+="，"+e.name.split("/")[e.name.split("/").length-1]}),t&&(t=t.slice(1)),e.regionZone=t,e.choosedData=[];var a={};angular.forEach(e.areaModel.selectedData,function(t,i){a={figureCode:t.interId,name:t.name.split("/")[t.name.split("/").length-1]},e.choosedData.push(a)}),e.$apply()}}]})};var b={unSelectedData:[],selectedData:[],candidateFlag:!1,selectedFlag:!1};e.loadRegionData=function(){b.unSelectedData=t.getCountry().data,b.selectedData=e.choosedData,e.tab.toggle(0),e.areaModel=o.initArea(b)},e.selectGoodTypes=function(){$(document).promptBox({isHidden:!0,title:Lang.getValByKey("servicesApproval","servicesApproval_placeholder_goods_type"),isNest:!0,loadData:function(){d()},content:{nest:$("#getUnGoodTypes")},operation:[{type:"submit",description:Lang.getValByKey("common","common_prompt_confirm"),operationEvent:function(){m()}}]})},e.selectTypesModel={selectedGoods:[],listGoodsTypes:e.listGoodsTypes},e.initSelectList=function(){var a,i,o={urlParams:{q:e.countryName},isAsync:!0};a=t.retrievalSupplier(o);var r=[],s=[],n=[],l=a.data;for(var c in l)s[c]={},s[c].id=l[c].id,s[c].name=l[c].name+"，"+l[c].code,r.push(s[c]);n.data=r,i=selectFactory({data:n,id:"supplier",isSearch:!0,isUsePinyin:!0,attrTextModel:function(t,a){var o;o=t?p(t,a):{},e.supplierId=o.id,o.name?e.supplierName=o.name.split("，")[0]:e.supplierName="",$("#supplier").val(e.supplierName),e.$apply(),u(i)}})},e.selectServiceTypes=function(){var a,i;a=t.getServicesTypeList(),a.data.splice(0,1),i=selectFactory({data:a,id:"serviceType",isUsePinyin:!0,attrTextModel:function(t,a){var o;o=t?p(t,a):{},e.serviceTypeIds=[o.code],e.serviceTypeName=o.name,e.subServiceTypeCode="MAINLINESHIP",e.subServiceTypeName="海运",e.$apply(),u(i)}})},e.removeSpace=function(){if($.trim(e.serviceContentInfo).length)return!0;e.serviceContentInfo=$.trim(e.serviceContentInfo)},e.submitService=function(){e.nameInfo||e.serviceForm.nameInfo.$setDirty(),e.codeInfo||e.serviceForm.codeInfo.$setDirty(),e.serviceTypeName||e.serviceForm.serviceTypeName.$setDirty(),-1===e.serviceTypeIds.indexOf("ST004")||e.subServiceTypeName||e.serviceForm.subServiceTypeName.$setDirty(),e.estimatedTime&&!e.estimatedUnitValue&&e.serviceForm.estimatedTime.$setDirty(),e.serviceContentInfo||e.serviceForm.serviceContentInfo.$setDirty(),e.goodsTypeIdsInfo||e.serviceForm.goodsTypeIdsInfo.$setDirty(),e.goodsTypeIdsInfo||e.serviceForm.goodsTypeIdsInfo.$setDirty(),e.supplierName||e.serviceForm.supplierName.$setDirty();var a={seatParams:{uid:e.serviceId},urlParams:{name:e.nameInfo,code:e.codeInfo,serviceTypeCodes:e.serviceTypeIds,subServiceTypeCode:e.subServiceTypeCode,serviceContent:$.trim(e.serviceContentInfo),areas:[],cargoTypes:e.listGoodsTypeIds,supplierId:e.supplierId,estimatedTime:e.estimatedTime,estimatedUnit:e.estimatedUnit,weightLimitMin:e.weightLimitMin,weightLimitMax:e.weightLimitMax,weightLimitUnitCode:e.weightLimitUnitCode,description:$.trim(e.descriptionInfo)}},i={};return angular.forEach(e.choosedData,function(e,t){i={figureCode:e.figureCode,name:e.name},a.urlParams.areas.push(i)}),1!=e.validateCodeError&&(!!e.serviceForm.$valid&&void t.editServicesApproval(a,function(t){0==t.errorCode?(e.isVisibleDraft=!0,e.isVisible=!1,e.visible=!0,e.serviceId=t.data,e.serviceSpanInfo(t.data),e.serviceForm.$setPristine(),e.serviceForm.$setUntouched(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}))},e.supplierModel={supplierData:[]},e.pictureModel={edit:!0,uploadShow:!1,picture:[],accept:"image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf"},e.getUnCheckSupplier=function(a){e.tabs.selected(0),e.mainBlock="suppler";var i={seatParams:{sid:a,intertype:e.intertype}};t.getSupplierById(i,function(t){if(0==t.errorCode){e.supplierModel.supplierData=t.data;var a="";angular.forEach(e.supplierModel.supplierData.serviceTypes,function(t,i){i==e.supplierModel.supplierData.serviceTypes.length-1?a+=t.supplierTypeName:a+=t.supplierTypeName+","}),e.supplierModel.supplierData.serviceTypes=a,$("#stars").rating("update",parseInt(e.supplierModel.supplierData.rank)),$("#stars").rating("refresh",{min:0,max:5,step:1,size:"xs",animate:!0,displayOnly:!0,showClear:!1,showCaption:!1}),e.pictureModel.picture=v(e.supplierModel.supplierData.files),e.pictureModel=s.init(e.pictureModel),e.supplierModel=r.initSupplier(e.supplierModel)}})},e.goSupplerBack=function(){e.mainBlock="detail"},e.submitCheckedService=function(a){var i=[];for(var o in a)i.push(a[o].uid);var r={urlParams:i};t.examineServices(r,function(t){0==t.errorCode?($(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.goCheckService=function(){$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("servicesApproval","servicesApproval_prompt_check_enable")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){var a={urlParams:[e.serviceId]};t.examineServices(a,function(t){0==t.errorCode?(e.mainBlock="list",$(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]})},e.submitCheckToDraft=function(a){var i=[];for(var o in a)i.push(a[o].uid);var r={urlParams:i};t.toDraftServices(r,function(t){0==t.errorCode?($(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.backDraft=function(){$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("servicesApproval","servicesApproval_prompt_draft_tip")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){var a={urlParams:[e.serviceId]};t.toDraftServices(a,function(t){0==t.errorCode?(e.mainBlock="list",$(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]})},e.submitCheckedDoneService=function(a){var i=[];for(var o in a)i.push(a[o].uid);var r={urlParams:i};t.enableServices(r,function(t){0==t.errorCode?($(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.toEnableSingleServices=function(){$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("servicesApproval","servicesApproval_prompt_check_tip")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){var a={urlParams:[e.serviceId]};t.enableServices(a,function(t){0==t.errorCode?(e.mainBlock="list",$(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]})},e.submitUnCheckedDoneService=function(a){var i=[];for(var o in a)i.push(a[o].uid);var r={urlParams:i};t.unEnableServices(r,function(t){0==t.errorCode?($(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.editUnCheckedDetail=function(t){e.serviceTitle=Lang.getValByKey("servicesApproval","servicesApproval_title_detail"),e.isAudit=!1,e.validateCodeError=!1,e.mainBlock="detail",e.detailTabIndex.selected(0),e.visible=!0,e.isVisible=!1,e.serviceId=t,e.serviceSpanInfo(t),e.serviceData.isOnline?(e.enableName="停用",e.enableValue=!1):(e.enableName="启用",e.enableValue=!0),e.serviceForm.$setPristine(),e.serviceForm.$setUntouched(),setTimeout(function(){$(".from-box").scrollTop(0)},10)},e.validateCode=function(){if(e.codeInfo){var a;a=0==e.isVisibleDraft?"":e.serviceId;var i={urlParams:{code:e.codeInfo,uid:a}};t.validateServiceCode(i,function(t){0==t.errorCode?e.validateCodeError=!1:e.validateCodeError=!0})}},e.removeValidateCode=function(){e.validateCodeError=!1},e.submitAudit=function(){if(e.auditSubmitStatus=!0,e.auditRemark||e.auditForm.auditRemark.$setDirty(),e.auditForm.$valid){var a={urlParams:{msg:e.auditRemark},seatParams:{uid:e.serviceId}};1==e.auditStatus?t.draftService(a,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),setTimeout(function(){e.mainBlock="list",e.getTypeTable(e.typeId),e.$apply()},1500)):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}):2==e.auditStatus&&t.auditService(a,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),setTimeout(function(){e.mainBlock="list",e.getTypeTable(e.typeId),e.$apply()},1500)):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}},e.enabled=function(a){1==a?$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("servicesApproval","servicesApproval_prompt_check_tip")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){var a={urlParams:[e.serviceId]};t.enableServices(a,function(t){0==t.errorCode?(e.enableName=Lang.getValByKey("servicesApproval","servicesApproval_btn_stop"),e.enableValue=!1,e.$apply(),$(document).promptBox("closePrompt"),setTimeout(function(){e.mainBlock="list",e.getTypeTable(e.typeId),e.$apply()},1500),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]}):$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("servicesApproval","servicesApproval_prompt_check_stopNormal")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){var a={urlParams:[e.serviceId],seatParams:{isconfirmed:!1}};t.unEnableServices(a,function(a){0==a.errorCode?(e.enableName=Lang.getValByKey("servicesApproval","servicesApproval_btn_enable"),e.enableValue=!0,e.$apply(),$(document).promptBox("closePrompt"),setTimeout(function(){e.mainBlock="list",e.getTypeTable(e.typeId),e.$apply()},1500),$(document).promptBox({isDelay:!0,contentDelay:a.msg,type:"success"})):206006==a.errorCode?$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:a.msg},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){$(document).promptBox("closePrompt");var a={urlParams:[e.serviceId],seatParams:{isconfirmed:!0}};t.unEnableServices(a,function(t){0==t.errorCode?(e.enableName=Lang.getValByKey("servicesApproval","servicesApproval_btn_enable"),e.enableValue=!0,e.$apply(),$(document).promptBox("closePrompt"),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]}):($(document).promptBox("closePrompt"),$(document).promptBox({isDelay:!0,contentDelay:a.msg,type:"errer",manualClose:!0}))})}}]})},e.showFlowProcess=function(a,i){if(a){e.mainBlock="process",e.processTitle=i;var o={seatParams:{uid:a}};t.getServiceProcess(o,function(t){0===t.errorCode&&(e.streamList=t.data)})}},e.detailTabIndex=$("#detail-tab").tab({callback:g}),e.getWeightRule=function(a){var i={seatParams:{id:a}};t.getServiceWeightRule(i,function(t){0===t.errorCode&&(t.data=t.data?t.data:{},e.isVolume=t.data.isVolume?"true":"false",e.isremarkVolume=t.data.isVolume?"是":"否",e.showVolumeDetail=!!t.data.isVolume,e.volumeFactor=t.data.volumeFactor,e.weightValueTye=t.data.weightValueTye,"max"===t.data.weightValueTye?e.weightValueName="实重和体积重取最大":"min"===t.data.weightValueTye?e.weightValueName="实重和体积重取最小":e.weightValueName="")}),e.isEdit=!1},e.editWeightRule=function(){e.isEdit=!0},e.initSelect=function(){var a=t.getWeightValueMode();selectFactory({data:a,id:"type-select-input",defaultText:Lang.getValByKey("common","common_select_tips"),attrTextModel:function(t,a,i){t?(e.weightValueTye=i.code,e.weightValueName=t,e.ruleForm.valueMode.$setPristine()):(e.weightValueTye="",e.weightValueName=""),e.$apply()}})},e.SetIsConsiderVolume=function(){"false"==e.isVolume?(e.isremarkVolume="否",e.showVolumeDetail=!1,e.volumeFactor="",e.weightValueTye=""):(e.isremarkVolume="是",e.showVolumeDetail=!0,e.volumeFactor="",e.weightValueTye="max",e.weightValueName="实重和体积重取最大"),e.ruleForm.$setPristine()},e.cancelWeight=function(){e.ruleForm.$setPristine(),e.ruleForm.$setUntouched(),e.isEdit=!1,e.getWeightRule(e.currentServicesId)},e.submitWeight=function(){if("true"===e.isVolume&&!e.ruleForm.$valid)return e.volumeFactor||e.ruleForm.volumeFactor.$setDirty(),void(e.valueMode||e.ruleForm.valueMode.$setDirty());var a,i;a="true"===e.isVolume,i=e.volumeFactor?Number(e.volumeFactor):"";var o={seatParams:{uid:e.serviceId},urlParams:{isVolume:a,volumeFactor:i,weightValueTye:e.weightValueTye}};t.serviceWeightRule(o,function(t){0!=t.errorCode?$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}):(e.isVisible=!1,e.isVisibleEdit=!0,e.visible=!0,$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success",time:3e3}),e.getWeightRule(e.currentServicesId))})},e.regionDetail=function(t,a){var i=e.isOffline?"1":"";window.location.href="#/regionDetail?schemaId="+t+"&name="+a+"&q=servicesApproval&uid="+e.serviceId+"&checkStatus="+e.currentServicesStatus+"&status="+i};var h=parseUrl.getParams();h.uid&&(e.serviceTitle=Lang.getValByKey("servicesApproval","servicesApproval_title_detail"),e.isAudit=!0,e.validateCodeError=!1,e.mainBlock="detail",e.visible=!0,e.isVisible=!1,e.showAuthor=!0,e.serviceId=h.uid,e.serviceSpanInfo(h.uid),2!=h.status&&(e.isAudit=!1,e.serviceData.isOnline?(e.enableName="停用",e.enableValue=!1):(e.enableName="启用",e.enableValue=!0)),e.detailTabIndex.toggle(2)),e.add=function(){e.showCode=!1,e.startDisabled?e.rangeRadio="e":e.rangeRadio="s",e.regionForm.$setPristine(),e.regionForm.$setUntouched(),e.regionForm.$setUntouched(),e.isSaveNext=!0,e.proRegionID=0,e.code="",e.description="",$(document).promptBox({title:"添加分区方案",loadTitle:function(){return"添加分区方案"},isMiddle:!0,isNest:!0,content:{nest:$("#regionDetail")},loadData:function(){$('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass("save").removeClass("edit")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveSeriviceRegion(),$(document).promptBox("closeFormPrompt"),e.$apply()}}]})},e.saveSeriviceRegion=function(){if(e.rangeRadio&&(e.proRegionID&&!e.code&&e.regionForm.code.$setDirty(),!$("#code-msg").hasClass("remote-invalid")&&e.regionForm.$valid)){var a={urlParams:{serviceId:e.serviceData.id,type:e.rangeRadio,remark:$.trim(e.description)},seatParams:{}},i="s"===e.rangeRadio?"起点范围":"终点范围";e.proRegionID?(a.seatParams.id=e.proRegionID,t.editServicesRegion(a,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),e.isSaveNext?e.regionDetail(t.data,i):f()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})):t.saveServicesRegion(a,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),e.isSaveNext?e.regionDetail(t.data,i):f()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}},e.del=function(){var a=[],o=i.getSelectTable(e.serviceRangeModel.tableBody);if(!o.length)return $(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("common","common_code_noSelected"),type:"errer",manualClose:!0}),!1;angular.forEach(o,function(e){a.push(e.id)});var r={urlParams:a,serviceId:e.serviceData.id},s={title:Lang.getValByKey("common","common_prompt_title"),type:"warning",content:{tip:"确定删除已选产品范围？"},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){t.deleteServicesRegion(r,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),$(document).promptBox("closePrompt"),f(),e.serviceRangeModel.restData.id=e.serviceData.id,e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]};$(document).promptBox(s)},e.editable=!0,e.edit=function(t){e.startDisabled=!1,e.endDisabled=!1,e.showCode=!0,(e.serviceRangeModel&&e.serviceRangeModel.tableBody).length>=2&&(e.startDisabled=!0,e.endDisabled=!0),e.regionForm.$setPristine(),e.regionForm.$setUntouched(),e.regionForm.$setUntouched(),e.isSaveNext=!0,e.rangeRadio=t.type,e.code=t.code,e.description=t.remark,e.proRegionID=t.id,$(document).promptBox({title:"编辑分区方案",loadTitle:function(){return"编辑分区方案"},isMiddle:!0,isNest:!0,content:{nest:$("#regionDetail")},loadData:function(){$('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass("save").removeClass("edit")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveSeriviceRegion(),$(document).promptBox("closeFormPrompt"),e.$apply()}}]})},e.selectTimeTypes=function(){t.getProductEstimated(null,function(t){e.estimatedList=t.data,selectFactory({data:t,id:"intenTimeType",attrTextField:{"ng-value":"code"},attrTextId:function(t){e.estimatedUnit=t,e.$apply()},attrTextModel:function(t,a){e.estimatedUnitValue=t,e.$apply()}})})},e.getSupplier=function(a){e.tabs.selected(0),e.mainBlock="suppler";var i={seatParams:{sid:a,intertype:"logistics"}};t.getSupplierById(i,function(t){if(0==t.errorCode){e.supplierModel.supplierData=t.data;var a=""
;angular.forEach(e.supplierModel.supplierData.serviceTypes,function(t,i){i==e.supplierModel.supplierData.serviceTypes.length-1?a+=t.supplierTypeName:a+=t.supplierTypeName+","}),e.supplierModel.supplierData.serviceTypes=a,$("#stars").rating("update",parseInt(e.supplierModel.supplierData.rank)),$("#stars").rating("refresh",{min:0,max:5,step:1,size:"xs",animate:!0,displayOnly:!0,showClear:!1,showCaption:!1}),e.pictureModel.picture=v(e.supplierModel.supplierData.files),e.pictureModel=s.init(e.pictureModel),e.supplierModel=r.initSupplier(e.supplierModel)}})},e.getSupplierListData=function(e){e=e||"";var a={urlParams:{q:e},seatParams:{intertype:"logistics"}};return t.retrievalSupplier(a)},e.getSupplierList=function(){e.supplierDatas=t.retrievalSupplier({seatParams:{intertype:"logistics"}}),D(e.supplierDatas.data);var a=selectFactory({data:e.supplierDatas,id:"supplier",isSearch:!0,isUsePinyin:!0,defaultText:Lang.getValByKey("common","common_select_tips"),closeLocalSearch:!0,onSearchValueChange:function(t,a){var i=e.getSupplierListData(a);D(i.data),t.setData(i)},attrTextModel:function(t,i){var o;o=t?p(t,i):{},e.supplierId=o.id,o.name?e.supplierName=o.name.split("，")[0]:e.supplierName="",$("#supplier").val(e.supplierName),e.$apply(),u(a)}});a.setData(e.supplierDatas),a.open(),$("#supplier").val(e.supplierName)}}])});
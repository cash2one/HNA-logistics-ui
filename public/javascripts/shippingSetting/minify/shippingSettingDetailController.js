app.controller("shippingSettingDetailCtrl",["$scope","shippingSettingService","tableService",function(e,i,t){function a(){$(".table-container tbody").slimScroll({height:$(".content-main").height()-250})}function n(){var i={urlParams:e.tableModel.restData,seatParams:{id:e.data.shippingLineId}};t.getTable(e.tableModel.restURL,i,function(n){e.q=e.tableModel.restData.q,$(".table-box").css("zoom","1.0000001"),0===n.errorCode&&(e.tableModel=t.table(e.tableModel,i,n),setTimeout(function(){$(window).on("resize",a),$("#detailTable .table-box").focus(),resizeTable(),e.$apply(),$("#detailTable .table-box").css("zoom","1")},400))})}function o(e,t){e=e||"";var a={q:e?e.trim():"",pageIndex:t||1,pageSize:10};return i.getShippingShort(a)}function s(e){angular.forEach(e,function(e,i){e.name=e.nameEn+"("+e.imo+")"})}function p(e,t){e=e||"";var a={q:e?e.trim():"",pageIndex:t||1,pageSize:10};return i.getShippingLineShort(a)}function r(e){angular.forEach(e,function(e,i){e.name=e.name+"("+e.code+")"})}function l(){setTimeout(function(){for(var i=0;i<e.tableModel.tableBody.ports.length;i++)Calander.init({ele:"#eta-"+i,isClear:!0,showHour:!1,showMinute:!1,showSecond:!1,showTime:!1}),Calander.init({ele:"#etd-"+i,isClear:!0,showHour:!1,showMinute:!1,showSecond:!1,showTime:!1}),Calander.init({ele:"#cargoDeadTime-"+i,isClear:!0,showHour:!1,showMinute:!1,showSecond:!1,showTime:!1}),Calander.init({ele:"#portDeadTime-"+i,isClear:!0,showHour:!1,showMinute:!1,showSecond:!1,showTime:!1})},0)}function d(){["shippingVessel","shippingLineName","shippingName"].forEach(function(i){e.data[i]||e.shippingSettingsDetail[i].$setDirty()});for(var i=$(".errors"),t=0;t<i.length;t++)if(!$(i[t]).hasClass("ng-hide"))return!1;return e.shippingSettingsDetail.$valid}e.data={},e.showShippingSettingDetail=!1;var c=/^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/;e.tableModel={tableHeader:["港口","到港时间","截关时间","截货时间","离港时间"],tableHeaderSize:["20%","20%","20%","20%","20%"],tableBody:[],restURL:"logistics.getShippingLineDetail",restData:{q:"",refCombos:"",isAsc:!1,pageIndex:1,pageSize:100},selectNumber:0,selectFlag:!1},e.checkShippingVesselUnique=function(){if(e.data.shippingVessel){var t={seatParams:{id:e.id?e.id:"",code:e.data.shippingVessel}};i.checkShippingVesselUnique(t,function(i){0!=i.errorCode?($("#shippingVessel").addClass("errors"),e.showShippingVesselUniqueError=!0):($("#shippingVessel").removeClass("errors"),e.showShippingVesselUniqueError=!1)})}},e.clearUniqueError=function(){e.showShippingVesselUniqueError=!1},e.getShippingName=function(){selectFactory({data:[],isSearch:!0,isUsePinyin:!0,pagination:!0,id:"shippingName",showTextField:"name",defaultText:"请选择",searchPlaceHoder:"请输入船名或编码",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(i,t,a){e.shippingName=o(t,a),s(e.shippingName.data),i.setData(e.shippingName),e.$apply()},attrTextId:function(i){e.data.shippingNameId=i||"",e.$apply()},attrTextModel:function(i){e.data.shippingName=i.split("(")[0],e.$apply()}}).open()},e.getShippingLine=function(){selectFactory({data:[],isSearch:!0,isUsePinyin:!0,pagination:!0,id:"shippingLine",showTextField:"name",defaultText:"请选择",searchPlaceHoder:"请输入航线名或编码",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(i,t,a){e.shippingLine=p(t,a),r(e.shippingLine.data),i.setData(e.shippingLine),e.$apply()},attrTextId:function(i){i?(e.data.shippingLineId=i,n(),l()):e.data.shippingLineId="",e.$apply()},attrTextModel:function(i){e.data.shippingLineName=i.split("(")[0],e.$apply()}}).open()},e.TimeFormat=function(e){return e.split(" ")[0]},e.saveDetail=function(){var t=e.tableModel.tableBody.ports,a=t.length-1,n=!1,o="#eta-"+a;if($(o).val()||($(o).css("border-color","#FA787E"),n=!0),$("#etd-0").val()||($("#etd-0").css("border-color","#FA787E"),n=!0),d()&&!n){var s={code:e.data.shippingVessel.trim(),shipId:e.data.shippingNameId,shipName:e.data.shippingName,shippingLineId:e.data.shippingLineId,shippingLineName:e.data.shippingLineName,ports:e.tableModel.tableBody.ports};if(e.id){var p={urlParams:s,seatParams:{id:e.id}};i.modifyShipingLineSettingsDetail(p,function(i){0!=i.errorCode?$(document).promptBox({isDelay:!0,contentDelay:i.msg,type:"errer",manualClose:!0}):($(document).promptBox({isDelay:!0,contentDelay:i.msg,type:"success",time:3e3}),e.closeDetailPage())})}else i.addShipingLineSettingsDetail(s,function(i){0!=i.errorCode?$(document).promptBox({isDelay:!0,contentDelay:i.msg,type:"errer",manualClose:!0}):($(document).promptBox({isDelay:!0,contentDelay:i.msg,type:"success",time:3e3}),e.id=i.data,e.closeDetailPage())})}},e.$on("addshippingSettingDetail",function(i,t){e.isEdit=!0,e.shippingSettingsDetail.$setPristine(),e.tableModel.tableBody.ports={},e.data.shippingVessel="",e.data.shippingNameId="",e.data.shippingName="",e.data.shippingLineId="",e.data.shippingLineName="",e.clearUniqueError(),e.id=void 0}),e.$on("editshippingSettingDetail",function(i,t){e.isEdit=!1,e.shippingSettingsDetail.$setPristine(),e.clearUniqueError(),e.data.shippingVessel=t.code.trim(),e.data.shippingNameId=t.shipId,e.data.shippingName=t.shipEnglishName,e.data.shippingLineId=t.shippingLineId,e.data.shippingLineName=t.shippingLineName,e.tableModel.tableBody.ports=JSON.parse(JSON.stringify(t.ports)),e.id=t.id,l()}),e.edit=function(){e.isEdit=!0,e.dataKeep=JSON.parse(JSON.stringify(e.data)),e.portsKeep=JSON.parse(JSON.stringify(e.tableModel.tableBody.ports))},e.cancelDetail=function(){e.id?(e.isEdit=!e.isEdit,e.tableModel.tableBody.ports=e.portsKeep,e.data.shippingVessel=e.dataKeep.shippingVessel,e.data.shippingNameId=e.dataKeep.shippingNameId,e.data.shippingName=e.dataKeep.shippingName,e.data.shippingLineId=e.dataKeep.shippingLineId,e.data.shippingLineName=e.dataKeep.shippingLineName,e.showShippingVesselUniqueError=!1):(e.closeDetailPage(),e.$apply(),$(document).promptBox("closePrompt"))},e.checkEtaTime=function(i){var t=e.tableModel.tableBody.ports,a=t.length-1,n="#eta-"+a;c.test(e.tableModel.tableBody.ports[i].etaStr)?i==a&&$(n).css("border-color","#BDBDBD"):(e.tableModel.tableBody.ports[i].etaStr="",i==a&&$(n).css("border-color","#FA787E"))},e.checkPortDeadTimeTime=function(i){c.test(e.tableModel.tableBody.ports[i].portDeadTimeStr)||(e.tableModel.tableBody.ports[i].portDeadTimeStr="")},e.checkCargoDeadTimeTime=function(i){c.test(e.tableModel.tableBody.ports[i].cargoDeadTimeStr)||(e.tableModel.tableBody.ports[i].cargoDeadTimeStr="")},e.checkEtdTime=function(i){c.test(e.tableModel.tableBody.ports[i].etdStr)?0==i&&$("#etd-0").css("border-color","#BDBDBD"):(e.tableModel.tableBody.ports[i].etdStr="",0==i&&$("#etd-0").css("border-color","#FA787E"))},e.keyDownFn=function(){event.keyCode&&(e.keyCode=event.keyCode)},e.goback=function(){e.isEdit?$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"warning",content:{tip:Lang.getValByKey("common","common_back_confirm")},cancelDescription:Lang.getValByKey("common","common_back_no"),operation:[{type:"submit",application:"delete",description:Lang.getValByKey("common","common_back_yes"),operationEvent:function(){e.closeDetailPage(),e.$apply(),$(document).promptBox("closePrompt")}}]}):e.closeDetailPage()}}]);
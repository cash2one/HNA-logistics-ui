easySpa.require(["widget/slimscroll","widget/prompt","widget/select","public/common/tableController.js","widget/slides"],function(){app.controller("airLineCtrl",["$scope","airLineService","airLineView","tableService",function(e,r,a,t){function o(e){var r=e.next;if(null!=r)return r.clearData(),r.id=null,o(r)}function i(e,a,t){var o={seatParams:{countryId:t||"",pageIndex:a||1,pageSize:10,q:e?e.trim():""}};return r.getAirPortListByCountryId(o)}function d(e,a){if(a||(a=r.getAirportShort()),e){a=a.data;for(var t=0;t<a.length;t++){var o=a[t].name;if($.trim(o)==$.trim(e)||$.trim(a[t].name)==$.trim(e))return a[t].id}return"无匹配结果"}}function n(e){for(var e=e.data,r=0;r<e.length;r++)e[r].name=e[r].triadCode+"("+e[r].name+")"}e.airlineId={id:0},e.getLanguage=function(){r.getLanguage(function(r){0===r.errorCode&&(e.language=r.data)})},e.getLanguage(),e.tableModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("airLine","airLine_page_name"),Lang.getValByKey("airLine","airLine_page_code"),Lang.getValByKey("airLine","airLine_page_type"),Lang.getValByKey("airLine","airLine_page_startAirport"),Lang.getValByKey("airLine","airLine_page_endAirport"),Lang.getValByKey("common","common_page_remarks")],tableBody:[],restURL:"logistics.getAirLineTable",restData:{q:"",countryCodeFrom:"",triadCodeStart:"",countryCodeTo:"",triadCodeEnd:"",pageIndex:1,pageSize:10,sort:""},selectNumber:0,selectFlag:!1},e.getTable=function(r){e.q=e.tableModel.restData.q,e.tableModel.restData.countryCodeFrom=e.countryStartSearchCode,e.tableModel.restData.triadCodeStart=e.triadCodeStart,e.tableModel.restData.countryCodeTo=e.countryEndSearchCode,e.tableModel.restData.triadCodeEnd=e.triadCodeEnd,r&&(e.tableModel.restData.pageIndex=1);var a={urlParams:e.tableModel.restData};t.getTable(e.tableModel.restURL,a,function(r){if(0===r.errorCode){e.tableModel=t.table(e.tableModel,a,r);var o=$(".airline-table-page").height()-330;setTimeout(function(){$(".table-container tbody").slimscroll({height:o}),$(window).resize(function(){o=$(".airline-table-page").height()-330,$(".table-container tbody").slimscroll({height:o})})},10)}})},e.getTable(),e.clearData=function(){e.q="",e.tableModel.restData.q="",e.tableModel.restData.pageIndex=1,e.tableModel.restData.countryCodeFrom="",e.tableModel.restData.countryCodeTo="",e.tableModel.restData.triadCodeStart="",e.tableModel.restData.triadCodeEnd="",e.countryStartSearchCode="",e.countryStartSearch="",e.airportStartSearch="",e.triadCodeStart="",e.airportEndSearch="",e.triadCodeEnd="",e.countryEndSearchCode="",e.countryEndSearch="",e.getTable()},e.del=function(){var o={},i=[],d=t.getSelectTable(e.tableModel.tableBody);if(!d.length)return a.promptBox({isDelay:!0,contentDelay:Lang.getValByKey("common","common_code_noSelected"),type:"errer",manualClose:!0}),!1;angular.forEach(d,function(e){i.push(e.id)}),o={urlParams:i};var n={title:Lang.getValByKey("common","common_prompt_title"),type:"warning",content:{tip:Lang.getValByKey("airLine","airLine_code_modelDelTips")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){r.del(o,function(r){a.promptBox("closePrompt"),0===r.errorCode?(a.promptBox({isDelay:!0,contentDelay:r.msg,type:"success"}),e.getTable(),e.$apply()):a.promptBox({isDelay:!0,contentDelay:r.msg,type:"errer",manualClose:!0})})}}]};a.promptBox(n)};var l=$("#nest-airLineForm .label-text");a.propmtCostEvent(l),e.add=function(){e.airLineForm.$setPristine(),e.airLineForm.$setUntouched(),e.nestAirLineForm=!0,$("#nest-airLineForm").attr("style","").find(".title").text(Lang.getValByKey("airLine","airLine_page_add")),$(".remote-invalid").removeClass("remote-invalid"),e.airLineName="",e.airLineCode="",e.addAirLineType="INTERNAL",e.addStartAirport="",e.addStopoverAirport="",e.addEndAirport="",e.addStartAirportCode="",e.addStopoverAirportCode="",e.addEndAirportCode="",e.remark="",e.textareaNumber=140,a.loadBarEvent(l),$('button[name="prompt-save"]').addClass("save").removeClass("edit")},e.edit=function(t){e.airlineId.id=t,e.addStartAirport="",e.addStopoverAirport="",e.addEndAirport="",e.addStartAirportCode="",e.addStopoverAirportCode="",e.addEndAirportCode="",$(".remote-invalid").removeClass("remote-invalid"),$("#nest-airLineForm").attr("style","").find(".title").text("空运航线详情"),e.nestAirLineForm=!0,a.loadBarEvent(l),$('button[name="prompt-save"]').addClass("save").removeClass("edit"),r.getDetail({seatParams:{id:t}},function(r){if(r&&0===r.errorCode){var a=r.data.airports||[];3===a.length&&(e.addStartAirport=a[0].airportTriadCode+"("+a[0].airportName+")",e.addStopoverAirport=a[1].airportTriadCode+"("+a[1].airportName+")",e.addEndAirport=a[2].airportTriadCode+"("+a[2].airportName+")",e.addStartAirportCode=a[0].airportId,e.addStopoverAirportCode=a[1].airportId,e.addEndAirportCode=a[2].airportId),2===a.length&&(e.addStartAirport=a[0].airportTriadCode+"("+a[0].airportName+")",e.addEndAirport=a[1].airportTriadCode+"("+a[1].airportName+")",e.addStartAirportCode=a[0].airportId,e.addEndAirportCode=a[1].airportId),e.airLineName=r.data.name,e.airLineCode=r.data.code,e.addAirLineType=r.data.type,e.remark=r.data.description,e.textareaNumber=140-(e.remark?e.remark.length:0)}})},e.save=function(){if(e.airLineName=void 0===e.airLineName?"":e.airLineName,e.airLineCode=void 0===e.airLineCode?"":e.airLineCode,e.airLineName.trim()||e.airLineForm.airLineName.$setDirty(),e.airLineCode.trim()||e.airLineForm.airLineCode.$setDirty(),e.addAirLineType||e.airLineForm.addAirLineType.$setDirty(),e.addStartAirport||e.airLineForm.addStartAirport.$setDirty(),e.addEndAirport||e.airLineForm.addEndAirport.$setDirty(),$("#code-msg").hasClass("remote-invalid")||$("#code-msg-code").hasClass("remote-invalid")||!e.airLineForm.$valid)return scrollToErrorView($(".switch-list")),void a.displayErrorBox(l);var t;t=e.addStopoverAirportCode?[{airportId:e.addStartAirportCode},{airportId:e.addStopoverAirportCode},{airportId:e.addEndAirportCode}]:[{airportId:e.addStartAirportCode},{airportId:e.addEndAirportCode}];var o={urlParams:{name:e.airLineName.trim(),code:e.airLineCode.trim(),type:e.addAirLineType,airports:t,description:e.remark}};e.airlineId.id?(o.seatParams={id:e.airlineId.id},r.saveEdit(o,function(r){r&&0===r.errorCode?(a.promptBox({isDelay:!0,contentDelay:r.msg,type:"success"}),e.nestAirLineForm=!1,e.getTable(),e.airlineId.id&&(e.airlineId.id=0)):a.promptBox({isDelay:!0,contentDelay:r.msg,type:"errer",manualClose:!0})})):r.save(o,function(r){r&&0===r.errorCode?(a.promptBox({isDelay:!0,contentDelay:r.msg,type:"success"}),e.nestAirLineForm=!1,e.getTable()):a.promptBox({isDelay:!0,contentDelay:r.msg,type:"errer",manualClose:!0})})},e.cancel=function(){e.nestAirLineForm=!1,$("#code-msg-code").addClass("ng-hide").removeClass("remote-invalid"),e.airLineForm.airLineCode.errorTips="",e.airlineId.id&&(e.airlineId.id=0)},e.showTextNumber=function(){e.textareaNumber=140-e.remark.length},e.checkAirLineCode=function(){var a={urlParams:{code:e.airLineCode,id:e.airlineId.id}};e.airLineCode&&r.checkAirLineCode(a,function(r){0!=r.errorCode?(e.airLineForm.airLineCode.errorTips="编码已存在",$("#code-msg-code").removeClass("ng-hide").addClass("remote-invalid"),angular.element($(".validate-code").addClass("ng-invalid"))):($("#code-msg-code").addClass("ng-hide").removeClass("remote-invalid"),angular.element($(".validate-code").removeClass("ng-invalid")),e.airLineForm.airLineCode.errorTips="")})};var c,s,p,m,u,g,S;e.initSelectList=function(){var a={urlParams:{q:"",pageIndex:1,pageSize:10},isAsync:!0};e.addStartAirports=e.addEndAirports=e.addStopoverAirports=r.getAirportShort(a),e.countryStartSearchs=e.countryEndSearchs=r.getCountry(a),c=selectFactory({data:e.countryStartSearchs,isSearch:!0,id:"countryStartSearch",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入名称或二字码",onSearchValueChange:function(r,a,t){e.countryStartSearchs=e.getCountryData(a,t),r.setData(e.countryStartSearchs)},attrTextModel:function(r,a,t){e.countryStartSearchCode=t.figureCode,e.countryStartSearch=r,e.airportStartSearch="",e.triadCodeStart="",e.$apply(),o(c)}}),s=selectFactory({data:[],isSearch:!0,id:"airportStartSearch",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入名称或者三字码",onSearchValueChange:function(r,a,t){e.airportStartSearchs=i(a,t,e.countryStartSearchCode),n(e.airportStartSearchs),r.setData(e.airportStartSearchs)},attrTextModel:function(r,a,t){e.airportStartSearch=t.name,e.triadCodeStart=t.triadCode,e.$apply()}}),p=selectFactory({data:e.countryEndSearchs,isSearch:!0,id:"countryEndSearch",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入名称或二字码",onSearchValueChange:function(r,a,t){e.countryEndSearchs=e.getCountryData(a,t),r.setData(e.countryEndSearchs)},attrTextModel:function(r,a,t){e.countryEndSearchCode=t.figureCode,e.countryEndSearch=r,e.airportEndSearch="",e.triadCodeEnd="",e.$apply(),o(p)}}),m=selectFactory({data:[],isSearch:!0,id:"airportEndSearch",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入名称或者三字码",onSearchValueChange:function(r,a,t){e.airportEndSearchs=i(a,t,e.countryEndSearchCode),n(e.airportEndSearchs),r.setData(e.airportEndSearchs)},attrTextModel:function(r,a,t){e.airportEndSearch=t.name,e.triadCodeEnd=t.triadCode,e.$apply()}}),u=selectFactory({data:e.addStartAirports,isSearch:!0,id:"add-startAirport",height:240,pagination:!0,closeLocalSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),searchPlaceHoder:"请输入名称或三字码",onSearchValueChange:function(r,a,t){e.addStartAirports=e.getCurrentAirData(a,t),n(e.addStartAirports),r.setData(e.addStartAirports)},attrTextModel:function(r,a){e.addStartAirportCode=d(r,a),e.addStartAirport=r,e.addStartAirport==e.addEndAirport&&($("#add-startAirport").val(""),e.addStartAirport=""),e.$apply()}}),S=selectFactory({data:e.addStopoverAirports,id:"add-stopoverAirport",isSearch:!0,height:240,pagination:!0,closeLocalSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),searchPlaceHoder:"请输入名称或三字码",onSearchValueChange:function(r,a,t){e.addStopoverAirports=e.getCurrentAirData(a,t),n(e.addStopoverAirports),r.setData(e.addStopoverAirports)},attrTextModel:function(r,a){e.addStopoverAirportCode=d(r,a),e.addStopoverAirport=r,e.$apply()}}),g=selectFactory({data:e.addEndAirports,id:"add-endAirport",isSearch:!0,height:240,pagination:!0,closeLocalSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),searchPlaceHoder:"请输入名称或三字码",onSearchValueChange:function(r,a,t){e.addEndAirports=e.getCurrentAirData(a,t),n(e.addEndAirports),r.setData(e.addEndAirports)},attrTextModel:function(r,a){e.addEndAirportCode=d(r,a),e.addEndAirport=r,e.addEndAirport==e.addStartAirport&&($("#add-endAirport").val(""),e.addEndAirport=""),e.$apply()}})},e.getCountryData=function(e,a){a||(a=1),e=e||"";var t={urlParams:{q:e,pageIndex:a,pageSize:10}},o=r.getCountry(t);return angular.forEach(o.data,function(e,r){e.name+="("+e.code+")"}),o},e.getCityList=function(e,a,t){a||(a=1);var o={urlParams:{countryCode:t,parentId:t,q:e?e.trim():"",pageIndex:a,pageSize:10}};return r.getCity(o)},e.getCurrentAirData=function(e,a){a||(a=1),e=e||"";var t={urlParams:{q:e,pageIndex:a,pageSize:10,includeAllAudit:!0},isAsync:!0};return r.getAirportShort(t)}}])});
easySpa.require(["widget/slimscroll","widget/nestable","widget/prompt","widget/tab","widget/parseUrl","widget/select","widget/starRating","public/javascripts/fragment/supplier/account.js","public/common/tableController.js","public/common/pictureController.js","widget/slides"],function(){app.controller("supplierCtrl",["$scope","$rootScope","$compile","supplierService","supplierView","tableService","pictureService",function(e,t,a,n,i,o,r){function s(){1==e.showSenior?$(".table-container tbody").slimscroll({height:$(".content-main").height()-299}):$(".table-container tbody").slimscroll({height:$(".content-main").height()-250})}function l(t){var a=[];for(var i in t)a.push(t[i].id);var o={urlParams:a,seatParams:{intertype:e.intertype}};n.deleteSupplier(o,function(t){0==t.errorCode?($(document).promptBox("closePrompt"),e.getTypeTable(e.typeId),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()}function p(){$(".table-container tbody").slimscroll({height:$(".content-main").height()-299})}function c(e){var t=e.next;if(null!=t)return t.clearData(),t.id=null,c(t)}function d(e,t){for(var t=t.data,a=0;a<t.length;a++)if(t[a].name==e)return t[a]}function m(){var t={seatParams:{supplierid:e.supplierId,bdid:e.BDUserId,id:e.bdId?e.bdId:""}};n.checkBDUserExist(t,function(t){e.showBDUserExist=!t.data})}function u(e){for(var t=e?e.length:0,a=[],n=0;n<t;n++)e[n].picUrlID="object"==typeof e[n].picUrlID?e[n].picUrlID.id:e[n].picUrlID,a.push(e[n].picUrlID);return a}function y(e){for(var t=e?e.length:0,a={},n=[],i=0;i<t;i++)a={picUrlID:e[i],delshow:!1},n.push(a);return n}e.paramter=window.parseUrl.getParams(),e.intertype="logistics",e.paramter&&"trade"==e.paramter.module&&(e.intertype="trade"),e.tableModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("supplier","supplier_table_name"),Lang.getValByKey("supplier","supplier_table_code"),Lang.getValByKey("supplier","supplier_table_level"),Lang.getValByKey("supplier","supplier_table_service")],tableBody:[],restURL:"logistics.getSupplierList",restData:{q:"",rank:-1,greaterthan:!1,pageIndex:1,pageSize:10},selectNumber:0,selectFlag:!1},e.tableBD=[],e.tableBDModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("supplier","supplier_table_responsibility"),Lang.getValByKey("supplier","supplier_table_full_name"),Lang.getValByKey("supplier","supplier_table_job_code"),Lang.getValByKey("supplier","supplier_table_department"),Lang.getValByKey("supplier","supplier_table_position"),Lang.getValByKey("supplier","supplier_table_mobile_phone"),Lang.getValByKey("supplier","supplier_table_telephone"),Lang.getValByKey("supplier","supplier_table_remark")],tableBody:[],selectNumber:0,selectFlag:!1},e.tableContacts=[],e.tableContactsModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("supplier","supplier_table_responsibility"),Lang.getValByKey("supplier","supplier_table_full_name"),Lang.getValByKey("supplier","supplier_table_department"),Lang.getValByKey("supplier","supplier_table_position"),Lang.getValByKey("supplier","supplier_table_mobile_phone"),Lang.getValByKey("supplier","supplier_table_telephone"),Lang.getValByKey("supplier","supplier_table_remark")],tableBody:[],selectNumber:0,selectFlag:!1},e.supplierId="",e.mainService="",e.bizScope="",e.isBizTrue=!1,e.ranks={data:[{id:1,name:1},{id:2,name:2},{id:3,name:3},{id:4,name:4},{id:5,name:5}]},e.rankName=1,e.rankId=1,e.seniorText=Lang.getValByKey("common","common_page_advancedFilter"),e.$on("$viewContentLoaded",function(){"trade"==e.intertype?n.getTradetSupplierTypes(function(t){0==t.errorCode&&(e.types=t.data,e.typeId=-1,e.getTypeTable(e.typeId))}):n.getSupplierTypes(function(t){0==t.errorCode&&(e.types=t.data,e.typeId=-1,e.getTypeTable(e.typeId))})}),$(window).on("resize",s),e.getTypeTable=function(t,a){a&&($(a.target).hasClass("check")||(e.seniorChecked=!1,e.showSenior=!1,e.tableModel.restData.greaterthan=!1,e.tableModel.restData.rank=-1,e.tableModel.restData.q="",e.q="",e.tableModel.restData.pageIndex=1,e.rankName=1,e.rankId=1,$(".type-filter li").removeClass("active"),$(a.target).addClass("active")),e.hiddenTypeIds=-1!=t?$(a.target).text():void 0),e.typeId=t;var n={seatParams:{serviceTypeId:e.typeId,intertype:e.intertype},urlParams:e.tableModel.restData};o.getTable(e.tableModel.restURL,n,function(t){0==t.errorCode&&(e.tableModel=o.table(e.tableModel,n,t))}),s()},e.seniorFilter=function(){1==e.showSenior?(e.seniorText=Lang.getValByKey("common","common_page_advancedFilter"),-1!=e.tableModel.restData.rank&&(e.tableModel.restData.greaterthan=!1,e.tableModel.restData.rank=-1,e.seniorChecked=!1,e.rankName=1,e.rankId=1,e.getTypeTable(e.typeId))):e.seniorText=Lang.getValByKey("common","common_page_ordinaryFilter"),e.showSenior=!e.showSenior,s()},e.initRankSelectList=function(){var t=e.ranks;selectFactory({data:t,id:"rank",defaultText:"",attrTextModel:function(t){e.rankName=t,e.rankId=t,e.tableModel.restData.greaterthan=!1,e.tableModel.restData.rank=e.rankId,e.getTypeTable(e.typeId),e.$apply()}})},e.selectRank=function(){e.seniorChecked=!1},e.checkSenior=function(t){e.seniorChecked=!e.seniorChecked,1==e.seniorChecked?(e.tableModel.restData.greaterthan=!0,e.tableModel.restData.rank=e.rankId):(e.tableModel.restData.greaterthan=!1,e.tableModel.restData.rank=e.rankId,e.rankName=1,e.rankId=1),e.getTypeTable(e.typeId,t)},e.retrievalList=function(){e.q=e.tableModel.restData.q,e.tableModel.restData.pageIndex=1,e.getTypeTable(e.typeId)},e.goBack=function(){e.isEdit||e.isVisible||e.isBizVisible?$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"warning",content:{tip:Lang.getValByKey("common","common_back_confirm")},cancelDescription:Lang.getValByKey("common","common_back_no"),operation:[{type:"submit",application:"delete",description:Lang.getValByKey("common","common_back_yes"),operationEvent:function(){$(document).promptBox("closePrompt"),e.isEdit=!1,e.paramter.id?top.location.href="http://"+location.host+sessionStorage.getItem("detailPath"):(e.main=!1,e.getTypeTable(e.typeId),e.$apply())}}]}):e.paramter.id?top.location.href="http://"+location.host+sessionStorage.getItem("detailPath"):(e.main=!1,e.getTypeTable(e.typeId))},e.addSupplier=function(){e.tab.exdisable(0),e.rankInfo=1,e.main=!0,e.visible=!1,e.isVisible=!1,e.isEdit=!0,1==e.validateRankError&&(e.validateRankError=!1),1==e.validatePictureError&&(e.validatePictureError=!1),e.validateCodeError=!1,e.showEmailError=!1,e.nameInfo="",e.simpleNameInfo="",e.websiteInfo="",e.faxInfo="",e.codeInfo="",e.emailInfo="",e.oldEmail="",e.descriptionInfo="",e.countryInfo="",e.listTypeIds=[],e.hiddenTypeIds?(e.serviceTypeIdsInfo=e.hiddenTypeIds+"，",e.serviceTypeIds=e.hiddenTypeIds+"，",-1!=e.typeId&&e.listTypeIds.push(e.typeId)):(e.serviceTypeIdsInfo="",e.serviceTypeIds=""),$("#stars").rating("update",1),$("#stars").rating("refresh",{min:0,max:5,step:1,size:"xs",animate:!0,displayOnly:!1,showClear:!1,showCaption:!1}),$("#stars").on("rating.change",function(t,a,n){e.rankInfo=$(t.target).val(),e.$apply()}),$('button[name="submitSupplier"]').addClass("save").removeClass("edit"),e.businessForm.$setPristine(),e.businessForm.$setUntouched(),e.financialForm.$setPristine(),e.financialForm.$setUntouched(),e.baseForm.$setPristine(),e.baseForm.$setUntouched(),e.BDForm.$setPristine(),e.BDForm.$setUntouched(),e.contactsForm.$setPristine(),e.contactsForm.$setUntouched()},e.deleteSupplier=function(){if(e.tableModel.selectNumber){var t=o.getSelectTable(e.tableModel.tableBody);$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_title_name"),type:"warning",content:{tip:Lang.getValByKey("supplier","supplier_prompt_tip_name")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){l(t)}}]})}else $(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("supplier","supplier_prompt_tip_tips"),type:"errer",manualClose:!0})},e.swichEvent=function(t){e.validatePictureError=!1,0==t&&($('button[name="submitSupplier"]').hasClass("save")&&(e.rankInfo=1),e.cancelSupplier()),1==t&&e.$broadcast("accountEvent",{}),2==t&&(resizeTable(),e.tableBDModel.tableBody=o.addCheckbox(e.tableBD),p(),e.$apply()),3==t&&(resizeTable(),e.tableContactsModel.tableBody=o.addCheckbox(e.tableContacts),p(),e.$apply()),e.isBizTrue?(e.bizVisible=!1,e.isBizVisible=!1):(e.bizVisible=!0,e.isBizVisible=!1),e.$apply(),5==t&&(e.isBizTrue&&(e.pictureModel.uploadShow=!0,e.pictureModel.edit=!0),e.cancelFinancial()),e.businessForm.$setPristine(),e.businessForm.$setUntouched(),e.financialForm.$setPristine(),e.financialForm.$setUntouched(),e.baseForm.$setPristine(),e.baseForm.$setUntouched(),e.BDForm.$setPristine(),e.BDForm.$setUntouched(),e.contactsForm.$setPristine(),e.contactsForm.$setUntouched(),$(".from-box .tab-content").scrollTop(0)},$(window).on("resize",p),e.cancelTypes=function(){e.nestGetTypes=!1},e.selectTypes=function(){e.loadData(),e.nestGetTypes=!0},e.loadData=function(){e.selected=[],e.checked=!1,"trade"==e.intertype?n.getTradetSupplierTypes(function(t){if(0==t.errorCode){var a=e.listTypeIds;for(var n in t.data){t.data[n].id=t.data[n].code,t.data[n].checked=!1;for(var i in a)t.data[n].id==a[i]&&(t.data[n].checked=!0)}t.data.splice(0,1);var o=[];for(var n in t.data)t.data[n].name&&o.push(t.data[n]);e.listTypes=o}}):n.getSupplierTypes(function(t){if(0==t.errorCode){var a=e.listTypeIds;for(var n in t.data){t.data[n].id=t.data[n].code,t.data[n].checked=!1;for(var i in a)t.data[n].id==a[i]&&(t.data[n].checked=!0)}t.data.splice(0,1);var o=[];for(var n in t.data)t.data[n].name&&o.push(t.data[n]);e.listTypes=o}})},e.selected=[],e.selectedTags=[];var b=function(t,a){if("add"==t&&-1==e.selected.indexOf(a)&&e.selected.push(a),"remove"==t&&-1!=e.selected.indexOf(a)){var n=e.selected.indexOf(a);e.selected.splice(n,1)}};e.obtainTypes=function(e,t){var a=e.target,n=a.checked?"add":"remove";a.checked?$(a).addClass("active"):$(a).removeClass("active"),b(n,t,a.name)},e.isCheckType=function(t){return e.selected.indexOf(t)>=0},e.submitTypes=function(){var t=$("#getTypes input.active"),a=[],n="";t.each(function(e){a.push(t.eq(e).data("id")),e==t.length-1?n+=t.eq(e).parent().data("name"):n+=t.eq(e).parent().data("name")+"，"}),e.serviceTypeIdsInfo=n,e.listTypeIds=a,e.cancelTypes()},e.validateCode=function(){if(e.codeInfo){var t;t=$('button[name="submitSupplier"]').hasClass("save")?"":e.supplierId;var a={urlParams:{code:e.codeInfo,sid:t},seatParams:{intertype:e.intertype}};n.validateSupplierCode(a,function(t){0==t.errorCode?(e.validateCodeError=!1,angular.element($(".validate-codes").removeClass("ng-invalid"))):(e.validateCodeError=!0,angular.element($(".validate-codes").addClass("ng-invalid")))})}},e.removeValidateCode=function(){e.validateCodeError=!1},e.submitSupplier=function(){if(e.nameInfo||e.baseForm.nameInfo.$setDirty(),e.simpleNameInfo||e.baseForm.simpleNameInfo.$setDirty(),e.codeInfo||e.baseForm.codeInfo.$setDirty(),e.serviceTypeIdsInfo||e.baseForm.serviceTypeIdsInfo.$setDirty(),e.emailInfo||e.baseForm.emailInfo.$setDirty(),!e.baseForm.$valid||1==e.validateCodeError||1==e.validateRankError||1==e.showEmailError)return void scrollToErrorView($(".tab-content"));var t={name:e.nameInfo,simpleName:e.simpleNameInfo,code:e.codeInfo,website:e.websiteInfo,fax:e.faxInfo,email:e.emailInfo,description:e.descriptionInfo,country:e.countryInfo,serviceTypeCodes:e.listTypeIds,rank:e.rankInfo};if($('button[name="submitSupplier"]').hasClass("save")){var a={urlParams:t,seatParams:{intertype:e.intertype}};n.saveSupplier(a,function(t){0==t.errorCode?(e.isBizTrue=!1,e.editSupplierDetail(t.data),e.getTypeTable(e.typeId),e.tab.enableAll(),e.supplierId=t.data,$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}else{var a={seatParams:{sid:e.supplierId,intertype:e.intertype},urlParams:t};n.editSupplier(a,function(t){0==t.errorCode?(e.isVisible=!1,e.editSupplierDetail(t.data),e.getTypeTable(e.typeId),e.supplierId=t.data,$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}},e.editSupplierDetail=function(t){e.supplierId=t;var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){e.tab.enableAll(),e.tab.selected(0),e.main=!0,e.visible=!0,e.isVisible=!1,e.isEdit=!1,e.validateRankError=!1,e.validateCodeError=!1,e.validatePictureError=!1,e.showEmailError=!1;var a=t.data,n="",i=[];e.tableBD=a.bds,e.tableContacts=a.supplierContacts,e.mainService=a.mainService,e.bizScope=a.bizScope,e.mainServiceInfo=a.mainService,e.bizScopeInfo=a.bizScope,e.taxpayerNumber=a.taxpayerNumber,e.bankName=a.bankName,e.bankAccount=a.bankAccount,e.companyTel=a.companyTel,e.address=a.address,e.lealPerson=a.lealPerson,e.taxpayerNumberInfo=a.taxpayerNumber,e.bankNameInfo=a.bankName,e.bankAccountInfo=a.bankAccount,e.companyTelInfo=a.companyTel,e.addressInfo=a.address,e.lealPersonInfo=a.lealPerson,e.pictureModel.uploadShow=!1,e.pictureModel.edit=!1,e.pictureModel.picture=y(a.files),e.pictureModel=r.init(e.pictureModel),e.name=a.name,e.simpleName=a.simpleName,e.website=a.website,e.fax=a.fax,e.email=a.email,e.code=a.code,e.description=a.description,e.country=a.country;for(var o in a.serviceTypes)i.push(a.serviceTypes[o].serviceTypeCode),a.serviceTypes[o].supplierTypeName&&(o==a.serviceTypes.length?n+=a.serviceTypes[o].supplierTypeName:n+=a.serviceTypes[o].supplierTypeName+"，");e.serviceTypeIdsInfo=n,e.listTypeIds=i,e.serviceTypeIds=n,e.rankInfo=parseInt(a.rank),$("#stars").rating("update",parseInt(a.rank)),$("#stars").rating("refresh",{min:0,max:5,step:1,size:"xs",animate:!0,displayOnly:!0,showClear:!1,showCaption:!1})}}),e.businessForm.$setPristine(),e.businessForm.$setUntouched(),e.financialForm.$setPristine(),e.financialForm.$setUntouched(),e.baseForm.$setPristine(),e.baseForm.$setUntouched(),e.BDForm.$setPristine(),e.BDForm.$setUntouched(),e.contactsForm.$setPristine(),e.contactsForm.$setUntouched()},e.editSupplier=function(){$('button[name="submitSupplier"]').addClass("edit").removeClass("save"),e.isVisible=!0,e.visible=!1;var t={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(t,function(t){if(0==t.errorCode){var a=t.data,n="",i=[];e.nameInfo=a.name,e.simpleNameInfo=a.simpleName,e.websiteInfo=a.website,e.faxInfo=a.fax,e.emailInfo=a.email,e.oldEmail=a.email,e.codeInfo=a.code,e.descriptionInfo=a.description,e.countryInfo=a.country;for(var o in a.serviceTypes)i.push(a.serviceTypes[o].serviceTypeCode),a.serviceTypes[o].supplierTypeName&&(o==a.serviceTypes.length-1?n+=a.serviceTypes[o].supplierTypeName:n+=a.serviceTypes[o].supplierTypeName+"，");e.serviceTypeIdsInfo=n,e.listTypeIds=i,e.serviceTypeIds=n,e.rankInfo=parseInt(a.rank),$("#stars").rating("update",parseInt(a.rank)),$("#stars").rating("refresh",{min:0,max:5,step:1,size:"xs",animate:!0,displayOnly:!1,showClear:!1,showCaption:!1}),$("#stars").on("rating.change",function(t,a,n){e.rankInfo=$(t.target).val(),e.$apply()})}})},e.cancelSupplier=function(){e.editSupplierDetail(e.supplierId),e.isVisible=!1},e.addBDUser=function(){e.BDForm.$setPristine(),e.BDForm.$setUntouched(),e.BDResponsibilityInfo="",e.BDUserInfo="",e.BDDescriptionInfo="",e.showBDUserExist=!1,$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_middle_title_add"),loadTitle:function(){return Lang.getValByKey("supplier","supplier_prompt_middle_title_add")},isMiddle:!0,isNest:!0,content:{nest:$("#BDDetail")},loadData:function(){$('#nest-BDDetail .other-btn button[name="prompt-operation"]').addClass("save").removeClass("edit")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveBDUser(),e.$apply()}}]})},e.initSelectList=function(){function t(e){for(var t=[],a=[],n=e.data,i=0,o=n.length;i<o;i++)a[i]={},a[i].id=n[i].id,a[i].name=n[i].fullName+"("+n[i].code+")",t.push(a[i]);return{data:t}}var a,i,o={urlParams:{q:e.BDUserInfo},isAsync:!0};a=n.getBDUser(o);var r=t(a);i=selectFactory({data:r,id:"userList",isSearch:!0,searchPlaceHoder:"请输入用户姓名或工号",isUsePinyin:!0,closeLocalSearch:!0,pagination:!0,defaultText:"请选择",onSearchValueChange:function(e,a,o){o||(o=1);var r={urlParams:{q:a,pageIndex:o,pageSize:10},async:!0};n.getBDUser(r,function(e){var a=t(e);i.setData(a)})},attrTextModel:function(t,a,n){var o;o=t?d(t,a):{},e.BDUserId=o.id,o.name?e.BDUserInfo=o.name.split("(")[0]:e.BDUserInfo="",$("#userList").val(e.BDUserInfo),e.showBDUserExist=!1,e.BDUserInfo&&m(),e.$apply(),c(i)}})},e.saveBDUser=function(){if(e.user||e.BDForm.user.$setDirty(),!e.showBDUserExist){var t;t=$('#nest-BDDetail button[name="prompt-operation"]').hasClass("save")?{sid:e.supplierId,intertype:e.intertype}:{sid:e.supplierId,bdid:e.bdId,intertype:e.intertype};var a={seatParams:t,urlParams:{responsibility:e.BDResponsibilityInfo,bdId:e.BDUserId,description:e.BDDescriptionInfo}};e.BDForm.$valid&&($('#nest-BDDetail button[name="prompt-operation"]').hasClass("save")?n.addBD(a,function(t){if(0==t.errorCode){$(document).promptBox("closeFormPrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableBD=a.bds}}),e.tableBDModel.tableBody=o.addCheckbox(e.tableBD),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}):n.editBD(a,function(t){if(0==t.errorCode){$(document).promptBox("closeFormPrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableBD=a.bds}}),e.tableBDModel.tableBody=o.addCheckbox(e.tableBD),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}))}},e.deleteBDUser=function(){var t=o.getSelectTable(e.tableBDModel.tableBody);t.length?$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_title_delete_bd"),type:"warning",content:{tip:Lang.getValByKey("supplier","supplier_prompt_title_delete_tip")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){e.submitDeleteBD(t)}}]}):$(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("supplier","supplier_prompt_tip_tips"),type:"errer",manualClose:!0})},e.submitDeleteBD=function(t){var a=[];for(var i in t)a.push(t[i].bdId);var r={seatParams:{sid:e.supplierId,intertype:e.intertype},urlParams:a};n.deleteBD(r,function(t){if(0==t.errorCode){$(document).promptBox("closePrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableBD=a.bds}}),e.tableBDModel.tableBody=o.addCheckbox(e.tableBD),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.bdId="",e.editBDDetail=function(t){e.bdId=t,e.BDForm.$setPristine(),e.BDForm.$setUntouched(),e.showBDUserExist=!1;for(var a in e.tableBD)e.tableBD[a].id==t&&(e.BDResponsibilityInfo=e.tableBD[a].responsibility,e.BDUserInfo=e.tableBD[a].name,e.BDUserId=e.tableBD[a].bdId,e.BDDescriptionInfo=e.tableBD[a].description);$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_middle_title_edit_bd"),loadTitle:function(){return Lang.getValByKey("supplier","supplier_prompt_middle_title_edit_bd")},isMiddle:!0,isNest:!0,content:{nest:$("#BDDetail")},loadData:function(){$('#nest-BDDetail .other-btn button[name="prompt-operation"]').addClass("edit").removeClass("save")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveBDUser(),e.$apply()}}]})},e.addContactsEvent=function(){e.contactsForm.$setPristine(),e.contactsForm.$setUntouched(),e.contactsResponsibilityInfo="",e.contactsNameInfo="",e.contactsDepartmentInfo="",e.contactsPositionInfo="",e.contactsMobilephoneInfo="",e.contactsTelephoneInfo="",e.contactsDescriptionInfo="",$("form[name='contactsForm']").find("input").val(""),$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_middle_title_add_contact"),loadTitle:function(){return Lang.getValByKey("supplier","supplier_prompt_middle_title_add_contact")},isMiddle:!0,isNest:!0,height:650,content:{nest:$("#contactsDetail")},loadData:function(){$('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass("save").removeClass("edit")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveContacts(),e.$apply()}}]})},e.editContactsDetail=function(t){e.cId=t,e.contactsForm.$setPristine(),e.contactsForm.$setUntouched();for(var a in e.tableContacts)e.tableContacts[a].id==t&&(e.contactsResponsibilityInfo=e.tableContacts[a].responsibility,e.contactsNameInfo=e.tableContacts[a].name,e.contactsDepartmentInfo=e.tableContacts[a].department,e.contactsPositionInfo=e.tableContacts[a].position,e.contactsMobilephoneInfo=e.tableContacts[a].mobilephone,e.contactsTelephoneInfo=e.tableContacts[a].telephone,e.contactsDescriptionInfo=e.tableContacts[a].description);$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_middle_title_edit_contact"),loadTitle:function(){return Lang.getValByKey("supplier","supplier_prompt_middle_title_edit_contact")},isMiddle:!0,isNest:!0,content:{nest:$("#contactsDetail")},loadData:function(){$('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass("edit").removeClass("save")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_save"),operationEvent:function(){e.saveContacts(),e.$apply()}}]})},e.saveContacts=function(){if(e.contactsResponsibilityInfo=void 0===e.contactsResponsibilityInfo?"":e.contactsResponsibilityInfo.replace(/(^\s*)|(\s*$)/g,""),e.contactsDepartmentInfo=void 0===e.contactsDepartmentInfo?"":e.contactsDepartmentInfo.replace(/(^\s*)|(\s*$)/g,""),e.contactsPositionInfo=void 0===e.contactsPositionInfo?"":e.contactsPositionInfo.replace(/(^\s*)|(\s*$)/g,""),e.contactsResponsibilityInfo||e.contactsForm.contactsResponsibilityInfo.$setDirty(),e.contactsNameInfo||e.contactsForm.contactsNameInfo.$setDirty(),e.contactsDepartmentInfo||e.contactsForm.contactsDepartmentInfo.$setDirty(),e.contactsPositionInfo||e.contactsForm.contactsPositionInfo.$setDirty(),!(e.contactsForm.$valid&&e.contactsResponsibilityInfo&&e.contactsNameInfo&&e.contactsDepartmentInfo&&e.contactsPositionInfo))return void scrollToErrorView($("#nest-contactsDetail .prompt-content"));var t;t=$('#nest-contactsDetail button[name="prompt-operation"]').hasClass("save")?{sid:e.supplierId,intertype:e.intertype}:{sid:e.supplierId,cid:e.cId,intertype:e.intertype};var a={seatParams:t,urlParams:{responsibility:e.contactsResponsibilityInfo,name:e.contactsNameInfo,department:e.contactsDepartmentInfo,position:e.contactsPositionInfo,mobilephone:e.contactsMobilephoneInfo,telephone:e.contactsTelephoneInfo,description:e.contactsDescriptionInfo}};$('#nest-contactsDetail button[name="prompt-operation"]').hasClass("save")?n.addContacts(a,function(t){if(0==t.errorCode){$(document).promptBox("closeFormPrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableContacts=a.supplierContacts}}),e.tableContactsModel.tableBody=o.addCheckbox(e.tableContacts),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}):n.editContacts(a,function(t){if(0==t.errorCode){$(document).promptBox("closeFormPrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableContacts=a.supplierContacts}}),e.tableContactsModel.tableBody=o.addCheckbox(e.tableContacts),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})},e.deleteContactsEvent=function(){var t=o.getSelectTable(e.tableContactsModel.tableBody);t.length?$(document).promptBox({title:Lang.getValByKey("supplier","supplier_prompt_delete_contact"),type:"warning",content:{tip:Lang.getValByKey("supplier","supplier_prompt_delete_tip_contact")},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){e.submitDeleteContacts(t)}}]}):$(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("supplier","supplier_prompt_tip_tips"),type:"errer",manualClose:!0})},e.submitDeleteContacts=function(t){var a=[];for(var i in t)a.push(t[i].id);var r={seatParams:{sid:e.supplierId,intertype:e.intertype},urlParams:a};n.deleteContacts(r,function(t){if(0==t.errorCode){$(document).promptBox("closePrompt");var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.tableContacts=a.supplierContacts}}),e.tableContactsModel.tableBody=o.addCheckbox(e.tableContacts),e.$apply(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.$apply()},e.editBusiness=function(){e.businessForm.$setPristine(),e.businessForm.$setUntouched();var t={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(t,function(t){if(0==t.errorCode){var a=t.data;e.mainServiceInfo=a.mainService,e.bizScopeInfo=a.bizScope}}),e.bizVisible=!1,e.isBizVisible=!0},e.submitBusiness=function(){if(e.mainServiceInfo=null===e.mainServiceInfo||void 0===e.mainServiceInfo?"":e.mainServiceInfo.replace(/(^\s*)|(\s*$)/g,""),e.mainServiceInfo||e.businessForm.mainServiceInfo.$setDirty(),!e.businessForm.$valid||!e.mainServiceInfo)return void scrollToErrorView($(".tab-content"));var t={seatParams:{sid:e.supplierId,intertype:e.intertype},urlParams:{mainService:e.mainServiceInfo,bizScope:e.bizScopeInfo}};n.saveOrAddBusiness(t,function(t){if(0==t.errorCode){e.bizVisible=!0,e.isBizVisible=!1;var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.mainService=a.mainService,e.bizScope=a.bizScope}}),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})},e.cancelBusiness=function(){e.bizVisible=!0,e.isBizVisible=!1;var t={seatParams:{sid:e.supplierId}};n.getSupplierById(t,function(t){if(0==t.errorCode){var a=t.data;e.mainService=a.mainService,e.bizScope=a.bizScope}}),e.businessForm.$setPristine(),e.businessForm.$setUntouched()},e.editFinancial=function(){e.pictureModel.uploadShow=!0,e.pictureModel.edit=!0;var t={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(t,function(t){if(0==t.errorCode){var a=t.data;e.taxpayerNumberInfo=a.taxpayerNumber,e.bankNameInfo=a.bankName,e.bankAccountInfo=a.bankAccount,e.companyTelInfo=a.companyTel,e.addressInfo=a.address,e.lealPersonInfo=a.lealPerson,e.pictureModel.picture=y(a.files),e.pictureModel=r.init(e.pictureModel)}}),e.bizVisible=!1,e.isBizVisible=!0,e.financialForm.$setPristine(),e.financialForm.$setUntouched()},e.cancelFinancial=function(){e.bizVisible=!0,e.isBizVisible=!1,e.pictureModel.uploadShow=!1,e.pictureModel.edit=!1;var t={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(t,function(t){if(0==t.errorCode){var a=t.data;e.validatePictureError=!1,e.taxpayerNumber=a.taxpayerNumber,e.bankName=a.bankName,e.bankAccount=a.bankAccount,e.companyTel=a.companyTel,e.address=a.address,e.lealPerson=a.lealPerson,e.pictureModel.picture=y(a.files),e.pictureModel=r.init(e.pictureModel)}}),e.financialForm.$setPristine(),e.financialForm.$setUntouched()},e.pictureModel={edit:!0,uploadShow:!1,picture:[],accept:"image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf"},e.getFile=function(t){var a=t.length;if(a+e.pictureModel.picture.length>r.maxUpload)return $(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("customer","company_placeholder_picture")+r.maxUpload+Lang.getValByKey("supplier","supplier_prompt_tip_picture_two"),type:"errer",manualClose:!0}),!1;for(var n=0;n<a;n++){var i=r.uploadFile(e.pictureModel,t[n]);if(!i)return!1;i.errorlocal?$(document).promptBox({isDelay:!0,contentDelay:i.errorlocal,type:"errer",manualClose:!0}):i.then(function(t){0===t.data.errorCode?(e.validatePictureError=!1,e.pictureModel=r.updateModel(e.pictureModel,t.data.data),$(document).promptBox({isDelay:!0,contentDelay:t.data.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.data.msg,type:"errer",manualClose:!0})})}},e.submitFinancial=function(){e.taxpayerNumberInfo||e.financialForm.taxpayerNumberInfo.$setDirty(),e.bankNameInfo||e.financialForm.bankNameInfo.$setDirty(),e.bankAccountInfo||e.financialForm.bankAccountInfo.$setDirty(),e.companyTelInfo||e.financialForm.companyTelInfo.$setDirty(),e.addressInfo||e.financialForm.addressInfo.$setDirty(),e.lealPersonInfo||e.financialForm.lealPersonInfo.$setDirty();var t=u(e.pictureModel.picture);t.length?e.validatePictureError=!1:e.validatePictureError=!0;var a={seatParams:{sid:e.supplierId,intertype:e.intertype},urlParams:{taxpayerNumber:e.taxpayerNumberInfo,bankName:e.bankNameInfo,bankAccount:e.bankAccountInfo,companyTel:e.companyTelInfo,address:e.addressInfo,lealPerson:e.lealPersonInfo,attachFileIds:t}};if(e.validatePictureError&&(e.financialForm.$valid=!1),!e.financialForm.$valid)return void scrollToErrorView($(".tab-content"));n.saveOrAddFinancial(a,function(t){if(0==t.errorCode){e.bizVisible=!0,e.isBizVisible=!1;var a={seatParams:{sid:e.supplierId,intertype:e.intertype}};n.getSupplierById(a,function(t){if(0==t.errorCode){var a=t.data;e.taxpayerNumber=a.taxpayerNumber,e.bankName=a.bankName,e.bankAccount=a.bankAccount,e.companyTel=a.companyTel,e.address=a.address,e.lealPerson=a.lealPerson,e.pictureModel.uploadShow=!1,e.pictureModel.edit=!1,e.pictureModel.picture=y(a.files),e.pictureModel=r.init(e.pictureModel)}}),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})}else $(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})},e.getPictureUrl=function(t){$("#slides").picturePreview({pictureId:t},e.pictureModel.picture)},e.tab=i.tab("#m-tab",e.swichEvent),e.getSupplierDetail=function(){if(e.paramter.id){e.supplierId=e.paramter.id;var t={seatParams:{sid:e.paramter.id,intertype:e.intertype}};n.getSupplierById(t,function(t){if(0==t.errorCode){e.tab.enableAll(),e.tab.selected(0),e.main=!0,e.visible=!0,e.isVisible=!1,e.validateRankError=!1,e.validateCodeError=!1,e.validatePictureError=!1,e.showEmailError=!1;var a=t.data,n="",i=[];e.tableBD=a.bds,e.tableContacts=a.supplierContacts,e.mainService=a.mainService,e.bizScope=a.bizScope,e.mainServiceInfo=a.mainService,e.bizScopeInfo=a.bizScope,e.taxpayerNumber=a.taxpayerNumber,e.bankName=a.bankName,e.bankAccount=a.bankAccount,e.companyTel=a.companyTel,e.address=a.address,e.lealPerson=a.lealPerson,e.taxpayerNumberInfo=a.taxpayerNumber,e.bankNameInfo=a.bankName,e.bankAccountInfo=a.bankAccount,e.companyTelInfo=a.companyTel,e.addressInfo=a.address,e.lealPersonInfo=a.lealPerson,e.pictureModel.uploadShow=!1,e.pictureModel.edit=!1,e.pictureModel.picture=y(a.files),e.pictureModel=r.init(e.pictureModel),e.name=a.name,e.simpleName=a.simpleName,e.website=a.website,e.fax=a.fax,e.code=a.code,e.description=a.description,e.country=a.country;for(var o in a.serviceTypes)i.push(a.serviceTypes[o].serviceTypeCode),
a.serviceTypes[o].supplierTypeName&&(o==a.serviceTypes.length?n+=a.serviceTypes[o].supplierTypeName:n+=a.serviceTypes[o].supplierTypeName+"，");e.serviceTypeIdsInfo=n,e.listTypeIds=i,e.serviceTypeIds=n,e.rankInfo=parseInt(a.rank),$("#stars").rating("update",parseInt(a.rank))}})}},e.clearEmailErrorMsg=function(){e.showEmailError=!1},e.checkEmail=function(){e.emailInfo&&e.oldEmail!=e.emailInfo&&n.checkSupplierUserInfoEmail({email:e.emailInfo},function(t){t.data?(e.showEmailError=!0,angular.element($(".check-emails").addClass("ng-invalid"))):(e.showEmailError=!1,angular.element($(".check-emails").removeClass("ng-invalid")))})},e.getSupplierDetail()}])});
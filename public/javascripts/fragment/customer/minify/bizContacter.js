app.controller("contacterCtrl",["$scope","customerService","tableService",function(e,t,o){function r(){$(".table-container tbody").slimScroll({height:$(".content-main").height()-250})}function a(){var t={urlParams:e.tableModel.restData};o.getTable(e.tableModel.restURL,t,function(a){if(e.q=e.tableModel.restData.q,$(".table-box").css("zoom","1.0000001"),0===a.errorCode){for(var s=a.data,n=[],i=!1,u=0;u<s.length;u++)s[u].changedForGorup&&(n.push(s[u].userName),i=!0);i&&setTimeout(function(){$(document).promptBox({isDelay:!0,contentDelay:n.toString()+"的人员信息已发生变化，请及时更新！",type:"errer",time:3e3,manualClose:!0})},500),e.tableModel=o.table(e.tableModel,t,a),setTimeout(function(){r(),$(window).on("resize",r),$(".table-box").focus(),resizeTable(),$(".table-box").css("zoom","1"),e.$apply()},400)}})}function s(){e.tableModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("customer","customer_duty"),Lang.getValByKey("common","common_table_full_name"),Lang.getValByKey("common","common_thead_only_code"),Lang.getValByKey("common","common_thead_phone"),Lang.getValByKey("common","common_table_telephone"),Lang.getValByKey("common","common_table_remark")],tableHeaderSize:["5%","15%","15%","15%","15%","15%","15%"],tableBody:[],restURL:"logistics.getBizContacter",restData:{q:"",sortName:"id",refCustomerId:e.customerId,isAsc:!1,pageIndex:1,pageSize:10},selectNumber:0,selectFlag:!1},a()}function n(){e.buzCustomer={},e.data={description:""},e.IsEdit=!1,e.textareaNumber=140,e.BizContacterForm.$setPristine()}function i(e,t){for(var t=t.data,o=0;o<t.length;o++)if(t[o].name==e)return t[o]}function u(e,t){for(var t=t.data,o=0;o<t.length;o++)if(t[o].fullName==e)return t[o]}function d(e){for(var t=e.data,o=0;o<t.length;o++)t[o].fullName=t[o].fullName+" ("+t[o].userCode+")";return e}function m(){f.setData({}),e.data.memberName="",e.showUserExistTips=!1,e.showUserErrTips=!1}function c(){var o=t.getBuzCustomerDuty();C=selectFactory({data:o,id:"duty",defaultCount:o.data.length+1,defaultText:Lang.getValByKey("common","common_select_tips"),attrTextModel:function(t,o){e.BizContacterForm.customer_user.$setPristine();var r;t?(r=i(t,o),e.showUserErrTips=!1):r={},m(),e.buzCustomer.dutyCode=r.code,e.data.duty=t,e.$apply()}}),f=selectFactory({data:[],showTextField:"fullName",id:"customer_user",isSearch:!0,searchPlaceHoder:"请输入姓名或工号",closeLocalSearch:!0,pagination:!0,defaultText:Lang.getValByKey("common","common_select_tips"),onSearchValueChange:function(t,o,r){if(e.buzCustomer.dutyCode){var a=e.getBizCustomerData(o,r);t.setData(a)}else t.setData({});e.$apply()},attrTextModel:function(t,o){var r;r=t?u(t,o):{},t!=e.data.memberName&&(e.canNotSaveNoExistPerson=!1),e.buzCustomer.userId=r.userId,e.data.memberName=t,l(),e.$apply()}}),setTimeout(function(){f.open()},100)}function l(){var o={refBussContactId:e.buzCustomer.userId,refBussGroupCode:e.buzCustomer.dutyCode,refCustomerId:e.customerId,description:e.data.description,id:e.modifyTableListId};t.isBuzCustomerExist(o,function(t){0!=t.errorCode?$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}):!0===t.data?(console.log("hihi"),e.showUserExistTips=!0,e.$apply()):e.showUserExistTips=!1})}function p(){return e.data.duty||e.BizContacterForm.duty.$setDirty(),e.data.memberName||e.BizContacterForm.customer_user.$setDirty(),!!e.BizContacterForm.$valid}function y(t,o,r){o(t,function(t){0!=t.errorCode?$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}):(e.closePrompt(),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success",time:3e3}),r())})}var f,C;e.getBizCustomerData=function(o,r){if(e.buzCustomer.dutyCode){o=o||"";var a={q:o?o.trim():"",pageIndex:r||1,pageSize:10,orgCode:e.buzCustomer.dutyCode},s=t.getUsersByDutyCode(a);return s=d(s)}},e.addContactPerson=function(){e.showUserErrTips=!1,e.showUserExistTips=!1,e.showPrompt=!0,m(),e.data.duty="",e.data.description="",e.modifyTableListId=""},e.editBizUser=function(t){console.log(t),e.showPrompt=!0,e.IsEdit=!0,e.showUserErrTips=!1,e.showUserExistTips=!1,e.canNotSaveNoExistPerson=1==t.changedForGorup,m(),getUsersByDutyCode(t.groupCode),e.buzCustomer.dutyCode=t.groupCode,e.buzCustomer.userId=t.userId,e.modifyTableListId=t.id,e.data.duty=t.groupName,e.data.memberName=t.userName+"("+t.userCode+")",e.data.description=t.description,e.showTextNumber()},e.$on("bizContacterEvent",function(t,o){s(),n(),c(),e.$apply(),e.showModifyPrompt=!1,e.showPrompt=!1,e.showUserErrTips=!1,e.showUserExistTips=!1}),e.closePrompt=function(){e.showPrompt=!1,n()},e.savePrompt=function(o){if(p()&&!e.canNotSaveNoExistPerson&&!e.showUserExistTips&&!e.showUserErrTips){if(e.IsEdit){var r={refBussContactId:e.buzCustomer.userId,refBussGroupCode:e.buzCustomer.dutyCode,refCustomerId:e.customerId,description:e.data.description,id:e.modifyTableListId};y(r,t.modifyBizContacter,a)}else{var r={refBussContactId:e.buzCustomer.userId,refBussGroupCode:e.buzCustomer.dutyCode,refCustomerId:e.customerId,description:e.data.description};y(r,t.addBizContacter,a)}n(),e.showPrompt=!1}},e.deleteContactPerson=function(){var r=Lang.getValByKey("customer","customer_del_biz_contacter_tips");o.delTableListById(e.tableModel,r,t.deleteBizContacterList,a)},e.showTextNumber=function(){e.textareaNumber=140-e.data.description.length},e.checkValidate=function(){e.data.duty?e.showUserErrTips=!1:e.showUserErrTips=!0}}]);
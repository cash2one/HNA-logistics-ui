easySpa.require(["widget/prompt","widget/parseUrl","public/common/tableController.js","public/common/calander.js","widget/slimscroll/","widget/select"],function(){app.controller("projectManageCtrl",["$scope","projectManageService","projectManageView","tableService",function(e,t,a,o){Calander.init({ele:["#startTime","#endTime"],isClear:!0});var n=window.parseUrl.getParams().module;n&&"logistics"===n&&(e.biztype=1),n&&"trade"===n&&(e.biztype=2),sessionStorage.setItem("projectBelong",e.biztype);var r=window.parseUrl.getParams().action;r&&"new"===r&&(e.projectAction=1),r&&"approval"===r&&(e.projectAction=2),sessionStorage.setItem("projectAction",e.projectAction);var c="";1===e.biztype&&(1===e.projectAction&&(c="logistics.getProjectsDataNewLog"),2===e.projectAction&&(c="logistics.getProjectsDataApprovalLog")),2===e.biztype&&(1===e.projectAction&&(c="logistics.getProjectsDataNew"),2===e.projectAction&&(c="logistics.getProjectsDataApproval"));var i={data:[{name:"全部",code:"-1"},{name:"草稿",code:"1"},{name:"待初审",code:"2"},{name:"待终审",code:"3"},{name:"已立项",code:"4"},{name:"已结项",code:"5"},{name:"已关闭",code:"6"}]};e.statusName="全部",2===e.projectAction&&i.data.splice(1,1),selectFactory({data:i,id:"projectStatus",showTextField:"name",defaultText:"",attrTextField:{"ng-value":"code"},attrTextId:function(t){e.tableModel.restData.status=t,e.$apply()},attrTextModel:function(t){e.statusName=t,e.$apply()}}),e.tableModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("projectManage","projectManage_project_name"),Lang.getValByKey("projectManage","projectManage_project_code"),Lang.getValByKey("projectManage","projectManage_business_type"),Lang.getValByKey("projectManage","projectManage_relationship_enterprise"),Lang.getValByKey("projectManage","projectManage_project_creator"),Lang.getValByKey("projectManage","projectManage_project_createTime"),Lang.getValByKey("projectManage","projectManage_project_status")],tableBody:[],restURL:c,restData:{biztype:e.biztype,starttime:getBeforeDate(6)+" 00:00:00",endtime:(new Date).format("yyyy-MM-dd 23:59:59"),status:"-1",companyname:"",project:"",pageIndex:1,pageSize:10}},e.getLanguage=function(){t.getLanguage(function(t){0===t.errorCode&&(e.language=t.data)})},e.getLanguage(),e.getRelationshipEnt=function(){var a=1===e.projectAction?"false":"true";t.getRelationshipEnt({urlParams:{isAudit:a,biztype:e.biztype}},function(o){e.relationshipEnterprise=selectFactory({data:o,isSearch:!0,closeLocalSearch:!0,pagination:!0,id:"relationshipEnterprise",searchPlaceHoder:"请输入企业名称",showTextField:"companyName",defaultText:"全部",attrTextModel:function(t){e.tableModel.restData.companyname=t,e.$apply()},onSearchValueChange:function(o,n,r){var c={urlParams:{q:n,isAudit:a,biztype:e.biztype,pageIndex:r}};t.getRelationshipEnt(c,function(t){0===t.errorCode?e.relationshipEnterprise.setData(t):e.relationshipEnterprise.setData([])}),e.$apply()}})})},e.$watch("tableModel",function(t,a){t!==a&&(e.delDisabled=!1,e.submitDisabled=!1,angular.forEach(e.tableModel.tableBody,function(t){t.checkbox&&1!==t.status&&(e.delDisabled=!0,e.submitDisabled=!0)}))},!0),e.delProjectsData=function(){var a=o.getSelectTable(e.tableModel.tableBody);if(!a.length)return void $(document).promptBox({isDelay:!0,contentDelay:"请先选择数据！",type:"errer",manualClose:!0});var n=a.map(function(e){return e.status}),r="";n.forEach(function(e){r=1===e}),r?$(document).promptBox({title:"提示",type:"warning",content:{tip:"确认删除选中项目?"},operation:[{type:"submit",description:Lang.getValByKey("common","common_page_delete"),application:"delete",operationEvent:function(){var o=a.map(function(e){return e.id});t.delProjectsData({urlParams:o},function(t){0===t.errorCode?(e.getProjectsData(),$(document).promptBox("closePrompt"),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}),e.$apply()})}}]}):$(document).promptBox({isDelay:!0,contentDelay:"只有草稿才能删除！",type:"errer",manualClose:!0})},e.submitProjectsData=function(){var a=o.getSelectTable(e.tableModel.tableBody);if(!a.length)return void $(document).promptBox({isDelay:!0,contentDelay:"请先选择数据！",type:"errer",manualClose:!0});var n=a.map(function(e){return e.status}),r="";n.forEach(function(e){r=!(e>1)}),r?$(document).promptBox({title:"提示",type:"success",content:{tip:"确认提交选中项目?"},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),application:"confirm",operationEvent:function(){var o=a.map(function(e){return e.id});t.submitProjectsData({urlParams:o},function(t){0===t.errorCode?(e.getProjectsData(),$(document).promptBox("closePrompt"),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}),e.$apply()})}}]}):$(document).promptBox({isDelay:!0,contentDelay:"只有草稿才能提交审核！",type:"errer",manualClose:!0})},e.jumpTo=function(){arguments[1]?sessionStorage.setItem("status",arguments[1]):sessionStorage.setItem("status",e.projectAction),sessionStorage.setItem("managePath",location.hash.split("&").slice(0,2).join("&")),top.location.href=arguments[2]?"http://"+location.host+arguments[0]+"?module="+n+"&id="+arguments[2]:"http://"+location.host+arguments[0]+"?module="+n},e.getProjectsData=function(){var t={urlParams:e.tableModel.restData};e.project=e.tableModel.restData.project,o.getTable(c,t,function(a){0===a.errorCode&&(e.tableModel=o.table(e.tableModel,t,a))})},e.resetProjectsData=function(){e.tableModel.restData={biztype:e.biztype,starttime:getBeforeDate(6)+" 00:00:00",endtime:(new Date).format("yyyy-MM-dd 23:59:59"),status:"-1",companyname:"",project:"",pageIndex:1,pageSize:10},e.project="",e.statusName="全部";var t={urlParams:e.tableModel.restData};o.getTable(c,t,function(a){0===a.errorCode&&(e.tableModel=o.table(e.tableModel,t,a))})},e.getUserIdentity=function(){t.getUserIdentity("",function(e){if(0===e.errorCode){var t="";0===e.data.length&&(t=0),e.data.length>0&&e.data.forEach(function(e){t+=e.type}),sessionStorage.setItem("identity",t)}})},e.getProjectsData(),e.getRelationshipEnt(),e.getUserIdentity()}])}),window.onhashchange=function(){$(".content-main").remove(),window.location.reload()};
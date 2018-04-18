easySpa.require(["widget/slimscroll","widget/prompt","public/common/tableController.js","public/common/uploadFile/uploadFile.js","widget/select","widget/searchBox","public/common/calander.js"],function(){app.controller("ordersCtrl",["$scope","$route","ordersService","ordersView","tableService",function(e,t,a,r,o){function l(){var t=[],a=o.getSelectTable(e.tableModel.tableBody);return a.length?(angular.forEach(a,function(e){t.push(e.orderNo)}),{urlParams:t}):(r.promptBox({msg:Lang.getValByKey("common","common_code_noSelected")}),!1)}function d(e){return e.forEach(function(e){e.name+="("+e.code+")"}),e}r.initCalander(),e.orderStartTime=getBeforeDate(6)+" 00:00:00",e.orderEndTime=(new Date).format("yyyy-MM-dd 23:59:59"),e.orderState={},e.tableModel={tableHeader:[Lang.getValByKey("common","common_thead_number"),"运单号",Lang.getValByKey("orders","orders_client_bill"),Lang.getValByKey("orders","orders_product_info"),Lang.getValByKey("orders","orders_client_info"),Lang.getValByKey("orders","orders_goods_type"),Lang.getValByKey("orders","orders_address_range"),Lang.getValByKey("orders","orders_creat_time")],tableBody:[],restURL:"logistics.getOrdersTable",restData:{startEffectTime:getBeforeDate(6)+" 00:00:00",endEffectTime:(new Date).format("yyyy-MM-dd 23:59:59"),orderStatus:"",customerId:"",cusUserId:"",waybillNo:"",productUid:"",q:"",pageIndex:1,pageSize:10,externalNo:"",sort:"createTime",asc:!1},selectNumber:0,selectFlag:!1},t.current.params.orderStatus?e.activeTab=t.current.params.orderStatus:e.activeTab="DRAFT",e.fromOrderSearch="orderSearch"==t.current.params.from,"DRAFT"==e.activeTab?9==e.tableModel.tableHeader.length&&e.tableModel.tableHeader.pop():8==e.tableModel.tableHeader.length&&e.tableModel.tableHeader.push("支付状态"),e.getOrdersTable=function(){var t,a={urlParams:e.tableModel.restData};t="DRAFT"===e.activeTab?317:371,a.urlParams.orderStatus=e.activeTab,o.getTable(e.tableModel.restURL,a,function(r){if(0===r.errorCode){e.tableModel=o.table(e.tableModel,a,r);var l=$(".g-orders").height()-t;setTimeout(function(){$(".table-container tbody").slimscroll({height:l}),$(window).resize(function(){l=$(".g-orders").height()-t,$(".table-container tbody").slimscroll({height:l})})},10)}})},e.getOrdersTable(),e.search=function(){e.orderCode?(e.tableModel.restData.pageIndex=1,e.tableModel.restData.startEffectTime=getBeforeDate(6)+" 00:00:00",e.tableModel.restData.endEffectTime=(new Date).format("yyyy-MM-dd 23:59:59"),e.tableModel.restData.customerId="",e.tableModel.restData.waybillNo=e.orderCode,e.tableModel.restData.cusUserId="",e.tableModel.restData.externalNo="",e.tableModel.restData.payStatus="",e.tableModel.restData.productUid=""):!e.orderCode&&e.clientNum?(e.tableModel.restData.pageIndex=1,e.tableModel.restData.startEffectTime=getBeforeDate(6)+" 00:00:00",e.tableModel.restData.endEffectTime=(new Date).format("yyyy-MM-dd 23:59:59"),e.tableModel.restData.customerId="",e.tableModel.restData.waybillNo="",e.tableModel.restData.cusUserId="",e.tableModel.restData.externalNo=e.clientNum,e.tableModel.restData.payStatus="",e.tableModel.restData.productUid=""):(e.orderProduct||(e.orderProductUid=""),e.tableModel.restData.pageIndex=1,e.tableModel.restData.startEffectTime=e.orderStartTime,e.tableModel.restData.endEffectTime=e.orderEndTime,e.tableModel.restData.customerId=e.orderCustomerValue,e.tableModel.restData.waybillNo="",e.tableModel.restData.externalNo="",e.tableModel.restData.cusUserId=e.orderClientValue,e.tableModel.restData.payStatus=e.payStatusValue||"",e.tableModel.restData.productUid=e.orderProductUid||""),e.getOrdersTable()},e.clearCondition=function(){e.tableModel.restData={startEffectTime:getBeforeDate(6)+" 00:00:00",endEffectTime:(new Date).format("yyyy-MM-dd 23:59:59"),customerId:"",cusUserId:"",waybillNo:"",q:"",pageIndex:1,pageSize:10,externalNo:"",sort:"createTime",asc:!1,payStatus:""},e.orderStartTime=getBeforeDate(6)+" 00:00:00",e.orderEndTime=(new Date).format("yyyy-MM-dd 23:59:59"),e.orderClientName="",e.orderCode="",e.clientNum="",e.orderCustomerName="",e.orderCustomerValue="",e.orderClientValue="",e.payStatusValue="",e.payStatus="",e.orderProduct="",e.orderProductUid="",n&&n.clearData(),$("#select-orders-status").val(""),e.getOrdersTable()},e.switchTab=function(t){t!==e.activeTab&&(e.activeTab=t,e.orderProduct="",e.orderProductUid="","DRAFT"==t?9==e.tableModel.tableHeader.length&&e.tableModel.tableHeader.pop():8==e.tableModel.tableHeader.length&&e.tableModel.tableHeader.push("支付状态"),e.getProduct(),e.clearCondition())},e.add=function(){window.location.href="#/confirmOrder"},e.del=function(){var t=l();t&&r.promptMidBox(Lang.getValByKey("common","common_prompt_title"),{msg:Lang.getValByKey("orders","orders_del_confrim")},Lang.getValByKey("common","common_page_delete"),function(){a.del(t,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),$(document).promptBox("closePrompt"),e.getOrdersTable(),e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})},"warning","delete")},e.commitOrder=function(){var t=l();t&&r.promptMidBox(Lang.getValByKey("common","common_prompt_title"),{msg:Lang.getValByKey("orders","orders_commit_confrim")},"",function(){a.commitOrder(t,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),$(document).promptBox("closePrompt"),e.getOrdersTable(),e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})})},e.sendInform=function(){var t=l();t&&(e.showPrompt=!0,a.checkOrderMessageSend(t,function(t){0===t.errorCode&&(e.orderState=t.data)}))},e.savePrompt=function(){a.sendInform(e.orderState.sendOrders,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),$(document).promptBox("closePrompt"),e.getOrdersTable(),e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}),e.showPrompt=!1},e.orderAccepted=function(){var t=l();t&&r.promptMidBox(Lang.getValByKey("common","common_prompt_title"),{msg:Lang.getValByKey("orders","orders_accept_confrim")},"",function(){a.orderAccepted(t,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),$(document).promptBox("closePrompt"),e.getOrdersTable(),e.$apply()):127119===t.errorCode?($(document).promptBox("closePrompt"),e.acceptedMsgBox=!0,e.acceptedMsg=t.data||[],e.acceptedMsgMore="",e.acceptedMsg&&e.acceptedMsg.length>5&&angular.forEach(e.acceptedMsg,function(t,a){e.acceptedMsgMore+=a?"  "+t:t}),e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})})},e.uploadFile=function(){var t=o.getSelectTable(e.tableModel.tableBody);if(1!==t.length)return r.promptBox({msg:Lang.getValByKey("orders","orders_code_selectOne")}),!1;e.showUploadFile=!0;var a={system:"operation",edit:!0,btnHandle:!0,orderStatus:e.activeTab,append:"#uploadFileContent",orderNo:t[0].orderNo,orderFileType:{url:"/api/v1/order/files/fileTypes",type:"GET"},getOrderFile:{url:"/api/v1/order/files",type:"GET",param:{pageIndex:1,pageSize:50,orderNo:t[0].orderNo}},delOrderFile:{url:"",type:"POST",param:{orderNo:t[0].orderNo,orderFileId:""}},addOrderFile:{url:"/api/v1/order/files/"+t[0].orderNo+"/orderFiles",type:"POST",param:{orderNo:t[0].orderNo,orderFileId:""}},ckeckFileName:{url:"/api/v1/order/files/files/name/check",type:"GET",param:{orderNo:t[0].orderNo,orderFileId:""}}};e.result=$(document).uploadBox(a)},e.printOrder=function(){},e.edit=function(e,t){window.location.href="#/confirmOrder?orderNum="+e+"&orderStatus="+t},e.jumpToTest=function(){window.location.href="#/confirmOrderTest"},e.showFlowProcess=function(e,t){window.location.href="#/ordersStatus?orderNum="+e+"&orderStatus="+t},e.pay=function(){var t=o.getSelectTable(e.tableModel.tableBody);if(1==t.length&&t[0].waybillNo){var r={seatParams:{waybillNo:t[0].waybillNo}};a.pay(r,function(e){0===e.errorCode?$(document).promptBox({isDelay:!0,contentDelay:e.msg,type:"success"}):$(document).promptBox({isDelay:!0,contentDelay:e.msg,type:"errer",manualClose:!0})})}};var n;e.getClientData=function(t,r){if(e.orderCustomerValue){var o={urlParams:{q:t||"",pageIndex:r||1,pageSize:10},seatParams:{costomerid:e.orderCustomerValue}},l=a.getClient(o);return angular.forEach(l.data,function(e){e.userName=e.fullName+"("+e.userName+")"}),l}},e.getClient=function(){var t;t="DRAFT"===e.activeTab?"select-client":"select-client1",e.orderCustomerValue&&!n||n.destroy(),n=selectFactory({data:[],isSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:t,showTextField:"userName",searchPlaceHoder:"请输入姓名或用户名",pagination:!0,isSaveInputVal:!0,attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(t,a,r){e.orderCustomerValue&&(e.clientData=e.getClientData(a,r),t.setData(e.clientData),e.$apply())},attrTextId:function(t){e.orderClientValue=t,e.$apply()},attrTextModel:function(t){e.orderClientName=t,e.$apply()}}),n.open(),s.next=n};var s;e.getCustomerData=function(e,t){var r={urlParams:{q:e?e.trim():"",pageIndex:t||1,pageSize:10,isAsc:!1,sortName:""}},o=a.getCustomer(r);return angular.forEach(o.data,function(e,t){e.userName+="("+e.code+")"}),o},e.getCustomer=function(){var t;t="DRAFT"===e.activeTab?"select-customer":"select-customer1",s&&s.destroy(),s=selectFactory({data:[],isSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),id:t,pagination:!0,searchPlaceHoder:"请输入账户名或编码",isSaveInputVal:!0,showTextField:"userName",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(t,a,r){e.customerData=e.getCustomerData(a,r),t.setData(e.customerData),e.$apply()},attrTextId:function(t){e.orderCustomerValue=t,e.orderClientValue="",e.orderClientName="",e.clientData=null,e.$apply()},attrTextModel:function(t){!t&&n&&n.clearData(),e.orderCustomerName=t,e.orderClientValue="",e.orderClientName="",e.clientData=null,e.$apply()}}),s.open()},e.payStatusList=[],e.getPayStatus=function(){e.payStatusList.length||(e.payStatusList=a.getPayStatusList()),selectFactory({data:e.payStatusList,defaultText:"全部",id:"select-pay-status",isSaveInputVal:!0,showTextField:"name",attrTextModel:function(t,a,r){e.payStatus=r.name||"",e.payStatusValue=r.code||"",e.$apply()}}).open()},e.getProduct=function(){e.contentList=a.getProductAllData({urlParams:{isHot:!0}}),e.navItem=a.getProductNavItem();var t;t="DRAFT"===e.activeTab?"select-product":"select-product1";new SearchBox.init({inputId:t,searchData:[],defaultText:"请选择",tip:"请输入名称或编码",navItem:e.navItem.data,tabIndex:"热门",contentList:d(e.contentList.data),toggleTab:function(e,t){this.tabIndex=t;var r={urlParams:{isHot:!1,pageIndex:e||1,pageSize:10,capital:t}};"热门"==t&&(r.urlParams.isHot=!0,r.urlParams.capital=""),"其他"==t&&(r.urlParams.isHot=!1,r.urlParams.capital="_");var o=a.getProductAllData(r);return{data:d(o.data),pagination:o.pagination}},onSearchValueChange:function(e,t){var r={urlParams:{q:e,isHot:!1,pageIndex:t||1,pageSize:10,capital:""}},o=a.getProductAllData(r);return{data:d(o.data),pagination:o.pagination}},attrTextModel:function(t,a){e.orderProduct=t||"",e.orderProductUid=a.uid||"",e.$apply()}})},e.getProduct()}])});
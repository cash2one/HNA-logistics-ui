easySpa.require(["public/common/tableController.js","widget/prompt"],function(){app.controller("orderLogCtrl",["$scope","tableService",function(e,r){e.nestLogDetail=!1,e.logTable={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("confirmOrder","confirmOrder_operationTime"),Lang.getValByKey("confirmOrder","confirmOrder_event"),Lang.getValByKey("confirmOrder","confirmOrder_operator"),Lang.getValByKey("confirmOrder","confirmOrder_operatorSource"),Lang.getValByKey("confirmOrder","confirmOrder_page_detail_orderStatus"),"支付状态"],tableBody:[],restURL:"logistics.getOrderLogList",restData:{},selectNumber:0,selectFlag:!1},e.detailTable={tableHeader:[Lang.getValByKey("common","common_thead_number"),Lang.getValByKey("confirmOrder","confirmOrder_modifyContent")],tableTitle:"",tableBody:[],restURL:"logistics.getOrderLogDetail",restData:{},selectNumber:0,selectFlag:!1},e.$on("operatelog",function(a,t){var o={seatParams:{orderId:t}};r.getTable(e.logTable.restURL,o,function(r){0===r.errorCode&&(e.logTable.tableBody=r.data)})}),e.showDetail=function(a,t){var o={seatParams:{logId:a}};r.getTable(e.detailTable.restURL,o,function(r){if(e.detailTable.tableBody=[],0===r.errorCode){if(null===r.data.recordTxtList&&0===r.data.upDataList.length)return;e.nestLogDetail=!0,null===r.data.recordTxtList?(e.showRecordTxt=!1,e.indexNum=1):(e.showRecordTxt=!0,e.indexNum=r.data.recordTxtList.length+1),e.detailTable.tableTitle=t,e.recordTxtList=r.data.recordTxtList,r.data.upDataList.forEach(function(e,r){var a=e.paramName;switch(a){case"customerName":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_customerName");break;case"externalNo":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_externalNo");break;case"productName":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_productName");break;case"orderAdditionalDtos":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_orderAdditionalDtos");break;case"cargoTypeName":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_cargoTypeName");break;case"packageNum":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_packageNum");break;case"cargoTotalWeight":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_cargoTotalWeight");break;case"fromAddress":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_fromAddress");break;case"toAddress":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_toAddress");break;case"fetchAddress":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_fetchAddress");break;case"orderCargoDtos":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_orderCargoDtos");break;case"customerNote":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_page_customerMsg");break;case"feeWeight":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_feeWeight");break;case"subOrder":e.paramName=Lang.getValByKey("confirmOrder","confirmOrder_subOrder");break;case"order":e.paramName="订单信息";break;default:e.paramName=a}}),e.detailTable.tableBody=r.data.upDataList}})},e.cancelShowDetail=function(){e.nestLogDetail=!1}}])});
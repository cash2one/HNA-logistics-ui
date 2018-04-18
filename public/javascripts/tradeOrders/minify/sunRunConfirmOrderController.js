easySpa.require(["service/templateService"],function(){function e(e,r,t,a){function o(){e.writeFirstTime&&(e.template.paymentClause="30 days from date of delivery.\nAn interest of 3 percentage per month will apply for any overdue payment")}function n(){e.template.purchaser=" and/or master and/or owners and/or charterers and/or managers and/or operators and/or "+e.template.purchaserCompanyName}function i(){e.writeFirstTime&&(e.template.note="BARGE FIGURE TO BE FINAL AND BINDING.\nDELIVERY SUBJECT TO WEATHER CONDITIONS.")}function m(){setTimeout(function(){Calander.init({ele:"#transportStartTime",isClear:!0}),Calander.init({ele:"#transportEndTime",isClear:!0}),Calander.init({ele:"#createTime",isClear:!0}),Calander.init({ele:"#sailStartTime",isClear:!0}),Calander.init({ele:"#sailEndTime",isClear:!0}),Calander.init({ele:"#reachStartTime",isClear:!0}),Calander.init({ele:"#reachEndTime",isClear:!0})},0)}function s(){r.getOrderConfrmByOrderNo(e.orderNo,function(r){0==r.errorCode?(e.writeFirstTime=!r.data.jsonData,e.template=JSON.parse(r.data.jsonData)||{},e.template.purchaserCustomerName=r.data.purchaserCustomerName,e.template.businessNo=r.data.businessNo,e.template.orderGoods=r.data.orderGoods,e.template.orderNo=r.data.orderNo,e.template.purchaserCompanyName=r.data.purchaserCompanyName||r.data.purchaserCustomerName,angular.forEach(e.template.orderGoods,function(e){e.goodsName=t.StringInsertByInterval(e.goodsName,"\n",30)}),p()):t.promptBox({msg:r.msg})})}function c(){e.writeFirstTime&&(e.template.companyAddress="Sunrun Bunkering Limited\n4F HNA Tower\nNo. 898 Puming Road\nShanghai, China")}function l(){e.writeFirstTime&&(e.template.companyPhone="+862161759009",e.template.companyFax="+862161759000")}function d(){e.writeFirstTime&&(e.template.companyEmail="wang_ye@hnair.com",e.template.representativeName="Yale Wang")}function p(){o(),n(),i(),m(),c(),l(),d(),e.writeFirstTime&&(e.template.createTime=t.DataFormat((new Date).format("yyyy-MM-dd 00:00:00")))}function u(){var r=!0,t=!0;["custCompanyNickName","businessNo","custCompanyAddress","shipName","destinationPort","imoCode","paymentClause","purchaser","note","representativeName","representativePhone","companyAddress","companyPhone","companyFax","companyEmail"].forEach(function(r){e.template[r]||e.sunRunTemplate[r].$setDirty()}),e.template.transportStartTime||e.template.transportEndTime||($("#transportStartTime").css("border-color","rgb(250, 120, 126)"),$("#transportEndTime").css("border-color","rgb(250, 120, 126)"),r=!1),e.template.sailStartTime||e.template.sailEndTime||e.template.reachStartTime||e.template.reachEndTime||($("#sailStartTime").css("border-color","rgb(250, 120, 126)"),$("#sailEndTime").css("border-color","rgb(250, 120, 126)"),$("#reachStartTime").css("border-color","rgb(250, 120, 126)"),$("#reachEndTime").css("border-color","rgb(250, 120, 126)"),t=!1);for(var a=$(".errors"),o=0;o<a.length;o++)if(!$(a[o]).hasClass("ng-hide"))return!1;return e.sunRunTemplate.$valid&&r&&t}e.IsEdit=!0,e.template={},e.$watch("template.shipName",function(){e.template.purchaser="M/V "+e.template.shipName+" and/or master and/or owners and/or charterers and/or\nmanagers and/or operators and/or "+e.template.purchaserCompanyName}),function(){e.pageSize=1,s()}(),e.$watch("template.transportStartTime",function(e,r){e!==r&&e&&($("#transportStartTime").css("border-color","#BDBDBD"),$("#transportEndTime").css("border-color","#BDBDBD"))},!0),e.$watch("template.transportEndTime",function(e,r){e!==r&&e&&($("#transportStartTime").css("border-color","#BDBDBD"),$("#transportEndTime").css("border-color","#BDBDBD"))},!0),e.$watch("template.sailStartTime",function(e,r){e!==r&&e&&($("#sailStartTime").css("border-color","#BDBDBD"),$("#sailEndTime").css("border-color","#BDBDBD"),$("#reachStartTime").css("border-color","#BDBDBD"),$("#reachEndTime").css("border-color","#BDBDBD"))},!0),e.$watch("template.sailEndTime",function(e,r){e!==r&&e&&($("#sailStartTime").css("border-color","#BDBDBD"),$("#sailEndTime").css("border-color","#BDBDBD"),$("#reachStartTime").css("border-color","#BDBDBD"),$("#reachEndTime").css("border-color","#BDBDBD"))},!0),e.$watch("template.reachStartTime",function(e,r){e!==r&&e&&($("#sailStartTime").css("border-color","#BDBDBD"),$("#sailEndTime").css("border-color","#BDBDBD"),$("#reachStartTime").css("border-color","#BDBDBD"),$("#reachEndTime").css("border-color","#BDBDBD"))},!0),e.$watch("template.reachEndTime",function(e,r){e!==r&&e&&($("#sailStartTime").css("border-color","#BDBDBD"),$("#sailEndTime").css("border-color","#BDBDBD"),$("#reachStartTime").css("border-color","#BDBDBD"),$("#reachEndTime").css("border-color","#BDBDBD"))},!0),e.confirm=function(){if(0==u())return void scrollToErrorView($("#form-content"));e.template.purchaserCompanyName=t.SectionBreakWord(e.template.purchaserCompanyName,50),e.template.companyAddress=t.SectionBreakWord(e.template.companyAddress,40),e.template.custCompanyAddress=t.SectionBreakWord(e.template.custCompanyAddress,40),e.template.paymentClause=t.SectionBreakWord(e.template.paymentClause,90),e.template.agent=t.SectionBreakWord(e.template.agent,90),e.template.note=t.SectionBreakWord(e.template.note,90),t.promptMidBox("",{msg:"确定提交信息？"},"",function(){r.saveOrderConfirm(e.template,function(a){if(0==a.errorCode){var o={urlParams:encodeURIComponent($("#sunRunConfirmOrder").html()),seatParams:{orderNo:e.template.orderNo,type:1}};r.exportPDFByOrderNo(o,function(r){t.promptBox(r),e.fileUrl=r.data.fileUrl,e.pageSize=r.data.pageSize,e.IsEdit=!1,e.$apply()})}else t.promptBox(a)})})},e.goodsNum=function(e){return e?Number(e).toFixed(4):null},e.goodsPrice=function(e){return Number(e).toFixed(2)},e.createTimeFormat=function(r){e.template.createTime=t.DataFormat(r)},e.transportStartTimeFormat=function(r){e.template.transportStartTime=t.DataFormat(r)},e.transportEndTimeFormat=function(r){e.template.transportEndTime=t.DataFormat(r)},e.sailStartTimeFormat=function(r){e.template.sailStartTime=t.DataFormat(r)},e.sailEndTimeFormat=function(r){e.template.sailEndTime=t.DataFormat(r)},e.reachStartTimeFormat=function(r){e.template.reachStartTime=t.DataFormat(r)},e.reachEndTimeFormat=function(r){e.template.reachEndTime=t.DataFormat(r)}}app.controller("sunRunConfirmOrderController",["$scope","tradeOrdersService","tradeOrdersView","templateService",e])});
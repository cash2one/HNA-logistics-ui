easySpa.require(["service/templateService"],function(){function e(e,o,t,r){function a(){o.getOrderInfoByOrderNoNormal(e.orderNo,function(o){0==o.errorCode?(e.template.orderGoods=o.data.orderGoods,e.template.currencyUnit=o.data.currencyUnit,e.projectId=o.data.projectId,e.purchaserId=o.data.purchaserId,e.sellerId=o.data.sellId):t.promptBox({msg:o.msg})})}function d(t,r){t=t||"",r||(r=1);var a="purchase"==easySpa.queryUrlValByKey("action")?"PURCHASE":"SALE",d={q:t?t.trim():"",pageIndex:r,pageSize:10,orderType:a,businessType:2,projectId:e.projectId,purchaserId:e.purchaserId,sellId:e.sellerId};return o.getTrdGoodsShortList(d)}function n(){for(t=0;t<e.template.orderGoods.length;t++)e.template.orderGoods[t].goodsNum||e.normalDeliveryTemplate["goodsNum"+t].$setDirty();for(var o=$(".errors"),t=0;t<o.length;t++)if(!$(o[t]).hasClass("ng-hide"))return!1;return e.normalDeliveryTemplate.$valid}e.InitGoodsSelect=function(){e.goodsData||(e.goodsData=d(),e.goodsData.data.forEach(function(e){e.showName=e.goodsTypeName+": "+e.name+"("+e.code+")"})),selectFactory({data:e.goodsData,isSearch:!0,isUsePinyin:!0,isCreateNewSelect:!0,id:"orderGood",pagination:!0,defaultText:"请选择",searchPlaceHoder:"请输入名称或编码",showTextField:"showName",attrTextField:{"ng-value":"id"},closeLocalSearch:!0,onSearchValueChange:function(o,t,r){var a=d(t,r);a.data.forEach(function(e){e.showName=e.goodsTypeName+": "+e.name+"("+e.code+")"}),o.setData(a),e.$apply()},attrTextId:function(o){e.orderGoodId=o||"",e.$apply()},attrTextModel:function(o){e.orderGoodName=o,e.$apply()}}).setData(e.goodsData)},e.addGoods=function(){function r(o){var t={goodsName:o.goodsName,goodsUnit:o.unit,goodsPrice:o.price.toFixed(2),goodsId:o.id,goodsCurrencyType:o.currencyType};e.template.orderGoods.push(t),e.template.currencyUnit=e.template.orderGoods[0].goodsCurrencyType}if(!e.orderGoodId)return void t.promptBox({msg:"请先选择商品!"});o.getGoodsOrderById(e.orderGoodId).then(function(e){0==e.errorCode&&r(e.data)})},e.checkOne=function(o,t){o.checked=!o.checked;var r=!0;t.forEach(function(e){e.checked||(r=!1)}),e.isAllchecked=r},e.isAllchecked=!1,e.checkAll=function(o){e.isAllchecked=!e.isAllchecked,o.forEach(function(o){o.checked=e.isAllchecked})},e.deleteGoods=function(){var o=e.template.orderGoods;o.forEach(function(t,r){t.checked&&(o.splice(r,1),e.deleteGoods())}),e.isAllchecked&&(e.isAllchecked=!1)},e.confirm=function(){if(0==n())return void scrollToErrorView($("#form-content"));t.promptMidBox("",{msg:"确定提交信息？提交后不能修改！"},"",function(){e.template.vat=Number(e.template.vat),e.template.orderNo=e.orderNo,e.template.noVat=Number(e.template.noVat),o.confirmTrdDeliveryOrderNormal(e.template,function(o){t.promptBox(o),0==o.errorCode&&setTimeout(function(){e.goBack("fresh")},200)})})},e.goodsToTal=function(e){var o=Number(e.goodsPrice*e.goodsNum).toFixed(2);return isNaN(o)&&(o=0),e.amountDue=o},e.totalAmountWithoutVat=function(o){if(!o)return e.template.noVat=0,e.template.noVat;var t=0;return o.forEach(function(e){var o=Number(e.amountDue);isNaN(o)||(t+=o)}),e.template.noVat=t.toFixed(2),e.template.noVat},e.totalAmount=function(){if(isNaN(e.template.vat)||!e.template.noVat)return void(e.totalWithVAT=0);var o=Number(e.template.noVat)+Number(e.template.vat);return e.totalWithVAT=o.toFixed(2),e.totalWithVAT},function(){e.template={},e.template.vat=0,e.template.orderGoods=[],e.IsEdit=!0,a(),setTimeout(function(){e.InitGoodsSelect()},0)}()}app.controller("normalDeliveryOrderController",["$scope","tradeOrdersService","tradeOrdersView","templateService",e])});
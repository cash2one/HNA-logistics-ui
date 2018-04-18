easySpa.require(["widget/tab","widget/prompt","widget/parseUrl","public/javascripts/fragment/addProduct/baseInfoCtr.js","public/javascripts/fragment/addProduct/productRangeCtr.js","public/javascripts/fragment/addProduct/productServeCtr.js","public/javascripts/fragment/addProduct/weightRegularCtr.js"],function(){app.controller("addProductCtrl",["$scope","addProductService","addProductView","$route","$timeout",function(e,t,o,a,r){function n(o){t.getProductBaseInfo(o,function(t){"boolean"==typeof t.data.isOnline?e.isOffline=!t.data.isOnline:e.isOffline=t.data.isOnline,e.status=t.data.status,e.id=t.data.id,e.IsDraftStatus=1===t.data.status,u?e.canEditBase=!1:e.isAudit?(e.IsDraftStatus||e.isOffline)&&(e.canEditBase=!0):e.IsDraftStatus&&(e.canEditBase=!0)})}function i(e){0===e.errorCode?$(document).promptBox({isDelay:!0,contentDelay:e.msg,type:"success",time:3e3}):$(document).promptBox({isDelay:!0,contentDelay:e.msg,type:"errer",manualClose:!0})}function c(e,t,o){$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:t},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),application:"confirm",operationEvent:function(){$(document).promptBox("closePrompt"),e()}}],cancelEvent:function(){"function"==typeof o&&o()}})}function s(t){switch(e.resetTabScroll(),t){case 0:e.$broadcast("baseInfoEvent",{});break;case 1:e.$broadcast("weightRegularEvent",{});break;case 2:e.$broadcast("productServeEvent",{});break;case 3:e.$broadcast("productRangeEvent",{})}try{e.$apply()}catch(e){}}var u=sessionStorage.getItem("backPricePath"),d=sessionStorage.getItem("backPriceType"),p=sessionStorage.getItem("backPriceModule");e.parameter=window.parseUrl.getParams(),a.current.params&&"new"===a.current.params.from?e.isAudit=!1:e.isAudit=!0,"1"===a.current.params.type?e.isPreview=!1:e.isPreview=!0,e.submitVerify=function(){c(function(){t.submitProducts(e.uid,function(t){i(t),0==t.errorCode&&r(function(){e.goBackProduct()},1e3)})},"确定该产品内容无误并提交审核？")},e.productEnable=function(){c(function(){t.onlineProdcut(e.uid,function(t){i(t),0==t.errorCode&&(e.productInfo.isOnline=!0,e.$digest(),window.location.reload())})},"确定启用该产品？")},e.productDisable=function(){c(function(){t.offlineProdcut(e.uid,function(t){i(t),0==t.errorCode&&(e.productInfo.isOnline=!1,e.$digest(),window.location.reload())})},"确定停用该产品？")},e.setPageTitle=function(t){e.productTitle=t},e.setProductInfo=function(t,o){e.isNew||(e.isNew=o),e.isNew||e.setPageTitle(Lang.getValByKey("addProduct","product_detail")),e.productInfo=t,!1===e.productInfo.isOnline&&(e.isOffline=!0)},function(){if(-1!=location.href.indexOf("uid")){var t=easySpa.queryUrlValByKey("uid"),o=easySpa.queryUrlValByKey("id");t&&(e.uid=t,e.id=o,n(e.uid))}}(),function(){e.resetTabScroll=function(){setTimeout(function(){$(".tab-content").scrollTop(0)},100)},e.swichEvent=function(e){s(e)},e.tab=o.tab("#m-tab",e.swichEvent),e.uid?e.isEdit=!1:(e.tab.exdisable(0),e.isEdit=!0),setTimeout(function(){e.$broadcast("baseInfoEvent",{})},200)}(),function(){reSetMenuCssStatus("#/customer"),e.goBackProduct=function(){if(u)location.href=d?"#/priceDetail?module="+p+"&q=price&uid="+u+"&type="+d:"#/priceDetail?module="+p+"&q=price&uid="+u;else if(e.isEdit||"1"===sessionStorage.getItem("isEdit"))$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"warning",content:{tip:Lang.getValByKey("common","common_back_confirm")},cancelDescription:Lang.getValByKey("common","common_back_no"),operation:[{type:"submit",application:"delete",description:Lang.getValByKey("common","common_back_yes"),operationEvent:function(){if(a.current.params&&a.current.params.orderNo)top.location.href="http://"+location.host+"/#/confirmOrder?orderNum="+a.current.params.orderNo;else{var t=easySpa.queryUrlValByKey("type"),o=easySpa.queryUrlValByKey("from");location.href="#/product?module="+o+"&type="+t}e.$apply(),$(document).promptBox("closePrompt")}}]});else if(a.current.params&&a.current.params.orderNo&&"undefined"!==a.current.params.orderNo){e.topParameter=window.parseUrl.getTopParams();var t=e.topParameter.workId||"",o=e.topParameter.isJustShow||!1;top.location.href="http://"+location.host+"/#/confirmOrder?orderNum="+a.current.params.orderNo+"&id="+t+"&isJustShow="+o+"&from="+e.topParameter.origin}else{var r=easySpa.queryUrlValByKey("type"),n=easySpa.queryUrlValByKey("from");location.href="#/product?module="+n+"&type="+r}}}();var l=easySpa.queryUrlValByKey("index");l&&(e.tab.selected(l),setTimeout(function(){e.$broadcast("productRangeEvent",{})},200))}])}),window.addEventListener("hashchange",function(){sessionStorage.setItem("backPricePath","")},!1),window.addEventListener("hashchange",function(){sessionStorage.setItem("isEdit","")},!1);
var controller={$scope:null,service:null,initViewButton:function(t){$.extend(!0,t.viewButton,{submit:!0,submitDisabled:!0,isSalesPrice:!1})},init:function(t,e){this.initViewButton(t),this.$scope=t,this.service=e,this.scopeEvent()},scopeEvent:function(){var t=this,e=t.$scope,i=t.service;e.infoCopy=function(){e.getInfo(),e.iPriceName=e.iInputPriceName=e.iInputPriceName+Lang.getValByKey("priceDetail","priceDetail_code_priceCopy");var t=0;e.copyPriceDetailList=[];for(var i=0,a=e.priceDetailList.length;i<a;i++)t=e.priceDetailList[i].id?e.priceDetailList[i].id:0,e.copyPriceDetailList[i]=e.getOnePriceDetails(t),angular.forEach(e.copyPriceDetailList[i].freightItems,function(t,a){if(-1===t.price)e.copyPriceDetailList[i].freightItems[a].price="";else{var o=-1==t.price?0:t.price;1==e.urlData.adjustTypeId?1==e.urlData.adjustUnitId?o=parseFloat(o)+parseFloat(o*(e.urlData.adjustVal/100)):2==e.urlData.adjustUnitId&&(o=parseFloat(o)+parseFloat(e.urlData.adjustVal)):2==e.urlData.adjustTypeId&&(1==e.urlData.adjustUnitId?o=parseFloat(o)-parseFloat(o*(e.urlData.adjustVal/100)):2==e.urlData.adjustUnitId&&(o=parseFloat(o)-parseFloat(e.urlData.adjustVal))),o=o>=0?o:0,e.copyPriceDetailList[i].freightItems[a].price=parseFloat(o.toFixed(3))}}),e.priceDetailList[i].id=""},e.childInit=function(){e.uid?(e.getInfo(),1==e.status?(e.isHidenEditBtn=!1,e.viewButton.submitDisabled=!1,e.viewButton.isShowCancelBtn=!0):e.isHidenEditBtn=!0):(e.parameter.data&&(e.urlData=JSON.parse(decodeURIComponent(e.parameter.data)),e.uid=e.urlData.uid,e.viewButton.isCopy=!0,e.infoCopy(),e.uid=0,2==e.urlData.priceType?(e.viewButton.isSalesPrice=!0,e.iInputProduct=e.iInputProductValue=""):e.viewButton.isSalesPrice=!1),e.title=Lang.getValByKey("priceDetail","priceDetail_code_addPriceMethod"))},e.childInit(),e.submitAudit=function(){$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:Lang.getValByKey("priceDetail","priceDetail_code_priceAddConfirm")},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){$(document).promptBox("closePrompt");var t={urlParams:[e.uid]};i.audit(t,function(t){0===t.errorCode?($(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success"}),e.isHidenEditBtn=!0,e.viewButton.submitDisabled=!0,setTimeout(function(){e.goBack()},e.jumpTime)):$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})})}}]})}}};
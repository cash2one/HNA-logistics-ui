var addSalesPriceUrl="#/priceDetail?module=salesPriceApproval&q=price",controller={$scope:null,service:null,tableService:null,initViewButton:function(e){$.extend(!0,e.viewButton,{isAdd:!1,isDelete:!1,isCopy:!1,isSubmitVerify:!1,isVerifyOk:!1,isNoPassDraft:!1,isShowVerifyList:!1,isShowStatusTableCell:!1,isBelongToProduct:!0,isBelongToService:!1,isShowPriceType:!0,isShowStatusTableCell:!0,isShowStartState:!0,isTabList:!0,isShowOperAreaLine:!1,isShowCheckBox:!1,isShowOperAreaLine:!1,isShowWeightAndArea:!0})},loadSalePriceData:function(){$scope=this.$scope;var e=this;$scope.pricePlanQ=$scope.pricePlan,$scope.belongServiceQ=$scope.belongServiceId,$scope.startAddressQ=$scope.startAddress,$scope.belongProductQ=$scope.belongProduct;var t={urlParams:$scope.tableModel.restData};$scope.tableModel.restData.status=$scope.useStateId,e.tableService.getTable($scope.tableModel.restURL,t,function(o){$scope.q=$scope.tableModel.restData.q,$scope.isShowIcon=!0,0===o.errorCode&&($scope.tableModel=e.tableService.table($scope.tableModel,t,o),setTimeout(function(){$scope.setScroll(),$(window).on("resize",$scope.setScroll),$scope.$apply(),$(".table-box").focus()},100))})},initPage:function(){function e(o,s){if(0!=$scope.tableModel.selectNumber&&0!=$(".table-box tbody tr").length){var a=[],c=t.tableService.getSelectTable($scope.tableModel.tableBody);if(!c.length)return accountView.promptBox({isDelay:!0,contentDelay:Lang.getValByKey("price","price_prompt_delay_tip"),type:"errer",manualClose:!0}),!1;angular.forEach(c,function(e){a.push(e.uid)}),a.seatParams=s?{confirmed:"isconfirmed=true"}:{confirmed:"isconfirmed=false"},o(a,function(s){0===s.errorCode?($(document).promptBox({isDelay:!0,contentDelay:s.msg,type:"success",time:3e3}),$(document).promptBox("closePrompt"),t.loadSalePriceData()):207001==s.errorCode?$(document).promptBox({title:Lang.getValByKey("common","common_prompt_title"),type:"success",content:{tip:s.msg},operation:[{type:"submit",description:Lang.getValByKey("common","common_pagination_confirm"),application:"confirm",operationEvent:function(){$(document).promptBox("closePrompt"),e(o,!0)}}]}):$(document).promptBox({isDelay:!0,contentDelay:s.msg,type:"errer",manualClose:!0})})}else $(document).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("price","price_prompt_delay_tip"),type:"errer",manualClose:!0})}var t=this;$scope=this.$scope,$scope.isShowPriceLevelList=!1,$scope.useStateId=2,$scope.tableModel={tableHeader:[Lang.getValByKey("price","price_id"),Lang.getValByKey("price","price_plan"),Lang.getValByKey("price","price_code"),Lang.getValByKey("price","price_belong_product"),Lang.getValByKey("price","price_type"),Lang.getValByKey("price","price_start_address"),Lang.getValByKey("price","price_goods_type"),Lang.getValByKey("price","price_valuation_currency"),Lang.getValByKey("price","price_account_type"),Lang.getValByKey("price","price_start_time"),Lang.getValByKey("price","price_end_time"),Lang.getValByKey("price","price_status")],tableHeaderSize:["4%","10%","5%","13%","6%","9%","6%","6%","6%","12%","12%","6%"],tableBody:[],restURL:"logistics.getCostPriceList",restData:{type:2,pageIndex:1,pageSize:10,orderby:"submittime"},selectNumber:0,selectFlag:!1},this.loadSalePriceData(),$scope.resetData=function(){$scope.costTypeStartCode="",$scope.pricePlan="",$scope.useStateId="",$scope.useState="",$scope.verifyState="",$scope.verifyStateId="",$scope.accountType="",$scope.accountTypeId="",$scope.costTypeStart="",$scope.costTypeEnd="",$scope.costTypeEndId="",$scope.valuationCurrency="",$scope.valuationCurrencyId="",$scope.startAddress="",$scope.goodsType="",$scope.goodsTypeId="",$("#start-time").val(""),$("#end-time").val(""),$scope.belongProduct="",$scope.belongProductUid="",$scope.priceType="",$scope.priceTypeId="",$scope.q="";for(var e=0;e<$scope.priceLevelList.length;e++)$scope[$scope.priceLevelList[e]]=!1;$scope.isShowPriceLevelList=!1,$scope.isResetSearchCls=!1;var t=$scope.getTabType();1==t?$scope.useStateId=2:2==t&&($scope.useStateId=3,$scope.useState=Lang.getValByKey("price","price_verify_ok")),$scope.search()},$scope.search=function(){for(var e="",o=0;o<$scope.priceLevelList.length;o++)$scope[$scope.priceLevelList[o]]&&(e+=o+1+",");e&&e.lastIndexOf(",")==e.length-1&&(e=e.substring(0,e.length-1)),$scope.tableModel.restData.feeTypeCode=$scope.costTypeStartCode,$scope.tableModel.restData.grades=e,$scope.tableModel.restData.status=$scope.useStateId,$scope.tableModel.restData.gradeType=$scope.priceTypeId,$scope.tableModel.restData.biz=$scope.belongProductUid,$scope.tableModel.restData.q=$scope.pricePlan,$scope.tableModel.restData.pageIndex=1,$scope.tableModel.restData.currencyId=$scope.valuationCurrencyId,$scope.tableModel.restData.feeTypeId=$scope.costTypeEndId,$scope.tableModel.restData.settleMentId=$scope.accountTypeId,$scope.tableModel.restData.starts=$scope.startAddress,$scope.tableModel.restData.cargoTypeCode=$scope.goodsTypeId,$scope.tableModel.restData.startEffectTime=$("#start-time").val(),$scope.tableModel.restData.endEffectTime=$("#end-time").val(),t.loadSalePriceData()},$scope.switchTab=function(e,o){var s=$(e.target);s.hasClass("tab-active")||($(".tab-active").removeClass("tab-active"),s.addClass("tab-active"),1==o?($scope.viewButton.isShowUseState=!1,$scope.viewButton.isShowStartUse=!1,$scope.viewButton.isShowStopUse=!1,$scope.viewButton.isVerifyOk=!1,$scope.viewButton.isNoPassDraft=!1,$scope.viewButton.isShowStatusTableCell=!0,$(".select-container").css("display","none"),$scope.resetData(),$scope.useStateId=2,$scope.tableModel.restData.asc=!0,$scope.tableModel.tableHeaderSize=["5%","10%","5%","12%","6%","9%","6%","6%","6%","12%","12%","6%"],t.loadSalePriceData()):2==o&&($scope.viewButton.isShowUseState=!0,$scope.viewButton.isShowStartUse=!1,$scope.viewButton.isShowStopUse=!1,$scope.viewButton.isVerifyOk=!1,$scope.viewButton.isNoPassDraft=!1,$scope.viewButton.isShowStatusTableCell=!1,$(".select-container").css("display","none"),$scope.resetData(),$scope.useStateId=3,$scope.useState=Lang.getValByKey("price","price_verify_ok"),$scope.tableModel.restData.asc=!1,$scope.tableModel.tableHeaderSize=["5%","10%","5%","12%","6%","9%","6%","6%","6%","12%","12%","6%"],t.loadSalePriceData()))},$scope.verifyOk=function(){$scope.showConfirmWindow(function(){e(t.service.verifySalePrice)},Lang.getValByKey("price","price_confirm_verify_ok_tips"))},$scope.nopassDraft=function(){$scope.showConfirmWindow(function(){e(t.service.salePriceNoPass)},Lang.getValByKey("price","price_confirm_nppass_tips"))},$scope.startUse=function(){$scope.showConfirmWindow(function(){e(t.service.salePriceStartUse)},Lang.getValByKey("price","price_confirm_start_use_tips"))},$scope.stopUse=function(){$scope.showConfirmWindow(function(){e(t.service.salePriceStopUse)},Lang.getValByKey("price","price_confirm_stop_use_tips"))},$scope.editCurrentPrice=function(e){var t=$scope.getTabType();location.href=addSalesPriceUrl+"&uid="+e+"&type="+t}},init:function(e,t,o){this.initViewButton(e),this.$scope=e,this.service=t,this.tableService=o,this.initPage()}};
app.controller("bankManagerCtr",["$scope","fundsAccountService","eventServiceFactory",function(e,a,r){e.init=function(a){e.initData(a),e.getBankCardList()};var t=r.createEventService();t.on("bankManagerData",e.init),e.initData=function(a){e.thirdPayAccountId=a.thirdPayAccountId,e.list=[]},e.getBankCardList=function(){var r={seatParams:{thirdPayAccountId:e.thirdPayAccountId}};a.getBankCardList(r,function(a){0===a.errorCode&&(e.list=a.data||[])})},e.unbundled=function(r){var t={title:"确定解绑下列银行账户？",type:"success",content:{tip:"<p>账户号："+r.cardNo+"</p><p>开户行："+r.subbranch+"</p>"},operation:[{type:"submit",description:"确定",operationEvent:function(){var t={seatParams:{bankCardId:r.id||""}};a.unbundledBankCard(t,function(a){a.thirdMsg=a.data&&a.data.rspMsg?a.data.rspMsg:a.msg,0===a.errorCode?($(document).promptBox("closePrompt"),$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"success"}),e.getBankCardList(),e.$apply()):$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"errer",manualClose:!0})})}}]};$(document).promptBox(t)},e.addBankCard=function(){e.addBankCardFrom.$setPristine(),e.addBankCardFrom.$setUntouched(),e.cardNo="",e.bank="",e.subbranch="",e.mobile="",e.verCode="",e.getVerCodeBtnText="获取验证码",e.lockVerCodeBtn=!1,e.timerHandler&&clearInterval(e.timerHandler),e.showAddCard=!0},e.saveBankCard=function(){if(e.cardNo||e.addBankCardFrom.cardNo.$setDirty(),e.bank||e.addBankCardFrom.bank.$setDirty(),e.subbranch||e.addBankCardFrom.subbranch.$setDirty(),e.mobile||e.addBankCardFrom.mobile.$setDirty(),e.verCode||e.addBankCardFrom.verCode.$setDirty(),e.addBankCardFrom.$valid&&!$("#remote-verCode-error").hasClass("remote-invalid")&&!$("#remote-cardNo-error").hasClass("remote-invalid")){var r={urlParams:{cardNo:e.cardNo,bank:e.bank,bankClsCode:e.bankCode,subbranch:e.subbranch,bankNo:e.subbranchValue,mobile:e.mobile,validateCode:e.verCode,thirdPayAccountId:e.thirdPayAccountId}};a.saveBankCard(r,function(a){a.thirdMsg=a.data&&a.data.rspMsg?a.data.rspMsg:a.msg,0===a.errorCode?(e.showAddCard=!1,e.getBankCardList(),$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"errer",manualClose:!0})})}},e.sendSms=function(){if(e.mobile&&!e.lockVerCodeBtn){var r={urlParams:{mobilePhone:e.mobile}};a.sendSms(r,function(a){0===a.errorCode?(e.lockVerCodeBtn=!0,e.count=60,e.getVerCodeBtnText=e.count+"s",e.timerHandler=setInterval(function(){--e.count,e.count?e.getVerCodeBtnText=e.count+"s":(e.lockVerCodeBtn=!1,e.getVerCodeBtnText="获取验证码",e.timerHandler&&clearInterval(e.timerHandler)),e.$apply()},1e3)):$(document).promptBox({isDelay:!0,contentDelay:a.data,type:"errer",manualClose:!0})})}},e.ansycVerCode=function(){if(e.verCode&&e.mobile){var r={urlParams:{phoneNo:e.mobile,validateCode:e.verCode}};a.ansycVerCode(r,function(a){0===a.errorCode?(e.addBankCardFrom.verCode.errorTips="",$("#remote-verCode-error").addClass("ng-hide").removeClass("remote-invalid")):(e.addBankCardFrom.verCode.errorTips=a.msg,$("#remote-verCode-error").removeClass("ng-hide").addClass("remote-invalid"))})}},e.ansycCardNo=function(){if(e.cardNo){var r={urlParams:{cardNo:e.cardNo}};a.ansycCardNo(r,function(a){0===a.errorCode?(e.addBankCardFrom.cardNo.errorTips="",$("#remote-cardNo-error").addClass("ng-hide").removeClass("remote-invalid")):(e.addBankCardFrom.cardNo.errorTips=a.msg,$("#remote-cardNo-error").removeClass("ng-hide").addClass("remote-invalid"))})}},e.getBankList=function(){e.bankData||a.getBankList(function(a){e.bankData=a}),e.bankData&&selectFactory({data:{data:e.bankData},defaultText:"请选择",id:"select-bank",defaultCount:1e4,showTextField:"name",attrTextModel:function(a,r,t){e.bank=a,e.bankCode=t.code||"",e.subbranch=e.subbranchValue="",o&&o.clearData(),Select.sharePool["select-subbranch"]=null,e.$apply()}}).open()};var o;e.getSubbranchList=function(){o||(o=selectFactory({data:[],isSearch:!0,defaultText:"请选择",id:"select-subbranch",showTextField:"bankName",closeLocalSearch:!0,pagination:!0,searchPlaceHoder:Lang.getValByKey("common","common_select_search_tips"),onSearchValueChange:function(r,t,o){if(e.bankCode){var n={urlParams:{q:t||"",pageIndex:o||1,pageSize:10,bankClsCode:e.bankCode}};a.getSubbranchList(n,function(e){0===e.errorCode&&r.setData(e)})}},attrTextModel:function(a,r,t){e.subbranch=t.bankName||"",e.subbranchValue=t.bankNo||"",e.$apply()}}),o.open())},e.verifyAccount=function(a){e.tranAmount="",e.verifyAccountForm.$setPristine(),e.verifyAccountForm.$setUntouched(),e.currentVerifyAccount=a,e.showVerifyAccount=!0},e.confirmVerifyAccount=function(){if(e.tranAmount||e.verifyAccountForm.tranAmount.$setDirty(),e.verifyAccountForm.$valid){var r={urlParams:{cardNo:e.currentVerifyAccount.cardNo,thirdPayAccountId:e.thirdPayAccountId,amount:e.tranAmount}};a.confirmVerifyAccount(r,function(a){a.thirdMsg=a.data&&a.data.rspMsg?a.data.rspMsg:a.msg,0===a.errorCode?(e.showVerifyAccount=!1,e.getBankCardList(),$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"success"})):$(document).promptBox({isDelay:!0,contentDelay:a.thirdMsg,type:"errer",manualClose:!0})})}},e.goBack=function(){e.$parent.block="accountDetail",t.dispatch("accountDetailData",{thirdPayAccountId:e.thirdPayAccountId})}}]);
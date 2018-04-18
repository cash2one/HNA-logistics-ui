app.factory("fundsAccountService",["easyHttp",function(t){var n={};return n.digital=function(t){var n=parseFloat(t);return n=isNaN(n)?0:n},n.dealNumber=function(t){var n;if(t&&null!=t){t=String(t);var e=t.split(".")[0],i=t.split(".")[1];i=i?i.length>=2?"."+i.substr(0,2):"."+i+"0":".00";var r=e.split("").reverse().join("").match(/(\d{1,3})/g);n=(Number(t)<0?"-":"")+r.join(",").split("").reverse().join("")+i}else n=0===t?"0.00":"";return n},n.getAccountManagerList=function(n,e){return t.get("logistics.getAccountManagerList",n,e)},n.getCustomerId=function(n,e){return t.get("logistics.getCustomerId",n,e)},n.openAccountManager=function(n,e){return t.get("logistics.openAccountManager",n,e)},n.getAccountInfo=function(n,e){return t.get("logistics.getAccountInfo",n,e)},n.getAccountBank=function(n,e){return t.get("logistics.getAccountBank",n,e)},n.getBankCardList=function(n,e){return t.get("logistics.getBankCardList",n,e)},n.getBankVerdCardList=function(n,e){return t.get("logistics.getBankVerdCardList",n,e)},n.getRechargeInfo=function(n){t.get("logistics.submitRecharge",n)},n.unbundledBankCard=function(n,e){return t.get("logistics.unbundledBankCard",n,e)},n.sendSms=function(n,e){return t.get("logistics.sendSmsOnBankModel",n,e)},n.getBankList=function(n){return t.get("logistics.getBankList",n)},n.getSubbranchList=function(n,e){return t.get("logistics.getSubbranchList",n,e)},n.ansycVerCode=function(n,e){return t.get("logistics.ansycVerCode",n,e)},n.saveBankCard=function(n,e){return t.post("logistics.saveBankCard",n,e)},n.getFeeCheck=function(n,e){return t.post("logistics.getFeeCheck",n,e)},n.confirmVerifyAccount=function(n,e){return t.post("logistics.confirmVerifyAccount",n,e)},n.getBussinessRecordDetail=function(n,e){return t.get("logistics.getBussinessRecordDetail",n,e)},n.submitRecharge=function(n,e){return t.post("logistics.submitRecharge",n,e)},n.getSignature=function(n,e){return t.post("logistics.getSignature",n,e)},n.ansycCardNo=function(n,e){return t.get("logistics.ansycCardNo",n,e)},n.getTransPassSignature=function(n,e){return t.get("logistics.getTransPassSignature",n,e)},n.getPaymentSignature=function(n,e){return t.post("logistics.getPaymentSignature",n,e)},n.paymentCallback=function(n,e){return t.post("logistics.paymentCallback",n,e)},n.withdrawCallback=function(n,e){return t.post("logistics.withdrawCallback",n,e)},n}]);
app.factory("contractTemplateDetailView",["contractTemplateDetailService",function(t){return{initStateSelect:function(e){var a=t.getContractType();selectFactory({data:a,id:"serviceType",showTextField:"message",defaultText:null,attrTextModel:function(t,a,n){t?(e.serviceType=n.message,e.serviceTypeCode=n.code):(e.serviceType=null,e.serviceTypeCode=null),e.$apply()}})},bindEvent:function(e){e.setCheckBox=function(t){var a=t.target,n=a.checked;e.generateContractImm=!!n},e.goBack=function(){top.location.href="http://"+location.host+"#/contractTemplates"},e.edit=function(){e.isEdit=!e.isEdit,$(".w-e-text").attr("contenteditable","true")},e.GenerateContract=function(){top.location.href="http://"+location.host+"#/contractDetail?tempId="+e.id},e.checkTemplateNameUnique=function(){var a={id:e.id,name:e.templateName};t.checkTemplateNameUnique(a,function(t){0==t.errorCode&&(e.showTemplateNameExist=t.data)})},e.clearTemplateUniqueErr=function(){e.showTemplateNameExist=!1},e.saveContractTemplate=function(){function a(t,a){a(t,function(t){0!=t.errorCode?$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0}):(e.id=t.data,e.isEdit=!e.isEdit,e.editContractTitle=!1,$(".w-e-text").attr("contenteditable","false"),$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"success",time:3e3}),e.generateContractImm&&setTimeout(function(){top.location.href="http://"+location.host+"#/contractDetail?tempId="+e.id},1e3))})}if(!function(){e.serviceType||e.contractTemplate.serviceType.$setDirty(),e.templateName||e.contractTemplate.templateName.$setDirty(),e.contractorTitle||e.contractTemplate.contractorTitle.$setDirty();for(var t=$(".errors"),a=0;a<t.length;a++)if(!$(t[a]).hasClass("ng-hide"))return!1;return!!e.contractTemplate.$valid}())return void scrollToErrorView($(".main"));var n={serviceType:e.serviceTypeCode,name:e.templateName,title:e.contractorTitle,content:$(".w-e-text").html(),firstContractorDto:{name:e.partAName,address:e.partAAddr,contact:e.partAPhone,bankAccount:e.partABankAccount,bankName:e.partABankName},secondContractorDto:{name:e.partBName,address:e.partBAddr,contact:e.partBPhone,bankAccount:e.partBBankAccount,bankName:e.partBBankName},id:e.id};if(n.content&&-1!=n.content.indexOf("<style")){var o=n.content.indexOf("<style"),c=n.content.indexOf("</style>"),r=n.content.slice(0,o),i=n.content.slice(c+8);n.content=r+i}0==e.id?a(n,t.saveContractTemplate):a(n,t.updateContractTemplate)}}}}]);
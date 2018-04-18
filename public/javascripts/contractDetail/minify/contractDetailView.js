app.factory("contractDetailView",["contractDetailService",function(t){return{initStateSelect:function(e){function a(a,n){n||(n=1);var o={name:a||"",pageIndex:n,pageSize:10,serviceType:e.serviceTypeCode},a=t.getContractTemplateByType(o);return a}var n=selectFactory({data:[],id:"templateName",isSearch:!0,closeLocalSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),isSaveInputVal:!0,pagination:!0,onSearchValueChange:function(t,e,o){var r=a(e,o);n.setData(r)},attrTextModel:function(a,n,o){a?(e.contractTemplateId=o.id,t.getContractTemplateById(e.contractTemplateId,function(t){if(0==t.errorCode){var a=t.data;e.contractorTitle=a.title,e.templateName=a.name,e.serviceTypeCode=a.serviceType,e.serviceType=a.serviceTypeName,$(".w-e-text").html(a.content),e.partAName=a.firstContractorDto.name,e.partAAddr=a.firstContractorDto.address,e.partAPhone=a.firstContractorDto.contact,e.partABankAccount=a.firstContractorDto.bankAccount,e.partABankName=a.firstContractorDto.bankName,e.partBName=a.secondContractorDto.name,e.partBAddr=a.secondContractorDto.address,e.partBPhone=a.secondContractorDto.contact,e.partBBankAccount=a.secondContractorDto.bankAccount,e.partBBankName=a.secondContractorDto.bankName}})):e.contractTemplateId=null,e.$apply()}}),o=t.getContractType();selectFactory({data:o,id:"serviceType",showTextField:"message",defaultText:null,attrTextModel:function(t,a,o){t?(e.serviceType!=o.message&&e.editContractTitle&&(n.setData({}),e.templateName="",e.contractTemplate.templateName.$setPristine()),e.serviceType=o.message,e.serviceTypeCode=o.code):e.serviceTypeCode=null,e.$apply()}})},bindEvent:function(e){e.getContractTemplateList=function(){if(e.serviceTypeCode){var a={serviceType:e.serviceTypeCode};t.getContractTemplateByType(a,function(t){0!=t.errorCode?Select.sharePool.templateName.setData([]):Select.sharePool.templateName.setData(t)})}else Select.sharePool.templateName.setData([])},e.goBack=function(){e.tempId?top.location.href="http://"+location.host+"#/contractTemplateDetail?id="+e.tempId:top.location.href="http://"+location.host+"#/contracts"},e.edit=function(){e.isEdit=!e.isEdit,$(".w-e-text").attr("contenteditable","true")},e.saveDraftContract=function(){e.saveStatue=1,e.saveContract()},e.GenerateContract=function(){e.saveStatue=2,e.saveContract()},e.saveContract=function(){function a(t,a){a(t,function(t){if(0!=t.errorCode){if(403==t.errorCode)return;$(document).promptBox({isDelay:!0,contentDelay:t.msg,type:"errer",manualClose:!0})}else{var a=t.data,n=t.msg;e.editContractTitle=!1,e.id=a.id,$(document).promptBox({isDelay:!0,contentDelay:n,type:"success",time:3e3}),2==e.saveStatue?(e.contractStatus=2,e.fileUrl=a.fileUrl):(e.contractStatus=1,e.isEdit=!e.isEdit,$(".w-e-text").attr("contenteditable","false"))}})}if(function(){e.serviceType||e.contractTemplate.serviceType.$setDirty(),e.templateName||e.contractTemplate.templateName.$setDirty(),e.contractorTitle||e.contractTemplate.contractorTitle.$setDirty(),e.contractTemplate.$valid||scrollToErrorView($(".contract-detail-main"));for(var t=$(".errors"),a=0;a<t.length;a++)if(!$(t[a]).hasClass("ng-hide"))return!1;return!!e.contractTemplate.$valid}()){var n={serviceType:e.serviceTypeCode,name:e.templateName,title:e.contractorTitle,content:$(".w-e-text").html(),firstContractorDto:{name:e.partAName,contact:e.partAPhone,address:e.partAAddr,bankAccount:e.partABankAccount,bankName:e.partABankName},secondContractorDto:{name:e.partBName,address:e.partBAddr,contact:e.partBPhone,bankAccount:e.partBBankAccount,bankName:e.partBBankName},id:e.id,status:e.saveStatue,templateName:e.templateName};if(n.content&&-1!=n.content.indexOf("<style")){var o=n.content.indexOf("<style"),r=n.content.indexOf("</style>"),c=n.content.slice(0,o),i=n.content.slice(r+8);n.content=c+i}0==e.id?a(n,t.saveContract):a(n,t.updateContract)}}}}}]);
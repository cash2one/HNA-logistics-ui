app.factory("goodsdesView",["$http","$templateCache",function(t,e){function o(){return"?a="+Math.random()}var n={};return n.getTpl=function(n){return t.get("/tpl/fragment/goodsdes/"+n+".html"+o()).then(function(t){if(t.data)return e.put(n+".html",t.data),t.data})},n.createSelect=function(t,e,o,n,r){var a={data:e,id:t,offset:-300,attrTextModel:o};if(n&&(a.isSearch=!0,a.multipleSign=",",a.defaultText="请选择",a.isSaveInputVal=!0,a.isUsePinyin=!0,a.closeLocalSearch=!0),r&&(a.onSearchValueChange=r),billCreationService[t])return billCreationService[t].setData(e),void billCreationService[t].open();r?billCreationService[t]=selectFactory(a):console.log(a),selectFactory(a)},n.promptBox=function(t){var e={isDelay:!0,contentDelay:t.msg,time:3e3};0==t.errorCode?e.type="success":(e.manualClose=!0,e.type="errer"),doc.promptBox(e),!e.time||doc.promptBox("closePrompt")},n.promptMidBox=function(t,e,o,n){doc.promptBox({title:t||"提示信息",type:"success",width:"400px",content:{tip:e.msg},operation:[{type:"submit",description:o||Lang.getValByKey("common","common_pagination_confirm"),operationEvent:function(){return n(),$(document).promptBox("closePrompt"),!1}}]})},n}]);
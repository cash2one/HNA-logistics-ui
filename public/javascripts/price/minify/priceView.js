app.factory("priceView",[function(){var e={};return e.lockBtn=function(){$("#delete").attr("disabled","true"),$("#submitVerify").attr("disabled","true"),$("#delete").addClass("disabled"),$("#submitVerify").addClass("disabled")},e.unlockBtn=function(){$("#delete").removeAttr("disabled"),$("#submitVerify").removeAttr("disabled"),$("#delete").removeClass("disabled"),$("#submitVerify").removeClass("disabled")},e.check=function(){for(var t=!1,a=$(".checkbox"),n=0;n<a.length;n++)if(a[n].checked){var c=$(a[n]).attr("data-status");if(c!=Lang.getValByKey("price","price_draft")){t=!0,e.lockBtn();break}}t||e.unlockBtn()},e.bindEvent=function(){var t=setInterval(function(){$(".tbody").length>0&&(clearInterval(t),t=null,$(".tbody").delegate(".checkbox","change",function(){e.check()}),$("#select-all").on("change",function(){e.check()}))},100)},e}]);
app.factory("confirmOrderView",[function(){return{questionMarkHover:function(){$("#questionMark").hover(function(){$("#questionMark_div").css("display","block")},function(){$("#questionMark_div").css("display","none")})},switchList:function(){$(".label-text").on("click",function(){var o={none:"block",block:"none"},i=$(this).siblings().css("display");$(this).siblings().css("display",o[i]),"block"==o[i]?$(this).find("i").css("transform","rotate(-90deg)"):$(this).find("i").css("transform","rotate(90deg)")})},switchStatus:function(o,i,n){var s={origin:"oPlace",destination:"dPlace",accept:"aPlace"},e=$("#"+s[i]).find(".address");if(n)return o[s[i]+"ListShow"]=!1,$("#"+s[i]+"Btn").html(Lang.getValByKey("confirmOrder","confirmOrder_page_oPlaceContracts_open")),$(e).css("display","none"),void $($(e)[o[s[i]+"Index"]]).css("display","inline-block");o[s[i]+"ListShow"]=!o[s[i]+"ListShow"],o[s[i]+"ListShow"]?($(e).css("display","inline-block"),$("#"+s[i]+"Btn").html(Lang.getValByKey("confirmOrder","confirmOrder_page_oPlaceContracts_close"))):($("#"+s[i]+"Btn").html(Lang.getValByKey("confirmOrder","confirmOrder_page_oPlaceContracts_open")),$(e).css("display","none"),$($(e)[o[s[i]+"Index"]]).css("display","inline-block"))},toggleList:function(o,i){o.orderInfo.orderLogistics[i].isShow=!o.orderInfo.orderLogistics[i].isShow,o.orderInfo.orderLogistics[i].isShow?$("#icon"+i).removeClass("icon_open").addClass("icon_close"):$("#icon"+i).removeClass("icon_close").addClass("icon_open")},remainWord:function(o){o.remainWords=140-$("#customerMessageBox").val().length},bindEvent:function(){this.questionMarkHover(),this.switchList()}}}]);
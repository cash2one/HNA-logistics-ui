app.factory("historyRateView",[function(){function e(e){for(var i=0;i<a.length;i++)e!=a[i]&&$(".ui-datepicker").removeClass(a[i])}function i(){for(var e=0;e<a.length;e++)if($(".ui-datepicker").hasClass(a[e]))return $(n[e]);return null}var t={},a=["begin-time-canlander","finish-time-canlander","start-time-canlander","end-time-canlander"],n=["#begin-time","#finish-time","#start-time","#end-time"],m="",r="",s="",d="2100-01-01 00:00:00";return t.initCalander=function(t){$("#begin-time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:!0,changeYear:!0,changeMonth:!0,maxDate:d,showOtherMonths:!0,beforeShow:function(){r=$("#begin-time").val(),$("#finish-time").val()&&($("#begin-time").datetimepicker("option","maxDate",$("#finish-time").val()),$("#begin-time").val(r)),$(".ui-datepicker").css("visibility","visible"),$(".ui-datepicker").removeClass("canlander2"),$(".ui-datepicker").addClass("canlander"),e("begin-time-canlander"),$(".ui-datepicker").addClass("begin-time-canlander")},onSelect:function(e){var i=new Date(e).getTime(),t=new Date($("#finish-time").val()).getTime();t<i?($("#begin-time").val(new Date(t).format("yyyy-MM-dd hh:mm:ss")),$("#begin-time").datetimepicker("refresh"),r=$("#begin-time").val()):r=e},onClose:function(){$("#begin-time").val(r)}}),$("#finish-time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:!0,changeYear:!0,changeMonth:!0,maxDate:d,beforeShow:function(){s=$("#finish-time").val(),$("#begin-time").val()&&$("#finish-time").datetimepicker("option","minDate",$("#begin-time").val()),$(".ui-datepicker").css("visibility","visible"),$(".ui-datepicker").removeClass("canlander2"),$(".ui-datepicker").addClass("canlander"),e("finish-time-canlander"),$(".ui-datepicker").addClass("finish-time-canlander")},onSelect:function(e){var i=new Date($("#begin-time").val()).getTime();new Date(e).getTime()<i?($("#finish-time").val(new Date(i).format("yyyy-MM-dd hh:mm:ss")),$("#finish-time").datetimepicker("refresh"),s=$("#finish-time").val()):s=e},onClose:function(){$("#finish-time").val(s)}}),$("#start-time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:!0,changeYear:!0,changeMonth:!0,maxDate:d,beforeShow:function(){startTime=$("#start-time").val(),$("#end-time").val()&&($("#start-time").datetimepicker("option","maxDate",$("#end-time").val()),$("#start-time").val(startTime)),$(".ui-datepicker").css("visibility","visible"),$(".ui-datepicker").removeClass("canlander"),$(".ui-datepicker").addClass("canlander2"),e("start-time-canlander"),$(".ui-datepicker").addClass("start-time-canlander")},onSelect:function(e){var i=new Date(e).getTime(),t=new Date($("#end-time").val()).getTime();t<i?($("#start-time").val(new Date(t).format("yyyy-MM-dd hh:mm:ss")),$("#start-time").datetimepicker("refresh"),startTime=$("#start-time").val()):startTime=e},onClose:function(){$("#start-time").val(startTime)}}),$("#end-time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:!0,changeYear:!0,changeMonth:!0,maxDate:d,beforeShow:function(i){if(m=$("#end-time").val(),$("#start-time").val()&&$("#end-time").datetimepicker("option","minDate",$("#start-time").val()),$("#end-time").val()==d&&t.isEdit)return void $(".ui-datepicker").css("visibility","hidden");$(".ui-datepicker").css("visibility","visible"),$("#end-time").val(""),$(".ui-datepicker").removeClass("canlander"),$(".ui-datepicker").addClass("canlander2"),e("end-time-canlander"),$(".ui-datepicker").addClass("end-time-canlander")},onSelect:function(e){var i=new Date($("#start-time").val()).getTime();new Date(e).getTime()<i?($("#end-time").val(new Date(i).format("yyyy-MM-dd hh:mm:ss")),$("#end-time").datetimepicker("refresh"),m=$("#end-time").val()):m=e},onClose:function(){$("#end-time").val(m)}}),$(window).resize(function(){var e=i();if(e&&e.length>0){$(".ui-datepicker").offset({left:e.offset().left})}})},t}]);
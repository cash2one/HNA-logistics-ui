app.factory("tryBillingView",[function(){var n={};return n.initCalander=function(){$("#begin-time").datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",showSecond:!0,changeYear:!0,changeMonth:!0,maxDate:"2100-01-01 00:00:00",beforeShow:function(){},onChangeMonthYear:function(){},onSelect:function(n){},onClose:function(){}})},n}]);
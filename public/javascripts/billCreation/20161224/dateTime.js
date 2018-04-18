
app.directive('hnaDateTime', function (){
    return  {
        restrict:'EA',
        link: function (scope,elm,attrs) {
            $(elm).datetimepicker({
	            timeFormat: "HH:mm:ss",
	            dateFormat: "yy-mm-dd",
	            showSecond: true,
	            changeYear: true,
	            changeMonth: true,
	            maxDate: '',
	            beforeShow: function(date) {},
	            onChangeMonthYear: function() {
	  
	            },
	            onSelect: function(date) {
	                
	            },
	            onClose: function() {
	                
	            }
	        });
        }
    };
})

.directive("changeStatus", function(){
		return {
			link : function(scope,elm,attrs){
				var val = attrs.changeStatus;
				if(scope.statusList){
					scope.statusList.data.forEach(function(item){
							if(item.code == val) elm.text(item.name);
					});
				}
			}
		}
});
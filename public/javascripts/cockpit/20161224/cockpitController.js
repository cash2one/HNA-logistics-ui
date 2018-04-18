easySpa.require([
	'public/lib/echarts.min.js',
	'public/javascripts/fragment/cockpit/cumulativeStatics.js',
	'public/javascripts/fragment/cockpit/staticsRank.js',
	'public/javascripts/fragment/cockpit/weeklyStatics.js',
	'public/javascripts/fragment/cockpit/tradeIndicator.js',
	'public/javascripts/fragment/cockpit/latestOrder.js',
	'widget/select',
    'public/common/calander.js'
], function(){
	app.controller('cockpitCtrl', [
		'$scope',
		'$route',
		'cockpitService',
		'cockpitView',
		function($scope, $route, cockpitService, cockpitView){
			$scope.businessStatics = $route.current.params.from ? false : true;
			var _count = 0;
			$scope.switchTab = function(name){
				if($scope.businessStatics && name !== 'businessStatics'){ //切换至指标监控
					$scope.businessStatics = false;
					if(_count === 0){
						_count = 1;
						$scope.$broadcast('changeToIndicator', {});
					}
				}else if(!$scope.businessStatics && name === 'businessStatics'){ //切换至业务统计
					$scope.businessStatics = true;
				}else{
					return;
				}
			}
		}
	]);
});

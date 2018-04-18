easySpa.require([
	'widget/slimscroll',
	'widget/prompt',
	'public/common/tableController.js'
], function(){
	app.controller('balanceManagementCtrl', [
		'$scope', 
		'$route', 
		'balanceManagementService', 
		'balanceManagementView', 
		'tableService', 
		function($scope, $route, balanceManagementService, balanceManagementView, tableService) {
			$scope.isManageBalance = false;
			$scope.confirmPrompt = false;
			$scope.userType = 1;  //默认为物流客户
			$scope.visible = true;
			$scope.transactionBalance = "";
			$scope.paymentPassword = "";
			$scope.tableModel = {
				tableBody: [],
				restURL: 'logistics.getLogisticAccountInfo',
				restData: {
					q: '',
					isAsc: false,
					pageIndex: 1,
					pageSize: 10,
					userType: $scope.userType
				}
			};

			$(window).on('resize', setScrollDetail);

            function setScrollDetail() {
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 250
                });
            };

			$scope.loadListData = function() {
				var params = {
					urlParams: $scope.tableModel.restData
				};
				tableService.getTable($scope.tableModel.restURL, params, function(res){
					if(res.errorCode === 0){
						$scope.tableModel = tableService.table($scope.tableModel, params, res);
						setTimeout(function() {
							setScrollDetail();
	                        $scope.$apply();
	                    }, 500);
					}
				});
			};

			$scope.loadListData();


			$scope.manageBalance = function(item){
                item.totalBalance = item.totalBalance ? parseFloat(item.totalBalance).toFixed(2) : '0.00';
                balanceManagementService.isNeedPassword(function(res){
					if(res.errorCode === 0 && !res.data){
						$scope.isManageBalance = true;
						$scope.manageBalanceData = item;
						balanceManagementService.isLogisticAccountLocked(function(res){
							if(res.errorCode !== 0){
								$scope.ErrorPayPwd = true;
								angular.element($("#ErrorPayPwd")).html(res.msg);
								angular.element($("#transactionBalance, #paymentPassword, #confirmBalance")).attr("disabled","disabled");
							}
						});
					}else{
		                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("balanceManagement", 'balance_set_password'), type: 'errer', manualClose:true});
					}
				});
			};

			/*
			*余额操作类型(充值&减值)
			$scope.add = 'a';
			$scope.decrease = false;
			$scope.operationType = 'a';
			$scope.setOperationAdd = function(){
				$scope.add = 'a';
				$scope.decrease = false;
				$scope.operationType = 'a';
			}
			$scope.setOperationDecrease = function(){
				$scope.add = false;
				$scope.decrease = 'd';
				$scope.operationType = 'd';
			}*/

			/*充值金额计算*/
			$scope.calTransction = function(){
				if($scope.balanceOperation){
					var temp = $scope.manageBalanceData.totalBalance * 1 + $scope.transactionBalance * 1;
					$scope.totalBalance = temp.toFixed(2);
				}
			}

			$scope.ErrorPayPwd = false;

			$scope.confirmBalance = function(){
				if(!$scope.transactionBalance){
					$scope.balanceOperation.transactionBalance.$setDirty();
				}
				if(!$scope.paymentPassword){
					$scope.balanceOperation.paymentPassword.$setDirty();
				}
				if(!$scope.balanceOperation.$valid){
					return;
				}
				balanceManagementService.verifyPayPwd({
					urlParams: {
						oldPassword: $scope.paymentPassword
					}
				},function(res){
					if(res.errorCode === 0){
					    $scope.transactionBalance = parseFloat($scope.transactionBalance).toFixed(2);
						$scope.confirmPrompt = true;
					}else{
						$scope.ErrorPayPwd = true;
						angular.element($("#ErrorPayPwd")).html(res.msg);
						if(res.errorCode !== 127319){
							angular.element($("#transactionBalance, #paymentPassword, #confirmBalance")).attr("disabled","disabled");
						}
					}
				});
			};
			$scope.saveBalance = function(){
				var params = {
					urlParams: {
						id: $scope.manageBalanceData.id,
						password: $scope.paymentPassword,
						thirdId: $scope.manageBalanceData.thirdId,
						thirdType: $scope.manageBalanceData.thirdType,
						totalBalance: $scope.totalBalance * 1,
						transactionBalance: $scope.transactionBalance * 1,
						transactionType: 0
					}
				}
				balanceManagementService.logisticAccountRecharge(params, function(res){
					$scope.confirmPrompt = false;			
					if(res.errorCode === 0){
						$scope.rechargeSuccess = true;
					}else{
						$scope.rechargeFailed = true;
						$scope.failedMsg = res.msg;
					}
				});
			};
			$scope.cancelBalance = function(){
				$scope.confirmPrompt = false;
			};

			$scope.goBack = function(){
				window.location.reload();
			};

			$scope.gotIt = function(){
				window.location.reload();
			};
			/*搜索*/
			$scope.balanceSearch = function(){
				$scope.q = $scope.tableModel.restData.q;
				$scope.tableModel.restData.pageIndex = 1;
				$scope.loadListData();
			};
	}]);
});

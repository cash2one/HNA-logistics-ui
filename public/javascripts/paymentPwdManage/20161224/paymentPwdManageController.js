easySpa.require([
	'widget/prompt'
], function(){
	app.controller('paymentPwdManageCtrl', [
		'$scope', 
		'$route',
		'paymentPwdManageService', 
		'paymentPwdManageView', 
		function($scope, $route, paymentPwdManageService, paymentPwdManageView) {
			function init() {
				angular.element($(".tip-box")).remove();
				$scope.setPwd = "";
				$scope.setPwdConfirm = "";
				$scope.resetPwdConfirm = "";
				$scope.updatePayPwd = "";
				$scope.updatePayPwdConfirm = "";
				$scope.setPwdContainer = true;
				$scope.ErrorPayPwd = false;
				$scope.resetProgress = 1;
				$scope.errorPasswordCount = 0;
                $scope.setPasswordSuccess = "重置成功";
				paymentPwdManageService.isNeedPassword(function(res){
					if(res.errorCode === 0){
						if(res.data){
                            $scope.setPassword = true;
                        }else{
							$scope.setPassword = false;
                            paymentPwdManageService.isLogisticAccountLocked(function(res){
                                if(res.errorCode !== 0){
                                    $scope.ErrorPayPwd = true;
                                    angular.element($("#ErrorPayPwd")).html(res.msg);
                                    angular.element($("#resetPwdConfirm, .next-step")).attr("disabled","disabled");
                                }
                            });
						}
					}
				});
			};

			init();

			function initPwdStrength() {
				var O_color = "#eeeeee";
				document.getElementById("strength_L").style.background = O_color;
				document.getElementById("strength_M").style.background = O_color;
				document.getElementById("strength_H").style.background = O_color;
			}

			/*检验密码强度*/
			$scope.checkPwdStrength = function() {
				var setPwd = $scope.setPwd,
					O_color = "#eeeeee",
					L_color = "#A7DFF4",
					M_color = "#6CC7E9",
					H_color = "#3BAFDA",
					level = 0,
					mode = 0,
					Lcolor,
					Mcolor,
					Hcolor;
				$scope.ExistNoSupWord = false;

				if(setPwd == null || setPwd == '' || setPwd == undefined){
					Lcolor = Mcolor = Hcolor = O_color;
					mode = 0;
				}else{
					for(var index = 0; index < setPwd.length; index++){
						var charMode,
							singleWord = setPwd.charAt(index),
							regSpecial = /[!@#&()_+,./\\^]+/,
                			regNumber = /[0-9]+/,
                			regLowercase = /[a-z]+/,
                			regCapital = /[A-Z]+/;
                		//判断输入密码的类型
                		if(regNumber.test(singleWord)){  //数字
                			charMode = 1;
                		}else if(regCapital.test(singleWord)){  //大写
                			charMode = 2;
                		}else if(regLowercase.test(singleWord)){  //小写
                			charMode = 4;
                		}else if(regSpecial.test(singleWord)){  //特殊字符
                			charMode = 8;
                		}else{  //不支持的字符
                			$scope.ExistNoSupWord = true;
                			initPwdStrength();
                			return;
                		}

                		mode |= charMode;
                		var typeNum = CalcLevel(mode);
					}
					if( typeNum== 0 || setPwd.length >18){
	                    Lcolor = Mcolor = Hcolor = O_color;
	                    $scope.passWordLevel = 'original';
	                }else if(setPwd.length < 6 || (typeNum <= 2) ){
	                    Lcolor = L_color;
	                    Mcolor = Hcolor = O_color; ///低优先级
	                    $scope.passWordLevel = 'low';
	                }else if((setPwd.length >=6 && setPwd.length <=9 && typeNum == 3) ||
	                    (setPwd.length >=6 && setPwd.length <=7 && typeNum == 4)){
	                    Lcolor = Hcolor = O_color;
	                    Mcolor = M_color; ///中级
	                    $scope.passWordLevel = 'normal';
	                }else if((setPwd.length >=10 && setPwd.length <=18 && typeNum == 3) ||
	                    (setPwd.length >=8 && setPwd.length <=18 && typeNum == 4))
	                {
	                    Hcolor = H_color; ///高级
	                    Lcolor = Mcolor = O_color;
	                    $scope.passWordLevel = 'high';
	                }else{
	                    Lcolor = Mcolor = Hcolor = O_color;
	                    $scope.passWordLevel = 'original';
	                }
				}
				document.getElementById("strength_L").style.background = Lcolor;
	            document.getElementById("strength_M").style.background = Mcolor;
	            document.getElementById("strength_H").style.background = Hcolor;
			};

			function CalcLevel(mode) {
				var level = 0;
				for(var i = 0; i < 4; i++){
					if(mode & 1){
						level++;
					}
					mode >>>= 1;
				}
				return level;
			};

			$scope.checkPwd = function() {
				$scope.showPwLow = $scope.passWordLevel == 'low' ? true : false;
			};

			$scope.checkVerify = function() {
            	if($scope.showDiffErr = $scope.setPwdConfirm || $scope.setPwdConfirm){
                    $scope.showDiffErr = false;
				}else{
                    $scope.showDiffErr = true;
				}
			};

			$scope.initPwd = function() {
				if(!$scope.setPwd){
					$scope.setPwds.setPwd.$setDirty();
				}
				if(!$scope.setPwdConfirm){
					$scope.setPwds.setPwdConfirm.$setDirty();
				}
				if(!$scope.setPwds.$valid){
					return;
				}
				if($scope.passWordLevel == 'low' || $scope.passWordLevel == 'original'){
	                return;
	            }
	            if($scope.ExistNoSupWord) {
	                return;
	            }
	            if($scope.setPwd != $scope.setPwdConfirm){
	            	return;
	            }
				var param = {
					urlParams: {
						newPassword: $scope.setPwd,
						repeatPassword: $scope.setPwdConfirm
					}
				};
				paymentPwdManageService.initPaymentPwd(param, function(res){
                    $scope.setSuccessTxt = res.msg;
                    $scope.setPwdContainer = false;
					if(res.errorCode === 0){
                        $scope.setSuccess = true;
					}else{
                        $scope.setSuccess = false;
                    }
				});
			};

			$scope.goToReset = function() {
				window.location.reload();
			};

			/*验证财务密码*/
			$scope.checkPaymentPwd = function() {
				if(!$scope.resetPwdConfirm){
					$scope.resetPwd.resetPwdConfirm.$setDirty();
					return;
				}
                paymentPwdManageService.verifyPayPwd({
					urlParams: {
                        oldPassword: $scope.resetPwdConfirm
					}
				}, function(res){
                    if(res.errorCode === 0){
                        $scope.ErrorPayPwd = false;
                        $scope.resetProgress = 2;
                    }else{
                        $scope.ErrorPayPwd = true;
                        angular.element($("#ErrorPayPwd")).html(res.msg);
                        if(res.errorCode !== 127319){
                            angular.element($("#resetPwdConfirm, .next-step")).attr("disabled","disabled");
                        }
                    }
                });
			};

			function initUpdatePwdStrength() {
				var O_color = "#eeeeee";
				document.getElementById("reset_strength_L").style.background = O_color;
				document.getElementById("reset_strength_M").style.background = O_color;
				document.getElementById("reset_strength_H").style.background = O_color;
			}

			/*检验新密码强度*/
			$scope.checkUpddateStrength = function() {
				var setPwd = $scope.updatePayPwd,
					O_color = "#eeeeee",
					L_color = "#A7DFF4",
					M_color = "#6CC7E9",
					H_color = "#3BAFDA",
					level = 0,
					mode = 0,
					Lcolor,
					Mcolor,
					Hcolor;
				$scope.updateExistNoSupWord = false;

				if(setPwd == null || setPwd == '' || setPwd == undefined){
					Lcolor = Mcolor = Hcolor = O_color;
					mode = 0;
				}else{
					for(var index = 0; index < setPwd.length; index++){
						var charMode,
							singleWord = setPwd.charAt(index),
							regSpecial = /[!@#&()_+,./\\^]+/,
                			regNumber = /[0-9]+/,
                			regLowercase = /[a-z]+/,
                			regCapital = /[A-Z]+/;
                		//判断输入密码的类型
                		if(regNumber.test(singleWord)){  //数字
                			charMode = 1;
                		}else if(regCapital.test(singleWord)){  //大写
                			charMode = 2;
                		}else if(regLowercase.test(singleWord)){  //小写
                			charMode = 4;
                		}else if(regSpecial.test(singleWord)){  //特殊字符
                			charMode = 8;
                		}else{  //不支持的字符
                			$scope.updateExistNoSupWord = true;
                			initUpdatePwdStrength();
                			return;
                		}

                		mode |= charMode;
                		var typeNum = CalcLevel(mode);
					}
					if( typeNum== 0 || setPwd.length >18){
	                    Lcolor = Mcolor = Hcolor = O_color;
	                    $scope.passWordLevel = 'original';
	                }else if(setPwd.length < 6 || (typeNum <= 2) ){
	                    Lcolor = L_color;
	                    Mcolor = Hcolor = O_color; ///低优先级
	                    $scope.passWordLevel = 'low';
	                }else if((setPwd.length >=6 && setPwd.length <=9 && typeNum == 3) ||
	                    (setPwd.length >=6 && setPwd.length <=7 && typeNum == 4)){
	                    Lcolor = Hcolor = O_color;
	                    Mcolor = M_color; ///中级
	                    $scope.passWordLevel = 'normal';
	                }else if((setPwd.length >=10 && setPwd.length <=18 && typeNum == 3) ||
	                    (setPwd.length >=8 && setPwd.length <=18 && typeNum == 4))
	                {
	                    Hcolor = H_color; ///高级
	                    Lcolor = Mcolor = O_color;
	                    $scope.passWordLevel = 'high';
	                }else{
	                    Lcolor = Mcolor = Hcolor = O_color;
	                    $scope.passWordLevel = 'original';
	                }
				}
				document.getElementById("reset_strength_L").style.background = Lcolor;
	            document.getElementById("reset_strength_M").style.background = Mcolor;
	            document.getElementById("reset_strength_H").style.background = Hcolor;
			};

			$scope.checkUpdatePwd = function() {
				$scope.showUpdatePwLow = $scope.passWordLevel == 'low' ? true : false;
			};
			$scope.checkResetVerify = function() {
				if($scope.updatePayPwd === $scope.updatePayPwdConfirm || !$scope.updatePayPwdConfirm){
                    $scope.showUpdateDiffErr = false;
				}else{
                    $scope.showUpdateDiffErr = true;
				}
			};
			/*更新财务密码*/
			$scope.updatePaymentPwd = function() {
				$scope.checkResetVerify();
				if(!$scope.updatePayPwd){
					$scope.updatePwd.updatePayPwd.$setDirty();
				}
				if(!$scope.updatePayPwdConfirm){
					$scope.updatePwd.updatePayPwdConfirm.$setDirty();
				}
				if(!$scope.updatePwd.$valid){
					return;
				}
				if($scope.passWordLevel == 'low' || $scope.passWordLevel == 'original'){
	                return;
	            }
	            if($scope.updateExistNoSupWord) {
	                return;
	            }
	            if($scope.updatePayPwd != $scope.updatePayPwdConfirm){
	            	return;
	            }
				var param = {
					urlParams: {
						newPassword: $scope.updatePayPwd,
						repeatPassword: $scope.updatePayPwdConfirm
					}
				};
				paymentPwdManageService.updatePaymentPwd(param, function(res){
					if(res.errorCode === 0){
						$scope.resetProgress = 3;
						$scope.resetSuccessTxt = "财务密码已重置成功！";
						$scope.resetSuccess = true;
					}else if(res.errorCode === 127311){
						window.location.reload();
					}else{
                        $scope.resetProgress = 3;
                        $scope.resetSuccessTxt = res.msg;
                        $scope.setPasswordSuccess = "重置失败";
                        $scope.resetSuccess = false;
					}
				});
			};

			/*忘记密码*/
			$scope.forgetPwd = function() {
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("paymentPwdManage", 'contact_admin'), type: 'errer', manualClose:false});
			}
	}]);
});











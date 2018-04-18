easySpa.require(["public/common/des.js"], function() {
    app.controller('loginCtrl', ['$scope', "$http", 'loginService', 'loginView', function($scope, $http, loginService, loginView) {
        loginView.showLoginTimeoutMsg();
        /*
         登录页面语言管理
         */
        $scope.langModel = {};
        $scope.langModel.langLibrary = Lang.langLibrary();
        $scope.langModel.showLangTxt = Lang.defaultTxt();
        $scope.langModel.showLangImg = Lang.getCurrentLanguage();
        $scope.langModel.switchLang = function(language) {
            Lang.switchLang(language);
            //需要重刷页面
            window.location.reload();
        };
        /*
         原始输入框提示信息
         */
        var oldTextTips = Lang.getValByKey("login", 'login_code_userNameTips'),
            oldPassTips = Lang.getValByKey("login", 'login_code_passWordTips'),
            oldLoginTips = Lang.getValByKey("login", 'login_code_login'),
            oldBacktrackTips = Lang.getValByKey("login", 'login_code_backtrack');
        $scope.loginModel = {
            "username":oldTextTips,
            "password":"",
            "passwordText":oldPassTips,
            "login":oldLoginTips,
            "backtrack":oldBacktrackTips,
            "buttonStatus": false,
            "slideNumber" : 0,
            "usernameError":false,
            "passwordError":false
        };

        /*
         用户名输入框事件处理
         */
        $scope.userFocus = function(){
            if($scope.loginModel.username != oldTextTips){
                return;
            }
            $scope.loginModel.username = "";
            angular.element($("#username")).css("color","#5d5c5c");
        };
        $scope.userBlur = function(){
            if($scope.loginModel.username){
                return;
            }
            $scope.loginModel.username = oldTextTips;
            angular.element($("#username")).css("color","#cad1da");
        };

        /*
         密码输入框事件处理
         */
        $scope.passFocus = function(){
            if($scope.loginModel.passwordText != oldPassTips){
                return;
            }
            angular.element($("#password-text")).css("display","none");
            angular.element($("#password")).css("display","block");
            $("#password").val("").focus();
        };
        $scope.passBlur = function(){
            if($scope.loginModel.password){
                return;
            }
            $scope.loginModel.passwordText = oldPassTips;
            angular.element($("#password-text")).css("display","block");
            angular.element($("#password")).css("display","none");
        };
        /*
         密码框右侧眼睛事件处理
         */
        $scope.eyeClose = true;
        $scope.eyeOpen = false;
        $scope.show = function(){
            var element = angular.element($("#password"));
            if(element.attr("type") == "text"){
                element.attr("type","password");
            }else{
                element.attr("type","text");
            }
            $scope.eyeClose = !$scope.eyeClose;
            $scope.eyeOpen = !$scope.eyeOpen;
        };
        /*
         获取token
         */
        loginService.setXtoken();
        /*
         获取验证码
         */
        $scope.getVcode = function() {
            loginService.getCodeImage();
        };
        $scope.getVcode();
        $scope.checkCode = function() {
            loginService.checkCode("logistics.checkCode", {
                validateCode: vercode.percent()
            }, function(data) {
                $scope.validateCode = vercode.percent();
                if (data.errorCode === 0) {
                    vercode.success();
                } else {//失败，重置图片位置
                    $scope.loginModel.slideNumber ++;
                    if($scope.loginModel.slideNumber > 4) {
                        $scope.loginModel.slideNumber = 0;
                        angular.element($("#big-img"))
                            .css({"background-image": "url(public/img/vcode-loading.png"})
                            .delay(1000)
                            .queue(function () {
                                $scope.getVcode();
                                $(this).dequeue();
                            });
                        vercode.refresh();
                    } else {
                        $scope.loginModel.slideNumber ++;
                        if($scope.loginModel.slideNumber > 4) {
                            $scope.loginModel.slideNumber = 0;
                            angular.element($("#big-img"))
                                .css({"background-image":"url(public/img/vcode-loading.png"})
                                .delay(1000)
                                .queue(function(){
                                    $scope.getVcode();
                                    $(this).dequeue();
                                });
                            vercode.refresh();
                        }else {
                            vercode.failure();
                            setTimeout(function() {
                                $scope.getVcode();
                            }, 1000);
                        }
                    }
                }
            });
        };
        var vercode = new verCode("#m-code-box", "#m-code-img", {tips:Lang.getValByKey("login", "login_code_sliderTips")},$scope.checkCode);
        vercode.init();

        /*
         登录点击事件
         */
        $scope.submit = function(){
            if($scope.loginModel.buttonStatus == true){
                return;
            }

            var userName = $.trim($scope.loginModel.username),
                passWord = $.trim($scope.loginModel.password),
                validateCode = $scope.validateCode ? $scope.validateCode : 0;
            $("#login-callback-tips").html('');


            if((!userName || userName == oldTextTips) && !passWord){
                $scope.loginModel.usernameError = $scope.loginModel.passwordError = true;
                return;
            }
            if(!userName || userName == oldTextTips){
                $scope.loginModel.usernameError = true;
                return;
            }
            if(!passWord){
                $scope.loginModel.passwordError = true;
                return;
            }

            $scope.loginModel.login = Lang.getValByKey('login', 'login_code_logining');
            $scope.loginModel.buttonStatus  = true;
            loginService.login("logistics.login", {
                urlParams: {
                    userName:userName,
                    passWord:Des.enc(passWord),
                    validateCode:validateCode
                }
            }, function(data) {
                $scope.loginModel.login = oldLoginTips;
                $scope.loginModel.buttonStatus  = false;

                //登录成功
                if(data.errorCode === 0) {
                    cookie.set("loginSuccess", "true", 1);
                    window.location.href = "/";
                    return;
                }

                //登录失败重刷验证码
                $scope.getVcode();
                vercode.reset();
                $scope.validateCode = 0;

                //未知异常
                if(data.errorCode === -1){
                    return;
                }
                //账户锁定
                if(data.errorCode === 110002){
                    $scope.locking();
                    return;
                }
                //尝试次数过多
                if(data.errorCode === 110001){
                    loginView
                    loginView.showErrorMsg(data);
                    return;
                }
                loginView.showErrorMsg(data);
            });
        };

        /*
         输入校验
         */
        $scope.keyDownEvent = function(type){
            if(type == "username"){
                $scope.loginModel.usernameError = false;
            }else if(type == "password"){
                $scope.loginModel.passwordError = false;
            }
        };

        /*
         Login页面回车事件
         */
        $scope.enterEvent = function(e) {
            var keycode = window.event ? e.keyCode : e.which;
            if(keycode == 13){
                $scope.submit();
            }
        };

        /*
         锁定及忘记密码
         */
        $scope.loginModel.loginBox = true;
        $scope.loginModel.forgetBox = $scope.loginModel.lockingBox = false;

        //锁定账户
        $scope.locking = function(){
            $scope.loginModel.loginBox = !$scope.loginModel.loginBox;
            $scope.loginModel.lockingBox = !$scope.loginModel.lockingBox;
        };
        //忘记密码
        $scope.forget = function(){
            $scope.loginModel.loginBox = !$scope.loginModel.loginBox;
            $scope.loginModel.forgetBox = !$scope.loginModel.forgetBox;
        };
        //返回登录
        $scope.backtrack = function(){
            $scope.loginModel.loginBox = !$scope.loginModel.loginBox;
            $scope.loginModel.forgetBox = $scope.loginModel.lockingBox = false;
        };
    }]);
});
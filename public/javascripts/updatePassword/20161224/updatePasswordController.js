easySpa.require([
    'widget/prompt',
    'public/common/des.js'
], function() {
    app.controller('updatePasswordCtrl', ['$scope', 'updatePasswordService', 'updatePasswordView', function($scope, updatePasswordService, updatePasswordView) {
        function init() {
            $scope.oldPassword='';
            $scope.newPassword='';
            $scope.newVertifyPw ='';
            $scope.passWordLevel = 'original';
            $scope.currentUser =''

            updatePasswordService.getUserProfile(function (returnData) {
                if(returnData.errorCode == 0) {
                    console.log(returnData,"returnData")
                    $scope.currentUser = returnData.data.accountName;

                }
            })
        }

        init();

        function initPasswordStrength() {

            var O_color = "#eeeeee";
            document.getElementById("strength_L").style.background = O_color;
            document.getElementById("strength_M").style.background = O_color;
            document.getElementById("strength_H").style.background = O_color;
            $scope.passWordLevel == 'original';

        }

        $scope.checkPwStrength = function () {

            var password = $scope.newPassword;
            console.log(password, "newPw");
            var O_color = "#eeeeee";
            var L_color = "#A7DFF4";
            var M_color = "#6CC8EA ";
            var H_color = "#3BAFDA";
            var level = 0;

            var mode = 0;
            var Lcolor;
            var Mcolor;
            var Hcolor;
            $scope.ExistNoSupWord = false;


            if (password == null || password == ''|| password == undefined) {
                Lcolor = Mcolor = Hcolor = O_color;
                mode = 0;
            }else{
                console.log(password.length,"password.length")
                for (var index = 0; index < password.length; index++) {
                    var charMode;
                    var regSpecial = /[!@#&()_+,./\\^]+/;
                    var regNumber = /[0-9]+/;
                    var regLowercase = /[a-z]+/;
                    var regCapital = /[A-Z]+/;

                    singleWord = password.charAt(index);
                    console.log(singleWord,"singleWord");

                    // 判断输入密码的类型
                    if (regNumber.test(singleWord)) { //数字
                        charMode = 1;
                    }
                    else if (regCapital.test(singleWord)) //大写
                        charMode = 2;
                    else if (regLowercase.test(singleWord)) //小写
                        charMode = 4;
                    else if(regSpecial.test(singleWord)){
                        charMode = 8;  //特殊字符
                    }else{
                        //不支持的字符
                        $scope.ExistNoSupWord = true;
                        initPasswordStrength();
                        return;
                    }

                    mode |= charMode;

                    var typeNumber = CalcLevel(mode);

                }
                if( typeNumber== 0 || password.length >18){
                    Lcolor = Mcolor = Hcolor = O_color;
                    $scope.passWordLevel = 'original';

                }else if(password.length < 6 || (typeNumber <= 2) ){
                    Lcolor = L_color;
                    Mcolor = Hcolor = O_color; ///低优先级
                    $scope.passWordLevel = 'low';
                }else if((password.length >=6 && password.length <=9 && typeNumber == 3) ||
                    (password.length >=6 && password.length <=7 && typeNumber == 4)){
                    Lcolor = Hcolor = O_color;
                    Mcolor = M_color; ///中级
                    $scope.passWordLevel = 'normal';
                }else if((password.length >=10 && password.length <=18 && typeNumber == 3) ||
                    (password.length >=8 && password.length <=18 && typeNumber == 4))
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
            for(var indexj=0;indexj<4;indexj++){
                if(mode & 1) {
                    level++;
                }
                mode >>>=1;
            }
            return level;

        }


        function checkFormBeforeSummit() {
            if(!$scope.oldPassword){
                $scope.UpdatePW.oldPassword.$setDirty();
            };

            if(!$scope.newPassword){
                $scope.UpdatePW.newPassword.$setDirty();
            };
            if(!$scope.newVertifyPw ){

                $scope.UpdatePW.newVertifyPw.$setDirty();
            };

            if($scope.passWordLevel == 'low' || $scope.passWordLevel == 'original'){
                return false;
            }

            if($scope.newPassword != $scope.newVertifyPw) {
                $scope.showDiffErr = true;
                return false;
            }

            if($scope.newPassword === $scope.oldPassword){
                $scope.showOldNewSame = true;
                return false;
            }

            // if($scope.newPassword.indexOf($scope.currentUser)!= -1){
            //     initPasswordStrength();
            //     $scope.ExistNoSupWord = true; // 不支持包含用户名
            //     return false;
            // }



            if($scope.ExistNoSupWord) {
                return false;
            }


            return $scope.UpdatePW.$valid ? true:false;
        }

        $scope.checkVertify = function () {
            if($scope.newPassword != $scope.newVertifyPw) {
                $scope.showDiffErr = true;
            }else{
                $scope.showDiffErr = false;
            }
        }

        $scope.checknewPW = function () {
            $scope.checkOldAndNew();
            checkNewPwLow();

        }

        $scope.checkOldAndNew = function () {
            if($scope.newPassword === $scope.oldPassword) {
                $scope.showOldNewSame = true;
            }else{
                $scope.showOldNewSame = false;
            }

        }

        function checkNewPwLow() {
            if($scope.passWordLevel == 'low'){
                $scope.showPwLow = true;
            }else{
                $scope.showPwLow = false;
            }

        }



        $scope.updatePw = function () {
            var canUpdate = checkFormBeforeSummit();
            if(!canUpdate) {
                return;
            }

            var param={
                urlParams:{
                    oldPassword: Des.enc($scope.oldPassword),
                    newPassword: Des.enc($scope.newPassword)
                }

            };
            updatePasswordService.updatePassword(param,function (returnData) {
                if(returnData.errorCode != 0){
                    $(document).promptBox({isDelay: true, contentDelay: returnData.msg, type: 'errer', manualClose: true});
                }else{
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: "密码更新成功，稍后请重新登陆！",//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                    setTimeout(function () {
                        updatePasswordService.logout(function (res) {
                            if(res.errorCode === 0){
                                cookie.delete('token');
                                cookie.delete("loginSuccess");
                                try{
                                    var protocol = window.location.protocol,
                                        hostname = window.location.hostname,
                                        port = window.location.port;
                                    top.location.href = protocol + '//' + hostname + ':' + port + '/' + 'login.html#/login';

                                }catch(e){
                                    window.location.reload();
                                }
                            }

                        });

                    },3000)

                }

            })

            console.log("update Ok");

        }
    }]);
});
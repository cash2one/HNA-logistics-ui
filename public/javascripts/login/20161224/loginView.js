app.factory('loginView', [function() {
    var loginView = {};
    loginView.showErrorMsg = function(data) {
        if(data.errorCode == 110001) {
            angular.element($("#login-callback-tips")).html('<span class="span-error">' + Lang.getValByKey("login", 'login_data_' + data.errorCode) + data.data.leftInputCount + '</span>');
        } else {
            angular.element($("#login-callback-tips")).html('<span class="span-error">' + Lang.getValByKey("login", 'login_data_' + data.errorCode) + '</span>');
        }
    }
    loginView.showLoginTimeoutMsg = function() {
        if(location.href.indexOf("401") > -1 && cookie.get("loginSuccess")) {
            $(document).promptBox({isDelay:true, contentDelay: Lang.getValByKey("login", "login_out_time"), type: 'errer', manualClose:true});
        }
        $(".tip-box").animate({
            opacity:0
        }, 3000, function() {
           $(".tip-box").remove();
        });
    }
    return loginView;
}]);
easySpa.use(["service/cookieService", "widget/prompt"]);
app.factory('loginService', ['easyHttp', 'cookieService', function(easyHttp, cookieService) {
    var loginService = {};
    loginService.setXtoken = function() {
        var token = cookieService.get("token");
        if(token) {
            $.ajaxSetup({
                headers: {
                    "x-token": token
                }
            });
            easyHttp.get("logistics.loginCheck", function(data) {
                if(data.errorCode == 401) {//token失效
                    cookieService.delete("token");
                    var tokenResult = easyHttp.get("logistics.getToken");
                    $.ajaxSetup({//设置最新的请求头信息
                        headers: {
                            "x-token": tokenResult.data
                        }
                    });
                    cookieService.delete("token");
                    cookieService.set("token", tokenResult.data, 1);//将token保留一天
                }
            });
        } else {
            var tokenResult = easyHttp.get("logistics.getToken");
            $.ajaxSetup({
                headers: {
                    "x-token": tokenResult.data
                }
            });
            cookieService.set("token", tokenResult.data, 1);//将token保留一天
        }
    }
    loginService.getCodeImage = function() {
        easyHttp.get("logistics.getCodeImage",{
            headers: {
                accept: "text/base64"
            }
        }, function(data) {
            angular.element($("#big-img")).css({"background-image":"url(data:image/jpeg;base64," + data + ")"});
        });
    };
    loginService.checkCode = function(url, params, callback) {
        var data = easyHttp.post(url, {
            urlParams: params
        });
        callback(data);
    }
    loginService.login = function(url, config, callback) {
        easyHttp.post(url, config, callback);
    }
    return loginService;
}]);
(function() {
    String.prototype.replaceAll  = function(s1,s2) {
        return this.replace(new RegExp(s1,"gm"),s2);
    }
    for(var key in Interface) {
        window[key] = Interface[key];
    }
    Interface.getUrlById = function(id, seatParams) {
        var url = getUrlById(id);
        if(seatParams) {
            for(var key in seatParams) {
                if(seatParams[key] === ''){
                    url = url.replaceAll("/{" + key + "}", '').replaceAll("{" + key + "}", '');
                }else{
                    url = url.replaceAll("{" + key + "}", seatParams[key]);
                }
            }
        }
        return url;
    };
    function getUrlById(id) {
        var appName = id.split(".")[0];
        var id = id.split(".")[1];
        var interfaces = window[appName].interfaces;
        var url = "";
        for(var index = 0; index < interfaces.length; index++) {
            if(interfaces[index].id == id) {
                url = interfaces[index].url;
                if(url.indexOf("http://") > -1 || !window[appName].host) {
                    return url;
                } else {
                    if(window[appName].host == "") {
                        return url;
                    } else {
                        return "http://" + window[appName].host + url;
                    }
                }
                break;
            }
        }
    }
    function request(id, config, callback, type) {
        var seatParams = null,
            urlParams = null,
            async = null,
            headers = null;
        if(config) {
            seatParams = config.seatParams;
            urlParams = config.urlParams;
            headers = config.headers;
            if(urlParams) {
                async = urlParams.async;
            }
        }
        var url = getUrlById(id);
        if(!urlParams) {
            urlParams = {};
        }
        if(!headers) {
            headers = {};
        }
        if(seatParams) {
            for(var key in seatParams) {
                if(seatParams[key] === ''){
                    url = url.replaceAll("/{" + key + "}", '').replaceAll("{" + key + "}", '');
                }else{
                    url = url.replaceAll("{" + key + "}", seatParams[key]);
                }
            }
        }
        var ajaxConfig = {
            type: type,
            url: url,
            data: urlParams,
            headers: headers,
            cache: false,
            async: false
        };
        if(async) {
            ajaxConfig.async = async;
        }
        if(callback) {
           ajaxConfig.success = function(data) {
                try {
                    var result = JSON.parse(data);
                    easySpa.httpResponseInterceptor(result);
                } catch(ex) {
                    var result = data;
                }
                callback(result);
           }
        }
        if(type == "POST" || type == "PUT" || type == "DELETE") {
            ajaxConfig["contentType"] = "application/json; charset=utf-8";
            ajaxConfig["data"] = JSON.stringify(urlParams);
        }
        try {
            if(!callback) {
                var result = JSON.parse($.ajax(ajaxConfig).responseText);
                easySpa.httpResponseInterceptor(result);
                return result;
            } else {
                $.ajax(ajaxConfig);
            }
        } catch(ex) {
            if(!callback) {
                var result = $.ajax(ajaxConfig).responseText;
                easySpa.httpResponseInterceptor(result);
                return result;
            }
        }
    }
    app.factory('ajaxService', [function() {
        function ajaxResquest(params) {
            var args = params;
            var url = "";
            var config = {};
            var callback = null;
            var type = params[0];
            for(var index = 1; index < args.length; index++) {
                if(typeof args[index] == "function") {
                    callback = args[index];
                } else if(typeof args[index] == "string" && args[index].indexOf(".") > -1) {
                    url = args[index];
                } else if(typeof args[index] == "object") {
                    config = args[index];
                }
            }
            return request(url, config, callback, type);
        }
        /*
         * config格式
         * seatParams
         * urlParams
         * */
        var ajax = {
            get: function() {
                arguments = [].slice.call(arguments,0);
                arguments.unshift("GET");
                return ajaxResquest(arguments);
            },
            post: function(url, config, callback) {
                arguments = [].slice.call(arguments,0);
                arguments.unshift("POST");
                return ajaxResquest(arguments);
            },
            put: function(url, config, callback) {
                arguments = [].slice.call(arguments,0);
                arguments.unshift("PUT");
                return ajaxResquest(arguments);
            },
            delete: function(url, config, callback) {
                arguments = [].slice.call(arguments,0);
                arguments.unshift("DELETE");
                return ajaxResquest(arguments);
            }
        }
        return ajax;
    }]);
    var factory = app.factory;
    app.factory = function(arg1, arg2) {
        var newArg = [];
        for(var index = 0; index < arg2.length; index++) {
            if(typeof arg2[index] == "string" && arg2[index] == "easyHttp") {
                newArg.push("ajaxService");
            } else {
                newArg.push(arg2[index]);
            }
        }
        factory.apply(this, [arg1, newArg]);
    }
})();

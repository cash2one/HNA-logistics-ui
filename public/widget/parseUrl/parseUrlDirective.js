/**
 * Package: parseUrl.js
 * Function: 解析window.location.href的值
 * Author: liutao.
 * Date: 2017-03-07 14:00:00.
 */
(function(root, factory){
    root.parseUrl = factory();
})(window, function(){
    return {
        url: window.location.href,

        location: window.location,

        getParams: function(){
            var _this = this;

            var ret = {};

            if(_this.location.href.indexOf('?') == -1){
                return ret;
            }

            var search = _this.location.href.split('?')[1].split('&');
            for (var i=0, length=search.length; i<length; i++) {
                if(!search[i]){
                    continue;
                }
                var s = search[i].split('=');
                ret[s[0]] = decodeURI(s[1]);
            }
            return ret;
        },

        getTopParams: function(){
            var _this = this;

            var ret = {};

            if(top.location.href.indexOf('?') == -1){
                return ret;
            }

            var search = top.location.href.split('?')[1].split('&');
            for (var i=0, length=search.length; i<length; i++) {
                if(!search[i]){
                    continue;
                }
                var s = search[i].split('=');
                ret[s[0]] = decodeURI(s[1]);
            }
            return ret;
        }
    }
});
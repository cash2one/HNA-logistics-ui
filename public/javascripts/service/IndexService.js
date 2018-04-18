/**
 * Package: IndexService.js
 * Function: Frame
 * Author: liutao.
 * Date: 2016-11-02 10:00:00.
 */
;(function(){
    'use strict';

    app.factory('IndexService',['easyHttp', function(easyHttp) {

        var factory = {};

        /**
         * 获取页面菜单。
         */
        factory.getMenu = function(){
            return easyHttp.get('/api/v1/u/usertree');
        };

        /**
         *  获取个性化配置
         */
        factory.getPersonConf = function(){
            return easyHttp.get('/api/v1/u/userconfig');
        };

        /**
         * 设置个性化配置。
         */
        factory.setPersonConf = function(data){
            return easyHttp.post('/api/v1/u/userconfig', data);
        };
        /**
         * 获取个人用户信息。
         */
        factory.getUserProfile = function(){
            return easyHttp.get('/api/v1/u/profile');
        };

        return factory;
    }]);
})();
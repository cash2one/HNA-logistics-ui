app.factory('projectCheckService', [
    'easyHttp',
    function (easyHttp) {
        var projectCheckService = {};
        var projectBelong = sessionStorage.getItem('projectBelong');

        // 获取初审信息
        projectCheckService.getApprvoalInfo = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getApprvoalInfoLog' : 'logistics.getApprvoalInfo';
            return easyHttp.get(url, config, callback);
        };

        // 添加初审问题
        projectCheckService.postQuestion = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.postQuestionLog' : 'logistics.postQuestion';
            return easyHttp.post(url, config, callback);
        };

        // 添加初审回复
        projectCheckService.postAnswer = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.postAnswerLog' : 'logistics.postAnswer';
            return easyHttp.post(url, config, callback);
        };
        // 添加初审意见
        projectCheckService.postOpinion = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.postOpinionLog' : 'logistics.postOpinion';
            return easyHttp.post(url, config, callback);
        };

        return projectCheckService;
    },
]);

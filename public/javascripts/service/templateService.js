app.factory('templateService', ['easyHttp', function(easyHttp) {
    var templateService = {
        uploadTemplate: function(params, callback) {
            easyHttp.post('logistics.uploadTemplate', params, callback);
        },
        getTemplate: function(params, callback) {
            easyHttp.get('logistics.getTemplate', params, callback);
        },
        getTemplateData: function(params, callback) {
            easyHttp.get('logistics.getTemplateData', params, callback);
        }
    };
    return templateService;
}]);
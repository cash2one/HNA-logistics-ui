var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function($scope) {//配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            isShowOperAreaLine: true
        });
    },
    init: function($scope, service, tableService) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;
        this.tableService = tableService;
    }
}
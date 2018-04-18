easySpa.require([
    'widget/slimscroll',
    'widget/select',
    "public/javascripts/fragment/orderNumber/ruleCtrl.js",
    "public/javascripts/fragment/orderNumber/inventoryCtrl.js",
    "public/javascripts/fragment/orderNumber/superviseCtrl.js",
    "public/javascripts/fragment/orderNumber/channelNumberService.js",
    "public/javascripts/fragment/orderNumber/waybillNumberService.js",
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select'
], function () {
    app.controller('orderNumberCtrl', ['$scope', 'orderNumberService', 'orderNumberView','tableService', function ($scope, orderNumberService, orderNumberView,tableService) {
        $scope.module= easySpa.queryUrlValByKey("module");
        $scope.activeTab = 'RULE';
        $scope.switchTabON = function(type){
            if(type === $scope.activeTab){return;}
            $scope.activeTab = type;
        };
    }]);
});

easySpa.require([
    'public/common/calander.js',
    'widget/select',
    'widget/prompt',
    'public/common/tableController.js',
    'public/common/eventService.js',
    'public/javascripts/fragment/fundsAccount/accountManager.js',
    'public/javascripts/fragment/fundsAccount/accountDetail.js',
    'public/javascripts/fragment/fundsAccount/bankManager.js',
    'public/javascripts/fragment/fundsAccount/businessRecord.js',
    'public/javascripts/fragment/fundsAccount/withdrawApply.js',
    'public/javascripts/fragment/fundsAccount/recharge.js',
    'public/javascripts/fragment/fundsAccount/rechargeResult.js'
], function () {
    app.controller('fundsAccountCtrl', ['$scope', 'fundsAccountService', 'fundsAccountView', function ($scope, fundsAccountService, fundsAccountView) {

        $scope.block = 'accountManager';

        /**
         * 返回操作，主Controller控制。子Controller调用。
         */
        $scope.goBack = function (type) {
            if (type == 'accountDetail') {    //资金账户详情返回
                $scope.block = 'accountManager';
            } else if (type == 'bankManager') {    //银行账户管理
                $scope.block = 'accountDetail';
            } else if (type == 'withdrawApply') {    //提现申请返回
                $scope.block = 'accountDetail';
            } else if (type == 'recharge') {    //充值返回
                $scope.block = 'accountDetail';
            } else if (type == 'businessRecord') {    //交易记录详情
                $scope.block = 'accountDetail';
            }
        };
    }]);
});


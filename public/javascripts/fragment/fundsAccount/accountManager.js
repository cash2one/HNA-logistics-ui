/**
 * 资金账户管理
 */
app.controller("accountManagerCtr", ["$scope", "$location", "fundsAccountService", "eventServiceFactory", function ($scope, $location, fundsAccountService, eventServiceFactory) {
    /**
     * 获取账户管理列表
     */
    $scope.getAccountManagerList = function () {
        var config = {
            'urlParams': {}
        };
        fundsAccountService.getAccountManagerList(config, function (res) {
            if (res.errorCode === 0) {
                if(res.data){
                    res.data.forEach(function(val){
                        if(val.signing){
                            val.totalAmount = fundsAccountService.dealNumber(val.totalAmount)
                        }
                    });
                    $scope.list = res.data
                }else{
                    $scope.list = [];
                }
            } else {
                setTimeout(function(){
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                },0)
            }
        });
    };

    $scope.getCustomerId = function () {
        fundsAccountService.getCustomerId(function (res) {
            if(res.errorCode === 0){
                $scope.hrefPay = res.data.dsptUrl;
                $scope.hrefBasic = res.data.qywyUrl
            }else{
                setTimeout(function(){
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.msg,
                        type: 'errer',
                        manualClose: true
                    });
                },0)
            }
        });
    };
    /**
     * 获取资金账户详情
     * @param id
     */
    $scope.getAccountDetail = function (block, item) {
        if (!item.thirdPayAccountId || !item.signing) {
            return;
        }
        $scope.$parent.block = block;
        eventHandler.dispatch('accountDetailData', {
            'thirdPayAccountId': item.thirdPayAccountId,
            'custName': item.custName,
            'currencyCode': item.currencyCode
        });
    };

    /**
     * 开户
     * @param item
     */
    $scope.openAccountManager = function (item) {
        $scope.showSigning = true;
    };

    /**
     * 初始化
     */
    $scope.init = function () {
        $scope.showSigning = false;
        $scope.getAccountManagerList();
        $scope.getCustomerId();
    };
    $scope.init();    //初始化调用一次
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('accountManagerData', $scope.init);

    if($location.$$search.thirdPayAccountId){
        var map = {
            'thirdPayAccountId': $location.$$search.thirdPayAccountId,
            'currencyCode': $location.$$search.currencyCode,
            'custName': $location.$$search.custName,
            'signing': true
        };
        $scope.getAccountDetail('accountDetail', map);
    }
}]);
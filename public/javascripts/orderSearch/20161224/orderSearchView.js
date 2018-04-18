app.factory('orderSearchView', ["tableService", "orderSearchService", function (tableService, orderSearchService) {

    var orderSearchView = {};
    var defaultTime = "2100-01-01 00:00:00";
    orderSearchView.initCalander = function ($scope) {

        Calander.init({
            ele: ["#startTime", "#endTime"]
        });

        $scope.orderSearch.startTime = getBeforeDate(6) + ' 00:00:00';    //起始时间
        $scope.orderSearch.endTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间
    };

    orderSearchView.initSelect = function ($scope) {

        function getUserNameList(data, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }
            var params = {
                'urlParams': {
                    'q': data || '',
                    "pageIndex": currentPage,
                    "pageSize": 10,
                    'userType': 1 //1 是物流 2 是贸易
                }
            };
            var res = orderSearchService.getUserNameListWithoutNoAudit(params);

            res.data && res.data.forEach(function (item, index) {
                if(item.fullName && item.userName){
                    item.fullName += '(' + item.userName + ')';
                }
            });
            console.log(res);

            return res;
        }

        var clientData = getUserNameList();

        var clientEle = selectFactory({
            data: clientData,
            isSearch: true,
            isUsePinyin: true,
            defaultText: Lang.getValByKey("common", 'common_select_tips'),
            id: "select-customer",
            showTextField: "fullName",
            pagination: true,
            searchPlaceHoder: '请输入姓名或用户名',
            attrTextField: {
                "ng-value": "id"
            },
            closeLocalSearch: true,
            onSearchValueChange: function (attachEvent, data, currentPage) {
                var clientData = getUserNameList(data, currentPage);
                attachEvent.setData(clientData);
            },
            attrTextId: function (id) {
                $scope.orderSearch.cusUserId = id;
                $scope.$apply();
            },
            attrTextModel: function (userName) {
                $scope.orderCustomerName = userName;
                $scope.$apply();
            }
        });
        clientEle.setData(clientData);
        // clientEle.open();
        $('#select-client').val($scope.orderClientName);

    };

    orderSearchView.InitOrderStatus = function ($scope) {
        if (orderStatusEle) {
            return;
        }

        $scope.orderStatusData = orderSearchService.getOrderStatus();

        var orderStatusEle = selectFactory({
            data: $scope.orderStatusData,
            defaultText: Lang.getValByKey("common", 'common_all_tips'),
            id: "select-orders-status",
            showTextField: "name",
            isSaveInputVal: true,
            attrTextField: {
                "ng-value": "code"
            },
            attrTextId: function (code) {
                $scope.orderSearch.orderStatus = code;
                $scope.$apply();
            },
            attrTextModel: function (name) {
                $scope.ordersStatusName = name;
                $scope.$apply();
            }
        });
        orderStatusEle.setData($scope.orderStatusData);
        // orderStatusEle.open();

    }
    orderSearchView.initTable = function ($scope) {
        $scope.tableModel = {
            'tableHeader': [
                '序号',
                '客户单号',
                '运单号',
                '产品信息',
                '客户信息',
                '货物类型',
                '起止地',
                '创建时间',
                '订单状态'

            ],
            'tableBody': [],
            'restURL': 'logistics.searchLogisticalOrder',
            'restData': {
                'pageIndex': 1,
                'pageSize': 10,
                'sort': 'createTime',
                'productUid': '',
                'asc': false
            },
            'selectNumber': 0,
            'selectFlag': false
        }

    }

    orderSearchView.bindEvent = function ($scope) {
        var self = this;
        $scope.getCustomer = orderSearchView.initSelect($scope);//客户下拉框
        $scope.showOrderStatus = orderSearchView.InitOrderStatus($scope);//状态下拉框


    }


    return orderSearchView;
}]);
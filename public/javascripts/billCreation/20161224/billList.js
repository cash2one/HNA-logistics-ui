easySpa.require([
    'public/common/tableController.js',
    'widget/parseUrl',
    'widget/select'
], function(){
    app.controller('billList', ['$scope', 'billCreationService', 'tableService', billList]);

    function billList($scope, billCreationService, tableService) {
        $scope.paramter = window.parseUrl.getParams();

        $scope.userType = 1; // 默认为物流-客户管理
        if ($scope.paramter && $scope.paramter.module == 'trade') {
            $scope.userType = 2; // 贸易-客户管理
        }
        $scope.search = {};

        billCreationService.nowScope = $scope;

        $scope.unwatcher = [];

        $scope.num = Math.random()
            .toString(36)
            .substring(3, 8);

        $scope.initBillingStatus = function () {
            if (!$scope.billingStatus) {
                billCreationService.billingStatus({ seatParams: { interType: '', subInterType: 1 } }, function (res) {
                    $scope.billingStatus = res;
                });
            }
        };

        var getLastMonth = billCreationService.getLastMonth();
        $scope.search.startEffectTime = getLastMonth.start;
        $scope.search.endEffectTime = getLastMonth.end;

        $scope.search.status = 'DRAFT';
        $scope.statusName = $scope.lang.draft;

        $scope.unwatcher.push(
            $scope.$watch('billingStatus', function (data, old) {
                if (data) {
                    billCreationService.createSelect('billingStatus_' + $scope.num, data, function (name, data, currentData) {
                        if (name == '全部') {
                            delete $scope.search.status;
                            delete $scope.statusName;
                            delete $scope.tableModel.restData.status;
                        }
                        $scope.search.status = currentData.code;
                        $scope.statusName = name;
                    });
                }
            })
        );

        $scope.deleteBillByNumber = function () {
            var data = getSelectedData(),obj;
            if (billCreationService.checkData(data)) { return; }
            if($scope.paramter.module == 'trade'){
                obj = data;
            }else{
                obj = {
                    "billNos":data,
                    "customers":userListResult
                };
            }
            var config = {
                urlParams: obj,
                seatParams: {
                    interType: '',
                    subInterType: ''
                }
            };
            if ($scope.module == 'trade') {
                config.seatParams.interType = $scope.interType;
            }
            config.seatParams.subInterType = $scope.subInterType;
            billCreationService.promptMidBox('', { msg: '确定删除已选账单？' }, '', function () {
                billCreationService.deleteBillByNumber(config, function (res) {
                    billCreationService.promptBox(res);
                    if (res.errorCode === 0) { $scope.loadListData();$scope.$apply(); }
                });
            });
        };

        $scope.submitBillInBilllist = function () {
            var data = getSelectedData();
            if (billCreationService.checkData(data)) { return; }
            var config = {
                urlParams: data,
                seatParams: {
                    interType: '',
                    subInterType: ''
                }
            };
            if ($scope.module == 'trade') {
                config.seatParams.interType = $scope.interType;
            }
            if ($scope.module == 'logistics') {
                config.seatParams.interType = '';
            }
            config.seatParams.subInterType = $scope.subInterType;
            billCreationService.promptMidBox('', { msg: '确定提交已选账单？' }, '', function () {
                billCreationService.submitBillInBilllist(config, function (res) {
                    billCreationService.promptBox(res);
                    if (res.errorCode === 0) { $scope.loadListData();$scope.$apply(); }
                });
            });
        };

        $scope.canHanle = function (type) {
            var selectedData = tableService.getSelectTable($scope.tableModel.tableBody),
                Item = 0,
                otherItem = 0;
            if (selectedData.length === 0) { return false; }
            selectedData.forEach(function (item) {
                if (item.status != type) { otherItem++; } else { Item++; }
            });
            return !(otherItem === 0 && Item > 0);
        };

        $scope.tableModel = {
            tableHeader: [],
            tableHeaderSize: [],
            tableBody: [],
            restURL: 'logistics.getAllBillList',
            restData: {
                q: '',
                refCombos: '',
                isAsc: false,
                pageIndex: 1,
                pageSize: 10
            },
            selectNumber: 0,
            selectFlag: false
        };

        var searchKey = ['status', 'billNo', 'orderNo', 'waybillNo', 'customerId', 'startEffectTime', 'endEffectTime'];

        $scope.loadListData = function () {
            var param = angular.copy($scope.tableModel.restData);
            searchKey.forEach(function (key) {
                delete param[key];
            });
            angular.extend(param, billCreationService.getSearchData($scope));
            if ($scope.module == 'trade') {
                param.platformIds = $scope.platformValue;
                if ($scope.submodule == 'pay') {
                    param.bizCompanyIds = $scope.customerValue;
                } else {
                    param.bizCompanyIds = param.customerId;
                }
            } else {
                param.settlement = $scope.payWay;
                if ($scope.submodule == 'pay') {
                    param.customerId = $scope.customerValue;
                } else {
                    param.customerId = param.customerId;
                }
            }
            param.status = $scope.search.status;

            var params = {
                urlParams: param,
                seatParams: {
                    interType: $scope.interType,
                    subInterType: $scope.subInterType
                }
            };

            tableService.getTable($scope.tableModel.restURL, params, function (data) {
                $scope.q = $scope.tableModel.restData.q;
                if (data.errorCode === 0) {
                    $scope.count += 1;
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    // billCreationService.setScroll('.bill-line-wrap', $scope);
                }
            });
        };

        var originUserList = null;

        $scope.initUserList = function () {
            if ($scope.userList) {
                return;
            }
            var config = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                    userType: $scope.userType
                }
            };
            billCreationService.getCurrentUserVisibleUserList(config, function (res) {
                res.data.forEach(function (item) {
                    item.name = item.userName + ' (' + item.code + ')';
                });
                $scope.userList = res;
                if (!originUserList) { originUserList = res; }
            });
        };

        var userListResult = [];

        $scope.resetUserList = function () {
            if (billCreationService['userList2_' + $scope.num] && originUserList) {
                billCreationService['userList2_' + $scope.num].setData(originUserList);
            }
        };

        $scope.unwatcher.push(
            $scope.$watch('userList', function (data, old) {
                if (data) {
                    if (billCreationService['userList2_' + $scope.num]) {
                        billCreationService['userList2_' + $scope.num].setData(data);
                    } else {
                        billCreationService.createSelect(
                            'userList2_' + $scope.num,
                            data,
                            function (name, data, currentData) {
                                if (name) {
                                    var names = name.split('，');
                                    data.data.forEach(function (item) {
                                        names.forEach(function (name) {
                                            if (name == item.name && userListResult.indexOf(item.id) === -1) { userListResult.push(item.id); }
                                        });
                                    });
                                    $scope.search.customerId = userListResult.join(',');
                                } else {
                                    delete $scope.search.customerId;
                                    userListResult.length = 0;
                                }
                                $scope.$apply();
                            },
                            'mutile',
                            function (attachEvent, q, currentPage) {
                                if (!currentPage) {
                                    currentPage = 1;
                                }
                                q = q ? q : '';
                                var config = {
                                    urlParams: {
                                        q: q ? q.trim() : '',
                                        pageIndex: currentPage,
                                        pageSize: 10,
                                        isAsc: false,
                                        sortName: '',
                                        userType: $scope.userType
                                    }
                                };
                                billCreationService.getCurrentUserVisibleUserList(function (res) {
                                    res.data.forEach(function (item) {
                                        item.name = item.userName + ' (' + item.code + ')';
                                    });
                                    $scope.userList = res;
                                    $scope.$apply();
                                }, config);
                            }
                        );
                    }
                }
            })
        );

        $scope.clearSearch = function () {
            $scope.$parent.clear();
            billCreationService.clearSearch($scope);
            $scope.search.startEffectTime = getLastMonth.start;
            $scope.search.endEffectTime = getLastMonth.end;
            $scope.search.status = 'DRAFT';
            $scope.statusName = $scope.lang.draft;
            $scope.payWay = '';
            $('#billingStatus_'+$scope.num).val($scope.lang.draft);
            $scope.loadListData();
        };

        $scope.billsDetail = function (billNo, customerId, status, currency) {
            window.location.href = '#/billDetail?billNo=' + billNo + '&customerId=' + customerId + '&from=billCreation' + '&status=' + status + '&currency=' + currency + '&module=' + $scope.module + '&submodule=' + $scope.submodule;
        };

        $scope.flowProcess = function (billNo) {
            window.location.href = '#/billStream?billNo=' + billNo + '&from=billCreation' + '&module=' + $scope.module + '&submodule=' + $scope.submodule;
        };

        function getSelectedData() {
            var selectedData = tableService.getSelectTable($scope.tableModel.tableBody);
            selectedData = selectedData.map(function (item) {
                return item.billNo;
            });
            return selectedData;
        }

        function initCalander() {
            var calander = [['#begin-time', '#finish-time']];
            setTimeout(function () {
                calander.forEach(function (cal) {
                    Calander.init({ ele: cal, isClear: true });
                });
            }, 0);
        }

        var payWayEle;
        $scope.showPayWay = function () {
            if (payWayEle) {
                return;
            }

            var config = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 100
                }
            };
            $scope.payWayData = billCreationService.getPayWayData(config);

            payWayEle = selectFactory({
                data: $scope.payWayData,
                defaultText: Lang.getValByKey("common", 'common_all_tips'),
                id: "select-payWay",
                attrTextModel: function(name, data,currentData) {
                    if(!name){
                        $scope.payWay ='';
                    }else{
                        $scope.payWay = name;
                    }
                    $scope.$apply();
                }
            });
            payWayEle.open();
        };

        $scope.loadListData();
        initCalander();
    }
});
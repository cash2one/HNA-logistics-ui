easySpa.require([
    "widget/select",
    'widget/prompt'
], function () {
    app.controller('confirmOrderTestCtrl', ['$scope', 'confirmOrderTestService', 'confirmOrderTestView', function ($scope, confirmOrderTestService, confirmOrderTestView) {

        $scope.backToOrderPage = function () {
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("common", 'common_back_confirm')
                },
                cancelDescription: Lang.getValByKey("common", 'common_back_no'),
                operation: [
                    {
                        type: 'submit',
                        application: 'delete',
                        description: Lang.getValByKey("common", 'common_back_yes'),
                        operationEvent: function () {
                            $(document).promptBox('closePrompt');
                            window.location.href = '#/orders';
                        }
                    }
                ]
            })
        };

        function summitForm(inputdata, summitFunc) {

            summitFunc(inputdata, function (data) {
                if (data.errorCode != 0) {//服务器异常
                    console.log("error")
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {
                    $scope.InitSelectByorderNo();
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })
        }

        $scope.orderAccept = function () {

            var data = {
                'seatParams': {
                    'orderNo': $scope.order.orderNo
                }
            }

            console.log($scope.order.orderNo);

            summitForm(data, confirmOrderTestService.SetOrderToAccept);
        };

        $scope.orderStateChangeSummit = function () {
            var data = {
                'urlParams': {
                    orderNo: $scope.order.orderNo,
                    orderStatus: 'COMMITED'
                }
            };

            summitForm(data, confirmOrderTestService.ModifyOrderStatus);
        };

        function InitLOGCodeFormProviderSelect() { //服务商返回的物流消息的编码

            var data = confirmOrderTestService.getCodeFormProvider();

            propertyElm = selectFactory({
                data: data,
                id: "code-Form-Provider",
                isSearch: true,
                showTextField: "code",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                attrTextModel: function (name, data, currentItem) {
                    console.log(currentItem);


                    if (!name) {
                        $scope.order.code = '';

                    } else {
                        $scope.order.code = name;

                    }
                    console.log($scope.order.code);

                    $scope.$apply();

                }
            });
        }

        function InitProviderStatus() {   //供应商状态

            var data = {
                data: [
                    {name: "该供应商对该子单的工作环节已经完成", status: 1},
                    {name: "该供应商对该子单的工作环节尚未完成", status: 2}

                ],
                errorCode: 0,
                msg: ''
            }

            selectFactory({
                data: data,
                id: "orderStatus",

                defaultText: Lang.getValByKey("common", "common_select_tips"),
                attrTextModel: function (name, data, currentItem) {
                    console.log(currentItem);

                    if (!name) {
                        $scope.order.statusName = ''
                        $scope.order.status = '';

                    } else {
                        $scope.order.statusName = name;
                        $scope.order.status = currentItem.status;

                    }
                    console.log($scope.order.status);

                    $scope.$apply();

                }
            });

        }

        $scope.InitSelectByorderNo = function () {
            //$scope.InitSubOrderSelect();
            $scope.InitServiceUidSelect();
        };

        $scope.InitSubOrderSelect = function () {  //获取子单编号

            var param = {
                'seatParams': {
                    'orderNo': $scope.order.orderNo
                }
            };

            var data = confirmOrderTestService.getSubOrderByOrderSerial(param);
            selectFactory({
                data: data,
                id: "suborderNo",
                isSearch: true,
                showTextField: "subOrderNo",
                defaultCount: 100,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                attrTextModel: function (name, data, currentItem) {
                    if (!name) {
                        $scope.order.suborderNo = '';

                    } else {
                        $scope.order.suborderNo = name;

                    }
                    console.log($scope.order.suborderNo);

                    $scope.$apply();

                }
            });
        };


        $scope.InitServiceUidSelect = function () {  //获取子单编号
            console.log("InitServiceUidSelect")

            var param = {
                'seatParams': {
                    'orderNo': $scope.order.orderNo
                }
            }

            var data = confirmOrderTestService.getProviderByOrderSerial(param);
            $scope.suborderNo = confirmOrderTestService.getSubOrderByOrderSerial(param);

            selectFactory({
                data: data,
                id: "serviceUid",
                isSearch: true,
                showTextField: "name",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                attrTextModel: function (name, data, currentItem) {
                    if (!name) {
                        $scope.order.serviceUid = '';
                        $scope.order.supplierId = ''
                        $scope.order.servicename = ''

                    } else {
                        $scope.order.servicename = name;
                        $scope.order.serviceUid = currentItem.serviceUid;
                        $scope.order.supplierId = currentItem.supplierId;

                    }
                    console.log($scope.order.serviceUid);
                    console.log($scope.order.supplierId);

                    $scope.$apply();

                }
            });
        };


        $scope.summit = function () {
            var subOrderToServiceDtoObj,subOrderToServiceDto =[];
            $scope.suborderNo.data.forEach(function(value, key){
                subOrderToServiceDtoObj = {
                    subOrderNo: value.subOrderNo,
                    cargoNumber: $scope.subOrder.cargoNumber,
                    length: $scope.subOrder.length,
                    width: $scope.subOrder.width,
                    height: $scope.subOrder.height,
                    lwhUnit: $scope.subOrder.lwhUnit,
                    weight: $scope.subOrder.weight,
                    weightUnit: $scope.subOrder.weightUnit
                };
                subOrderToServiceDto.push(subOrderToServiceDtoObj);
            });
            var param = {
                urlParams: {
                    code: $scope.order.code,
                    type: 2,
                    status: $scope.order.status,
                    waybillNo: $scope.order.orderNo,
                    orderWeight: $scope.order.orderWeight,
                    // orderWeightUnit:"kg",
                    orderWeightUnit: $scope.order.orderWeightUnit,
                    serviceUid: $scope.order.serviceUid,
                    supplierId: $scope.order.supplierId,
                    serviceOrderNo: $scope.order.serviceorderNo,
                    trackMessage: $scope.order.trackMessage,
                    messageTime: new Date().getTime(),
                    trackingSupSubOrders:subOrderToServiceDto
                }
            };

            confirmOrderTestService.addOrder(param, function (data) {
                if (data.errorCode != 0) {//服务器异常
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {

                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })
        }

        $scope.calcOrderSales = function () {
            var param = {
                seatParams: {
                    orderNo: $scope.cash.orderNo
                }
            }

            confirmOrderTestService.calcOrderSales(param, function (data) {


                $scope.cash.money = data.data.amount;
                $scope.cash.currencyCode = data.data.currencyCode;
                $scope.cash.custCurrencyCode = data.data.custCurrencyCode;
                $scope.cash.custcurrencyAmount = data.data.custCurrencyAmount;
                $scope.cash.exchangeRateSetting = data.data.exchangeRateSetting;
                $scope.cash.exchangeRate = data.data.exchangeRate;
                $scope.result = data.data.result;
                $scope.calcMsgs = data.data.calcMsgs;
                if (data.errorCode != 0) {//服务器异常
                    console.log("error")
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })
        }
        $scope.calcOrderPurchases = function () {
            var param = {
                seatParams: {
                    orderNo: $scope.cash.orderNo
                }
            }

            confirmOrderTestService.calcOrderPurchases(param, function (data) {


                $scope.cash.money = data.data.amount;
                $scope.cash.currencyCode = 'CNY';
                $scope.cash.custCurrencyCode = data.data.custCurrencyCode;
                $scope.cash.custcurrencyAmount = '-';
                $scope.cash.exchangeRateSetting = true;
                $scope.cash.exchangeRate = '-';
                $scope.result = data.data.result;
                $scope.calcMsgs = data.data.calcMsgs;
                if (data.errorCode != 0) {//服务器异常
                    console.log("error")
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })
        }

        $scope.calcPurchases = function () {
            var param = {
                seatParams: {
                    orderNo: $scope.cash.orderNo
                }
            }

            confirmOrderTestService.calcOrderPurchases(param, function (data) {

                if (data.errorCode != 0) {//服务器异常
                    console.log("error")
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {
                    $scope.cash.money = data.data.amount;
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })


        };
        $scope.calcOrderProcess = function () {
            var param = {
                seatParams: {
                    orderNo: $scope.cash.orderNo
                }
            }

            confirmOrderTestService.calcOrderProcess(param, function (data) {


                var msg = '\r\n' + "揽收服务:" + data.data.st001Uid + "-" + data.data.st001Name + '\r\n';
                msg += "仓储服务:" + data.data.st002Uid + "-" + data.data.st002Name + '\r\n';
                msg += "清关服务:" + data.data.st003Uid + "-" + data.data.st003Name + '\r\n';
                msg += "干线服务:" + data.data.st004Uid + "-" + data.data.st004Name + '\r\n';
                msg += "配送服务:" + data.data.st005Uid + "-" + data.data.st005Name + '\r\n';
                msg += "综合服务:" + data.data.st006Uid + "-" + data.data.st006Name + '\r\n';

                $scope.result = msg;

                $scope.calcMsgs = data.data.msgs;

                if (data.errorCode != 0) {//服务器异常
                    console.log("error")
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                }
            })


        };

        function init() {

            $scope.order = {};
            $scope.subOrder = {};
            $scope.cash = {};
            InitLOGCodeFormProviderSelect();
            InitProviderStatus();
        }

        init();
    }]);
});
easySpa.require([
    'service/templateService'
], function(){
    app.controller('sunRunDeliveryConfirmController', ['$scope', 'tradeOrdersService', 'tradeOrdersView', 'templateService', sunRunDeliveryConfirmController]);

// orderStatusCode
// 2 是待发货
// 3 是待收货

    function sunRunDeliveryConfirmController($scope, tradeOrdersService, tradeOrdersView, templateService) {
        $scope.IsEdit = true;
        $scope.template = {};
        var bankAccountSelectEle = null;
        var goodList = {};
        var goods = {};


        function getOrderInfo() {
            var customerType = $scope.orderType === 'SALE' ? 1 : 2;

            tradeOrdersService.getOrderStatusByOrderNo($scope.orderNo, customerType).then(function (res) {
                if (res.errorCode == 0) {
                    initData(res.data || {});
                } else {
                    tradeOrdersView.promptBox({ msg: res.msg });
                }
            });
        }

        function initCalander() {
            setTimeout(function () {
                Calander.init({
                    ele: "#createTime",
                    isClear: true
                });
                Calander.init({
                    ele: '#latestPayTime',
                    isClear: true,
                });
                Calander.init({
                    ele: '#reachTime',
                    isClear: true,
                });
            }, 0);
        }

        function initOurCompanyAddr() {
            $scope.template.companyAddress = 'Sunrun Bunkering Limited\n4F HNA Tower\nNo. 898 Puming Road\nShanghai, China';
        }

        function initOurCompanyPhoneAndFax() {
            $scope.template.companyPhone = '+862161759009';
            $scope.template.companyFax = '+862161759000';
        }

        function initContactEmail() {
           $scope.template.companyEmail = 'wang_ye@hnair.com';
            $scope.template.trader = 'YL';
        }

        function GetGoodList(q, currentPage) {
            q = q ? q : '';

            if (!currentPage) {
                currentPage = 1;
            }


            var data = {
                q: q ? q.trim() : '',
                pageIndex: currentPage,
                pageSize: 10,
                orderType: 'SALE',
                businessType: 2,
                projectId: $scope.projectId,
                purchaserId: $scope.purchaserId,
                sellId: $scope.sellerId
            };
            return tradeOrdersService.getTrdGoodsShortList(data);
        }

        function InitGoodsSelect() {
            setTimeout(function () {
                $scope.goodsData = GetGoodList();

                $scope.goodsData.data.forEach(function (item) {
                    item.showName = item.goodsTypeName + ': ' + item.name + '(' + item.code + ')';
                });

                var select = selectFactory({
                    data: $scope.goodsData,
                    isSearch: true,
                    isUsePinyin: true,
                    id: 'orderGood',
                    isCreateNewSelect:true,
                    pagination: true,
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入名称或编码',
                    showTextField: 'showName',
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        var GoodsData = GetGoodList(data, currentPage);

                        GoodsData.data.forEach(function (item) {
                            item.showName = item.goodsTypeName + ': ' + item.name + '(' + item.code + ')';
                        });
                        attachEvent.setData(GoodsData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.orderGoodId = '';
                        } else {
                            $scope.orderGoodId = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.orderGoodName = name;
                        $scope.$apply();
                    },
                });
                select.setData($scope.goodsData);
                // select.open();
            }, 0);
        }

        $scope.addGoods = function () {
            if (!$scope.orderGoodId) {
                tradeOrdersView.promptBox({ msg: '请先选择商品!' });
                return;
            }

            tradeOrdersService.getGoodsOrderById($scope.orderGoodId).then(function (res) {
                if (res.errorCode == 0) {
                    transKeys(res.data);
                }
            });

            function transKeys(data) {
                var good = {
                    goodsName: data.goodsName,
                    goodsUnit: data.unit,
                    goodsPrice: data.price.toFixed(2),
                    goodsId: data.id,
                    goodsCurrencyType:data.currencyType,
                };
                $scope.template.orderGoods.push(good);
                $scope.template.currencyUnit = $scope.template.orderGoods[0].goodsCurrencyType;
            }
        };



        //初始化Account，并获得对应的Bank、Address、Swift、Holder信息，以上信息可以编辑

        $scope.initAccountNo = function () {

            if(!$scope.sellerId) return;

            $scope.accountData = tradeOrdersService.getAccountNoBySellId($scope.sellerId);

            accountEle =  selectFactory({
                data: {},
                id: "accountNo",
                showTextField: "accountNo",
                defaultText: "请选择",
                isCreateNewSelect :true,
                isReadOnly:false,
                attrTextModel: function (name, data, currentData) {
                    if (!name) {
                        $scope.template.accountNo = '';
                        $scope.template.bankName = '';
                        $scope.template.bankAddr = '';
                        $scope.template.Swift = '';
                        $scope.template.holder = '';
                        $scope.template.payCurrency = '';
                    } else {
                        $scope.template.accountNo = currentData.accountNo;
                        $scope.template.bankName = currentData.bank;
                        $scope.template.bankAddr = currentData.address;
                        $scope.template.Swift = currentData.swift;
                        $scope.template.holder = currentData.holder;
                        $scope.template.payCurrency = currentData.currency;
                    }
                    $scope.$apply();

                }
            });

            setTimeout(function(){
                accountEle.setData($scope.accountData);
                accountEle.open();
            },100);


            // var accountEle =  selectFactory({
            //     data: $scope.accountData,
            //     id: "accountNo",
            //     showTextField: "accountNo",
            //     defaultText: "请选择",
            //     isCreateNewSelect :true,
            //     isReadOnly:false,
            //     attrTextModel: function (name, data, currentData) {
            //         if (!name) {
            //             $scope.template.accountNo = '';
            //             $scope.template.bankName = '';
            //             $scope.template.bankAddr = '';
            //             $scope.template.Swift = '';
            //             $scope.template.holder = '';
            //             $scope.template.payCurrency = '';
            //         } else {
            //             $scope.template.accountNo = currentData.accountNo;
            //             $scope.template.bankName = currentData.bank;
            //             $scope.template.bankAddr = currentData.address;
            //             $scope.template.Swift = currentData.swift;
            //             $scope.template.holder = currentData.holder;
            //             $scope.template.payCurrency = currentData.currency;
            //         }
            //         $scope.$apply();
            //
            //     }
            // });
            // accountEle.setData($scope.accountData);
            // accountEle.open()
        }


        function initData(data) {
            $scope.template = data;

            $scope.template.currencyUnit = $scope.template.orderGoods[0].goodsCurrencyType; // 所有的商品都是统一的货币类型
            $scope.template.InvoiceNo = new Date().format('yyyyMMdd');
            $scope.template.createTime = tradeOrdersView.DataFormat(new Date().format('yyyy-MM-dd 00:00:00'));
            $scope.template.vat = 0.00;
            $scope.template.purchaserCompanyName = data.purchaserCompanyName || data.purchaserCustomerName;//有可能客户注册的时候不填写

            $scope.template.purchaserCompanyName = tradeOrdersView.StringInsertByInterval($scope.template.purchaserCompanyName,'\n',30) // 处理itext不换行的问题

            for(var index= 0 ;index < $scope.template.orderGoods.length;index++){
                if($scope.template.orderGoods[index].goodsNum){
                    $scope.template.orderGoods[index].goodsNum = $scope.template.orderGoods[index].goodsNum.toFixed(4);
                }
                if($scope.template.orderGoods[index].goodsPrice){
                    $scope.template.orderGoods[index].goodsPrice = $scope.template.orderGoods[index].goodsPrice.toFixed(2);
                }

                $scope.template.orderGoods[index].goodsName = tradeOrdersView.StringInsertByInterval($scope.template.orderGoods[index].goodsName,'\n',30);
            }

            // 获取全部商品所需要的信息
            $scope.purchaserId = data.orderType === 'SALE' ? data.purchaserCustomerId : data.purchaserId;
            $scope.projectId = data.projectId;
            $scope.sellerId = data.sellerId;


            initOurCompanyAddr();
            initOurCompanyPhoneAndFax();
            initContactEmail();
            //$scope.initAccountNo();

            goodList = GetGoodList();
        }

        function init() {
            $scope.pageSize = 1;
            initCalander();
            getOrderInfo();
            InitGoodsSelect();

        }

        init();

        // 中间价格部分

        function round(v, e) {
            var t = 1;
            for (; e > 0; t *= 10, e--) {}
            for (; e < 0; t /= 10, e++) {}

            return Math.round(v * t) / t;
        }

        $scope.goodsToTal = function (item) {
            var goodsToTal = round(Number(item.goodsPrice * item.goodsNum), 2);
            if (isNaN(goodsToTal)) {
                goodsToTal = 0;
            }

            return item.amountDue = goodsToTal.toFixed(2);
        };

        $scope.allGoodsToTal = function (data) {
            if (!data) {
                $scope.template.noVat = 0;
                return $scope.template.noVat;
            }

            var total = 0;
            data.forEach(function (item) {
                var num = Number(item.amountDue);
                if (!isNaN(num)) { total += num; }
            });
            $scope.template.noVat = round(Number(total), 2);

            return $scope.template.noVat.toFixed(2);
        };

        $scope.totalAmount = function () {
            if (isNaN($scope.template.vat) || !$scope.template.noVat) {
                $scope.totalWithVAT = 0;
                return;
            }

            var total = Number($scope.template.noVat) + Number($scope.template.vat);
            $scope.totalWithVAT = round(Number(total), 2);
            return $scope.totalWithVAT.toFixed(2);
        };

        $scope.checkOne = function (item, data) {
            item.checked = !item.checked;
            var isAll = true;
            data.forEach(function (item) {
                if (!item.checked) {
                    isAll = false;
                }
            });
            $scope.isAllchecked = isAll;
        };
        $scope.isAllchecked = false;
        $scope.checkAll = function (data) {
            $scope.isAllchecked = !$scope.isAllchecked;
            data.forEach(function (item) {
                item.checked = $scope.isAllchecked;
            });
        };

        $scope.deleteGoods = function () {
            var orderGoods = $scope.template.orderGoods;
            orderGoods.forEach(function (item, index) {
                if (item.checked) {
                    orderGoods.splice(index, 1);
                    $scope.deleteGoods();
                }
            });
            if ($scope.isAllchecked) {
                $scope.isAllchecked = false;
            }

        };

        $scope.goodsNum = function (item) {
            var goodNum = Number(item.goodsNum).toFixed(4);
            return goodNum;

        }

        $scope.Vat = function (item) {
            var vat = Number(item).toFixed(2);
            return vat;

        }

        $scope.goodsPrice = function (item) {
            var goodsPrice = Number(item.goodsPrice).toFixed(2);
            return goodsPrice;

        }



        // 备注部分的格式化

        $scope.template.remarkOne='';
        // $scope.remarkOnetextareaNumber = 1000 -$scope.template.remarkOne.length;
        //
        // $scope.showRemarkOneTextNumber = function () {
        //     $scope.remarkOnetextareaNumber = 1000 - $scope.template.remarkOne.length;
        // }

        $scope.template.remarkTwo='';
        // $scope.remarkTwotextareaNumber = 1000 -$scope.template.remarkTwo.length;
        //
        // $scope.showRemarkTwoTextNumber = function () {
        //     $scope.remarkTwotextareaNumber = 1000 - $scope.template.remarkTwo.length;
        // }

        // 时间部分的格式化

        $scope.createTimeFormat = function (dateInput) {
            $scope.template.createTime = tradeOrdersView.DataFormat(dateInput);
        }


        $scope.reachTimeFormat = function (dateInput) {

            $scope.template.reachTime =  tradeOrdersView.DataFormat2(dateInput);

        }

        $scope.latestPayTimeFormat = function (dateInput) {
            $scope.template.latestPayTime =  tradeOrdersView.DataFormat2(dateInput);
        }



        // 提交部分

        function canSubmit() {

            var formCheckField = ['custCompanyAddress','InvoiceNo','bankName','shipName','destinationPort',
                'reachTime','trader','vat','latestPayTime','bankAddr','Swift',
                'accountNo','holder','currencyUnit','companyAddress','companyPhone','companyFax','companyEmail','payCurrency'];

            formCheckField.forEach(function (checkField) {
                if(!$scope.template[checkField]){
                    $scope.sunRunTemplate[checkField].$setDirty();
                }

            })

            for (index = 0; index < $scope.template.orderGoods.length; index++) {
                if (!$scope.template.orderGoods[index].goodsNum) {
                    $scope.sunRunTemplate['goodsNum' + index].$setDirty();
                }
            }


            var errorEles = $('.errors');
            for (var index = 0; index < errorEles.length; index++) {
                if (!$(errorEles[index]).hasClass('ng-hide')) {
                    return false;
                }
            }

            return $scope.sunRunTemplate.$valid;
        }

        $scope.confirm = function () {
            if (canSubmit() == false) {
                scrollToErrorView($("#form-content"))
                return;
            }

            $scope.template.companyAddress = tradeOrdersView.SectionBreakWord($scope.template.companyAddress,40);
            $scope.template.custCompanyAddress = tradeOrdersView.SectionBreakWord($scope.template.custCompanyAddress,40);
            $scope.template.remarkOne = tradeOrdersView.SectionBreakWord($scope.template.remarkOne,100);
            $scope.template.remarkTwo = tradeOrdersView.SectionBreakWord($scope.template.remarkTwo,100);


            tradeOrdersView.promptMidBox('', { msg: '确定提交信息？提交后不能修改！' }, '', function () {
                var param = {
                    urlParams: encodeURIComponent($('#sunRunDeliverOrderConfirm').html()),

                    seatParams: {
                        orderNo: $scope.template.orderNo,
                        type: 2,
                    },
                };

                // 需要改变状态
                $scope.template.vat = Number($scope.template.vat);

                var data = angular.copy($scope.template);
                delete data.id;


                tradeOrdersService.confirmTrdDeliveryOrder(data).then(function (res) {
                    if (res.errorCode == 0) {
                        tradeOrdersService.exportPDFByOrderNo(param, function (returnData) {
                            tradeOrdersView.promptBox(returnData);
                            $scope.fileUrl = returnData.data.fileUrl;
                            $scope.pageSize = returnData.data.pageSize;
                            $scope.IsEdit = false;
                            $scope.$apply();
                        });
                    } else {
                        tradeOrdersView.promptBox(res);
                    }
                });

                // tradeOrdersService.confirmTrdDeliveryOrder(param)
                // 还需要把变更的都给后台发一遍
            });
        };
    }
});
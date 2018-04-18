easySpa.require([
    "service/templateService"
], function(){
    app.controller("normalDeliveryOrderController",['$scope','tradeOrdersService','tradeOrdersView', 'templateService', normalDeliveryOrderController]);

// orderStatusCode
// 2 是待发货
// 3 是待收货

    function normalDeliveryOrderController($scope, tradeOrdersService,tradeOrdersView, templateService){



        function getOrderInfo() {
            // var customerType = $scope.orderType === 'SALE' ? 1 : 2;

            tradeOrdersService.getOrderInfoByOrderNoNormal($scope.orderNo,function (res) {
                if (res.errorCode == 0) {
                    $scope.template.orderGoods = res.data.orderGoods;
                    $scope.template.currencyUnit = res.data.currencyUnit;
                    $scope.projectId = res.data.projectId;
                    $scope.purchaserId = res.data.purchaserId;
                    $scope.sellerId = res.data.sellId;
                } else {
                    tradeOrdersView.promptBox({ msg: res.msg });
                }

            })
        }


        //商品部分 start

        function GetGoodList(q, currentPage) {
            q = q ? q : '';

            if (!currentPage) {
                currentPage = 1;
            }
            var orderType = easySpa.queryUrlValByKey("action") == 'purchase' ? 'PURCHASE' : 'SALE';
            var data = {
                q: q ? q.trim() : '',
                pageIndex: currentPage,
                pageSize: 10,
                orderType: orderType,
                businessType: 2,
                projectId: $scope.projectId,
                purchaserId: $scope.purchaserId,
                sellId: $scope.sellerId,
            };
            return tradeOrdersService.getTrdGoodsShortList(data);
        }

        $scope.InitGoodsSelect = function(){

                if(!$scope.goodsData){
                    $scope.goodsData = GetGoodList();
                    $scope.goodsData.data.forEach(function (item) {
                        item.showName = item.goodsTypeName + ': ' + item.name + '(' + item.code + ')';
                    });
                }

                var select = selectFactory({
                    data: $scope.goodsData,
                    isSearch: true,
                    isUsePinyin: true,
                    isCreateNewSelect:true,
                    id: 'orderGood',
                    pagination: true,
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入名称或编码',
                    showTextField: 'showName',
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        var GoodsData = GetGoodList(data,currentPage);

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
                //select.open();

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

        //商品部分 end
        
        
        function canSubmit() {
            for (index = 0; index < $scope.template.orderGoods.length; index++) {
                if (!$scope.template.orderGoods[index].goodsNum) {
                    $scope.normalDeliveryTemplate['goodsNum' + index].$setDirty();
                }
            }


            var errorEles = $('.errors');
            for (var index = 0; index < errorEles.length; index++) {
                if (!$(errorEles[index]).hasClass('ng-hide')) {
                    return false;
                }
            }

            return $scope.normalDeliveryTemplate.$valid;
            
        }

        $scope.confirm = function () {
            if (canSubmit() == false) {
                scrollToErrorView($("#form-content"))
                return;
            }

            tradeOrdersView.promptMidBox('', { msg: '确定提交信息？提交后不能修改！' }, '', function () {
                // 需要改变状态
                $scope.template.vat = Number($scope.template.vat);
                $scope.template.orderNo = $scope.orderNo;
                $scope.template.noVat = Number($scope.template.noVat);

                tradeOrdersService.confirmTrdDeliveryOrderNormal($scope.template,function (res) {
                    tradeOrdersView.promptBox(res);

                    if(res.errorCode ==0){
                        setTimeout(function () {
                            $scope.goBack('fresh');
                        },200)
                    }

                })

            });

        }

        $scope.goodsToTal = function (item) {
            var goodsToTal = (Number(item.goodsPrice * item.goodsNum)).toFixed(2);
            if (isNaN(goodsToTal)) {
                goodsToTal = 0;
            }

            return item.amountDue = goodsToTal;
        };

        $scope.totalAmountWithoutVat = function (data) {
            if (!data) {
                $scope.template.noVat = 0;
                return $scope.template.noVat;
            }

            var total = 0;
            data.forEach(function (item) {
                var num = Number(item.amountDue);
                if (!isNaN(num)) { total += num; }
            });
            $scope.template.noVat = total.toFixed(2)

            return $scope.template.noVat;
        };

        $scope.totalAmount = function () {
            if (isNaN($scope.template.vat) || !$scope.template.noVat) {
                $scope.totalWithVAT = 0;
                return;
            }

            var total = Number($scope.template.noVat) + Number($scope.template.vat);
            $scope.totalWithVAT = total.toFixed(2);
            return $scope.totalWithVAT;
        };



        function init() {
            $scope.template = {};
            $scope.template.vat = 0;
            $scope.template.orderGoods=[];
            $scope.IsEdit = true;

            getOrderInfo();
            setTimeout(function () {
                $scope.InitGoodsSelect()
            },0)

        }

        init();

    }
});
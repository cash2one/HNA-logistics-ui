easySpa.require([
    'widget/tab',
    'widget/prompt',
    'widget/parseUrl',
    'public/javascripts/fragment/addProduct/baseInfoCtr.js',
    'public/javascripts/fragment/addProduct/productRangeCtr.js',
    'public/javascripts/fragment/addProduct/productServeCtr.js',
    'public/javascripts/fragment/addProduct/weightRegularCtr.js'
], function () {
    app.controller('addProductCtrl', [
        '$scope',
        'addProductService',
        'addProductView',
        '$route',
        '$timeout',
        function ($scope, addProductService, addProductView, $route, $timeout) {
            var backId = sessionStorage.getItem('backPricePath');
            var backType = sessionStorage.getItem('backPriceType');
            var backModule = sessionStorage.getItem('backPriceModule');
            $scope.parameter = window.parseUrl.getParams();
            function bindEvent() {
                reSetMenuCssStatus('#/customer');
                $scope.goBackProduct = function () {
                    if (backId) {
                        if (backType) {
                            location.href = '#/priceDetail?module=' + backModule + '&q=price&uid=' + backId + '&type=' + backType;
                        } else {
                            location.href = '#/priceDetail?module=' + backModule + '&q=price&uid=' + backId;
                        }
                    } else {
                        if ($scope.isEdit || sessionStorage.getItem('isEdit') === '1') {
                            $(document).promptBox({
                                title: Lang.getValByKey('common', 'common_prompt_title'),
                                type: 'warning',
                                content: {
                                    tip: Lang.getValByKey('common', 'common_back_confirm')
                                },
                                cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                                operation: [
                                    {
                                        type: 'submit',
                                        application: 'delete',
                                        description: Lang.getValByKey('common', 'common_back_yes'),
                                        operationEvent: function () {
                                            if ($route.current.params && $route.current.params.orderNo) {
                                                top.location.href = 'http://' + location.host + '/#/confirmOrder?orderNum=' + $route.current.params.orderNo;
                                            } else {
                                                var type = easySpa.queryUrlValByKey('type');
                                                var from = easySpa.queryUrlValByKey('from');
                                                location.href = '#/product?module=' + from + '&type=' + type;
                                            }
    
                                            $scope.$apply();
                                            $(document).promptBox('closePrompt');
                                        }
                                    }
                                ]
                            });
                        } else {
                            if ($route.current.params && $route.current.params.orderNo && $route.current.params.orderNo !=="undefined") {
                                $scope.topParameter = window.parseUrl.getTopParams();
    
                                var workId = $scope.topParameter.workId || '',
                                    isJustShow = $scope.topParameter.isJustShow || false;
                                top.location.href = 'http://' + location.host + '/#/confirmOrder?orderNum=' + $route.current.params.orderNo + '&id='+workId + '&isJustShow=' + isJustShow + '&from=' + $scope.topParameter.origin;
                            } else {
                                var type = easySpa.queryUrlValByKey('type');
                                var from = easySpa.queryUrlValByKey('from');
                                location.href = '#/product?module=' + from + '&type=' + type;
                            }
                        }
                    }
                };
            }
    
            if ($route.current.params && $route.current.params.from === 'new') {
                $scope.isAudit = false;
            } else {
                $scope.isAudit = true;
            }
    
            if ($route.current.params.type === '1') {
                $scope.isPreview = false;
            } else {
                $scope.isPreview = true;
            }
    
            function getProductBaseInfo(uid) {
                addProductService.getProductBaseInfo(uid, function (result) {
                    if (typeof result.data.isOnline === 'boolean') {
                        $scope.isOffline = !result.data.isOnline;
                    } else {
                        $scope.isOffline = result.data.isOnline;
                    }
                    $scope.status = result.data.status;
                    $scope.id = result.data.id;
                    $scope.IsDraftStatus = result.data.status === 1;
    
                    if (backId) {
                        $scope.canEditBase = false;
                    } else {
                        if ($scope.isAudit) {
                            if ($scope.IsDraftStatus || $scope.isOffline) {
                                $scope.canEditBase = true;
                            }
                        } else {
                            if ($scope.IsDraftStatus) {
                                $scope.canEditBase = true;
                            }
                        }
                    }
                });
            }
    
            function Msg(data) {
                if (data.errorCode === 0) {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                }
            }
    
            function confirm(callback, message, cancelCb) {
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: message
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_pagination_confirm'),
                            application: 'confirm',
                            operationEvent: function () {
                                $(document).promptBox('closePrompt');
                                callback();
                            }
                        }
                    ],
                    cancelEvent: function () {
                        if (typeof cancelCb === 'function') {
                            cancelCb();
                        }
                    }
                });
            }
    
            $scope.submitVerify = function () {
                confirm(function () {
                    addProductService.submitProducts($scope.uid, function (result) {
                        Msg(result);
                        if (result.errorCode == 0) {
                            $timeout(function () {
                                $scope.goBackProduct();
                            }, 1000);
                        }
                    });
                }, '确定该产品内容无误并提交审核？');
            };
    
            $scope.productEnable = function () {
                confirm(function () {
                    addProductService.onlineProdcut($scope.uid, function (result) {
                        Msg(result);
                        if (result.errorCode == 0) {
                            $scope.productInfo.isOnline = true;
                            $scope.$digest();
                            window.location.reload();
                        }
                    });
                }, '确定启用该产品？');
            };
    
            $scope.productDisable = function () {
                confirm(function () {
                    addProductService.offlineProdcut($scope.uid, function (result) {
                        Msg(result);
                        if (result.errorCode == 0) {
                            $scope.productInfo.isOnline = false;
                            $scope.$digest();
                            window.location.reload();
                        }
                    });
                }, '确定停用该产品？');
            };
            $scope.setPageTitle = function (title) {
                $scope.productTitle = title;
            };
            $scope.setProductInfo = function (productInfo, isNew) {
                if (!$scope.isNew) {
                    $scope.isNew = isNew;
                }
                if (!$scope.isNew) {
                    $scope.setPageTitle(Lang.getValByKey('addProduct', 'product_detail'));
                }
                $scope.productInfo = productInfo;
    
                // 判断是否为停用状态
                if ($scope.productInfo.isOnline === false) {
                    $scope.isOffline = true;
                }
            };
    
            function initPageData() {
                if (location.href.indexOf('uid') == -1) {
                    return;
                }
                var uid = easySpa.queryUrlValByKey('uid');
                var id = easySpa.queryUrlValByKey('id');
                if (uid) {
                    $scope.uid = uid;
                    $scope.id = id;
                    getProductBaseInfo($scope.uid);
                }
            }
    
            //  var isReset = true;
    
            function resetEvent(index) {
                $scope.resetTabScroll();
                // if(!isReset) return;
                switch (index) {
                    case 0: {
                        $scope.$broadcast('baseInfoEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 1: {
                        $scope.$broadcast('weightRegularEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 2: {
                        $scope.$broadcast('productServeEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 3: {
                        $scope.$broadcast('productRangeEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    default:
                        break;
                }
                try{
                    $scope.$apply();
                }catch(e){}
                //  isReset = true;
            }
    
            // var oldIndex = 0;
    
            function initTab() {
                $scope.resetTabScroll = function () {
                    setTimeout(function () {
                        $('.tab-content').scrollTop(0);
                    }, 100);
                };
                $scope.swichEvent = function (index) {
                    // if(oldIndex === 0 && index != 0 && $scope.isEdit ){
                    //     confirm(function(){
                    //         isReset = true;
                    //         resetEvent(index);
                    //         oldIndex = index;
                    //     }, '确定要放弃编辑该产品基本信息吗?',function(){
                    //         isReset = false;
                    //         $scope.tab.toggle(0);
                    //     });
                    // }else{
                    resetEvent(index);
                    //  oldIndex = index;
                    // }
                };
    
                /** tab切换组件 */
                $scope.tab = addProductView.tab('#m-tab', $scope.swichEvent);
                if (!$scope.uid) {
                    $scope.tab.exdisable(0);
                    $scope.isEdit = true;
                } else {
                    $scope.isEdit = false;
                }
                setTimeout(function () {
                    $scope.$broadcast('baseInfoEvent', {});
                }, 200);
            }
            initPageData();
            initTab();
            bindEvent();
    
            var index = easySpa.queryUrlValByKey('index');
            if (index) {
                $scope.tab.selected(index);
                setTimeout(function () {
                    $scope.$broadcast('productRangeEvent', {}); // 向子类发出重置数据事件
                }, 200);
            }
        }
    ]);
});

window.addEventListener(
    'hashchange',
    function () {
        sessionStorage.setItem('backPricePath', '');
    },
    false
);
window.addEventListener(
    'hashchange',
    function () {
        sessionStorage.setItem('isEdit', '');
    },
    false
);

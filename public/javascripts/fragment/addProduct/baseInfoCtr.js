easySpa.require(['widget/prompt', 'public/javascripts/fragment/selectTypes/selectTypesCtrl.js', 'public/javascripts/fragment/selectTypes/selectTypesService.js', 'public/common/pictureController.js'], function () {
    app.controller('baseInfoCtr', [
        '$scope',
        'addProductService',
        '$route',
        'pictureService',
        function ($scope, addProductService, $route, pictureService) {
            var backId = sessionStorage.getItem('backPricePath');
    
            $scope.$on('baseInfoEvent', function () {
                // 接受初始化
                $scope.isEdit = false;
                $scope.baseInfoForm = {};
                $scope.isPublic = true;
                $scope.acceptType = 1;
                $scope.productGroupPublic = true;
                if ($route.current.params && $route.current.params.from === 'new') {
                    $scope.isAudit = false;
                    if (!$scope.uid) {
                        $scope.isEdit = true;
                    }
                } else {
                    $scope.isAudit = true;
                }
                $scope.init();
                $scope.$apply();
            });
    
            //   $scope.auditStatus = "audit";
    
            $scope.init = function () {
                if ($scope.uid) {
                    getProductBaseInfo($scope.uid);
                } else {
                    $scope.setPageTitle(Lang.getValByKey('addProduct', 'product_add_title'));
                    $scope.isNew = true;
                }
                initestimatedTime();
                initProductGroup();
                initWeightList();
                initGoodTypes();
                if ($scope.uid && $scope.id) {
                    initSelectedValue();
                }
            };
    
            $scope.editBaseInfo = function () {
                $scope.isEdit = true;
                $scope.$parent.isEdit = true;
                sessionStorage.setItem('isEdit', 1);
                $scope.canEditBase = false;
            };
    
            $scope.cancel = function () {
                if (oldData) {
                    angular.extend($scope, oldData);
                }
                $scope.isEdit = false;
                $scope.$parent.isEdit = false;
                sessionStorage.setItem('isEdit', 0);
                $scope.canEditBase = true;
            };
    
            var oldData;
    
            $scope.$watch('isEdit', function (n, o) {
                if (n) {
                    oldData = getScopeData();
                }
            });
    
            function getScopeData() {
                var data = {};
                for (var key in $scope) {
                    if (key.indexOf('$') === -1 && typeof $scope[key] !== 'object' && typeof $scope[key] !== 'function') {
                        data[key] = $scope[key];
                    }
                }
                data.cargos = $scope.cargoTypeCode;
                delete data.cargoTypeCode;
                return data;
            }
    
            /** 图片上传 */
            $scope.delshow = false;
            $scope.pictureModel = {
                'edit': true,    //是否编辑状态
                'uploadShow': false,    //是否显示上传按钮图标
                'picture': [],    //图片存放地址
                'accept':'image/jpg,image/jpeg,image/png,image/bmp,image/tiff'
            };
            $scope.getFile = function (files) {
                var result = pictureService.uploadFile($scope.pictureModel, files[0]);
                if (!result) {
                    return false;
                }
                if (result.errorlocal) {
                    $(document).promptBox({ isDelay: true, contentDelay: result.errorlocal, type: 'errer', manualClose: true });
                } else {
                    result.then(function (res) {
                        if (res.data.errorCode === 0) {
                            //res.data.data为图片对应的 picUrlID
                            $scope.validatePictureError = false;
                            $scope.image = res.data.data.path;
                            $scope.imgUrl = res.data.data.path;
                            $scope.hasUpload = true;
                            $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'success' });
                        } else {
                            $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'errer', manualClose: true });
                        }
                    });
                }
            };
            $scope.delPic = function(){
                $scope.imgUrl = '';
                $scope.hasUpload = false;
            }

            $scope.saveCustomer = function () {
                if (!checkValue()) {
                    scrollToErrorView($(".tab-content"));
                    return;
                }
                $scope.isEdit = false;
                $scope.$parent.isEdit = false;
                sessionStorage.setItem('isEdit', '');
                $scope.canEditBase = true;
                var data = getScopeData();
                if ($scope.uid) {
                    addProductService.modifyProductBaseInfo($scope.uid, data, generalCallback);
                } else {
                    addProductService.saveCustomer(data, function (result) {
                        if (result.errorCode === 0) {
                            $scope.$parent.uid = $scope.uid = result.data.uid;
                            $scope.$parent.id = $scope.id = result.data.id;
                            getProductBaseInfo(result.data.uid);
                            // $scope.tab.enableAll();
                        }
                        generalCallback(result);
                        // $scope.$apply();
                    });
                }
            };
    
            $scope.$watch('isEdit', function () {
                $scope.checkCode(1);
            });
    
            $scope.checkCode = function (close) {
                //$scope.customerForm.code.$setPristine();
                //$scope.codeErrorMsg = '';
                if (close) {
                    return;
                }
                if ($scope.code === $scope.oldCode) {
                    $scope.codeError = true;
                    return;
                }
                if (!$scope.code) {
                    return;
                }
                addProductService.productCheckCode($scope.code, function (res) {
                    if (res.errorCode !== 0) {
                        $scope.customerForm.code.$setDirty();
                        $scope.codeErrorMsg = res.msg;
                        $scope.codeError = false;
                    } else if (res.errorCode === 0) {
                        $scope.codeError = true;
                        $scope.customerForm.code.$setPristine();
                        $scope.codeErrorMsg = '';
                    }
                    $scope.$degist();
                });
            };
    
            function checkAudit() {
                var passed = true;
                if (!$scope.auditStatus) {
                    $scope.customerForm.auditStatus.$setDirty();
                    passed = false;
                }
                if (!$scope.auditRemark) {
                    $scope.customerForm.auditRemark.$setDirty();
                    passed = false;
                }
                return passed;
            }
    
            $scope.submitAudit = function () {
                if (checkAudit()) {
                    addProductService.auditAndRejections($scope.auditStatus, $scope.uid, $scope.auditRemark, function (result) {
                        generalCallback(result);
                        if (result.errorCode === 0) {
                            setTimeout(function () {
                                $scope.goBackProduct();
                            }, 1000);
                        }
                    });
                }
            };
    
            function generalCallback(data) {
                if (data.errorCode === 0) {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                    $(document).promptBox('closePrompt');
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                }
            }
    
            function getProductBaseInfo(uid) {
                addProductService.getProductBaseInfo(uid, function (result) {
                    $.extend($scope, result.data);
                    if(result.data.image){
                        $scope.hasUpload = true;
                        $scope.imgUrl = result.data.image;
                    }else {
                        $scope.hasUpload = false;
                    }
                    $scope.oldCode = $scope.code;
                    if (typeof result.data.isOnline === 'boolean') {
                        $scope.isOffline = !result.data.isOnline;
                    } else {
                        $scope.isOffline = result.data.isOnline;
                    }
                    $scope.$parent.status = result.data.status;
                    $scope.$parent.IsDraftStatus = result.data.status === 1;
                    // $scope.productGroupPublic = result.data.isPublic;
                    $scope.setProductInfo(result.data, $scope.isNew);
                    if (backId) {
                        $scope.canEditBase = false;
                    } else {
                        if ($scope.isAudit) {
                            if ($scope.$parent.IsDraftStatus || $scope.isOffline) {
                                $scope.canEditBase = true;
                            }
                        } else {
                            if ($scope.$parent.IsDraftStatus) {
                                $scope.canEditBase = true;
                            }
                        }
                    }
                    $scope.tab.enableAll();
                    getUserDetail($scope.createUserId);
                });
            }
    
            function getUserDetail(id) {
                addProductService.getUserDetail(id, function (result) {
                    if (result.data) {
                        $scope.creator = result.data.fullName + ' ' + result.data.userName;
                    }
                });
            }
    
            function initGoodTypes() {
                var cargos = $scope.cargos;
                $scope.cargoTypeCode = [];
                $scope.cargoTypeCodeIndex = [];
                if (cargos && cargos.length > 0) {
                    $scope.cargoTypeCodeName = [];
                    cargos.forEach(function (item) {
                        $scope.cargoTypeCodeName.push(item.cargoTypeName);
                        $scope.cargoTypeCode.push({ cargoTypeCode: item.cargoTypeCode });
                        $scope.cargoTypeCodeIndex.push(item.cargoTypeCode);
                    });
                    $scope.cargoTypeCodeName = $scope.cargoTypeCodeName.join('，');
                }
            }
    
            function checkValue() {
                var keyArray = ['name', 'code', 'productGroupFirst', 'productGroupLeaf', 'introduction', 'cargoTypeCodeName'];
                var canSubmit = true;
                keyArray.forEach(function (key) {
                    if (!$scope[key]) {
                        $scope.customerForm[key].$setDirty();
                        canSubmit = false;
                    }
                });
    
                if (!($scope.codeError === true || typeof $scope.codeError === 'undefined')) {
                    canSubmit = false;
                }
    
                // if(($scope.weightLimitMin && $scope.weightLimitMax) && !$scope.weightLimitUnitName){
                //     $scope.customerForm.weightLimitUnitName.$setDirty();
                //     canSubmit = false;
                // }
    
                if (!$scope.estimatedTime && $scope.estimatedUnitName) {
                    $scope.customerForm.estimatedTime.$setDirty();
                    canSubmit = false;
                }
                if ($scope.estimatedTime && !$scope.estimatedUnitName) {
                    $scope.customerForm.estimatedUnitName.$setDirty();
                    canSubmit = false;
                }
    
                return canSubmit && $scope.canSubmit;
            }
    
            $scope.$watch('estimatedTime', function (n, o) {
                if (!n) {
                    $scope.customerForm.estimatedUnitName.$setPristine();
                }
            });
    
            // $scope.$watch(function(){
            //     if(!$scope.weightLimitMin && !$scope.weightLimitMax) return true;
            //     else return false;
            // }, function(n,o){
            //     if(n)  $scope.customerForm.weightLimitUnitName.$setPristine();
            // });
    
            $scope.selectGoodTypes = function () {
                $(document).promptBox({
                    isHidden: true,
                    title: '请选择货物类型',
                    isNest: true,
                    loadData: function () {
                        loadGoodsData();
                    },
                    content: {
                        nest: $('#getUnGoodTypes')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_prompt_confirm'),
                            operationEvent: function () {
                                submitGoodsTypes();
                            }
                        }
                    ]
                });
            };
    
            function submitGoodsTypes() {
                var types = $('#getUnGoodTypes input.active');
                var arr = [];
                var arrName = '';
                types.each(function (i) {
                    arr.push(types.eq(i).data('id'));
                    if (i === types.length - 1) {
                        arrName += types
                            .eq(i)
                            .parent()
                            .data('name');
                    } else {
                        arrName +=
                            types
                                .eq(i)
                                .parent()
                                .data('name') + '，';
                    }
                });
                $scope.cargoTypeCodeName = arrName;
                $scope.cargoTypeCodeIndex = [];
                $scope.cargoTypeCode = arr.map(function (item) {
                    $scope.cargoTypeCodeIndex.push(item);
                    return { cargoTypeCode: item };
                });
                $(document).promptBox('closeFormPrompt');
                $scope.$apply();
            }
    
            $scope.selectTypesModel = {
                selectedGoods: [],
                listGoodsTypes: $scope.listGoodsTypes
            };
    
            function loadGoodsData() {
                $scope.selectTypesModel.selectedGoods = [];
                addProductService.getGoodTypes(null, function (response) {
                    if (response.errorCode === 0) {
                        var sid = $scope.cargoTypeCodeIndex;
                        for (var i in response.data) {
                            if (response.data.hasOwnProperty(i)) {
                                response.data[i].id = response.data[i].code;
                                response.data[i].checked = false;
                                for (var j in sid) {
                                    if (response.data[i].id === sid[j]) {
                                        response.data[i].checked = true;
                                    }
                                }
                            }
                        }
    
                        var typeData = [];
                        for (var k in response.data) {
                            if (response.data[k].name) {
                                typeData.push(response.data[k]);
                            }
                        }
                        $scope.selectTypesModel.listGoodsTypes = typeData;
                    }
                });
            }
    
            function initSelectedValue() {
                var estimatedUnitWatch = $scope.$watch(
                    function () {
                        if ($scope.estimatedUnit && $scope.estimatedList) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    function (n, o) {
                        if (n) {
                            $scope.estimatedList.forEach(function (item) {
                                if ($scope.estimatedUnit === item.code) {
                                    $scope.estimatedUnitName = item.name;
                                }
                            });
                            estimatedUnitWatch();
                        }
                    }
                );
    
                var productGroupWacth = $scope.$watch(
                    function () {
                        if ($scope.productGroupList && $scope.productGroupLeafId) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    function (n, o) {
                        if (n) {
                            addProductService.searchProductGroup($scope.productGroupLeafId, function (result) {
                                $scope.productGroupPublic = result.data.childProductGroup[0]['public'];
                                $scope.productGroupFirst = result.data.name;
                                $scope.productGroupFirstId = result.data.id;
                            });
                            productGroupWacth();
                        }
                    }
                );
    
                // var WeightListWatch = $scope.$watch(function(){
                //     if($scope.weightLimitUnitCode && $scope.WeightList) return true;
                //         else return false;
                //     },function(n,o){
                //         if(n){
                //             $scope.WeightList.forEach(function(item){
                //                 if(item.code == $scope.weightLimitUnitCode){
                //                     $scope.weightLimitUnitName = item.name;
                //                 }
                //             });
                //             WeightListWatch();
                //         }
                //     });
            }
    
            function initestimatedTime() {
                addProductService.getProductEstimated(null, function (result) {
                    $scope.estimatedList = result.data;
                    // if ($scope.estimatedList.length > 0 && !$scope.uid) {
                        // $scope.estimatedList.forEach(function(item){
                        //    if(item.name === '天'){
                        //        $scope.estimatedUnit = item.code;
                        //        $scope.estimatedUnitName = item.name;
                        //    }
                        // });
                    // }
                    selectFactory({
                        data: result,
                        id: 'estimated-unit-name',
                        offset: -300,
                        attrTextModel: function (name, data, currentData) {
                            $scope.estimatedUnit = currentData.code;
                            $scope.estimatedUnitName = name;
                            $scope.$apply();
                        }
                    });
                });
            }
    
            function initWeightList() {
                $scope.weightLimitUnitCode = 'kg';
                $scope.weightLimitUnitName = '千克';
    
                // addProductService.getWeightList(null, function(result){
    
                // $scope.WeightList = result.data;
                // if($scope.WeightList.length > 0 && !$scope.uid){
                //      // $scope.WeightList.forEach(function(item){
                //      //    if(item.name === '千克'){
                //      //        $scope.weightLimitUnitCode = item.code;
                //      //        $scope.weightLimitUnitName = item.name;
                //      //    }
                //      // });
                // }
                // selectFactory({
                //     data: result,
                //     id: "weight-limit-unit-code",
                //     offset: -300,
                //     attrTextModel: function(name, data, currentData) {
                //          $scope.weightLimitUnitCode = currentData.code;
                //          $scope.weightLimitUnitName = name;
                //          $scope.$apply();
                //     }
                // });
                // });
            }
    
            function initProductGroup() {
                addProductService.getProductGroup(null, function (result) {
                    $scope.productGroupList = result.data;
                    selectFactory({
                        data: result,
                        id: 'product-group-first',
                        offset: -300,
                        attrTextModel: function (name, data, currentData) {
                            if (!name) {
                                groupLeft.setData({ data: [] });
                            }
                            $scope.productGroupFirst = name;
                            $scope.productGroupFirstId = currentData.id;
                            delete $scope.productGroupLeafId;
                            delete $scope.productGroupLeaf;
                            $scope.$apply();
                        }
                    });
                });
    
                var groupLeft = null;
                function productGroupLeafWatch(n, o) {
                    if (n) {
                        addProductService.getProductGroup(n, function (result) {
                            $scope.productGroupLeafData = result;
                            if ($scope.productGroupLeafId) {
                                result.data.forEach(function (item) {
                                    if (item.id === $scope.productGroupLeafId) {
                                        $scope.productGroupLeaf = item.name;
                                    }
                                });
                            }
                            if (!groupLeft) {
                                groupLeft = selectFactory({
                                    data: {},
                                    id: 'product-group-leaf',
                                    offset: -300,
                                    attrTextModel: function (name, data, currentData) {
                                        $scope.productGroupLeaf = name;
                                        if (name) {
                                            $scope.productGroupLeafId = currentData.id;
                                            $scope.productGroupPublic = currentData['public'];
                                            if (!currentData['public']) {
                                                $scope.isPublic = currentData['public'];
                                            }
                                        }
                                        $scope.$apply();
                                    }
                                });
                            }
                            groupLeft.setData(result);
                            $('#product-group-leaf').val($scope.productGroupLeaf);
                        });
                    }
                }
                $scope.$watch('productGroupFirstId', productGroupLeafWatch);
            }
        }
    ]);
});

window.onbeforeunload = function () {
    sessionStorage.setItem('isEdit', '');
};

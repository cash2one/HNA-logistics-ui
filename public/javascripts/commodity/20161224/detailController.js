easySpa.require(['widget/select', 'public/common/pictureController.js', 'widget/slides', 'public/common/pictureService.js'], function () {
    app.controller('detail', ['$scope', 'commodityService', 'commodityView', 'pictureService', detail]);
});

function detail($scope, commodityService, commodityView, pictureService) {
    $scope.name = 'detail';

    $scope.data = {
        purchaserLimit: 0,
        projectLimit: 0,
        enabled: 1,
        businessType: 2
    };

    $scope.isEdit = true;

    $scope.edit = function () {
        $scope.isEdit = true;
    };
    $scope.goBack = function () {
        if($scope.isEdit){
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
                            $(document).promptBox('closePrompt');
                            window.location.reload();
                        }
                    }
                ]
            });
        }else{
            window.location.reload();
        }
        
    };

    $scope.cancelEdit = function () {
        $scope.isEdit = false;
        getOneGoods($scope.id);
    };

    if ($scope.id) {
        $scope.isEdit = false;
        getOneGoods($scope.id);
    }

    function getOneGoods(id) {
        commodityService.getOneGoods(id).then(function (data) {
            if (data) {
                if (data.enabled) {
                    data.enabled = 1;
                } else {
                    data.enabled = 0;
                }
                if (data.purchaserCustomer && data.purchaserCustomer.length > 0) {
                    $scope.purchaserCustomerCodes = [];
                    data.purchaserCustomerCodes = [];
                    data.purchaserCustomer.forEach(function (item) {
                        $scope.purchaserCustomerCodes.push(item.userName + '(' + item.code + ')');
                        data.purchaserCustomerCodes.push(item.code);
                    });
                    $scope.purchaserCustomerCodes = $scope.purchaserCustomerCodes.join(',');
                }
                if (data.project && data.project.length > 0) {
                    $scope.projectIds = [];
                    data.projectIds = [];
                    data.project.forEach(function (item) {
                        $scope.projectIds.push(item.name + '(' + item.code + ')');
                        data.projectIds.push(item.id);
                    });
                    $scope.projectIds = $scope.projectIds.join(',');
                    // data.projectIds = data.projectIds.join(',');
                }
                if (data.image) {
                    $scope.fileUrl = data.image;
                }
                $scope.data = data;
                $scope.unitList && initWeight();
                // $scope.currencyList && $scope.autoCurrency();
            }
        });
    }

    autoCurrency();

    $scope.hsCodeError = false;
    $scope.checkLength = function (e) {
        if (e && !/^\d+(\.\d+)?$/.test(e)) {
            $scope.hsCodeError = true;
        } else {
            $scope.hsCodeError = false;
        }
    };

    $scope.descriptions = [{ name: 'a1' }, { name: 'a2' }];

    ['supplierName', 'purchaserCustomerCodes2', 'unitName', 'currencyName', 'projectIds2'].forEach(function (item) {
        delete Select.sharePool[item];
    });

    /* $scope.$watch('data.name', function (newVal) {
        if (newVal) {
            $scope.dataNameError = false;
        } else {
            $scope.dataNameError = true;
        }
    }); */

    $scope.save = function () {
        if (checkValue()) {
            scrollToErrorView($(".detail > div"));
            return;
        }
        if (!$scope.data.name) {
            $scope.dataNameError = true;
            return;
        }
        var promise;
        var data = angular.copy($scope.data);
        if ($scope.data.id) {
            promise = commodityService.updateOneGoods(data);
        } else {
            promise = commodityService.saveOneGoods(data);
        }
        if (data.enabled == '1') {
            data.enabled = true;
        } else {
            data.enabled = false;
        }
        if ($scope.fileUrl) {
            data.image = $scope.fileUrl;
        }
        promise.then(function (res) {
            commodityView.promptBox(res);
            // var id = res.data ? res.data : $scope.id;
            // getOneGoods(id);
            $scope.isEdit = false;
            $scope.goBack();
        });
    };

    function checkValue() {
        var keyArray = ['name', 'goodsTypeName', 'supplierName', 'unitName', 'price', 'currencyName'];
        var canSubmit = false;
        if ($scope.data.purchaserLimit == '1') {
            keyArray.push('purchaserCustomerCodes');
        }
        if ($scope.data.projectLimit == '1') {
            keyArray.push('projectIds');
        }

        keyArray.forEach(function (key) {
            if ((!$scope.data[key] || !$scope.data[key].length) && typeof $scope.data[key] !== 'number') {
                $scope.customerForm[key].$setDirty();
                canSubmit = true;
            }
        });
        return canSubmit;
    }

    function generalCallback(data) {
        if (data.errorCode == 0) {
            $(document).promptBox({
                isDelay: true,
                contentDelay: data.msg,
                type: 'success',
                time: 3000
            });
            $(document).promptBox('closePrompt');
        } else {
            $(document).promptBox({
                isDelay: true,
                contentDelay: data.msg,
                type: 'errer',
                manualClose: true
            });
        }
    }

    $scope.loadGoodsType = function () {
        commodityService.trdGoodTypeList().then(function (data) {
            commodityView.goodsTypes(
                data,
                $scope,
                {
                    name: $scope.data.goodsTypeName,
                    id: $scope.data.goodsTypeId
                },
                function (name, id) {
                    $scope.data.goodsTypeName = name;
                    $scope.data.goodsTypeId = id;
                }
            );
        });
    };

    $scope.setClass = function (type) {
        if (type === 'pro') {
            if ($scope.data.projectLimit != 0) {
                return 'show';
            }
        }
        if (type === 'pur') {
            if ($scope.data.purchaserLimit != 0) {
                if ($scope.data.projectLimit == 0) {
                    return 'show ml';
                }
                return 'show';
            }
        }
    };

    // 供应商列表下拉菜单
    $scope.getSuppelierData = function (q, currentPage) {
        if (!currentPage) {
            currentPage = 1;
        }
        q = q.length ? q.trim() : '';
        var config = {
            q: q,
            pageIndex: currentPage,
            pageSize: 10,
            isAsc: false,
            sortName: '',
            isIncludePlatform: 1
        };
        return commodityService.trdSuppelyList(config);
    };

    $scope.initSupplier = function () {
        var select = selectFactory({
            data: [],
            isSearch: true,
            isUsePinyin: true,
            defaultText: '请选择',
            id: 'supplierName',
            searchPlaceHoder: '请输入供应商名称或编码',
            showTextField: 'userName',
            attrTextField: {
                'ng-value': 'id'
            },
            pagination: true,
            closeLocalSearch: true,
            onSearchValueChange: function (attachEvent, data, currentPage) {
                $scope.suppelierData = $scope.getSuppelierData(data, currentPage);
                angular.forEach($scope.suppelierData.data, function (value, key) {
                    value.userName = value.name + ' (' + value.code + ')';
                });
                attachEvent.setData($scope.suppelierData);
                $scope.$apply();
            },
            attrTextId: function (id) {
                if (!id) {
                    $scope.data.supplierId = '';
                } else {
                    $scope.data.supplierId = id;
                }
                $scope.$apply();
            },
            attrTextModel: function (userName, list, present) {
                $scope.data.supplierName = userName;
                if ($scope.data.supplierCode !== present.code) {
                    $('#purchaserCustomerCodes2').val('');
                }
                $scope.data.supplierCode = present.code;
                $scope.$apply();
            }
        });
        select.open();
        if ($scope.data.supplierName) {
            $('#supplierName').val($scope.data.supplierName);
        }
    };

    // 采购企业下拉菜单
    $scope.getPurchaseData = function (q) {
        q = q.length ? q.trim() : '';
        var config = {
            q: q,
            pageIndex: 1,
            pageSize: 10,
            isAsc: false,
            sortName: '',
            userType: 2,
            supplierCode: $scope.data.supplierCode || ''
        };
        return commodityService.getCustomerShortGoods(config);
    };
    $scope.initPurchaseCus = function () {
        var timer = setInterval(function () {
            if ($('#purchaserCustomerCodes2').length > 0) {
                clearInterval(timer);
                timer = null;
                initPurchaseSelect();
            }
        }, 50);
        function initPurchaseSelect() {
            $scope.purchaserData = commodityService.getCustomerShortGoods({
                userType: 2
            });

            angular.forEach($scope.purchaserData.data, function (value, key) {
                value.userName += '(' + value.code + ')';
            });
            selectFactory({
                data: $scope.purchaserData,
                isSearch: true,
                isUsePinyin: true,
                multipleSign: ',',
                defaultText: '请选择',
                id: 'purchaserCustomerCodes2',
                searchPlaceHoder: '请输入企业名称或编码',
                showTextField: 'userName',
                attrTextField: {
                    'ng-value': 'id'
                },
                pagination: true,
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data) {
                    $scope.customerData = $scope.getPurchaseData(data);
                    angular.forEach($scope.customerData.data, function (value, key) {
                        value.userName += '(' + value.code + ')';
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.$apply();
                },
                attrTextModel: function (userName) {
                    var selectList = userName.split('，').map(function (item) {
                        return item.substring(item.indexOf('(') + 1, item.indexOf(')'));
                    });
                    var purchaserIdList = [];
                    for (var i = 0, iLength = selectList.length; i < iLength; i++) {
                        for (var j = 0, jLength = $scope.customerData.data.length; j < jLength; j++) {
                            if ($scope.customerData.data[j].code === selectList[i]) {
                                purchaserIdList.push($scope.customerData.data[j].code);
                            }
                        }
                    }
                    $scope.data.purchaserCustomerCodes = unique(purchaserIdList);
                    $scope.purchaserCustomerCodes = userName;
                    $scope.$apply();
                }
            });
        }
    };

    // 计量单位

    commodityService.weight().then(function (data) {
        $scope.unitList = data.data;
        $scope.data && initWeight();
    });

    function initWeight() {
        var data = $scope.unitList;
        if ($scope.data.unit) {
            data.forEach(function (item) {
                if (item.code == $scope.data.unit) {
                    $scope.data.unitName = item.name;
                }
            });
        } else {
            $scope.data.unit = 'kg';
            $scope.data.unitName = '千克';
        }

        selectFactory({
            data: { data: data },
            defaultText: '请选择',
            id: 'unitName',
            showTextField: 'name',
            attrTextField: {
                'ng-value': 'code'
            },
            attrTextId: function (code) {
                if (code === 'undefined') {
                    // 全部
                    $scope.data.unit = '';
                } else {
                    $scope.data.unit = code;
                }
                $scope.$apply();
            },
            attrTextModel: function (name) {
                if (name) {
                    $scope.data.unitName = name;
                    $scope.$apply();
                } else {
                    $scope.data.unitName = '';
                }
            }
        });
    }

    // 货币单位

    
    function autoCurrency() {
        // var data = $scope.currencyList;
        commodityService.getCurrencyList({ q: '', pageSize: 10, pageIndex: 1 }, function (res) {
            $scope.currencyList = res.data;
            res.data.forEach(function (item) {
                item.nameCode = item.name + '(' + item.code + ')';
            });
            if ($scope.data.currencyType) {
                res.data.forEach(function (item) {
                    if (item.code == $scope.data.currencyType) {
                        $scope.data.currencyName = item.name + '(' + item.code + ')';
                    }
                });
            } else {
                $scope.data.currencyType = 'CNY';
                $scope.data.currencyName = '人民币(CNY)';
            }
        });
    };
    
    $scope.manualCurrency = function () {
        var select = selectFactory({
            data: [],
            defaultText: '请选择',
            id: 'currencyName',
            showTextField: 'nameCode',
            isSearch: true,
            closeLocalSearch: true,
            pagination: true,
            searchPlaceHoder: '请输入货币名称或三字码',
            attrTextField: {
                'ng-value': 'code'
            },
            attrTextId: function (code) {
                if (code === 'undefined') {
                    // 全部
                    $scope.data.currencyType = '';
                } else {
                    $scope.data.currencyType = code;
                }
                $scope.$apply();
            },
            attrTextModel: function (name) {
                if (name) {
                    $scope.data.currencyName = name;
                } else {
                    $scope.data.currencyName = '';
                }
                $scope.$apply();
            },
            onSearchValueChange: function (attachEvent, q, currentPage) {
                commodityService.getCurrencyList({ q: q ? q.trim() : '', pageSize: 10, pageIndex: currentPage ? currentPage : 1 }, function (res) {
                    $scope.currencyList = res.data;
                    res.data.forEach(function (item) {
                        item.nameCode = item.name + '(' + item.code + ')';
                    });
                    attachEvent.setData(res);
                });
                $scope.$apply();
            }
        });
        setTimeout(function() {
            select.open();
        }, 50);
    }
    // 项目多选下拉菜单
    $scope.getProjectShortData = function (q, currentPage) {
        q = q.length ? q.trim() : '';
        var config = {
            project: q,
            pageIndex: currentPage,
            pageSize: 10,
            isAsc: false,
            sortName: ''
        };
        return commodityService.trdProjectsShort(config);
    };
    $scope.initProjectShort = function () {
        var timer = setInterval(function () {
            if ($('#projectIds2').length > 0) {
                clearInterval(timer);
                timer = null;
                initProjectSelect();
            }
        }, 50);
        function initProjectSelect() {
            $scope.projectData = $scope.getProjectShortData('', 1);
            angular.forEach($scope.projectData.data, function (value, key) {
                value.userName = value.name + '(' + value.code + ')';
            });
            selectFactory({
                data: $scope.projectData,
                isSearch: true,
                defaultText: '请选择',
                multipleSign: ',',
                id: 'projectIds2',
                searchPlaceHoder: '请输入项目名称或编码',
                showTextField: 'userName',
                attrTextField: {
                    'ng-value': 'id'
                },
                pagination: true,
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getProjectShortData(data, currentPage);
                    angular.forEach($scope.customerData.data, function (value) {
                        value.userName = value.name + '(' + value.code + ')';
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.$apply();
                },
                attrTextModel: function (userName) {
                    var selectList = userName.split('，').map(function (item) {
                        return item.substring(item.indexOf('(') + 1, item.indexOf(')'));
                    });
                    var projectIdList = [];
                    for (var i = 0, iLength = selectList.length; i < iLength; i++) {
                        for (var j = 0, jLength = $scope.customerData.data.length; j < jLength; j++) {
                            if ($scope.customerData.data[j].code === selectList[i]) {
                                projectIdList.push($scope.customerData.data[j].id);
                            }
                        }
                    }
                    $scope.data.projectIds = unique(projectIdList);
                    $scope.projectIds = userName;
                    $scope.$apply();
                }
            });
        }
    };

    $scope.pictureModel = {
        edit: true, // 是否编辑状态
        uploadShow: true, // 是否显示上传按钮图标
        picture: [], // 图片存放地址
        accept: 'image/jpg,image/jpeg,image/png,image/bmp,image/tiff'
    };

    $scope.getFile = function (el) {
        var result = pictureService.uploadFile($scope.pictureModel, $scope[el.target.id]);
        if (!result) {
            return false;
        }
        if (result.errorlocal) {
            $(document).promptBox({
                isDelay: true,
                contentDelay: result.errorlocal,
                type: 'errer',
                manualClose: false
            });
        } else {
            result.then(function (res) {
                if (res.data.errorCode === 0) {
                    // res.data.data为图片对应的 picUrlID
                    $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);
                    $scope.fileUrl = res.data.data.path;
                    $scope.$apply();
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.data.msg,
                        type: 'success'
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.data.msg,
                        type: 'errer',
                        manualClose: false
                    });
                }
            });
        }
    };
    $scope.getPictureUrl = function (fileid) {
        $('#slides').picturePreview({ pictureId: fileid }, $scope.pictureModel.picture);
    };
}

// Array.includes polyfill
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}

// 数组去重
function unique(arr) {
    var ret = [];
    var hash = {};
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var key = typeof item + item;
        if (hash[key] !== 1) {
            ret.push(item);
            hash[key] = 1;
        }
    }
    return ret;
}

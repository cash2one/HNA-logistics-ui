easySpa.require([
    'widget/prompt',
    'widget/tab',
    'public/javascripts/customer/20161224/customerService.js'
], function () {
    app.controller('productSettingCtrl', [
        '$scope',
        'customerService',
        function ($scope, customerService) {
            var $scopeData = {
                isPublic: true,
                isPublicOrigin: true,
                showLayer: false,
                editSetting: false,
                isUpdate: false,
                tabActive: 1,
                productGroupData: [],
                productData: [],
                selectedItem: '',
                selectedItemId: 1,
                selectedItemOriginStr: '',
                selectedItemStr: '',
                productSelecting: [],
                productSelectingOrigin: [],
                productSelected: [],
                productSelectedOrigin: [],
                searchSelecting: '',
                checkedAllSelecting: false,
                checkedAllSelected: false,
                productGroupIds: [],
                productUids: []
            };
            var $scopeMethod = {
                getProductVisiblity: function () {
                    customerService.getProductVisiblity({ customerId: $scope.customerId }, function (res) {
                        if (res.errorCode === 0 && typeof res.data.wbFlag === 'number') {
                            $scope.isUpdate = true;
                            $scope.isPublic = !+res.data.wbFlag;
                            $scope.isPublicOrigin = !+res.data.wbFlag;
                            if (res.data.products.length) {
                                $scope.selectedItemStr = res.data.products
                                    .map(function (item) {
                                        return item.name;
                                    })
                                    .join(',');
                                $scope.selectedItemOriginStr = $scope.selectedItemStr;
                                $scope.productSelecting = JSON.parse(JSON.stringify(res.data.products));
                                $scope.productSelected = JSON.parse(JSON.stringify(res.data.products));
                                $scope.productSelecting.forEach(function (item) {
                                    item.disabled = true;
                                    item.checked = true;
                                });
                                $scope.productSelected.forEach(function (item) {
                                    item.checked = false;
                                    item.disabled = false;
                                    if (item.uid) {
                                        $scope.productUids.push(item.uid);
                                    }
                                    if (!item.uid) {
                                        $scope.productGroupIds.push(item.id);
                                    }
                                });
                                $scope.productSelectingOrigin = JSON.parse(JSON.stringify($scope.productSelecting));
                                // 重置搜索源数据
                                $scope.productSelectedOrigin = JSON.parse(JSON.stringify($scope.productSelected));
                                // $scope.productSelectedOrigin2 = JSON.parse(JSON.stringify($scope.productSelected));
                            } else {
                                $scope.selectedItemStr = '';
                                $scope.productSelecting = [];
                                $scope.productSelected = [];
                                // 重置搜索源数据
                                $scope.productSelectedOrigin = [];
                            }
                        } else {
                            $scope.isUpdate = false;
                            $scope.selectedItemStr = '';
                            $scope.productSelecting = [];
                            $scope.productSelected = [];
                            // 重置搜索源数据
                            $scope.productSelectedOrigin = [];
                        }
                        // $scope.$apply();
                    });
                },
                showProductLayer: function () {
                    $scope.tabActive = 1;
                    customerService.getProductVisiblity({ customerId: $scope.customerId }, function (res) {
                        if (res.data.products.length) {
                            $scope.selectedItemOriginStr = res.data.products
                                .map(function (item) {
                                    return item.name;
                                })
                                .join(',');
                            $scope.productSelecting = [];
                            $scope.productSelected = JSON.parse(JSON.stringify(res.data.products));
                            $scope.productSelected.forEach(function (item) {
                                item.checked = false;
                            });
                            $scope.productSelectingOrigin = [];
                            // 重置搜索源数据
                            $scope.productSelectedOrigin = JSON.parse(JSON.stringify($scope.productSelected));
                        }
                    });
                    var opt = {
                        title: '添加可见范围',
                        isHidden: true,
                        boxWidth: true,
                        isNest: true,
                        loadData: function () {
                            $scope.getAllProductGroup(false);
                        },
                        content: {
                            nest: $('#productLayer')
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: '确定',
                                operationEvent: function () {
                                    $scope.productUids = [];
                                    $scope.productGroupIds = [];
                                    $scope.productSelected.forEach(function (item) {
                                        if (item.uid) {
                                            $scope.productUids.push(item.uid);
                                        }
                                        if (!item.uid) {
                                            $scope.productGroupIds.push(item.id);
                                        }
                                    });
                                    $scope.selectedItemStr = $scope.productSelected
                                        .map(function (item) {
                                            return item.name;
                                        })
                                        .join(',');
                                    $scope.tabActive = 1;
                                    $(document).promptBox('closeSlideBox');
                                    $scope.$apply();
                                }
                            }
                        ]
                    };
                    $(document).promptBox(opt);
                },
                getAllProductGroup: function (isShowAll) {
                    customerService.getAllProductGroup({ isShowAll: isShowAll }, function (res) {
                        if (res.errorCode === 0) {
                            $scope.productGroupData = res.data;
                        }
                    });
                },
                getAllProduct: function () {
                    customerService.getAllProduct('', function (res) {
                        if (res.errorCode === 0) {
                            $scope.productData = res.data;
                        }
                    });
                },
                selectAction: function (item) {
                    var isIn = $scope.productSelecting.some(function (subject) {
                        return subject.id === item.id;
                    });
                    // 再次打开选择框不能重复选择已选项
                    if ($scope.tabActive === 1 && item.isPublic || isIn) {
                        return;
                    }
                    $scope.selectedItem = item;
                    $scope.selectedItemId = item.id;
                    $scope.productSelecting = [];
                    if ($scope.tabActive === 1) {
                        $scope.productSelecting.push(item);
                        $scope.productSelectingOrigin = JSON.parse(JSON.stringify($scope.productSelecting));
                        // 遍历已选择项
                        $scope.productSelecting.forEach(function (item) {
                            if ($scope.productSelected.length) {
                                for (var i = 0, len = $scope.productSelected.length; i < len; i++) {
                                    if (item.id === $scope.productSelected[i].id) {
                                        item.checked = true;
                                        item.disabled = true;
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.tabActive === 2) {
                        var groupId = item.id;
                        customerService.getAllProduct({ groupId: groupId }, function (res) {
                            $scope.productSelected.forEach(function (selected) {
                                res.data.forEach(function (selecting) {
                                    if (selected.uid === selecting.uid) {
                                        selecting.checked = true;
                                        selecting.disabled = true;
                                    }
                                });
                            });
                            $scope.productSelecting = res.data;
                            $scope.productSelectingOrigin = JSON.parse(JSON.stringify($scope.productSelecting));
                        });
                    }
                },
                toggleData: function (type) {
                    if ($scope.tabActive === type) {
                        return;
                    }
                    $scope.tabActive = type;
                    $scope.selectedItem = '';
                    $scope.selectedItemId = '';
                    $scope.productSelecting = [];
                    if (type === 1) {
                        $scope.getAllProductGroup(false);
                        if ($scope.selectedItem) {
                            $scope.productSelecting.push($scope.selectedItem);
                            // 本地搜索源数据
                            $scope.productSelectingOrigin = JSON.parse(JSON.stringify($scope.productSelecting));
                        }
                    }
                    if (type === 2) {
                        $scope.getAllProductGroup(true);
                        var groupId = $scope.selectedItem.id;
                        customerService.getAllProduct({ groupId: groupId }, function (res) {
                            $scope.productSelecting = res.data;
                            // 本地搜索源数据
                            $scope.productSelectingOrigin = JSON.parse(JSON.stringify($scope.productSelecting));
                        });
                    }
                    // 遍历已选择项
                    $scope.productSelecting.forEach(function (item) {
                        if ($scope.productSelected.length) {
                            for (var i = 0, len = $scope.productSelected.length; i < len; i++) {
                                if (item.id === $scope.productSelected[i].id) {
                                    item.checked = true;
                                    item.disabled = true;
                                }
                            }
                        }
                    });
                },
                // 本地搜索
                searchLocale: function (type) {
                    if (type === 1) {
                        if ($scope.searchSelecting) {
                            $scope.productSelecting = $scope.productSelectingOrigin.filter(function (item) {
                                if (item.name.includes($scope.searchSelecting)) {
                                    return item;
                                }
                            });
                        } else {
                            $scope.productSelecting = $scope.productSelectingOrigin;
                        }
                    }
                    if (type === 2) {
                        if ($scope.searchSelected) {
                            $scope.productSelected = $scope.productSelectedOrigin.filter(function (item) {
                                if (item.name.includes($scope.searchSelected)) {
                                    return item;
                                }
                            });
                        } else {
                            $scope.productSelected = $scope.productSelectedOrigin;
                        }
                    }
                },
                moveRight: function () {
                    // 获取待选择选中数据
                    var forwardList = $scope.productSelecting.filter(function (item) {
                        if (item.checked && !item.disabled) {
                            item.disabled = true;
                            return item;
                        }
                    });
                    // 合并选中与已选择数据并重置选中状态
                    $scope.productSelected = JSON.parse(JSON.stringify($scope.productSelected.concat(forwardList)));
                    $scope.productSelected.forEach(function (item) {
                        item.checked = false;
                    });
                    // 重置搜索源数据
                    $scope.productSelectedOrigin = JSON.parse(JSON.stringify($scope.productSelected));
                },
                moveLeft: function () {
                    // 遍历选中数据
                    for (var i = 0, iLen = $scope.productSelecting.length; i < iLen; i++) {
                        for (var j = 0, jLen = $scope.productSelectedOrigin.length; j < jLen; j++) {
                            if ($scope.productSelected[j] && $scope.productSelected[j].checked) {
                                if ($scope.productSelecting[i].id === $scope.productSelected[j].id) {
                                    $scope.productSelecting[i].disabled = false;
                                    $scope.productSelecting[i].checked = false;
                                }
                            }
                        }
                    }
                    // 重置已选择数据
                    $scope.productSelected = $scope.productSelected.filter(function (item) {
                        if (!item.checked) {
                            return item;
                        }
                    });
                    // 重置搜索源数据
                    $scope.productSelectedOrigin = $scope.productSelectedOrigin.filter(function (item) {
                        if (!item.checked) {
                            return item;
                        }
                    });
                },
                submitVisiblity: function () {
                    var params = {
                        customerId: $scope.customerId,
                        productGroupIds: $.unique($scope.productGroupIds),
                        productUids: $.unique($scope.productUids),
                        wbFlag: +!$scope.isPublic,
                        isUpdate: $scope.isUpdate
                    };
                    customerService.saveProductVisiblity(params, function (res) {
                        if (res.errorCode === 0) {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: 'success'
                            });
                            $scope.editSetting = false;
                            $scope.getProductVisiblity();
                            // $scope.productSelectedOrigin2 = $scope.productSelectedOrigin;
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: 'errer',
                                manual: true
                            });
                        }
                    });
                },
                cancelVisiblity: function () {
                    $scope.editSetting = false;
                    $scope.getProductVisiblity();
                }
            };

            // 全选/撤消
            $scope.$watch('checkedAllSelecting', function (newVal) {
                if (newVal) {
                    $scope.productSelecting.forEach(function (item) {
                        item.checked = true;
                    });
                } else {
                    $scope.productSelecting.forEach(function (item) {
                        item.checked = false;
                    });
                }
            });
            $scope.$watch('checkedAllSelected', function (newVal) {
                if (newVal) {
                    $scope.productSelected.forEach(function (item) {
                        item.checked = true;
                    });
                } else {
                    $scope.productSelected.forEach(function (item) {
                        item.checked = false;
                    });
                }
            });

            $scope.$on('productSettingEvent', function () {
                $.extend($scope, $scopeData, $scopeMethod);
                $scope.getProductVisiblity();
                $scope.isPublic = $scope.isPublicOrigin;
                $scope.selectedItemStr = $scope.selectedItemOriginStr;
                $scope.$apply();
            });
        }
    ]);
});

// Array.includes polyfill
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this === null) {
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

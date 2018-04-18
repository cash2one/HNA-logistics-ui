easySpa.require([
    'widget/prompt',
    'widget/select',
    'widget/searchBox',
    'public/common/uploadFile/uploadFile.js',
    'public/javascripts/fragment/ordersStatus/ordersStatus.js',
    'public/javascripts/fragment/orderLog/orderLog.js',
    'public/javascripts/fragment/orderDetail/payInfo.js',
    'public/javascripts/fragment/orderDetail/serviceInfo.js'
], function(){
    app.controller('confirmOrderCtrl', ['$scope', '$location','$route', 'confirmOrderService', 'confirmOrderView', function ($scope, $location,$route, confirmOrderService, confirmOrderView) {
        //海运、空运类型默认值。
        $scope.seaId = 1;
        $scope.airId = 6;
        //操作日志状态初始化
        $scope.isOrderSearch = false;
        $scope.activeTab = "ORDERDETAIL";
        $scope.from = easySpa.queryUrlValByKey("from");
        $scope.isOrderSearch = ($scope.from === "orderSearch") ? true : false;

        /**
         * tab 切换
         * @param type
         */
        $scope.switchTab = function(type){
            if(type === $scope.activeTab){ return; }
            if(type === "OPERATIONLOG"){
                $scope.$broadcast('operatelog', $scope.orderId);
            }
            $scope.activeTab = type;
        };

        var comObj = {
            showMsg: function (msg, type) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: msg,
                    type: type,
                    time: 3000,
                    manualClose: type === 'errer'
                });
            },
            showErrorMsg: function (msg) {
                comObj.showMsg(msg, 'errer');
            },
            getSigleDataByName: function (name, data) {
                var data = data.data;
                for (var index = 0; index < data.length; index++) {
                    if (data[index].name == name) {
                        return data[index];
                    }
                }
            },
            clearNextAddress : function(currentEle){
                var nextEle = currentEle.next;
                if (nextEle == null) {
                    return;
                }
                nextEle.clearData();
                nextEle.id = null;
                return comObj.clearNextAddress(nextEle);
            }
        }

        $.extend($scope, {
            submited: "",
            oPlaceListShow: true,
            dPlaceListShow: true,
            aPlaceListShow: true,
            CNAddress: true,
            tableWidth: ["12%", "12%", "12%", "12%", "12%", "12%", "12%", "12%"],
            tableItemLength: ["30", "30", "15", "9", "30", "9", "30"],
            resourceTree: {},
            remainWords: 140,
            orderBaseInfo: {},
            currentAddress: {},
            goodsList: [],
            selectGoods: [],
            serviceList: [],
            addAddressFormShowError: false,
            orderCustomerMsg: {},
            oPlaceList: [],
            dPlaceList: [],
            aPlaceList: []
        });

        /**
         * 获取计量单位：件、千克、克、吨等
         */
        confirmOrderService.getUnitDictionary("", function(res){
            if(res.errorCode == 0){
                $scope.unitList = res;
                $scope.unitMenu = {};

                res.data.map(function(item){
                    $scope.unitMenu[item.code] = item.name;
                });
            }else{
                $scope.unitMenu = [];
            }
        });

        $scope.orderBaseInfo.cusWeightUnit = "kg";
        $scope.orderBaseInfo.cusWeightUnitName = "千克";
        var createSelectBox = function (index, value) {
            //物品类型
            var unitList = $scope.unitList;
            unitListEle = selectFactory({
                data: unitList,
                id: "goodsUnitName" + index,
                maxHeight: 160,
                closeLocalSearch: true,
                "direction": "up",
                isCreateNewSelect: true,  //如果为false 则会导致删除为空后添加 单例不创建
                defaultCount: 50,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                attrTextId: function (code) {
                    $scope.goodsList[index]['goodsUnit'] = code;
                },
                attrTextModel: function (name, data) {
                    if (!name) {
                        unitList = {};
                    } else {
                        unitList = data.data.find(function (item) {
                            return item.name == name;
                        })
                    }
                    $scope.goodsList[index]['goodsUnitName'] = unitList.name;
                    $scope.$apply();
                    $scope.goodsCheck();
                }
            });
            //unitListEle.setData(unitList);
            unitListEle.inputElement.val( $scope.goodsList[index]['goodsUnitName'])
            //unitListEle.hide();
        };

        var setSelectBoxList = function () {
            for (var s = 0, l = $scope.goodsList.length; s < l; s++) {
                (function (s) {
                    setTimeout(function () {
                        if ($("#goodsUnit" + s)) {
                            createSelectBox(s);
                        }
                    }, 10)
                })(s)
            }
        };

        //客户单号
        $scope.getClientNum = function(){
            if($scope.checkbox){    //如果点击勾选
                if($scope.orderBaseInfo.customerName) {    //修改
                    var config = {
                        'seatParams':{
                            'cusUserId': $scope.orderBaseInfo.customerId
                        }
                    };

		            confirmOrderService.getClientNum(config, function(data){
		                if(data && data.errorCode === 0){
		                    $scope.orderBaseInfo.externalNo=data.data;
                            $("#clientNum").attr("readonly", "true");
		                }else{
		                	comObj.showErrorMsg(data.msg);
		                }
		            });
		        }else{
                    $scope.checkbox = false;
		        	comObj.showErrorMsg("请输入账号名");
                }
            }else{    //去勾选
                $scope.checkbox = false;
                $("#clientNum").removeAttr("readonly");
	      		$scope.orderBaseInfo.externalNo = $scope.externalNoOrigin;
            }
        }

        $scope.goBack = function (isSave) {
          if($route.current.params && $route.current.params.orderFrom == 'cockpit'){
            window.location.href = "#/cockpit?from=logisticsOrder";
            return;
          };
          if(($scope.orderStatus == 'DRAFT' || $scope.couldEdit) && !isSave){
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
                        if($route.current.params && $route.current.params.id){
                            top.location.href = "http://" +location.host +　"#/workOrderDetail?id=" +  $route.current.params.id;
                        }else if($route.current.params && $route.current.params.from =='orderSearch'){
                            window.location.href = "#/orderSearch?from=orderDetail";
                        }else{
                            window.location.href = "#/orders?&orderStatus=" + $scope.orderStatus;
                        }
                      }
                  }
                ]
              })
            }else{
                if($route.current.params && $route.current.params.id){
                    top.location.href = "http://" +location.host +　"#/workOrderDetail?id=" +  $route.current.params.id;
                }else if($route.current.params && $route.current.params.from =='orderSearch'){
                    window.location.href = "#/orderSearch?from=orderDetail";
                }
                else{
                    window.location.href = "#/orders?&orderStatus=" + $scope.orderStatus;
                }
            }
        };
        $scope.tableHeader = [
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_name'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_engName'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_hsCode'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_count'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_unit'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_price'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_describe'),
            Lang.getValByKey("confirmOrder", 'confirmOrder_page_goodsInfo_operator')
        ];
        $scope.detailTableHeader = $scope.tableHeader.slice(0, 7);
        $scope.goodsMenu = ["goodsNameCn", "goodsNameEn", "hsCode", "goodsNumber", "goodsUnitName", "goodsPrice", "description"];
        //添加物品
        $scope.addGoods = function () {
            $scope.goodsList.push({
                "goodsNameCn": "",
                "goodsNameEn": "",
                "goodsNumber": "",
                "goodsPrice": "",
                "goodsUnit": "",
                "goodsUnitName": "",
                "hsCode": "",
                "description": ""
            });

            setTimeout(function () {
                createSelectBox($scope.goodsList.length - 1);
            }, 10)
        };
        //删除物品
        $scope.delGoods = function (index) {
            $scope.goodsList.splice(index, 1);
            if(index <  $scope.goodsList.length){
                setTimeout(function () {
                    createSelectBox(index);
                }, 10)

            }else{

            }
        };
        //省市区联动组件
        $scope.initAddWidget = function () {
            if ($scope.CNAddress) {
                initCNAddress();
            } else {
                initNotCNAddress();
            }
        };

        //使用新地址弹出层
        $scope.openAddNewAddress = function (addressType) {
            $('#mobile-phone').removeClass('ng-invalid ng-dirty');
            if (!$scope.orderBaseInfo.productName) {
                return;
            }
            var showWarning = function () {
                comObj.showMsg(Lang.getValByKey("confirmOrder", "confirmOrder_model_max10Address"), 'warning')
            };
            if (addressType == 1 && $scope.oPlaceList.length >= 10) {
                showWarning();
                return;
            } else if (addressType == 2 && $scope.dPlaceList.length >= 10) {
                showWarning();
                return;
            } else if (addressType == 3 && $scope.aPlaceList.length >= 10){
                showWarning();
                return;
            }
            if(addressType == 3){
                $scope.isOrdinary = true;
            }else{
                if($scope.productGroupRootId == $scope.seaId || $scope.productGroupRootId == $scope.airId){
                    $scope.isOrdinary = false;
                }else{
                    $scope.isOrdinary = true;
                }
            }

            $scope.CNAddress = false;

            $scope.isOriginAddress = addressType;
            $scope.currentAddress = {};
            $scope.airSea = $scope.airSeaValue = '';

            $("#addOrModifyAddress").html(Lang.getValByKey("confirmOrder", 'confirmOrder_model_addNewAddress'));
            $scope.AddNewAddressForm.$setPristine();

            $('#select-address-type').val($scope.addressType);

            $scope.showAddressForm = true;
        };

        //cancel添加新地址页面
        $scope.cancelAddNewAddress = function () {
            $scope.currentAddress = {};
            $scope.AddNewAddressForm.addressState.$setPristine();
            AddNewAddressForm.reset();
            resetFormRawModelValue();
            $scope.showAddressForm = false;
        };
        var resetFormRawModelValue = function () {
            var formEle = ["addressAddress", "addressName", "addressPhone", "addressPostcode", "addressEmail"];
            for (var s = 0, len = formEle.length; s < len; s++) {
                $scope.AddNewAddressForm[formEle[s]].$$rawModelValue = "";
            }
        };
        //save添加新地址页面
        $scope.saveAddNewAddress = function () {
            flag = false;

            if (!$scope.currentAddress.countryName) {
                flag = true;
                $scope.AddNewAddressForm.addressCountry.$setDirty();
            }

            if($scope.isOrdinary || $scope.isOriginAddress == 3){    //非海运、空运。
                if ($scope.CNAddress) {    //中国区
                    $scope.AddNewAddressForm.addressState.$setPristine();

                    if (!$scope.currentAddress.provinceName) {
                        flag = true;
                        $scope.AddNewAddressForm.addressProvince.$setDirty();
                    }
                    if (!$scope.currentAddress.cityName) {
                        flag = true;
                        $scope.AddNewAddressForm.addressCity.$setDirty();
                    }
                    // if (!$scope.currentAddress.districtName) {
                    //     flag = true;
                    //     $scope.AddNewAddressForm.addressArea.$setDirty();
                    // }
                    // if (!$scope.currentAddress.streetName) {
                    //     flag = true;
                    //     $scope.AddNewAddressForm.addressStreet.$setDirty();
                    // }
                } else {
                    $scope.AddNewAddressForm.addressProvince.$setPristine();
                    $scope.AddNewAddressForm.addressCity.$setPristine();
                    $scope.AddNewAddressForm.addressArea.$setPristine();
                    $scope.AddNewAddressForm.addressStreet.$setPristine();
                    if (!$scope.currentAddress.cityName) {
                        flag = true;
                        $scope.AddNewAddressForm.addressState.$setDirty();
                    }
                }
                if (!$scope.currentAddress.address) {
                    flag = true;
                    $scope.AddNewAddressForm.addressAddress.$setDirty();
                }
                if (!$scope.currentAddress.address) {
                    flag = true;
                    $scope.AddNewAddressForm.addressState.$setDirty();
                }

            } else {
                if(!$scope.airSea){
                    $scope.AddNewAddressForm.airSea.$setDirty();
                    flag = true;
                }
            }

            if(!$scope.currentAddress.name){
                $scope.AddNewAddressForm.addressName.$setDirty();
                flag = true;
            }
            if(!$.trim($scope.currentAddress.postcode)){
                $scope.AddNewAddressForm.addressPostcode.$setDirty();
                flag = true;
            }
            //校验移动电话和固定电话
            if(!$scope.currentAddress.phone && !$scope.currentAddress.telPhone){
                // comObj.showErrorMsg('移动电话和固定电话必填一项');
                $('#mobile-phone').addClass('ng-invalid ng-dirty');
                flag = true;
            }else{
                $('#mobile-phone').removeClass('ng-invalid ng-dirty');
            }

            if (flag) {
                scrollToErrorView($(".confirmOrderPromptContent"));
                return;
            }

            var data = {
                "id": $scope.currentAddress.id || "",
                "customerId": $scope.orderBaseInfo.customerId,    //客户ID
                "name": $scope.currentAddress.name,
                "type": $scope.isOriginAddress,    //始发1、目的2、揽收3
                "phone": $scope.currentAddress.phone,    //移动电话
                "telPhone": $scope.currentAddress.telPhone,    //固定电话
                "postcode": $scope.currentAddress.postcode,    //邮编
                "email": $scope.currentAddress.email,    //邮箱
                "transportType": $scope.productGroupRootId,   //地址运输类型ID
                "countryCode": $scope.currentAddress.countryId || $scope.currentAddress.countryCode,   //国家编码
                "countryName": $scope.currentAddress.countryName    //国家名称
            };

            if($scope.isOriginAddress == 3){
                data.transportType = 11;
            }

            if(!$scope.isOrdinary && $scope.isOriginAddress != 3){ //海运或者空运传递参数
                data.transportId = $scope.airSeaValue;    //机场或港口ID
            }else{
                data.provinceId = $scope.currentAddress.provinceId;    //省Id
                data.provinceName = $scope.currentAddress.provinceName;    //省名称
                data.cityId = $scope.currentAddress.cityId;    //市Id
                data.cityName = $scope.currentAddress.cityName;    //市名称
                data.districtId = $scope.currentAddress.districtId;    //区/县Id
                data.districtName = $scope.currentAddress.districtName;    //区/县名称
                data.streetId = $scope.currentAddress.streetId;    //街道Id
                data.streetName = $scope.currentAddress.streetName;   //街道名称
                data.address = $scope.currentAddress.address;    //详细地址
            }

            var params = {
                urlParams: data
            };
            confirmOrderService.saveOrUpdateAddress(params, function (res) {

                if (res.errorCode != 0) {
                    comObj.showErrorMsg(res.msg)
                } else {
                    comObj.showMsg(res.msg, 'success');
                    if ($scope.isOriginAddress == 1) {    //始发地址
                        getAddressList(1, res.data);
                    } else if($scope.isOriginAddress == 2) {    //目的地址
                        getAddressList(2, res.data);
                    } else if($scope.isOriginAddress == 3){    //揽收地址
                        getAddressList(3, res.data);
                    }
                    $scope.resourceTree.addRootMap = {};
                    $scope.cancelAddNewAddress();
                }
            });
        };
        //获取某个用户关联的地址
        var getAddressList = function (type, selectId) {
            var params = {
                urlParams: {
                    customerId: $scope.orderBaseInfo.customerId,
                    type: type,
                    transportType: $scope.productGroupRootId    //地址类型
                }
            };
            if(type == 3){ params.urlParams.transportType = 11; }

            var callBack = function (res) {
                if (type == 1) {
                    $scope.oPlaceList = res.data;
                    if (selectId) {
                        $scope.oPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.id == selectId) {
                                $scope.oPlaceIndex = index;
                            }
                        })
                        if (selectId == -1) {
                            setTimeout(function () {
                                $scope.switchStatus("origin", true);
                            }, 10);
                        }
                    } else {
                        $scope.oPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.isDefault) {
                                $scope.oPlaceIndex = index;
                            }
                        });
                        setTimeout(function () {
                            $scope.switchStatus("origin", true);
                        }, 10);
                    }
                }
                else if (type == 2) {
                    $scope.dPlaceList = res.data;
                    if (selectId) {
                        $scope.dPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.id == selectId) {
                                $scope.dPlaceIndex = index;
                            }
                        })
                        if (selectId == -1) {
                            setTimeout(function () {
                                $scope.switchStatus("destination", true);
                            }, 10);
                        }
                    } else {
                        $scope.dPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.isDefault) {
                                $scope.dPlaceIndex = index;
                            }
                        })
                        setTimeout(function () {
                            $scope.switchStatus("destination", true);
                        }, 10);
                    }
                }else if (type == 3) {
                    $scope.aPlaceList = res.data;
                    if (selectId) {
                        $scope.aPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.id == selectId) {
                                $scope.aPlaceIndex = index;
                            }
                        })
                        if (selectId == -1) {
                            setTimeout(function () {
                                $scope.switchStatus("accept", true);
                            }, 10);
                        }
                    } else {
                        $scope.aPlaceList.map(function (item, index) {
                            item.isNotAccess = false;
                            item.isShow = true;
                            if (item.isDefault) {
                                $scope.aPlaceIndex = index;
                            }
                        })
                        setTimeout(function () {
                            $scope.switchStatus("accept", true);
                        }, 10);
                    }
                    if($scope.orderDetail && !$scope.orderDetail.fetchAddress
                        && $scope.aPlaceList && $scope.aPlaceList.length
                    ){
                        angular.forEach($scope.aPlaceList, function(item, index){
                            if(item.isDefault){
                                $scope.aPlaceIndex = index;
                            }
                        });
                    }
                }
                var uid = $scope.orderBaseInfo.productUid;
                var customerId = $scope.orderBaseInfo.customerId;
                delete $scope.resourceTree.addRootMap[uid + "$$" + customerId];
                $scope.isAddressAccessForCurrentProduce();
            }
            confirmOrderService.getAddressList(params, callBack)
        };
        //设置默认地址
        $scope.setDefaultAddress = function (id, type) {
            var params = {
                'seatParams': {
                    "customerId": $scope.orderBaseInfo.customerId,
                    "type": type,
                    "newId": id,
                    "transportType": $scope.productGroupRootId
                }
            };

            //提货地址类型为速递
            if(type == 3){ params.seatParams.transportType = 11; }

            var callback = function (res) {
                if (res.errorCode == 0) {
                    comObj.showMsg(res.msg, 'success');
                    if (type == 1) {
                        $scope.oPlaceList.map(function (item) {
                            item.isDefault = item.id == id;
                        });
                    } else if (type == 2){
                        $scope.dPlaceList.map(function (item) {
                            item.isDefault = item.id == id;
                        });
                    } else if (type == 3){
                        $scope.aPlaceList.map(function (item) {
                            item.isDefault = item.id == id;
                        });
                    }
                } else {
                    comObj.showErrorMsg(res.msg);
                }
            };
            confirmOrderService.setDefaultAddress(params, callback);
        };
        //修改地址
        $scope.modifyAddress = function (index, isOriginAddress) {
            $('#mobile-phone').removeClass('ng-invalid ng-dirty');
            $scope.isOriginAddress = isOriginAddress;
            $("#addOrModifyAddress").html(Lang.getValByKey("confirmOrder", 'confirmOrder_model_modifyNewAddress'));
            $scope.currentAddress = {};
            if (isOriginAddress == 1) {    //始发
                for (var s in $scope.oPlaceList[index]) {
                    $scope.currentAddress[s] = $scope.oPlaceList[index][s];
                }
                $scope.currentAddress.countryName = $scope.currentAddress.countryName + '(' + $scope.oPlaceList[index]['countryCode'] + ')';
                $scope.currentAddress.transportName = $scope.currentAddress.transportName + '(' + $scope.oPlaceList[index]['transportCode'] + ')';
            } else if(isOriginAddress == 2) {    //目的
                for (var s in $scope.dPlaceList[index]) {
                    $scope.currentAddress[s] = $scope.dPlaceList[index][s];
                }
                $scope.currentAddress.countryName = $scope.currentAddress.countryName + '(' + $scope.dPlaceList[index]['countryCode'] + ')';
                $scope.currentAddress.transportName = $scope.currentAddress.transportName + '(' + $scope.dPlaceList[index]['transportCode'] + ')';
            } else if(isOriginAddress == 3){    //揽收
                for (var s in $scope.aPlaceList[index]) {
                    $scope.currentAddress[s] = $scope.aPlaceList[index][s];
                }
                $scope.currentAddress.countryName = $scope.currentAddress.countryName + '(' + $scope.aPlaceList[index]['countryCode'] + ')';
                $scope.currentAddress.transportName = $scope.currentAddress.transportName + '(' + $scope.aPlaceList[index]['transportCode'] + ')';
            }

            $('#select-address-type').val($scope.currentAddress.transportTypeName);

            if(
                $scope.currentAddress.transportType == $scope.seaId ||
                $scope.currentAddress.transportType == $scope.airId
            ){
                $scope.isOrdinary = false;

                $scope.airSea = $scope.currentAddress.transportName;
                $scope.airSeaValue = $scope.currentAddress.transportId;
                $('#select-air-sea').val($scope.currentAddress.transportName);

                $scope.addressDetail = $scope.currentAddress.address;
                $('#addressDetail').val($scope.currentAddress.address);
            }else{
                $scope.isOrdinary = true;
                if ($scope.currentAddress.provinceName) {
                    $scope.CNAddress = true;
                } else {
                    $scope.CNAddress = false;
                }
            }

            $scope.getCountry(false);
            $scope.initAddWidget();
            $scope.showAddressForm = true;
        };
        //删除地址
        $scope.delAddress = function (id, type, index) {
            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("confirmOrder", "confirmOrder_pormpt_deleteAddress")
                },
                manualClose: false,
                time: 1000,
                isDelay: false,
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application: 'delete',
                        operationEvent: function () {
                            var param = {
                                seatParams: {
                                    cusUserId: $scope.orderBaseInfo.customerId
                                },
                                urlParams: [id + ""]
                            };
                            var callback = function (res) {
                                $(document).promptBox('closePrompt');
                                if (res.errorCode == 0) {
                                    comObj.showMsg(res.msg, 'success');
                                    if (type == 1) {
                                        $scope.oPlaceList = $scope.oPlaceList.filter(function (item) {
                                            return item.id != id;
                                        })
                                        if($scope.oPlaceList.length > 0){
                                            $scope.oPlaceList[0].isDefault = true;
                                            $scope.oPlaceIndex = 0;
                                        }else{
                                            $scope.oPlaceIndex = -1;
                                        }

                                    } else if (type == 2) {
                                        $scope.dPlaceList = $scope.dPlaceList.filter(function (item) {
                                            return item.id != id;
                                        })
                                        if($scope.dPlaceList.length > 0){
                                            $scope.dPlaceList[0].isDefault = true;
                                            $scope.dPlaceIndex = 0;
                                        }else{
                                            $scope.dPlaceIndex = -1;
                                        }
                                    } else if (type == 3){
                                        $scope.aPlaceList = $scope.aPlaceList.filter(function (item) {
                                            return item.id != id;
                                        })
                                        if($scope.aPlaceList.length > 0){
                                            $scope.aPlaceList[0].isDefault = true;
                                            $scope.aPlaceIndex = 0;
                                        }else{
                                            $scope.aPlaceIndex = -1;
                                        }
                                    }
                                    $scope.$apply();
                                } else {
                                    comObj.showErrorMsg(res.msg);
                                }
                            };
                            confirmOrderService.delUserAddress(param, callback);
                        }
                    }
                ]
            };
            $(document).promptBox(opt);
        };
        //按照arr的顺位，清楚obj的value值
        var clearObjValueByKey = function (name) {
            var arr = [
                "countryName", "countryCode", "countryId",
                "addressName", "addressId",
                "provinceName", "provinceId",
                "cityName", "cityId",
                "districtName", "districtId",
                "streetName", "streetId"
            ];
            for (var s = arr.indexOf(name), len = arr.length; s < len; s++) {
                $scope.currentAddress[arr[s]] = "";
            }
        };
        var resetProductAndCargo = function(productName,productId){
            if ($scope.orderStatus == "DRAFT") {
                setSelectBoxList();
            }
        };
        var resetFormInfo = function (data) {
            $scope.orderBaseInfo = {
                'cargoTypeId': data['cargoType'],
                'cargoTypeName': data['cargoTypeName'],
                'cusWeight': data['cusWeight'],
                'cusWeightUnit': data['cusWeightUnit'],
                'cusWeightUnitName': data['cusWeightUnitName'],
                'customerId': data["cusUserId"],
                'customerName': data['customerName'] + '(' + data['cusUserName'] + ')',
                'productName': data['productName'] + '(' + data['productCode'] + ')',
                'productUid': data['productUid'],
                'productId': data['productId'],
                'packageNum': data['packageNum'],
                'externalNo': data['externalNo'],
                'cusUserId': data['customerId']
            };
            $scope.orderCustomerMsg.msg = data.customerNote;

            getAddressList(1, -1);
            getAddressList(2, -1);
            getAddressList(3, -1);
            $scope.isAddressAccessForCurrentProduce();
            //$scope.getCurrencyByAccountId(data["cusUserId"]);
            $scope.goodsList = data.orderCargoDtos;

            resetProductAndCargo(data.productName,data.productId);
            getServersList(data.orderAdditionalDtos);
        };

        //通过订单ID获取订单信息
        var getOrderInfoByOrderId = function (orderNo) {
            var params = {
                seatParams: {
                    orderNo: orderNo
                }
            };
            var callBack = function (res) {
                var data = res.data;
                $scope.orderId = res.data.id;
                setTimeout(function(){    //require加载机制问题引起的。
                    $scope.$broadcast('payInfoEvent', data.orderNo, data.orderStatus);
                    $scope.$broadcast('serviceInfoEvent', data.orderNo, data.orderStatus);
                }, 0);

                if(data.productId){
                    var config = {
                        seatParams:{
                            'productId':data.productId
                        }
                    };

                    confirmOrderService.getProductGroupRootId(config, function(res){
                        if(res.errorCode === 0){
                            $scope.accountCurrency = res.data.currencyCode;
                            $scope.productGroupRootId = res.data.productGroupRootId;

                            if($scope.productGroupRootId == $scope.seaId || $scope.productGroupRootId == $scope.airId){
                                $scope.isOrdinary = false;
                            }else{
                                $scope.isOrdinary = true;
                                $scope.productGroupRootId = 11;
                            }
                        }
                    });
                }

                $scope.filterProductAddress(data.productUid);

                $scope.orderStatus = data.orderStatus;
                $scope.couldEdit = (data.orderStatus == "DRAFT");  //只有草稿状态才可以编辑

                if($route.current.params.isJustShow){
                    $scope.couldEdit = false;
                    $scope.isJustShow = true;
                }else{
                    $scope.isJustShow = false;
                }

                if($route.current.params.from){ //从订单查询过来，不可编辑
                    $scope.canEdit = false;
                }else{
                    $scope.canEdit = true;
                }

                $scope.ordSubOrderDtos = data.ordSubOrderDtos;
                $scope.orderNo = data.orderNo;
                $scope.orderBaseInfo.externalNo = data.externalNo;
                $scope.externalNoOrigin = data.externalNo;
                $scope.orderDetail = data;
                $("#orderDetailOrModify").html(data.waybillNo);
                var str = "";
                data.orderAdditionalDtos.map(function (item) {
                    str += item.serviceTypeName + "，";
                });
                $scope.serviceStr = str.slice(0, str.length - 1);

                if(data.orderStatus != 'DRAFT'){
                    setSubOrderLogistics(data.orderStatus, data.orderNo, data.waybillNo);
                }
                resetFormInfo(data);
            };
            confirmOrderService.getOrderInfoByOrderId(params, callBack);
        }

        //获取国家列表
        var countryEle;
        $scope.getCountryData = function(q, currentPage){
            //type为起点(s) 目的地(e) 提货地(f)
            var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');

            var config = {
                'urlParams': {
                    'q': q || "",
                    "pageIndex": currentPage || 1,
                    "pageSize": 10,
                    "id":$scope.orderBaseInfo.productId,
                    "type":type
                }
            };

            var data = confirmOrderService.getCountryList(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.figureCode +')';
            });
            return data;
        };
        $scope.getCountry = function (isOpen) {
            countryEle = selectFactory({
                data: [],
                id: "country",
                isSearch: true,
                closeLocalSearch: true,
                defaultCount: 11,
                isNotUseFilter:true,
                searchPlaceHoder:'请输入名称或二字码',
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                pagination: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    attachEvent.setData($scope.getCountryData(data, currentPage));
                    $scope.$apply();
                },
                attrTextModel: function (name, data, item) {
                    if (countryEle) { comObj.clearNextAddress(countryEle); }
                    clearObjValueByKey("countryName");

                    $scope.airSeaValue = '';
                    $scope.airSea = '';
                    $scope.addressDetail = '';
                    if(!name){
                        $('#select-air-sea').attr('disabled','disabled');
                    }else{
                        $('#select-air-sea').removeAttr('disabled');
                    }

                    $scope.currentAddress.countryName = name;
                    $scope.currentAddress.countryId = item.figureCode;
                    $scope.currentAddress.countryCode = item.figureCode;
                    $scope.currentAddress.figureCode = item.figureCode;
                    countryEle.id = item.id;
                    $scope.CNAddress = item.figureCode == "CN";
                    $scope.initAddWidget();
                    $scope.$apply();
                }
            });
            isOpen && countryEle.open();
        };
        var initNotCNAddress = function () {
            var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');
            var getStateData = function (q, currentPage) {
                var config = {
                    urlParams:{
                        'id': $scope.orderBaseInfo.productId,
                        'countryCode': $scope.currentAddress.countryCode,
                        'parentId': '',
                        'type': type,
                        'q': q || '',
                        'pageIndex': currentPage || 1,
                        'pageSize': 10
                    }
                };
                return confirmOrderService.getAddressData(config);
            };
            //初始化州选项
            var data = getStateData();
            stateEle = selectFactory({
                data: [],
                id: "state",
                showTextField: 'cityName',
                isSearch: true,
                isUsePinyin: true,
                isCreateNewSelect: true,
                pagination:true,
                closeLocalSearch: true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    attachEvent.setData(getStateData(data, currentPage));
                    $scope.$apply();
                },
                attrTextModel: function (name, data, item) {
                    clearObjValueByKey("addressName");
                    if (name) {
                        $scope.currentAddress.cityId = item.id;
                        $scope.currentAddress.cityName = item.cityName;
                    }
                    $scope.$apply();
                }
            });
            stateEle.setData(data);
            stateEle.hide();
            countryEle.next = stateEle;
        };
        var initCNAddress = function () {
            /*初始化省份start*/
            var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');
            var config = {
                urlParams:{
                    'id': $scope.orderBaseInfo.productId,
                    'countryCode': 'CN',
                    'parentId': '',
                    'type': type,
                    'pageIndex': 1,
                    'pageSize': 1000
                }
            };
            var data = confirmOrderService.getAddressData(config);
            provinceEle = selectFactory({
                data: [],
                id: "province",
                showTextField: 'cityName',
                defaultCount: 100,
                isCreateNewSelect: true,
                attrTextModel: function (name, data, item) {
                    clearObjValueByKey("provinceName");
                    comObj.clearNextAddress(provinceEle);
                    if (name) {
                        $scope.currentAddress.provinceName = item.cityName;
                        $scope.currentAddress.provinceId = item.id;

                        cityEle.setData([]);

                        var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');
                        config.urlParams.id = $scope.orderBaseInfo.productId;
                        config.urlParams.type = type;
                        config.urlParams.parentId = item.id;
                        var cityData = confirmOrderService.getAddressData(config);
                        if (!cityData || !cityData.data.length) {
                            cityEle.setData([]);
                        } else {
                            cityEle.setData(cityData);
                        }
                        if(cityData.data.length > 1){
                            cityEle.open();
                        } else if (cityData.data.length === 1){
                          clearObjValueByKey("cityName");
                          comObj.clearNextAddress(cityEle);
                          $scope.currentAddress.cityName = cityData.data[0].cityName;
                          $scope.currentAddress.cityId = cityData.data[0].id;
                          config.urlParams.parentId = cityData.data[0].id;
                          var areaData = confirmOrderService.getAddressData(config);
                          if (!areaData.data.length) {
                              areaEle.setData([]);
                          } else {
                              areaEle.setData(areaData);
                          }
                          if(areaData.data.length > 0){
                              areaEle.open();
                          }
                        }
                    }
                    $scope.$apply();
                }
            });
            provinceEle.setData(data);
            countryEle.next = provinceEle;

            /*初始化省份end*/

            /*初始化市start*/
            if($scope.currentAddress.provinceId){
                config.urlParams.parentId = $scope.currentAddress.provinceId;
                data = confirmOrderService.getAddressData(config);
            }else{
                data = {data:[]};
            }

            cityEle = selectFactory({
                data: [],
                id: "city",
                showTextField: 'cityName',
                defaultCount: 100,
                isCreateNewSelect: false,
                attrTextModel: function (name, data, item) {
                    clearObjValueByKey("cityName");
                    comObj.clearNextAddress(cityEle);
                    if (name) {
                        $scope.currentAddress.cityName = item.cityName;
                        $scope.currentAddress.cityId = item.id;

                        var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');
                        config.urlParams.id = $scope.orderBaseInfo.productId;
                        config.urlParams.type = type;
                        config.urlParams.parentId = item.id;

                        var areaData = confirmOrderService.getAddressData(config);
                        if (!areaData.data.length) {
                            areaEle.setData([]);
                        } else {
                            areaEle.setData(areaData);
                        }

                        if(areaData.data.length > 0){
                            areaEle.open();
                        }
                    }
                    $scope.$apply();
                }
            });
            cityEle.setData(data);
            provinceEle.next = cityEle;
            /*初始化市区end*/

            /*初始化区start*/
            if($scope.currentAddress.cityId){
                config.urlParams.parentId = $scope.currentAddress.cityId;
                data = confirmOrderService.getAddressData(config);
            }else{
                data = {data:[]};
            }

            areaEle = selectFactory({
                data: [],
                id: "area",
                showTextField: 'cityName',
                defaultCount: 100,
                isCreateNewSelect: false,
                attrTextModel: function (name, data, item) {
                    clearObjValueByKey("districtName");
                    comObj.clearNextAddress(areaEle);
                    if (name) {
                        $scope.currentAddress.districtName = item.cityName;
                        $scope.currentAddress.districtId = item.id;

                        var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');
                        config.urlParams.id = $scope.orderBaseInfo.productId;
                        config.urlParams.type = type;
                        config.urlParams.parentId = item.id;
                        var streetData = confirmOrderService.getAddressData(config);
                        if (!streetData.data.length) {
                            streetEle.setData([]);
                        } else {
                            streetEle.setData(streetData);
                        }
                        if(streetData.data.length > 0){
                            streetEle.open();
                        }
                    }
                    $scope.$apply();
                }
            });
            areaEle.setData(data);
            cityEle.next = areaEle;
            /*初始化区街道end*/

            /*乡镇初始化start*/
            if($scope.currentAddress.districtId){
                config.urlParams.parentId = $scope.currentAddress.districtId;
                data = confirmOrderService.getAddressData(config);
            }else{
                data = {data:[]};
            }

            streetEle = selectFactory({
                data: [],
                id: "street",
                showTextField: 'cityName',
                defaultCount: 100,
                isCreateNewSelect: false,
                attrTextModel: function (name, data, item) {
                    clearObjValueByKey("streetName");
                    if (name) {
                        $scope.currentAddress.streetName = item.cityName;
                        $scope.currentAddress.streetId = item.id;
                        streetEle.id = item.id;
                    }
                    $scope.$apply();
                }
            });
            streetEle.setData(data);
            areaEle.next = streetEle;
            /*乡镇初始化end*/
        };
        var getServersList = function (filterData) {
            if(!$scope.resourceTree.serviceList){    //详情
                $scope.resourceTree.serviceList = filterData;
                var config = {
                    'seatParams':{
                        'uid':$scope.orderBaseInfo.productUid,
                        'type':'optional'
                    }
                };
                confirmOrderService.getServiceList(config, function(res){
                    if(res.errorCode == 0){
                        $scope.resourceTree.serviceList = res.data;
                    }
                });
            }

            var data = $scope.resourceTree.serviceList;
            if (filterData) {
                var temp = [];
                filterData.map(function (item) {
                    temp.push(item.serviceTypeCode)
                });
                data.map(function (item) {
                    if (temp.indexOf(item.serviceTypeCode) > -1) {
                        item.isChecked = true;
                    }
                })
            }

            angular.forEach(data, function(item){
                item.serviceReceive = item.serviceTypeCode == 'ST001' ? true : false;
            });

            if(!$scope.productReceived){
                angular.forEach(data, function(item){
                    if(item.isChecked && item.serviceReceive){    //可选服务已勾选，并且是揽收服务
                        $scope.productReceived = true; return;
                    }
                });
            }

            //LOGP-2278
            $scope.isShowOptionalService = false;
            angular.forEach(data, function(item){
                if(item.isChecked){
                    $scope.isShowOptionalService = true;
                }
            });
            if(!$scope.orderDetail || ($scope.orderDetail && ($scope.orderDetail.orderStatus == 'COMMITED' || $scope.orderDetail.orderStatus == 'DRAFT'))){
                $scope.isShowOptionalService = true;
            }

            $scope.serviceList = data;
        };
        var getClientData = function (data, currentPage) {
            if(!currentPage) {
                currentPage = 1;
            }
            var config = {
                'urlParams': {
                    'q': data ? data.trim() : "",
                    'pageIndex': currentPage,
                    'pageSize': 10,
                    'sortName': '',
                    'isAsc': false
                }
            };
            var data = confirmOrderService.getUserList(config);
            angular.forEach(data.data, function(value, key){
              value.userName = value.fullName + '('+ value.userName +')';
            });
            return data;
        };

        /**
         * 客户选择下拉框
         */
        $scope.clientEle = function () {
            clientEle = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                searchPlaceHoder:"请输入姓名或用户名",
                id: "userList",
                showTextField: "userName",
                closeLocalSearch: true,
                isSaveInputVal: "true",
                pagination: true,
                attrTextField: {
                    "ng-value": "id"
                },
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    var clientList = getClientData(data, currentPage);
                    attachEvent.setData(clientList);
                },
                attrTextId: function (id) {
                    if(!id) {
                        $scope.orderBaseInfo.cusUserId = '';
                        productBox.destroy()
                    }else{
                        $scope.orderBaseInfo.customerId = id;
                        //获取客户所使用的币种，填写在物品信息表头。
                        //$scope.getCurrencyByAccountId(id);
                        $scope.getProduct();
                    }

                    //清除产品数据
                    $scope.orderBaseInfo.productUid = '';
                    $scope.orderBaseInfo.productName = '';

                    //清除地址数据
                    $scope.oPlaceList = [];
                    $scope.dPlaceList = [];
                    $scope.aPlaceList = [];

                    $scope.$apply();
                },
                attrTextModel: function (name,data, item) {
                    if(name != $scope.orderBaseInfo.customerName) {
                        $scope.orderBaseInfo.externalNo='';
                        $scope.orderBaseInfo.cargoTypeName = '';
                        $scope.checkbox = false;
                    }
                    $scope.orderBaseInfo.customerName = name;
                    $scope.orderBaseInfo.cusUserId = item.customerId;
                    $scope.$apply();
                }
            }).open();
        };

        //产品
        function rechangeProductData(data){
            data.forEach(function(value){
                value.name += '('+ value.code +')';
            });
            return data
        }
        var productBox;
        $scope.getProduct = function () {
            $scope.contentList = confirmOrderService.getProductAllData({'urlParams': {'isHot': true}});
            $scope.navItem = confirmOrderService.getProductNavItem();
            productBox = new SearchBox.init({
                inputId:"productList",
                searchData:[],
                defaultText: '请选择',
                tip:'请输入名称或编码',
                navItem: $scope.navItem.data,
                tabIndex:'热门',
                contentList: rechangeProductData($scope.contentList.data),
                toggleTab: function(currentPage,index){
                    this.tabIndex = index;
                    var config = {
                        'urlParams': {
                            'isHot':false,
                            'pageIndex': currentPage || 1,
                            'pageSize': 10,
                            'customerId':$scope.orderBaseInfo.cusUserId,
                            'capital': index
                        }
                    };
                    if(index == "热门"){
                        config.urlParams.isHot = true;
                        config.urlParams.capital = '';
                    }
                    if(index == "其他"){
                        config.urlParams.isHot = false;
                        config.urlParams.capital = '_';
                    }
                    var result = confirmOrderService.getProductAllData(config);
                    return {data:rechangeProductData(result.data),pagination:result.pagination}
                },
                onSearchValueChange:function(data,currentPage) {
                    var config = {
                        'urlParams': {
                            'q':data,
                            'isHot':false,
                            'pageIndex': currentPage || 1,
                            'pageSize': 10,
                            'customerId':$scope.orderBaseInfo.cusUserId,
                            'capital': ''
                        }
                    };
                    var result = confirmOrderService.getProductAllData(config);
                    return {data:rechangeProductData(result.data),pagination:result.pagination};
                },
                attrTextModel: function (name, item) {
                    if(!name){
                        $scope.orderBaseInfo.cargoTypeName = '';
                        $scope.orderBaseInfo.cargoTypeId = '';
                        $scope.orderBaseInfo.cusWeight = '';
                        $scope.orderBaseInfo.cusWeightUnit = '';
                        $scope.orderBaseInfo.cusWeightUnitName = '';
                        $scope.orderBaseInfo.productName = '';
                        $scope.oPlaceList = [];
                        $scope.dPlaceList = [];
                        $scope.aPlaceList = [];
                        $scope.serviceList = [];
                        $scope.$apply();
                        return;
                    }
                    //产品组根Id。1：海运，6：空运，11：其他（速递）
                    $scope.productGroupRootId = item.productGroupRootId;

                    confirmOrderService.getProductGroupRootId({seatParams:{'productId':item.id}}, function(res){
                        if(res.errorCode === 0){
                            $scope.accountCurrency = res.data.currencyCode;
                        }
                    });

                    if($scope.productGroupRootId == $scope.seaId || $scope.productGroupRootId == $scope.airId){
                        $scope.isOrdinary = false;
                    }else{
                        $scope.isOrdinary = true;
                        $scope.productGroupRootId = 11;    //强制为速递
                    }

                    //产品里面是否包含揽收服务。没有则缓存可选服务
                    $scope.filterProductAddress(item.uid);

                    //产品信息保存
                    $scope.orderBaseInfo.productName = name;
                    $scope.orderBaseInfo.productUid = item.uid;
                    $scope.orderBaseInfo.productId = item.id;

                    getAddressList(1);  //拉取当前用户关联的始发地址
                    getAddressList(2);  //拉取当前用户关联的目的地址
                    getAddressList(3);  //拉取当前用户关联的揽收地址

                    //货物类型
                    $scope.orderBaseInfo.cargoTypeName = "";
                    $scope.orderBaseInfo.cargoTypeId = "";
                    cargoEle && cargoEle.clearData();
                    var cargoData = confirmOrderService.getProductCargoData({'seatParams':{id: $scope.orderBaseInfo.productId}});

                    //货物总重数据清空
                    $scope.orderBaseInfo.cusWeight = '';

                    //可选服务
                    $scope.resourceTree.serviceList = item.services;

                    getServersList();
                    $scope.isAddressAccessForCurrentProduce();

                    //清除弹出层海运，空运地址数据
                    airSeaEle && airSeaEle.clearData();
                    Select.sharePool['select-air-sea'] = null;

                    if(cargoData.errorCode ===0 && cargoData.data.length>0){
                        $scope.orderBaseInfo.cargoTypeName = cargoData.data[0].cargoTypeName;
                        $scope.orderBaseInfo.cargoTypeId = cargoData.data[0].cargoTypeCode;
                    }
                    $scope.$apply();
                }
            });
        };

        /**
         * 产品是否是包含揽收服务，如果不是，则保存该产品的可选服务。
         */
        $scope.filterProductAddress = function(uid){
            if(uid){
                confirmOrderService.getProductReceived({'urlParams':{'uid':uid}}, function(res){
                    if(res.errorCode === 0){
                        $scope.productReceivedData = res.data;
                        $scope.productReceived = res.data.productReceive;    //主服务和必选服务包括揽收服务
                    }else{
                        $scope.productReceivedData = {};
                        $scope.productReceived = false;
                    }
                });
            }
        };

        var cargoEle;
        //货物类型
        $scope.cargoEle = function () {
            if(!$scope.orderBaseInfo.productId){
                return false;
            }
            var config = {
                'seatParams':{
                    id: $scope.orderBaseInfo.productId    //产品Id
                }
            };
            var res = confirmOrderService.getProductCargoData(config);    //获取产品对应的货物类型

            cargoEle = selectFactory({
                data: [],
                isUsePinyin: true,
                id: "cargoTypeList",
                isSaveInputVal: true,
                maxHeight: 160,
                showTextField: 'cargoTypeName',
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                attrTextModel: function (name, data, item) {
                    if(!name){
                        $scope.orderBaseInfo.cargoTypeName = $scope.orderBaseInfo.cargoTypeId = '';
                    }else{
                        $scope.orderBaseInfo.cargoTypeName = name;
                        $scope.orderBaseInfo.cargoTypeId = item.cargoTypeCode;
                    }
                    $scope.$apply();
                }
            });

            cargoEle.setData(res);
            cargoEle.open();
        };
        var getCargoUnitList = function (data) {
            var config = {
                'urlParams': {
                    'q': data ? data.trim() : "",
                    'pageIndex': 1,
                    'pageSize': 100
                }
            };
            return confirmOrderService.getCargoUnitList(config);
        };
        //计价单位
        $scope.unitEle = function () {
            var res = getCargoUnitList();

            unitEle = selectFactory({
                data: res,
                id: "cargoUnitList",
                isUsePinyin: true,
                isSaveInputVal: true,
                showTextField: "code",
                maxHeight: 160,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                attrTextModel: function (name, data) {
                    var cargoUnit;
                    if (!name) {
                        cargoUnit = {};
                    } else {
                        cargoUnit = data.data.find(function (item) {
                            return item.code == name;
                        })
                    }
                    $scope.orderBaseInfo.cusWeightUnit = cargoUnit.code;
                    $scope.orderBaseInfo.cusWeightUnitName = cargoUnit.name;
                    $scope.checkWeight();
                    $scope.$apply();
                }
            }).open();
        };
        //选择地址
        $scope.selectAddress = function (index, isOrigin) {
            if (isOrigin == 1) {
                $scope.oPlaceIndex = index;
            } else if(isOrigin == 2) {
                $scope.dPlaceIndex = index;
            } else if(isOrigin == 3) {
                $scope.aPlaceIndex = index;
            }
        };
        //设置订单子单流程
        var setSubOrderLogistics = function (orderStatus, orderNo, waybillNo) {
            var callback = function (res) {
                if (res.errorCode != 0) {
                    comObj.showErrorMsg(res.msg);
                } else {
                    $scope.processList = ordersStatusDataHandle.setStatus(res.data, orderStatus);
                }
            };
            confirmOrderService.getOrderStatus("", callback);
            var params = {
                seatParams: {
                    "waybillNo": waybillNo
                }
            };
            var callback = function (res) {
                if (res.errorCode != 0) {
                    comObj.showErrorMsg(res.msg);
                } else {
                    $scope.orderInfo = {
                        "packageNum": ordersStatusDataHandle.countObjLength(res.data),
                        "orderLogistics": ordersStatusDataHandle.setTransInfo(res.data)
                    };
                    console.log($scope.orderDetail);
                    console.log($scope.orderInfo);
                }
            };
            confirmOrderService.getOrderInfoByorderNo(params, callback);
        };

        var addressFilter = function (rootMap) {
            $scope.oPlaceList.map(function (item, index) {
                item.isNotAccess = !rootMap[item.id];
                if(item.isDefault && item.isNotAccess && $scope.oPlaceIndex == index){
                    $scope.oPlaceIndex = -1;
                }
            });

            $scope.dPlaceList.map(function (item, index) {
                item.isNotAccess = !rootMap[item.id];
                if(item.isDefault && item.isNotAccess && $scope.dPlaceIndex == index){
                    $scope.dPlaceIndex = -1;
                }
            });
            $scope.aPlaceList.map(function (item, index) {
                item.isNotAccess = !rootMap[item.id];
                if(item.isDefault && item.isNotAccess && $scope.aPlaceIndex == index){
                    $scope.aPlaceIndex = -1;
                }
            });
        };

        //获取当前用户某个产品下地址是否可用
        $scope.isAddressAccessForCurrentProduce = function () {
            var uid = $scope.orderBaseInfo.productUid;
            var customerId = $scope.orderBaseInfo.customerId;
            if (!(uid && customerId)) {
                return;
            }
            if ($scope.resourceTree.addRootMap && $scope.resourceTree.addRootMap[uid + "$$" + customerId]) {
                addressFilter($scope.resourceTree.addRootMap[uid + "$$" + customerId]);
                return;
            }
            var params = {
                seatParams: {
                    uid: uid,
                    customerId: customerId,
                    transportType:$scope.productGroupRootId
                }
            };
            var callback = function (res) {
                if (res.errorCode == 0) {
                    if (!$scope.resourceTree.addRootMap) {
                        $scope.resourceTree.addRootMap = {};
                    }
                    $scope.resourceTree.addRootMap[uid + "$$" + customerId] = res.data;
                    addressFilter(res.data);

                } else {
                    comObj.showErrorMsg(res.msg);
                }
            };
            confirmOrderService.isAddressAccessForCurrentProduce(params, callback);
        };
        //判断产品的重量是否在计量范围内
        $scope.checkWeight = function () {
            if ($scope.orderBaseInfo.cusWeight) {
                if (!$scope.orderBaseInfo.cusWeight) {
                    return;
                }
                if ($scope.orderBaseInfo.cusWeight == 0 || !($scope.orderBaseInfo.cusWeight.indexOf(".")) || ($scope.orderBaseInfo.cusWeight + "").split(".").length > 2) {
                    $scope.ConformOrderForm.cusWeight.invalidNum = Lang.getValByKey("confirmOrder", "confirmOrder_model_invalidNum");
                    $("#cusWeight").addClass("error");
                    return;
                } else {
                    $scope.ConformOrderForm.cusWeight.invalidNum = "";
                    $("#cusWeight").removeClass("error");
                }
            }
            if (!($scope.orderBaseInfo.productUid && $scope.orderBaseInfo.cusWeight && $scope.orderBaseInfo.cusWeightUnit)) {
                return;
            }
            var params = {
                urlParams: {
                    weight: $scope.orderBaseInfo.cusWeight,
                    weightUnitCode: $scope.orderBaseInfo.cusWeightUnit
                },
                seatParams: {
                    uid: $scope.orderBaseInfo.productUid
                }
            };
            var callback = function (res) {
                if (res.errorCode == 0) {
                    var str = "计量单位有问题";
                    if (!res.data) {
                        $("input[name='cusWeight']").addClass("error");
                        $("input[name='cusWeightUnit']").addClass("error");
                        $scope.ConformOrderForm.cusWeight.errorTips = res.msg;
                    } else {
                        $("input[name='cusWeight']").removeClass("error");
                        $("input[name='cusWeightUnit']").removeClass("error");
                        $scope.ConformOrderForm.cusWeight.errorTips = "";
                    }

                } else {
                    comObj.showErrorMsg(res.msg);
                }
            };
            confirmOrderService.isWeightInRange(params, callback);
        };
        $scope.baseInfoCheck = function () {
            var flag = false;
            var temp = ["customerName", "externalNo", "productName", "cargoTypeName", "packageNum", "cusWeight", "cusWeightUnit"];
            for (var s = 0, len = temp.length; s < len; s++) {
                if (!$scope.orderBaseInfo[temp[s]] || $("#" + temp[s]).hasClass("error")) {
                    $scope.ConformOrderForm[temp[s]].$setDirty();
                    flag = true;
                }
            }
            return flag;
        };
        $scope.addressCheck = function () {
            var flag = false;
            var op = $scope.oPlaceList[$scope.oPlaceIndex];
            var dp = $scope.dPlaceList[$scope.dPlaceIndex];
            var ap = $scope.aPlaceList[$scope.aPlaceIndex];
            if (!op && !$scope.orderDetail) {
                $(".cm-main").scrollTop($(".cm-main").offset().top - $("#fromAddress").offset().top)
                comObj.showErrorMsg("始发地址不能为空");
                return true;
            }
            if (!dp && !$scope.orderDetail) {
                $(".cm-main").scrollTop($(".cm-main").offset().top - $("#toAddress").offset().top);
                comObj.showErrorMsg("目的地地址不能为空");
                return true;
            }
            if ($scope.productReceived && !ap && !$scope.orderDetail) {
                $(".cm-main").scrollTop($(".cm-main").offset().top - $("#acceptAddress").offset().top);
                comObj.showErrorMsg("揽收地地址不能为空");
                return true;
            }
            return flag;
        };
        $scope.goodsCheck = function () {
            if (!$scope.submited) {
                return;
            }
            var testRule = [
                {
                    "reg": "/^[\\u4E00-\\u9FA5_\\w_\\-]{1,30}$/",           //名称
                    "tips": Lang.getValByKey("common", "common_validate_name")
                },
                {
                    "reg": "/^([\\w_\\-]+)+$/",           //英文名称
                    "tips": Lang.getValByKey("common", "common_validate_code")
                },
                {
                    "reg": "/^[0-9]{1}[0-9\.]{0,14}$/",           //HS编码  15位 1位小数不能放最开始
                    "tips": Lang.getValByKey("common", "common_validate_number")
                },
                {
                    "reg": "/^\\d{1,9}$/",           //数量
                    "tips": Lang.getValByKey("common", "common_validate_number")
                },
                {
                    "reg": "/^[\\u4E00-\\u9FA5A-Za-z0-9]{1,30}$/",           //计量单位
                    "tips": ""
                },
                {
                    "reg": "/^-?\\d+(\\.\\d{1,3})?$/",          //声明价格
                    "tips": Lang.getValByKey("confirmOrder", "confirmOrder_validation_price")
                },
                {
                    "reg": "/^[\\u4E00-\\u9FA5_\\w_\\-]{1,30}$/",          //物品描述
                    "tips": Lang.getValByKey("common", "common_validate_name")
                }
            ];
            $scope.selectGoods = [];
            var selectId = [];
            var flag = false;
            //收集所有要校验的行
            for (var s = 0, len1 = $scope.goodsList.length; s < len1; s++) {
                for (k in $scope.goodsList[s]) {
                     if ($scope.goodsList[s][k] && k != "id") {
                        selectId.push(s);
                        $scope.selectGoods.push($scope.goodsList[s]);
                        break;
                    }
                }
            }
            var oInput = $(".goodsItem");
            oInput.removeClass("error");
            $scope.goodsListRule = "";
            for (var s = 0; s < selectId.length; s++) {
                for (var k = 0; k < 7; k++) {
                   if (!eval(testRule[k].reg).test(oInput[selectId[s] * 7 + k].value)) {
                       if(oInput[selectId[s] * 7 + k].value){
                            $scope.goodsListRule = $scope.goodsListRule ? $scope.goodsListRule : testRule[k].tips;
                       }
                       $(oInput[s * 7 + k]).addClass("error");
                       flag = true;
                    }
                }
            }
            return flag;
        };
        //提交数据
        $scope.submitOrder = function (draftOrCommit) {
            if($scope.existExternalNo){
                $('.cm-main').scrollTop($('.errors').eq(0).offset().top - 30);
                return;
            }
            $route.current.params.orderStatus = draftOrCommit;
            //基本信息模块校验
            var flag = false;
            $scope.submited = true;
            flag = $scope.baseInfoCheck();
            if (flag) {
                scrollToErrorView($(".cm-main"));
                return;
            }

            //地址模块校验
            flag = $scope.addressCheck();
            if (flag && !$scope.orderDetail) {
                return;
            }

            if ($scope.oPlaceIndex != undefined && $scope.oPlaceIndex != -1) {
                var op = $scope.oPlaceList[$scope.oPlaceIndex];
            } else {
                var op = {
                    countryCode: $scope.orderDetail.fromAddress.countryCode,
                    countryName: $scope.orderDetail.fromAddress.countryName,
                    provinceId: $scope.orderDetail.fromAddress.provinceId,
                    provinceName: $scope.orderDetail.fromAddress.provinceName,
                    cityId: $scope.orderDetail.fromAddress.cityId,
                    cityName: $scope.orderDetail.fromAddress.cityName,
                    districtId: $scope.orderDetail.fromAddress.districtId,
                    districtName: $scope.orderDetail.fromAddress.districtName,
                    streetId: $scope.orderDetail.fromAddress.streetId,
                    streetName: $scope.orderDetail.fromAddress.streetName,
                    address: $scope.orderDetail.fromAddress.address,
                    id: $scope.orderDetail.fromAddress.id,
                    name: $scope.orderDetail.fromName,
                    phone: $scope.orderDetail.fromPhone,
                    telPhone: $scope.orderDetail.fromTelephone,
                    postcode: $scope.orderDetail.fromAddress.postcode,
                    email: $scope.orderDetail.fromAddress.email,
                    type: 1,
                    transportName:$scope.orderDetail.fromAddress.transportName,
                    transportType:$scope.orderDetail.fromAddress.transportType,
                    transportId:$scope.orderDetail.fromAddress.transportId
                };
            }
            if ($scope.dPlaceIndex != undefined && $scope.dPlaceIndex != -1) {
                var dp = $scope.dPlaceList[$scope.dPlaceIndex];
            } else {
                var dp = {
                    countryCode: $scope.orderDetail.toAddress.countryCode,
                    countryName: $scope.orderDetail.toAddress.countryName,
                    provinceId: $scope.orderDetail.toAddress.provinceId,
                    provinceName: $scope.orderDetail.toAddress.provinceName,
                    cityId: $scope.orderDetail.toAddress.cityId,
                    cityName: $scope.orderDetail.toAddress.cityName,
                    districtId: $scope.orderDetail.toAddress.districtId,
                    districtName: $scope.orderDetail.toAddress.districtName,
                    streetId: $scope.orderDetail.toAddress.streetId,
                    streetName: $scope.orderDetail.toAddress.streetName,
                    address: $scope.orderDetail.toAddress.address,
                    id: $scope.orderDetail.toAddress.id,
                    name: $scope.orderDetail.toName,
                    phone: $scope.orderDetail.toPhone,
                    telPhone: $scope.orderDetail.toTelephone,
                    postcode: $scope.orderDetail.toAddress.postcode,
                    email: $scope.orderDetail.toAddress.email,
                    type: 2,
                    transportName:$scope.orderDetail.toAddress.transportName,
                    transportType:$scope.orderDetail.toAddress.transportType,
                    transportId:$scope.orderDetail.toAddress.transportId
                };
            }

            if ($scope.aPlaceIndex != undefined && $scope.aPlaceIndex != -1 && $scope.productReceived) {
                var ap = $scope.aPlaceList[$scope.aPlaceIndex];
            } else {
                if($scope.orderDetail && $scope.orderDetail.fetchAddress){
                    var ap = {
                        countryCode: $scope.orderDetail.fetchAddress.countryCode,
                        countryName: $scope.orderDetail.fetchAddress.countryName,
                        provinceId: $scope.orderDetail.fetchAddress.provinceId,
                        provinceName: $scope.orderDetail.fetchAddress.provinceName,
                        cityId: $scope.orderDetail.fetchAddress.cityId,
                        cityName: $scope.orderDetail.fetchAddress.cityName,
                        districtId: $scope.orderDetail.fetchAddress.districtId,
                        districtName: $scope.orderDetail.fetchAddress.districtName,
                        streetId: $scope.orderDetail.fetchAddress.streetId,
                        streetName: $scope.orderDetail.fetchAddress.streetName,
                        address: $scope.orderDetail.fetchAddress.address,
                        id: $scope.orderDetail.fetchAddress.id,
                        name: $scope.orderDetail.fetchName,
                        phone: $scope.orderDetail.fetchPhone,
                        telPhone: $scope.orderDetail.fetchTelephone,
                        postcode: $scope.orderDetail.fetchAddress.postcode,
                        email: $scope.orderDetail.fetchAddress.email,
                        type: 3,
                        transportName:$scope.orderDetail.fetchAddress.transportName,
                        transportType:$scope.orderDetail.fetchAddress.transportType,
                        transportId:$scope.orderDetail.fetchAddress.transportId
                    };
                }else{
                    ap = {};
                }
            }

            //物品明细模块校验
            if (!$scope.goodsList.length) {
                comObj.showErrorMsg("请添加物品明细");
                return;
            }
            flag = $scope.goodsCheck();
            if (flag) {
                comObj.showErrorMsg("物品明细校验失败");
                return;
            }
            if (!$scope.selectGoods.length) {
                comObj.showErrorMsg("请添加物品明细");
                return;
            }
            var str = "";
            var orderStatus = '';
            if (draftOrCommit == "COMMITED") {
                orderStatus = $scope.orderStatus == "DRAFT" ? "COMMITED" : $scope.orderStatus;
                if ($scope.orderNo && $scope.orderStatus != "DRAFT") {
                    str = Lang.getValByKey("confirmOrder", "confirmOrder_pormpt_updateOrder");
                } else {
                    str = Lang.getValByKey("confirmOrder", "confirmOrder_pormpt_saveOrder");
                }
            } else {
                orderStatus = "DRAFT";
                if (!$scope.orderNo) {
                    str = Lang.getValByKey("confirmOrder", "confirmOrder_pormpt_saveDraft");
                } else {
                    str = Lang.getValByKey("confirmOrder", "confirmOrder_pormpt_updateDraft");
                }
            }
            var selectServices = $scope.serviceList.filter(function (item) {
                return item.isChecked;
            });
            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: str
                },
                manualClose: false, /*** 是否手动关闭 */
                time: 1000,
                isDelay: false,
                cancelEvent: function () {
                    $(document).promptBox('closePrompt');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function () {
                            var data = {
                                "id": "",
                                "orderNo": $scope.orderNo || "",
                                createUserName: $scope.orderDetail ? $scope.orderDetail.createUserName : "",
                                createFullName: $scope.orderDetail ? $scope.orderDetail.createFullName : "",
                                //注：这块的cusUserId和customerId反着，之后改了需求不想改model了
                                "cusUserId": $scope.orderBaseInfo.customerId,
                                "cusUserName": $scope.orderBaseInfo.customerName,
                                "cargoType": $scope.orderBaseInfo.cargoTypeId,
                                "customerId": $scope.orderBaseInfo.cusUserId || $scope.orderDetail.customerId,
                                "cargoTypeName": $scope.orderBaseInfo.cargoTypeName,
                                "productUid": $scope.orderBaseInfo.productUid,
                                "productName": $scope.orderBaseInfo.productName,
                                "orderStatus": orderStatus,
                                "cusWeight": $scope.orderBaseInfo.cusWeight,
                                "cusWeightUnit": $scope.orderBaseInfo.cusWeightUnit,
                                "cusWeightUnitName": $scope.orderBaseInfo.cusWeightUnitName,
                                "packageNum": $scope.orderBaseInfo.packageNum,
                                "fromName": op.name,
                                "fromPhone": op.phone,
                                "fromTelephone": op.telPhone,
                                "toName": dp.name,
                                "toPhone": dp.phone,
                                "toTelephone": dp.telPhone,
                                "externalNo": $scope.orderBaseInfo.externalNo,
                                "customerNote": $scope.orderCustomerMsg.msg,
                                "orderCargoDtos": $scope.selectGoods,
                                "ordSubOrderDtos": $scope.ordSubOrderDtos,
                                "orderAdditionalDtos": selectServices,
                                "fromAddress": op,
                                "toAddress": dp,
                                "fileDtos":$scope.result
                            };
                            if($scope.productReceived){
                                data.fetchAddress = ap;
                                data.fetchName = ap.name;
                                data.fetchPhone = ap.phone;
                                data.fetchTelephone = ap.telPhone;
                            }
                            var callback = function (res) {
                                $(document).promptBox('closePrompt');

                                if (res.errorCode != 0) {
                                    comObj.showErrorMsg(res.msg);
                                } else {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: res.msg,
                                        type: 'success',
                                        time: 3000
                                    });
                                    setTimeout(function () {
                                        $scope.goBack(true);
                                    }, 1000);
                                }
                            };

                            if ($scope.orderNo) {
                                var params = {
                                    urlParams: data,
                                    seatParams: {
                                        orderNo: $scope.orderNo
                                    }
                                };
                                confirmOrderService.updateOrder(params, callback);
                            } else {
                                var params = {
                                    urlParams: data
                                };
                                confirmOrderService.submitOrder(params, callback);
                            }
                        },
                    }
                ]
            };
            $(document).promptBox(opt);
        };
        confirmOrderView.bindEvent();
        //展开收齐动作
        $scope.switchStatus = function (str, flag) {
            confirmOrderView.switchStatus($scope, str, flag);
        };
        var flag = window.location.href.indexOf("?") > -1;
        if (flag) {
            $scope.orderNo = easySpa.queryUrlValByKey("orderNum");
        }
        if (flag && $scope.orderNo) {
            getOrderInfoByOrderId($scope.orderNo);
        } else {
            $scope.couldEdit = true;
            $scope.orderStatus = 'DRAFT';
        }
        $scope.resetInput = function(e){

            var val = e.target.value;
            e.target.value = val.toUpperCase();
            $scope.currentAddress.postcode =  val.toUpperCase();
        };
        $scope.toggleList = function (index) {
            confirmOrderView.toggleList($scope, index);
        };
        $scope.remainWord = function (that) {
            confirmOrderView.remainWord($scope);
        };
        $scope.edit = function () {
            $scope.couldEdit = true;
            $scope.confirmOrderAddFile(false,'#confirmOrderFileContent');
            setSelectBoxList();
        };
        $scope.cancelEdit = function () {
            $scope.couldEdit = false;
            $scope.oPlaceIndex = -1;
            $scope.dPlaceIndex = -1;
            $scope.aPlaceIndex = -1;
            $(".cm-main").scrollTop(0);
            getOrderInfoByOrderId($scope.orderNo);
        };
        $scope.jumpTo = function (type, id, uid) {
            var workId = $route.current.params.id || '',
                isJustShow = $route.current.params.isJustShow || false,
                origin = $scope.from || '';

            var typeMenu = {
                1: "customer?id={id}",
                2: "product?module=new&id={id}&uid={uid}&orderNo={$orderNo}&workId={workId}&isJustShow={isJustShow}&origin={origin}",
                3: "workOrderDetail?orderNo={$orderNo}&waybillNo={$waybillNo}"
            };
            top.location.href = "http://" + location.host + "/#/" +
                typeMenu[type].replace("{id}", id).replace("{workId}", workId).replace("{isJustShow}", isJustShow).replace("{origin}", origin).replace("{uid}", uid).replace('{$orderNo}', $scope.orderNo).replace('{$waybillNo}', $scope.orderDetail.waybillNo) + "&isEdit=false";
        };

        // by jinxyang
        $scope.noCustomerName = true;
        $scope.existExternalNo = false;
        $scope.$watch('orderBaseInfo.customerName', function(newValue) {
            if (newValue) $scope.noCustomerName = false;
        });

        $scope.checkExternalNo = function(num) {
            var id = $scope.orderDetail ? $scope.orderDetail.id : 0;
            var params = {
                urlParams: {},
                seatParams: {
                    cusUserId: $scope.orderBaseInfo.customerId,
                    externalNo: num,
                    id:id
                }
            };
            if (num) {
                confirmOrderService.checkExternalNo(params, function(res) {
                    if (res.data) {
                        $scope.existExternalNo = true;
                    } else {
                        $scope.existExternalNo = false;
                    }
                });
            }
        };

        /**
         *  获取海运、空运数据
         */
        var airSeaEle;
        $scope.getAirSeaListData = function(q, currentPage){
            var type = $scope.isOriginAddress == 1 ? 's' : ($scope.isOriginAddress == 2 ? 'e' : 'l');

            var config = {
                urlParams: {
                    q: q || '',
                    type: type,
                    id:$scope.orderBaseInfo.productId,
                    countryCode:$scope.currentAddress.countryCode,
                    pageIndex: currentPage || 1,
                    pageSize: 10
                }
            };

            var data = confirmOrderService.getAirSeaData(config);
            angular.forEach(data.data, function(value, index){
                if($scope.productGroupRootId == $scope.seaId){
                    value.name += '(' + value.enName + ')';
                }else if($scope.productGroupRootId == $scope.airId){
                    value.name += '(' + value.code + ')';
                }
            });
            return data;
        };
        $scope.getAirSeaList = function(){
            if($scope.productGroupRootId == $scope.seaId){
                var searchPlaceHoder = '请输入港口名称';
            }else if($scope.productGroupRootId == $scope.airId){
                var searchPlaceHoder = '请输入名称或三字码';
            }

            airSeaEle = selectFactory({
                data: [],
                isSearch: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-air-sea',
                showTextField: 'name',
                searchPlaceHoder:searchPlaceHoder,
                isSaveInputVal:true,
                closeLocalSearch: true,
                pagination: true,
                attrTextField: {
                    'ng-value': 'id'
                },
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.airSeaData = $scope.getAirSeaListData(data, currentPage);
                    attachEvent.setData($scope.airSeaData);
                },
                attrTextId: function (id) {
                    $scope.airSeaValue = id;
                    $scope.$apply();
                },
                attrTextModel: function (name, data, item) {
                    $scope.airSea = name;
                    $scope.addressDetail = item.address;
                    $scope.$apply();
                }
            });
            airSeaEle.open();
        };

        $scope.changeProductReceived = function(){
            if($scope.productReceivedData.productReceive){    //主服务里面已经包含揽收服务。
                return;
            }

            $scope.productReceived = false;
            angular.forEach($scope.serviceList, function(item){
                if(item.isChecked && item.serviceTypeCode == 'ST001'){    //可选服务选中揽收服务
                    $scope.productReceived = true; return;
                }
            });
        };
        $scope.confirmOrderAddFile = function(flag,append){
            var param = {
                system:'operation',
                edit:flag,
                btnHandle:false,
                orderStatus:$scope.orderStatus || 'DRAFT',
                append:append,
                orderNo:$scope.orderNo ||'',
                orderFileType:{
                    url:'/api/v1/order/files/fileTypes',
                    type:'GET'
                },
                getOrderFile:{
                    url:'/api/v1/order/files',
                    type:'GET',
                    param:{
                        pageIndex:1,
                        pageSize:20,
                        orderNo:$scope.orderNo || ''
                    }
                },
                delOrderFile:{
                    url:'',
                    type:'POST',
                    param:{
                        orderNo:$scope.orderNo || '',
                        orderFileId:''
                    }
                },
                addOrderFile:{
                    url:'/api/v1/order/files/'+$scope.orderNo+'/orderFiles',
                    type:'POST',
                    param:{
                        orderNo:$scope.orderNo || '',
                        orderFileId:''
                    }
                },
                ckeckFileName:{
                    url:'/api/v1/order/files/files/name/check',
                    type:'GET',
                    param:{
                        orderNo:$scope.orderNo || '',
                        orderFileId:''
                    }
                }
            };
            $scope.result = $(document).uploadBox(param)
        };
        if($scope.couldEdit && !$scope.orderNo){
            $scope.confirmOrderAddFile(true,'#confirmOrderFileContent');
        }else if($scope.couldEdit && $scope.orderNo){
            $scope.confirmOrderAddFile(false,'#confirmOrderFileContent');
        }else{
            $scope.confirmOrderAddFile(false,'#confirmOrderFileContentInfo');
        }

        $scope.changePhone = function(){
            if(!$.trim($('#mobile-phone').val()) && !$.trim($('#tel-phone').val())){
                $('#mobile-phone').addClass('ng-invalid ng-dirty');
            }else{
                $('#mobile-phone').removeClass('ng-invalid ng-dirty');
            }
        };
    }]);
});

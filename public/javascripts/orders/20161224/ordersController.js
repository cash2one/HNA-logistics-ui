easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js',
    'public/common/uploadFile/uploadFile.js',
    'widget/select',
    'widget/searchBox',
    'public/common/calander.js'
], function () {
    app.controller('ordersCtrl', ['$scope', '$route', 'ordersService', 'ordersView', 'tableService', function ($scope, $route, ordersService, ordersView, tableService) {
        //初始化时间控件
        ordersView.initCalander();
        $scope.orderStartTime = getBeforeDate(6) + ' 00:00:00';    //起始时间
        $scope.orderEndTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间

        //初始化数据
        $scope.orderState = {};
        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", "common_thead_number"),
                '运单号',
                Lang.getValByKey("orders", "orders_client_bill"),
                Lang.getValByKey("orders", "orders_product_info"),
                Lang.getValByKey("orders", "orders_client_info"),
                Lang.getValByKey("orders", "orders_goods_type"),
                Lang.getValByKey("orders", "orders_address_range"),
                Lang.getValByKey("orders", "orders_creat_time")
            ],
            'tableBody': [],
            'restURL': 'logistics.getOrdersTable',
            'restData': {
                'startEffectTime': getBeforeDate(6) + ' 00:00:00',
                'endEffectTime': new Date().format("yyyy-MM-dd 23:59:59"),
                'orderStatus': '',
                'customerId': '',
                'cusUserId': '',
                'waybillNo': '',
                'productUid': '',
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'externalNo': '',
                'sort': 'createTime',
                'asc': false
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        //状态初始化
        $route.current.params.orderStatus ? $scope.activeTab = $route.current.params.orderStatus : $scope.activeTab = 'DRAFT';


        $scope.fromOrderSearch = $route.current.params.from == 'orderSearch' ? true : false;

        if ($scope.activeTab == 'DRAFT') {
            if ($scope.tableModel.tableHeader.length == 9) {
                $scope.tableModel.tableHeader.pop();
            }
        } else {
            if ($scope.tableModel.tableHeader.length == 8) {
                $scope.tableModel.tableHeader.push('支付状态');
            }
        }

        /**
         * 获取订单表格
         */
        $scope.getOrdersTable = function () {
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            var tableHeight;
            $scope.activeTab === 'DRAFT' ? tableHeight = 317 : tableHeight = 371;
            config.urlParams.orderStatus = $scope.activeTab;
            tableService.getTable($scope.tableModel.restURL, config, function (data) {
                if (data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    var height = $('.g-orders').height() - tableHeight;
                    setTimeout(function () {
                        $('.table-container tbody').slimscroll({'height': height});
                        $(window).resize(function () {
                            height = $('.g-orders').height() - tableHeight;
                            $('.table-container tbody').slimscroll({'height': height});
                        });
                    }, 10);
                }
            });
        };
        $scope.getOrdersTable();

        /**
         * 按条件查询订单列表
         */
        $scope.search = function () {
            if ($scope.orderCode) {
                $scope.tableModel.restData.pageIndex = 1;
                $scope.tableModel.restData.startEffectTime = getBeforeDate(6) + ' 00:00:00';    //起始时间
                $scope.tableModel.restData.endEffectTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间
                $scope.tableModel.restData.customerId = "";    //客户名称
                $scope.tableModel.restData.waybillNo = $scope.orderCode;    //订单编号
                $scope.tableModel.restData.cusUserId = "";    //客户名称
                $scope.tableModel.restData.externalNo = "";   //客户单号
                $scope.tableModel.restData.payStatus = '';    //支付状态
                $scope.tableModel.restData.productUid = '';    //产品uid
            } else if (!$scope.orderCode && $scope.clientNum) {
                $scope.tableModel.restData.pageIndex = 1;
                $scope.tableModel.restData.startEffectTime = getBeforeDate(6) + ' 00:00:00';    //起始时间
                $scope.tableModel.restData.endEffectTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间
                $scope.tableModel.restData.customerId = "";    //客户名称
                $scope.tableModel.restData.waybillNo = "";    //订单编号
                $scope.tableModel.restData.cusUserId = "";    //客户名称
                $scope.tableModel.restData.externalNo = $scope.clientNum; //客户单号
                $scope.tableModel.restData.payStatus = '';    //支付状态
                $scope.tableModel.restData.productUid = '';    //产品UID
            } else {
                if(!$scope.orderProduct){
                    $scope.orderProductUid = '';
                }
                $scope.tableModel.restData.pageIndex = 1;
                $scope.tableModel.restData.startEffectTime = $scope.orderStartTime;    //起始时间
                $scope.tableModel.restData.endEffectTime = $scope.orderEndTime;    //截止时间
                $scope.tableModel.restData.customerId = $scope.orderCustomerValue;    //客户名称
                $scope.tableModel.restData.waybillNo = "";    //订单编号
                $scope.tableModel.restData.externalNo = "";    //订单编号
                $scope.tableModel.restData.cusUserId = $scope.orderClientValue;    //客户名称
                $scope.tableModel.restData.payStatus = $scope.payStatusValue || '';    //支付状态
                $scope.tableModel.restData.productUid = $scope.orderProductUid || '';    //支付状态
            }
            $scope.getOrdersTable();
        };

        /**
         * 清空查询条件
         */
        $scope.clearCondition = function () {
            $scope.tableModel.restData = {
                'startEffectTime': getBeforeDate(6) + ' 00:00:00',
                'endEffectTime': new Date().format("yyyy-MM-dd 23:59:59"),
                'customerId': '',
                'cusUserId': '',
                'waybillNo': '',
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'externalNo': '',
                'sort': 'createTime',
                'asc': false,
                'payStatus': ''
            };
            $scope.orderStartTime = getBeforeDate(6) + ' 00:00:00';    //起始时间
            $scope.orderEndTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间
            $scope.orderClientName = '';    //客户名称
            $scope.orderCode = '';    //订单编号
            $scope.clientNum = '';    //客户单号
            $scope.orderCustomerName = '';    //客户名称
            $scope.orderCustomerValue = '';
            $scope.orderClientValue = '';
            $scope.payStatusValue = '';
            $scope.payStatus = '';
            $scope.orderProduct = '';
            $scope.orderProductUid = '';
            if (clientEle) {
                clientEle.clearData();
            }
            $('#select-orders-status').val("");
            $scope.getOrdersTable();
        };

        /**
         * tab 切换
         * @param type
         */
        $scope.switchTab = function (type) {
            if (type === $scope.activeTab) {
                return;
            }

            $scope.activeTab = type;
            $scope.orderProduct = '';
            $scope.orderProductUid = '';
            if (type == 'DRAFT') {
                if ($scope.tableModel.tableHeader.length == 9) {
                    $scope.tableModel.tableHeader.pop();
                }
            } else {
                if ($scope.tableModel.tableHeader.length == 8) {
                    $scope.tableModel.tableHeader.push('支付状态');
                }
            }
            $scope.getProduct();
            //清空搜索条件并进行数据加载
            $scope.clearCondition();
        };

        /**
         * 点击下单
         */
        $scope.add = function () {
            window.location.href = '#/confirmOrder';
        };

        /**
         * 获取表格中勾选的数据
         * @returns {*}
         */
        function getSelectIds() {
            var param = [];
            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (!selData.length) {
                ordersView.promptBox({msg: Lang.getValByKey("common", 'common_code_noSelected')});
                return false;
            }
            angular.forEach(selData, function (val) {
                param.push(val.orderNo);
            });
            var params = {
                urlParams: param
            };
            return params;
        }

        /**
         * 删除订单
         */
        $scope.del = function () {
            var params = getSelectIds();
            if (!params) {
                return;
            }

            ordersView.promptMidBox(Lang.getValByKey("common", 'common_prompt_title'), {msg: Lang.getValByKey("orders", "orders_del_confrim")}, Lang.getValByKey("common", 'common_page_delete'), function () {
                ordersService.del(params, function (data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'success'});
                        $(document).promptBox('closePrompt');
                        $scope.getOrdersTable();
                        $scope.$apply();
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    }
                });
            }, 'warning', 'delete');
        };

        /**
         * 提交订单
         */
        $scope.commitOrder = function () {
            var params = getSelectIds();
            if (!params) {
                return;
            }

            ordersView.promptMidBox(Lang.getValByKey("common", 'common_prompt_title'), {msg: Lang.getValByKey("orders", "orders_commit_confrim")}, '', function () {
                ordersService.commitOrder(params, function (data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'success'});
                        $(document).promptBox('closePrompt');
                        $scope.getOrdersTable();
                        $scope.$apply();
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    }
                });
            });
        };

        /**
         * 弹出发送短信通知模板
         */
        $scope.sendInform = function () {
            var params = getSelectIds();
            if (!params) {
                return;
            }

            $scope.showPrompt = true;
            ordersService.checkOrderMessageSend(params, function (res) {
                if (res.errorCode === 0) {
                    $scope.orderState = res.data;
                }
            });
        };

        /**
         * 发送短信通知
         */
        $scope.savePrompt = function () {
            ordersService.sendInform($scope.orderState.sendOrders, function (res) {
                if (res.errorCode === 0) {
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    $(document).promptBox('closePrompt');
                    $scope.getOrdersTable();
                    $scope.$apply();
                } else {
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                }
            });
            $scope.showPrompt = false;
        };

        /**
         * 已提交-> 受理功能
         */
        $scope.orderAccepted = function () {
            var params = getSelectIds();
            if (!params) {
                return;
            }

            ordersView.promptMidBox(Lang.getValByKey("common", 'common_prompt_title'), {msg: Lang.getValByKey("orders", "orders_accept_confrim")}, '', function () {
                ordersService.orderAccepted(params, function (res) {
                    if (res.errorCode === 0) {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                        $(document).promptBox('closePrompt');
                        $scope.getOrdersTable();
                        $scope.$apply();
                    } else if (res.errorCode === 127119) {    //已提交订单（客户为现结方式，且订单未支付）
                        $(document).promptBox('closePrompt');
                        $scope.acceptedMsgBox = true;
                        $scope.acceptedMsg = res.data || [];

                        $scope.acceptedMsgMore = '';
                        if ($scope.acceptedMsg && $scope.acceptedMsg.length > 5) {
                            angular.forEach($scope.acceptedMsg, function (item, index) {
                                if (!index) {
                                    $scope.acceptedMsgMore += item;
                                } else {
                                    $scope.acceptedMsgMore += '  ' + item;
                                }
                            });
                        }
                        $scope.$apply();
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                });
            });
        };

        /**
         * 上传附件
         * @returns {boolean}
         */
        $scope.uploadFile = function () {
            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (selData.length !== 1) {
                ordersView.promptBox({msg: Lang.getValByKey("orders", 'orders_code_selectOne')});
                return false;
            }

            $scope.showUploadFile = true;
            var orderFileId = '';
            var param = {
                system: 'operation',
                edit: true,
                btnHandle: true,
                orderStatus: $scope.activeTab,
                append: '#uploadFileContent',
                orderNo: selData[0].orderNo,
                orderFileType: {
                    url: '/api/v1/order/files/fileTypes',
                    type: 'GET'
                },
                getOrderFile: {
                    url: '/api/v1/order/files',
                    type: 'GET',
                    param: {
                        pageIndex: 1,
                        pageSize: 50,
                        orderNo: selData[0].orderNo
                    }
                },
                delOrderFile: {
                    url: '',
                    type: 'POST',
                    param: {
                        orderNo: selData[0].orderNo,
                        orderFileId: ''
                    }
                },
                addOrderFile: {
                    url: '/api/v1/order/files/' + selData[0].orderNo + '/orderFiles',
                    type: 'POST',
                    param: {
                        orderNo: selData[0].orderNo,
                        orderFileId: ''
                    }
                },
                ckeckFileName: {
                    url: '/api/v1/order/files/files/name/check',
                    type: 'GET',
                    param: {
                        orderNo: selData[0].orderNo,
                        orderFileId: ''
                    }
                }
            };
            $scope.result = $(document).uploadBox(param)
        };

        /**
         * 打印面单-暂未开发
         */
        $scope.printOrder = function () {

        };

        /**
         * 查看订单详情
         */
        $scope.edit = function (orderNo, orderStatus) {
            window.location.href = '#/confirmOrder?orderNum=' + orderNo + '&orderStatus=' + orderStatus;
        };

        /**
         * 跳转模拟
         */
        $scope.jumpToTest = function () {
            window.location.href = '#/confirmOrderTest';
        };

        /**
         * 查看流转
         */
        $scope.showFlowProcess = function (orderNo, orderStatus) {
            window.location.href = '#/ordersStatus?orderNum=' + orderNo + '&orderStatus=' + orderStatus;
        };

        $scope.pay = function(){
            var selData = tableService.getSelectTable($scope.tableModel.tableBody);

            if(selData.length != 1){
                return;
            }
            if(!selData[0].waybillNo){
                return;
            }

            var config = {
                'seatParams':{
                    'waybillNo': selData[0].waybillNo
                }
            };

            ordersService.pay(config, function (res) {
                if (res.errorCode === 0) {
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                } else {
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                }
            });
        };

        /**==============================下拉框组件================================**/
        var clientEle;
        /**
         * 获取客户下拉列表  子账号
         */
        $scope.getClientData = function (q, currentPage) {
            if (!$scope.orderCustomerValue) {
                return;
            }
            var config = {
                'urlParams': {
                    q: q || '',
                    pageIndex: currentPage || 1,
                    pageSize: 10
                },
                'seatParams': {
                    costomerid: $scope.orderCustomerValue
                }
            };
            var data = ordersService.getClient(config);
            angular.forEach(data.data, function (value) {
                value.userName = value.fullName + '(' + value.userName + ')';
            });
            return data;
        };
        $scope.getClient = function () {
            var selectId;
            $scope.activeTab === 'DRAFT' ? selectId = "select-client" : selectId = "select-client1";
            if (!$scope.orderCustomerValue || clientEle) {
                clientEle.destroy();
            }
            clientEle = selectFactory({
                data: [],
                isSearch: true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: selectId,
                showTextField: "userName",
                searchPlaceHoder: '请输入姓名或用户名',
                pagination: true,
                isSaveInputVal: true,
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    if (!$scope.orderCustomerValue) {
                        return;
                    }

                    $scope.clientData = $scope.getClientData(data, currentPage);
                    attachEvent.setData($scope.clientData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.orderClientValue = id;
                    $scope.$apply();
                },
                attrTextModel: function (userName) {
                    $scope.orderClientName = userName;
                    $scope.$apply();
                }
            });

            clientEle.open();
            customerEle.next = clientEle;
        };

        /**
         * 获取客户下拉列表   主账号码
         */
        var customerEle;
        $scope.getCustomerData = function (q, currentPage) {
            var config = {
                'urlParams': {
                    'q': q ? q.trim() : "",
                    'pageIndex': currentPage || 1,
                    'pageSize': 10,
                    'isAsc': false,
                    'sortName': ''
                }
            };
            var res = ordersService.getCustomer(config);
            angular.forEach(res.data, function (value, key) {
                value.userName += '(' + value.code + ')';
            });
            return res;
        };
        $scope.getCustomer = function () {
            var selectId;
            $scope.activeTab === 'DRAFT' ? selectId = "select-customer" : selectId = "select-customer1";
            if (customerEle) {
                customerEle.destroy();
            }
            customerEle = selectFactory({
                data: [],
                isSearch: true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: selectId,
                pagination: true,
                searchPlaceHoder: '请输入账户名或编码',
                isSaveInputVal: true,
                showTextField: "userName",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getCustomerData(data, currentPage);
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.orderCustomerValue = id;
                    $scope.orderClientValue = "";
                    $scope.orderClientName = "";
                    $scope.clientData = null;
                    $scope.$apply();
                },
                attrTextModel: function (userName) {
                    if (!userName && clientEle) {
                        clientEle.clearData();
                    }

                    $scope.orderCustomerName = userName;
                    $scope.orderClientValue = "";
                    $scope.orderClientName = "";
                    $scope.clientData = null;
                    $scope.$apply();
                }
            });
            customerEle.open();
        };

        $scope.payStatusList = [];
        $scope.getPayStatus = function () {
            if(!$scope.payStatusList.length){
                $scope.payStatusList = ordersService.getPayStatusList();
            }
            selectFactory({
                data: $scope.payStatusList,
                defaultText: '全部',
                id: "select-pay-status",
                isSaveInputVal: true,
                showTextField: "name",
                attrTextModel: function (name, data, item) {
                    $scope.payStatus = item.name || '';
                    $scope.payStatusValue = item.code || '';
                    $scope.$apply();
                }
            }).open();
        };

        function rechangeProductData(data){
            data.forEach(function(value){
                value.name += '('+ value.code +')';
            });
            return data
        }
        $scope.getProduct = function () {
            $scope.contentList = ordersService.getProductAllData({'urlParams': {'isHot': true}});
            $scope.navItem = ordersService.getProductNavItem();
            var selectId;
            $scope.activeTab === 'DRAFT' ? selectId = "select-product" : selectId = "select-product1";
            var productBox = new SearchBox.init({
                inputId:selectId,
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
                    var result = ordersService.getProductAllData(config);
                    return {data:rechangeProductData(result.data),pagination:result.pagination}
                },
                onSearchValueChange:function(data,currentPage) {
                    var config = {
                        'urlParams': {
                            'q':data,
                            'isHot':false,
                            'pageIndex': currentPage || 1,
                            'pageSize': 10,
                            'capital': ''
                        }
                    };
                    var result = ordersService.getProductAllData(config);
                    return {data:rechangeProductData(result.data),pagination:result.pagination};
                },
                attrTextModel: function (name, data) {
                    $scope.orderProduct = name || '';
                    $scope.orderProductUid = data.uid || '';
                    $scope.$apply();
                }
            });
        };
        $scope.getProduct();
    }]);
});
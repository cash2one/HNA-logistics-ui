easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/tab',
    'widget/parseUrl',
    'widget/select',
    'public/common/tableController.js',
    'public/javascripts/fragment/customer/account.js',
    'public/javascripts/fragment/customer/companyInfo.js',
    'public/javascripts/fragment/customer/bizContacter.js',
    'public/javascripts/fragment/customer/clientContacter.js',
    'public/javascripts/fragment/customer/productSetting.js',
    'public/javascripts/fragment/customer/messageNotify.js',
    'public/javascripts/fragment/customer/userInfo.js'
], function () {
    app.controller('customerCtrl', [
        '$scope',
        '$route',
        'customerService',
        'customerView',
        'tableService',
        function ($scope, $route, customerService, customerView, tableService) {
            $scope.paramter = window.parseUrl.getParams();
            $scope.pageOfCustomerAudit = window.location.href.indexOf("customerApproval") > -1? true:false;
            $scope.showBtn = $scope.pageOfCustomerAudit == true? false:true;

            $scope.userType = 1; // 默认为物流-客户管理
            if ($scope.paramter && $scope.paramter.module == 'trade') {
                $scope.userType = 2; // 贸易-客户管理
            }
            var Tablehearder;

            if($scope.userType === 1){
                Tablehearder = [
                    Lang.getValByKey('common', 'common_thead_number'),
                    Lang.getValByKey('customer', 'customer_account_name'),
                    Lang.getValByKey('customer', 'customer_code'),
                    Lang.getValByKey('customer', 'customer_company_name'),
                    Lang.getValByKey('customer', 'customer_price_meal'),
                    // Lang.getValByKey('customer', 'customer_biz_type'),
                    Lang.getValByKey('customer', 'customer_level'),
                    Lang.getValByKey('customer', 'customer_audit_state'),
                ]
            }else{
                Tablehearder = [
                    Lang.getValByKey('common', 'common_thead_number'),
                    Lang.getValByKey('customer', 'customer_account_name'),
                    Lang.getValByKey('customer', 'customer_code'),
                    Lang.getValByKey('customer', 'customer_company_name'),
                    // Lang.getValByKey('customer', 'customer_biz_type'),
                    Lang.getValByKey('customer', 'customer_level'),
                    Lang.getValByKey('customer', 'customer_audit_state'),
                ]
            }

            $scope.tableModel = {
                tableHeader: Tablehearder,
                tableHeaderSize: ['5%', '10%', '10%', '15%', '15%', '15%','15%'],
                tableBody: [],
                restURL: 'logistics.getCustomerList',
                restData: {
                    q: '',
                    refCombos: '',
                    isLocked: -1,
                    evaluateLeval: '1',
                    beyondLeval: false,
                    isAsc: false,
                    pageIndex: 1,
                    pageSize: 10,
                    userType: $scope.userType,
                    authStatus:-1
                },
                selectNumber: 0,
                selectFlag: false,
            };
            $scope.seniorText = Lang.getValByKey('common', 'common_page_advancedFilter');
            $scope.isLockeds = {
                data: [{ id: -1, name: '全部' }, { id: 0, name: Lang.getValByKey('customer', 'customer_unlock') }, { id: 1, name: Lang.getValByKey('customer', 'customer_locked') }],
            };
            $scope.stateName = '全部';
            $scope.stateId = -1;
            $scope.combosName = Lang.getValByKey('customer', 'common_select_tips');
            $scope.combosId = '';
            $scope.levals = {
                data: [
                    // {id:-1,name:'无'},
                    { id: 1, name: Lang.getValByKey('customer', 'customer_one_star') },
                    { id: 2, name: Lang.getValByKey('customer', 'customer_two_star') },
                    { id: 3, name: Lang.getValByKey('customer', 'customer_three_star') },
                    { id: 4, name: Lang.getValByKey('customer', 'customer_four_star') },
                    { id: 5, name: Lang.getValByKey('customer', 'customer_five_star') },
                ],
            };


            $scope.evaluateLevalName = Lang.getValByKey('customer', 'customer_one_star');
            $scope.evaluateLevalId = '1';

            $scope.auditState ={
                data: [
                    {id:-1,name:Lang.getValByKey('customer', 'customer_state_all')},
                    {id:0,name:Lang.getValByKey('customer', 'customer_state_writing')},
                    { id: 1, name: Lang.getValByKey('customer', 'customer_state_to_be_submit') },
                    { id: 2, name: Lang.getValByKey('customer', 'customer_state_audit') },
                    { id: 4, name: Lang.getValByKey('customer', 'customer_state_success') },
                    { id: 3, name: Lang.getValByKey('customer', 'customer_state_fail') }

                ],
            };

            $scope.auditStateName = Lang.getValByKey('customer', 'customer_state_all');

            $scope.auidtMessage = ''; // 未通过原因
            $scope.authStatus = 0; // 未通过原因


            /** 初始加载机场信息列表 */
            $scope.$on('$viewContentLoaded', function () {
                $scope.loadListData();
            });
            $(window).on('resize', setScrollDetail);

            function setScrollDetail() {
                if ($scope.showSenior == true) {
                    $('.table-container tbody').slimscroll({
                        height: $('.content-main').height() - 314,
                    });
                } else {
                    $('.table-container tbody').slimscroll({
                        height: $('.content-main').height() - 250,
                    });
                }
            }
            $scope.setCustomerId = function (id) {
                $scope.customerId = id;
            };
            $scope.loadListData = function () {
                var params = {
                    urlParams: $scope.tableModel.restData,
                };
                tableService.getTable($scope.tableModel.restURL, params, function (data) {
                    if (data.errorCode === 0) {
                        var listData = data.data;
                        for (var j in listData) {
                            for (var i in $scope.levals.data) {
                                if (listData[j].evaluateLeval == $scope.levals.data[i].id) {
                                    listData[j].evaluateLevalName = $scope.levals.data[i].name;
                                }
                            }
                        }
                        data.data = listData;
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    }
                });

                setScrollDetail();
            };

            /** 高级筛选 */
            $scope.seniorFilter = function () {

                if ($scope.showSenior == true) {
                    $scope.seniorText = Lang.getValByKey('common', 'common_page_advancedFilter');
                    $scope.stateName = '全部';
                    $scope.stateId = -1;
                    $scope.combosName = Lang.getValByKey('customer', 'common_select_tips');
                    $scope.combosId = '';
                    $scope.evaluateLevalName = Lang.getValByKey('customer', 'customer_one_star');
                    $scope.evaluateLevalId = '1';
                    $scope.seniorChecked = false;
                    $scope.tableModel.restData.q = '';
                    $scope.tableModel.restData.refCombos = '';
                    $scope.tableModel.restData.isLocked = -1;
                    $scope.tableModel.restData.evaluateLeval = 1;
                    $scope.tableModel.restData.beyondLeval = false;
                    $scope.tableModel.restData.advancedSeach = false;
                    $scope.tableModel.restData.authStatus= -1;
                    $scope.auditStateName= '全部';
                } else {
                    $scope.tableModel.restData.advancedSeach = true;
                    $scope.seniorText = Lang.getValByKey('common', 'common_page_ordinaryFilter');
                }
                $scope.tableModel.restData.q = '';
                $scope.q = '';
                $scope.loadListData();
                $scope.showSenior = !$scope.showSenior;
                setScrollDetail();
            };

            /** 高级筛选条件 */
            function getSigleDataByName(name, data) {
                var result = data.data;
                for (var index = 0; index < result.length; index++) {
                    if (result[index].name == name) {
                        return result[index];
                    }
                }
            }
            $scope.selectCustomerCombos = function () {
                var combosData = customerService.getCombos();
                var map = [{ id: '', name: Lang.getValByKey('customer', 'common_select_tips') }];
                angular.forEach(combosData.data, function (value, key) {
                    map.push({
                        code: value.code,
                        preName:value.name,
                        name: value.name + '(' + value.code + ')',
                    });
                });
                combosData.data = map;
                selectFactory({
                    data: combosData,
                    id: 'combos',
                    defaultText: '',
                    defaultCount:100,
                    isCreateNewSelect:true,
                    isSearch: true,
                    attrTextModel: function (name, data, currentData) {
                        var comboData;
                        if (!name) {
                            comboData = {};
                        } else {
                            comboData = getSigleDataByName(name, data);
                        }
                        $scope.combosName = currentData.preName;
                        $scope.combosId = comboData.code;
                        $scope.tableModel.restData.refCombos = $scope.combosId;
                        $scope.loadListData();
                        $scope.$apply();
                    },
                });

            }
            $scope.initSelectList = function () {
                // 客户状态
                var data = $scope.isLockeds;
                selectFactory({
                    data: data,
                    id: 'state',
                    defaultText: '',
                    attrTextModel: function (name, data) {
                        var stateData;
                        if (!name) {
                            stateData = {};
                        } else {
                            stateData = getSigleDataByName(name, data);
                        }
                        $scope.stateName = name;
                        $scope.stateId = stateData.id;

                        $scope.tableModel.restData.isLocked = $scope.stateId;
                        $scope.loadListData();
                        $scope.$apply();
                    },
                });

                // 价格套餐
                var combosData = customerService.getCombos();
                var map = [{ id: '', name: Lang.getValByKey('customer', 'common_select_tips') }];
                angular.forEach(combosData.data, function (value, key) {
                    map.push({
                        code: value.code,
                        preName:value.name,
                        name: value.name + '(' + value.code + ')',
                    });
                });
                combosData.data = map;
                selectFactory({
                    data: combosData,
                    id: 'combos',
                    defaultText: '',
                    defaultCount:100,
                    isCreateNewSelect:true,
                    isSearch: true,
                    attrTextModel: function (name, data) {
                        var comboData;
                        if (!name) {
                            comboData = {};
                        } else {
                            comboData = getSigleDataByName(name, data);
                        }
                        $scope.combosName = name;
                        $scope.combosId = comboData.code;
                        $scope.tableModel.restData.refCombos = $scope.combosId;
                        $scope.loadListData();
                        $scope.$apply();
                    },
                });

                // 客户等级
                var levalData = $scope.levals;
                selectFactory({
                    data: levalData,
                    id: 'evaluateLeval',
                    defaultText: '',
                    attrTextModel: function (name, data) {
                        var levalsData;
                        if (!name) {
                            levalsData = {};
                        } else {
                            levalsData = getSigleDataByName(name, data);
                        }
                        $scope.evaluateLevalName = name;
                        $scope.evaluateLevalId = levalsData.id;

                        $scope.tableModel.restData.evaluateLeval = $scope.evaluateLevalId;
                        $scope.loadListData();
                        $scope.$apply();
                    },
                });

                //审核状态

                selectFactory({
                    data: $scope.auditState,
                    id: 'auditState',
                    defaultText: '',
                    attrTextModel: function (name, data) {
                        var auditStateData;
                        if (!name) {
                            auditStateData = {};
                        } else {
                            auditStateData = getSigleDataByName(name, data);
                        }
                        $scope.auditStateName = name;
                        $scope.authStatus = auditStateData.id;

                        $scope.tableModel.restData.authStatus = $scope.authStatus;
                        $scope.loadListData();
                        $scope.$apply();
                    },
                });
            };
            function inferSelected() {
                var param = [];
                var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                if (!oldData.length) {
                    accountView.promptBox({ isDelay: true, contentDelay: Lang.getValByKey('customer', 'customer_prompt_delay_tip'), type: 'errer', manualClose: true });
                    return false;
                }
                // 组织数据
                angular.forEach(oldData, function (val) {
                    param.push(val.id);
                });
                return param;
            }
            function PostDataToServer(postMethod) {
                if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                    var param = inferSelected();
                    if (!param) {
                        return false;
                    }
                    postMethod(param, function (data) {
                        if (data.errorCode === 0) {
                            $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                            $(document).promptBox('closePrompt');
                            // 更新table表数据
                            $scope.loadListData();
                            $scope.$apply();
                        } else {
                            $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                        }
                    });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('customer', 'customer_prompt_delay_tip'), type: 'errer', manualClose: true });
                }
            }
            $scope.resetStyle = function (val) {
                $('.from-box .verification .errors').css('padding-left', val + 'px');
            };

            /** 检索客户等级以上 */
            $scope.checkEvaluateLeval = function () {
                $scope.seniorChecked = !$scope.seniorChecked;
                if ($scope.seniorChecked == true) {
                    $scope.tableModel.restData.beyondLeval = true;
                    $scope.tableModel.restData.evaluateLeval = $scope.evaluateLevalId;
                } else {
                    $scope.tableModel.restData.beyondLeval = false;
                    $scope.tableModel.restData.evaluateLeval = $scope.evaluateLevalId;
                    $scope.rankName = 1;
                    $scope.rankId = 1;
                }
                $scope.loadListData();
            };

            /** 检索客户列表 */
            $scope.retrievalCustomerList = function () {
                $scope.q = $scope.tableModel.restData.q;
                $scope.tableModel.restData.pageIndex = 1;
                $scope.loadListData();
            };

            /** 返回列表 */
            $scope.goBackCustomer = function () {
                if (!$scope.isEdit) {
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey('common', 'common_back_confirm'),
                        },
                        cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                        operation: [
                            {
                                type: 'submit',
                                application: 'delete',
                                description: Lang.getValByKey('common', 'common_back_yes'),
                                operationEvent: function () {
                                    if ($scope.zjID) {
                                        top.history.go(-2);
                                    } else {
                                        $scope.main = false;
                                        $('.tip-box').remove();
                                        $scope.loadListData();
                                    }
                                    $scope.$apply();
                                    $(document).promptBox('closePrompt');
                                },
                            },
                        ],
                    });
                } else {
                    if ($scope.zjID) {
                        top.history.go(-2);
                    } else {
                        $scope.main = false;
                        $('.tip-box').remove();
                        $scope.loadListData();
                    }
                }

                customerView.unlockBtn() //提交审核按钮enable

            };

            /** 添加客户 */
            $scope.addCustomer = function () {
                $scope.isAdd = true;
                $scope.isEdit = false;
                $scope.isCanEdit = true;
                $scope.tab.exdisable(0);
                $scope.main = true;
                $scope.shipBooking = false;
                setTimeout(function () {
                    $('.tab-content').scrollTop(0);
                    $(".from-box").css("top","116px");
                }, 100);
                $scope.auidtMessage = '';
                initUserInfo();
            };

            /* 锁定客户*/
            $scope.lockCustomer = function () {
                PostDataToServer(customerService.lockCustomer);
            };

            /* 解锁客户*/
            $scope.unLockCustomer = function () {
                PostDataToServer(customerService.unlockCustomer);
            };

            /* 批量删除客户*/
            $scope.deleteCustomer = function () {
                if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                    var param = inferSelected();
                    if (!param) {
                        return false;
                    }
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey('customer', 'customer_prompt_delete_tip'),
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_delete'),
                                application: 'delete',
                                operationEvent: function () {

                                    PostDataToServer(customerService.deleteCustomer);
                                },
                            },
                        ],
                    });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('customer', 'customer_prompt_delay_tip'), type: 'errer', manualClose: true });
                }
            };

            //审核单个客户
            $scope.auditCustomer = function () {
                var param = [];
                param.push($scope.customerId)

                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: "确认该客户信息无误并提交审核？",
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_prompt_confirm'),
                            application: 'warning',
                            operationEvent: function () {
                                var params={
                                    urlParams:param
                                }
                                customerService.auditCustomers(params,function (res) {
                                    if (res.errorCode === 0) {
                                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success', time: 3000 });
                                        $(document).promptBox('closePrompt');
                                        // 更新table表数据
                                        $scope.loadListData();

                                        // 成功后设置为灰色
                                        $scope.auidtMessage = '';
                                        $scope.$apply();
                                        $(".from-box").css("top","116px");
                                        customerView.disableBtn("singleCustomerAudit");
                                    } else {
                                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                                    }
                                })
                            },
                        },
                    ],
                });
            }
            /* 批量审核客户*/
            $scope.auditCustomers = function () {
                if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {

                    var param = [];
                    var selectData = tableService.getSelectTable($scope.tableModel.tableBody);
                    if (!selectData.length) {
                        accountView.promptBox({ isDelay: true, contentDelay: Lang.getValByKey('customer', 'customer_prompt_delay_tip'), type: 'errer', manualClose: true });
                        return false;
                    }
                    // 组织数据
                    angular.forEach(selectData, function (val) {
                        param.push(val.id);
                    });

                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'success',
                        content: {
                            tip: "确认提交已选客户？",
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_prompt_confirm'),
                                application: 'warning',
                                operationEvent: function () {
                                    var params={
                                        urlParams:param
                                    }
                                    customerService.auditCustomers(params,function (res) {
                                        if (res.errorCode === 0) {
                                            $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success', time: 3000 });
                                            $(document).promptBox('closePrompt');
                                            // 更新table表数据
                                            $scope.loadListData();
                                            $scope.$apply();
                                        } else {
                                            $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                                        }
                                    })
                                },
                            },
                        ],
                    });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('customer', 'customer_prompt_delay_tip'), type: 'errer', manualClose: true });
                }
            };
            $scope.resetTabScroll = function () {
                setTimeout(function () {
                    $('.tab-content').scrollTop(0);
                }, 100);
            };

            /* 编辑客户信息*/
            $scope.editServiceDetail = function (value) {
                $scope.isEdit = true;
                $scope.main = true;
                $scope.resetTabScroll();
                $scope.tab.selected(0);
                initUserInfo(value);
                // $scope.getProductVisiblity(value.id);
            };
            //判断是否需要设置用户详情页面的提交审核按钮
            $scope.setSingleCustomerAuditBtn = function () {
                if($scope.customerId){

                    var param = {
                        'seatParams':{
                            id:$scope.customerId
                        }
                    }
                    // 发消息判断
                    customerService.getCustomerAuditStatus(param,function (res) {
                        if(res.errorCode == 0){
                            if(res.data != 1){ //不是待提交状态，则设置为灰色
                                customerView.disableBtn("singleCustomerAudit")
                            }else{
                                customerView.enableBtn("singleCustomerAudit")
                            }
                        }
                    })

                }else{ // 新增
                    customerView.disableBtn("singleCustomerAudit")
                }

            }
            function initUserInfo(value) {
                if (value) {
                    $scope.customerId = value.id;
                }
                $scope.setSingleCustomerAuditBtn();

                userInfoCtrl.init($scope, customerService, value);
            }
            $scope.swichEvent = function (index) {
                $scope.resetTabScroll();
                switch (index) {
                    case 0: {
                        $('#userInfo').css({ display: 'none' });
                        userInfoCtrl.init($scope, customerService, {
                            id: $scope.customerId,
                        });
                        break;
                    }
                    case 1: {
                        $scope.$broadcast('companyEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 2: {
                        $scope.$broadcast('accountEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 3: {
                        $scope.$broadcast('bizContacterEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 4: {
                        $scope.$broadcast('clientContacterEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    case 5: {
                        $scope.$broadcast('messageNotifyEvent', {});
                        break;
                    }
                    case 6: {
                        $scope.$broadcast('productSettingEvent', {}); // 向子类发出重置数据事件
                        break;
                    }
                    default: {
                        break;
                    }
                }
            };

            /** tab切换组件 */
            $scope.tab = customerView.tab('#m-tab', $scope.swichEvent);

            /*从财务管理-客户余额跳转*/
            if($scope.paramter.id){
                $scope.main = true;
                $('#userInfo').css({ display: 'none' });
                setTimeout(function(){
                    $scope.editServiceDetail({
                        id: $scope.paramter.id
                    });
                },0)
            }

            var id = easySpa.queryUrlValByKey('id');
            $scope.zjID = id;
            if (id) {
                setTimeout(function () {
                    $scope.editServiceDetail({
                        id: id,
                    });
                }, 1);
            }
            $scope.$watch('tableModel.tableBody', function (newVal, oldVal) {
                for (var j in newVal) {
                    for (var i in $scope.levals.data) {
                        if (newVal[j].evaluateLeval == $scope.levals.data[i].id) {
                            newVal[j].evaluateLevalName = $scope.levals.data[i].name;
                        }
                    }
                }
                customerView.bindEvent()
            });

        }
    ]);
});


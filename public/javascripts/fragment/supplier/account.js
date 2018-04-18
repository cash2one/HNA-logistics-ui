app.controller("accountCtrl", ["$scope", "supplierService", "tableService", function($scope, supplierService, tableService) {
    $scope.$on("accountEvent", function() {//接受初始化
        $scope.init();
        $scope.$apply();
    });
    function setScroll() {
        $(".table-container tbody").slimScroll({
            height: $('.content-main').height() - 250
        });
    }
    function loadCustomerChildAccountData() {
        var params = {
            'urlParams': $scope.tableAccountModel.restData
        };
        tableService.getTable($scope.tableAccountModel.restURL, params, function(data) {
            $scope.q = $scope.tableAccountModel.restData.q;
            if(data.errorCode === 0) {
                $scope.tableAccountModel = tableService.table($scope.tableAccountModel, params, data);
                setTimeout(function() {
                    setScroll();
                    $(window).on("resize", setScroll);
                    $(".table-box").focus();
                    resizeTable();
                    $scope.$apply();
                }, 100);
            }
        });
    }
    $scope.initTable = function() {
        $scope.tableAccount = [];
        $scope.tableAccountModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("supplier", 'supplier_user_name'),
                Lang.getValByKey("supplier", 'supplier_name'),
                Lang.getValByKey("supplier", 'supplier_email'),
                Lang.getValByKey("supplier", 'supplier_tel'),
                Lang.getValByKey("supplier", 'supplier_type'),
            ],
            tableHeaderSize: [
                '5%',
                '22%',
                '24%',
                '22%',
                '12%',
                '10%'
            ],
            tableBody: [],
            restURL: "logistics.searchSupplierChildAccount",
            restData: {
                refSupplier: $scope.supplierId,
                isAsc: false,
                pageIndex: 1,
                pageSize: 10,
                sortName: "isSystem"
            },
            selectNumber: 0,
            selectFlag: false
        };
        loadCustomerChildAccountData();
    }
    $scope.closePrompt = function() {
        $scope.nestAccountFrom = false;
    };
    function inferSelected() {
        var param = [];
        var oldData = tableService.getSelectTable($scope.tableAccountModel.tableBody);
        if(!oldData.length) {
            accountView.promptBox({isDelay:true, contentDelay:Lang.getValByKey("supplier", "supplier_prompt_delay_tip"), type: 'errer', manualClose:true});
            return false;
        }
        //组织数据
        angular.forEach(oldData, function(val) {
            param.push(val.id);
        });
        return param;
    }
    function PostDataToServer(postMethod) {
        if($scope.tableAccountModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
            var param = inferSelected();
            if(!param) {
                return false;
            }
            postMethod(param, function(res) {
                if(res.errorCode === 0) {
                    $(document).promptBox({isDelay:true, contentDelay:res.msg, type:'success', time:3000});
                    $(document).promptBox('closePrompt');
                    //更新table表数据
                    loadCustomerChildAccountData();
                    $scope.$apply();
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:res.msg, type:'errer', manualClose:true});
                }
            });
        }else{
            $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("supplier", 'supplier_prompt_delay_tip'), type: 'errer', manualClose:true});
        };
    }
    function showConfirmLayer(confirmTips, interface, operatorByAttr, type) {
        if($scope.tableAccountModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
            var param = [];
            var oldData = tableService.getSelectTable($scope.tableAccountModel.tableBody);
            if(!oldData.length) {
                accountView.promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", "common_table_delTips"), type: 'errer', manualClose:true});
                return false;
            }
            //组织数据
            angular.forEach(oldData, function(val) {
                param.push(val[operatorByAttr]);//id
            });
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("supplier", confirmTips)
                },
                operation: [
                    {
                        type: 'submit',
                        description: type == 'confirm' ? Lang.getValByKey("common", 'common_pagination_confirm') : Lang.getValByKey("common", 'common_page_delete'),
                        application : type=='confirm' ? 'confirm' : 'delete',
                        operationEvent: function() {
                            $(document).promptBox('closePrompt');
                            PostDataToServer(interface);
                        }
                    }
                ]
            });
        }else{
            $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_table_delTips'), type: 'errer', manualClose:true});
        };
    }
    function bindEvent() {
        /** 关闭国家弹框 */
        $scope.closePrompt = function() {
            $scope.nestAccountFrom = false;
        };
        $scope.addAccount = function() {
            $scope.isEdit = false;
            $scope.isCreateNewRate = true;
            $scope.nestAccountFrom = true;
            $scope.promptTitle = Lang.getValByKey("supplier", "supplier_create_title");
            $scope.username = "";
            $scope.name = "";
            $scope.accountEmail = "";
            $scope.oldEmail = "";
            $scope.tel = "";
            $scope.telOld = "";
            $scope.isSystem = "";
            $scope.accountType = '';
            $("#nest-accountFrom").css("display", "table");
            //清除angular表单脏值检测
            $scope.AccountFrom.$setPristine();
            $scope.AccountFrom.$setUntouched();

            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        $scope.checkUserExsist = function() {
            if(!$scope.username) {
                $("#account-user .errors").addClass("ng-hide");
                $("#account-user .errors").html("");
                return;
            }
            var config = {
                userName: $scope.username
            }
            supplierService.checkSupplierUserExsist(config, function(res) {
                if(res.errorCode != 0) {
                    $("#account-user .errors").removeClass("ng-hide");
                    $("#account-user .errors").html(Lang.getValByKey("supplier", "supplier_user_exsist"));
                    $(".check-user-exist").css("borderColor","#FA787E");
                } else {
                    $("#account-user .errors").addClass("ng-hide");
                    $(".check-user-exist").removeAttr("style");
                    $("#account-user .errors").html("");
                }
            });
        }
        $scope.checkPhoneExist = function () {
            if(!$scope.tel || $scope.tel == $scope.telOld){
                return;
            }
            var config = {
                'seatParams':{
                    mobilePhone: $scope.tel,
                    userId: !$scope.isEdit ? '' : $scope.id
                }
            };
            supplierService.checkSupplierUserPhoneExist(config, function (res) {
                if(res.errorCode != 0){
                    $scope.AccountFrom.tel.errorTips = Lang.getValByKey("supplier", "supplier_phone_exsist");
                    $scope.AccountFrom.tel.$error.defined = true;
                    $scope.AccountFrom.tel.$dirty = true;
                }else {
                    $scope.AccountFrom.tel.errorTips = "";
                }
            });
        };
        $scope.checkAccountEmail = function() {
            if(!$scope.accountEmail || $scope.oldEmail == $scope.accountEmail) {
                $("#account-email .errors").addClass("ng-hide");
                $("#account-email .errors").html("");
                return;
            }
            var config = {
                email: $scope.accountEmail,
                userId: !$scope.isEdit ? '' : $scope.id
            }
            supplierService.checkSupplierAccountEmail(config, function(res) {
                if(res.errorCode != 0) {
                    $("#account-email .errors").removeClass("ng-hide");
                    $("#account-email .errors").html(Lang.getValByKey("supplier", "supplier_email_exsist"));
                } else {
                    $("#account-email .errors").addClass("ng-hide");
                    $("#account-email .errors").html("");
                }
            });
        }
        $scope.clearEmailError = function () {
            $("#account-email .errors").addClass("ng-hide");
            $("#account-email .errors").html("");
        }
        // 收起更多
        $scope.hideMore = function(){
            $scope.tableAccountModel.more = false;
        };
        $scope.showMore = function(){
            $scope.tableAccountModel.more = true;
        };
        $scope.editChildAccount = function(val) {
            $scope.isEdit = true;
            $("#nest-accountFrom").css("display", "table");
            $scope.isCreateNewRate = false;
            $scope.promptTitle = Lang.getValByKey("supplier", "supplier_detail_title");
            $scope.nestAccountFrom = true;
            $scope.username = val.userName;
            $scope.name = val.fullName;
            $scope.accountEmail = val.email;
            $scope.oldEmail = val.email;
            $scope.tel = val.mobilePhone;
            $scope.telOld = val.mobilePhone;
            $scope.id = val.id;
            $scope.isSystem = val.isSystem;

            //清除angular表单脏值检测
            $scope.AccountFrom.$setPristine();
            $scope.AccountFrom.$setUntouched();
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        $scope.deleteAccount = function() {
            showConfirmLayer("supplier_prompt_delete_tip", supplierService.deleteSupplierChildAccount, "id", "delete");
        }
        $scope.lockAccount = function() {
            showConfirmLayer("supplier_prompt_lock_tip", supplierService.lockSupplierChildAccount, "id", "confirm");
        }
        $scope.unlockAccount = function() {
            showConfirmLayer("supplier_prompt_unlock_tip", supplierService.unlockSupplierChildAccount, "id", "confirm");
        }
        $scope.resetPassword = function() {
            showConfirmLayer("supplier_prompt_reset_tip", supplierService.resetSupplierChildPassword, "id", "confirm");
        }
        $scope.savePrompt = function() {
            var flag = false;
            if(!$scope.username){
                $scope.AccountFrom.username.$setDirty();
                flag = true;
            }
            if(!$scope.name){
                $scope.AccountFrom.name.$setDirty();
                flag = true;
            }else if(!(/^([A-Za-z\s\u4E00-\u9FA5]+)+$/.test($scope.name))){
                $("input[name='name']").addClass('ng-dirty');
                $scope.AccountFrom.name.errorTips = Lang.getValByKey("supplier", "supplier_validate_name");
                $scope.AccountFrom.name.$error.defined = true;
                $scope.AccountFrom.name.$dirty = true;
                flag = true;
            }
            if(!$scope.accountEmail){
                $scope.AccountFrom.accountEmail.$setDirty();
                flag = true;
            }
            if(!$scope.tel){
                $scope.AccountFrom.tel.$setDirty();
                flag = true;
            }else if(!(/^1[356789]\d{9}$/.test($scope.tel))){
                $("input[name='tel']").addClass('ng-dirty');
                $scope.AccountFrom.tel.errorTips = Lang.getValByKey("supplier", "supplier_validate_phone");
                $scope.AccountFrom.tel.$error.defined = true;
                $scope.AccountFrom.tel.$dirty = true;
                flag = true;
            }
            if(flag){ return; }

            var errorEles = $(".errors");
            for(var index = 0; index < errorEles.length; index++) {
                if(!$(errorEles[index]).hasClass("ng-hide")) {
                    return;
                }
            }
            if(!$scope.isEdit) {//增加客户
                supplierService.addSupplierChildAccount({
                    "userName": $scope.username,
                    "email": $scope.accountEmail,
                    "fullName": $scope.name,
                    "mobilePhone": $scope.tel,
                    "refSupplier": $scope.supplierId,
                }, function(data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        loadCustomerChildAccountData();
                    }
                });
            } else {//编辑客户
                supplierService.updateSupplierChildAccount({
                    "userName": $scope.username,
                    "email": $scope.accountEmail,
                    "fullName": $scope.name,
                    "mobilePhone": $scope.tel,
                    "id": $scope.id,
                    "isSystem": $scope.isSystem,
                    "refSupplier": $scope.supplierId
                }, function(data) {
                    if(data.errorCode != 0) {//服务器异常
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        loadCustomerChildAccountData();
                    }
                });
            }
        }
    }

    $scope.init = function() {
        $scope.initTable();
        bindEvent();
    }
}]);

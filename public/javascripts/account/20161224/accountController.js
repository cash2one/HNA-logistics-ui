easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js'
], function() {
    app.controller('accountCtrl', ['$scope', 'accountService', 'accountView', 'tableService', function($scope, accountService, accountView, tableService) {
        $scope.account = {
            'id': 0    //结算方式编辑Id保存
        };

        $scope.tableAccount = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("account", 'account_page_accountType'),
                Lang.getValByKey("account", 'account_page_code'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getAccountTable',
            'restData': {
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': 'code'
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        /**
         * 获取语言库
         */
        $scope.getLanguage = function(){
            accountService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        /**
         * 获取结算方式表
         */
        $scope.getAccountTable = function(isSearch){
            if(isSearch){
                $scope.tableAccount.restData.pageIndex = 1;
            }

            $scope.q = $scope.tableAccount.restData.q;

            var params = {
                'urlParams': $scope.tableAccount.restData
            };

            tableService.getTable($scope.tableAccount.restURL, params, function(data){
                if(data.errorCode === 0){
                    $scope.tableAccount = tableService.table($scope.tableAccount, params, data);

                    var height = accountView.height('acTable');
                    setTimeout(function() {
                        accountView.slimscroll('.table-container tbody', height);
                        $(window).resize(function(){
                            height = accountView.height('acTable');
                            accountView.slimscroll('.table-container tbody', height);
                        });
                    }, 10);
                }
            });
        };
        $scope.getAccountTable();


        /**
         * 删除结算方式
         */
        $scope.delAccount = function(){
            var param = [];

            var oldData = tableService.getSelectTable($scope.tableAccount.tableBody);

            if(!oldData.length){
                accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
                return false;
            }

            //组织数据
            angular.forEach(oldData, function(val){
                param.push(val.id);
            });

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("account", 'account_code_accountConfirm')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application:'delete',
                        operationEvent: function () {
                            accountService.delAccount(param, function(data){
                                if(data.errorCode === 0){
                                    accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                    accountView.promptBox('closePrompt');

                                    //更新table表数据
                                    $scope.$apply($scope.getAccountTable());
                                }else{
                                    accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                                }
                            });
                        }
                    }
                ]
            };
            accountView.promptBox(opt);
        };


        /*============================以下为点击添加结算方式代码============================*/
        var bar = $('#nest-AccountFrom .label-text');
        accountView.propmtCostEvent(bar);

        /**
         * 添加费用子类型
         */
        $scope.addAccount = function(){
            //清除angular表单脏值检测
            $scope.AccountForm.$setPristine();
            $scope.AccountForm.$setUntouched();

            $scope.nestAccountForm = true;

            $('#nest-AccountFrom').attr('style','').find('.title').text(Lang.getValByKey("account", 'account_page_addAccount'));

            $scope.accountName = '';
            $scope.accountCode = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;

            $('#globalization').find('.input-text').each(function(){
                $(this).val('');
                $(this).next('.verification').children('span').html('');
            });

            //弹框里的菜单显示隐藏公共事件
            accountView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        /** 关闭费用类型弹框 */
        $scope.cancelAccount = function(){
            $scope.nestAccountForm = false;
            $scope.account.id ? $scope.account.id = 0 : '';    //修改标志位重置

            $("#code-msg").removeClass('remote-invalid');
        };


        /**
         * 新增结算方式
         */
        $scope.saveAccount = function(){
            if(!$scope.accountName){
                $scope.AccountForm.accountName.$setDirty();
            }
            if(!$scope.accountCode){
                $scope.AccountForm.accountCode.$setDirty();
            }

            if($("#code-msg").hasClass('remote-invalid')
                || !$scope.AccountForm.$valid){
                accountView.displayErrorBox(bar);
                return;
            }


            var i18n = [];
            $('#globalization').children('li').each(function(){
                var localName = $.trim($(this).children('input').val());
                if(localName){
                    var map = {};

                    map.language = $(this).children('input').attr('data-code');
                    map.localName = $.trim($(this).children('input').val());

                    i18n.push(map);
                }
            });

            var config = {
                urlParams : {
                    name: $scope.accountName,
                    code: $scope.accountCode,
                    description: $scope.remark,
                    i18n: i18n
                }
            };

            if($scope.account.id) {    //修改
                config.seatParams = {'id': $scope.account.id};

                accountService.saveEditAccount(config, function(data){
                    if(data && data.errorCode === 0){
                        accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        $scope.nestAccountForm = false;

                        //更新table表数据
                        $scope.getAccountTable();

                        //编辑完成重置状态位
                        $scope.account.id ? $scope.account.id = 0 : '';
                    }else{
                        accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{    //新增
                accountService.saveAccount(config, function(data){
                    if(data && data.errorCode === 0){
                        accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        $scope.nestAccountForm = false;

                        //更新table表数据
                        $scope.getAccountTable();
                    }else{
                        accountView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        /**
         * 校验结算方式编码
         */
        $scope.checkCode = function(){
            var config = {
                'urlParams':{
                    'code': $scope.accountCode,
                    'sid': $scope.account.id
                }
            };
            if($scope.accountCode){
                accountService.checkCode(config, function(data){
                    if(data.errorCode != 0){    //编码重复
                        $scope.AccountForm.accountCode.errorTips = data.msg;
                        $("#code-msg").removeClass("ng-hide").addClass('remote-invalid');
                    }else{    //编码不重复
                        $("#code-msg").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.AccountForm.accountCode.errorTips = "";
                    }
                });
            }
        };

        /*=================================修改结算方式=============================*/
        $scope.editAccount = function(id){
            $scope.account.id = id;
            $scope.AccountForm.accountCode.errorTips = '';

            $('#nest-AccountFrom').attr('style','').find('.title').text(Lang.getValByKey("account", 'account_page_accountDetail'));

            $scope.nestAccountForm = true;
            accountView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');

            accountService.getAccountDetail(id, function(data){
                if(data && data.errorCode === 0){
                    $scope.accountName = data.data.name;
                    $scope.accountCode = data.data.code;
                    $scope.remark = data.data.description;

                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);
                    i18nEdit(data.data.i18n);
                }
            });
        };

        /**
         * 国际化
         */
        $scope.international = function() {
            window.location.href = '#/international?q=account';
        };

        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        function i18nEdit(i18n){
            var length = i18n ? i18n.length : 0;

            $('#globalization').children('li').each(function(){
                $(this).children('input').next('.verification').children('span').html('');
                var code = $(this).children('input').val('').attr('data-code');

                for(var i=0; i<length; i++){
                    if((i18n[i].language).toLowerCase() == code.toLowerCase()){
                        $(this).children('input').val(i18n[i].localName);
                    }
                }
            });
        }
    }]);
});
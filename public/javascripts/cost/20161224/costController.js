easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'public/common/tableController.js'
],function(){
    app.controller('costCtrl', ['$scope', 'costService', 'costView', 'tableService', function($scope, costService, costView, tableService){
        $scope.cost = {
            'type': '',    //大类选择
            'id': 0,    //费用类型编辑ID保存
            'bigType': []
        };

        $scope.tableCost = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("cost", 'cost_page_costname'),
                Lang.getValByKey("common", 'common_code_code'),
                Lang.getValByKey("common", 'common_thead_type'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getCostTable',
            'restData': {
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'type': '',
                'sort': 'code'
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        /**
         * 获取语言库
         */
        $scope.getLanguage = function(){
            costService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        /**
         *
         */
        $scope.init = function(){
            var data = costService.getBigType();
            selectFactory({
                data: data,
                defaultText: '',
                id: "type-select-input",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    $scope.costTypeValue = code;
                },
                attrTextModel: function(name){
                    $scope.costTypeName = name;
                    $scope.$apply();
                }
            });
        };

        /**
         * 获取大类对应的费用表格
         * @param type    大类type
         */
        $scope.getCostTable = function($index, type, isSearch){

            if(($index == undefined && type == undefined) || isSearch){    //搜索
                $scope.q = $scope.tableCost.restData.q;
                $scope.cost.type = $scope.tableCost.restData.type;

                if(isSearch){
                    $scope.tableCost.restData.pageIndex = 1;
                }
            }else{    //点击左侧大类
                $scope.tableCost.restData.pageIndex = 1;

                costView.active($index);
                $scope.q = $scope.tableCost.restData.q = '';

                if(type == undefined){    //全部大类
                    $scope.cost.type = $scope.tableCost.restData.type = '';
                }else{
                    $scope.cost.type = $scope.tableCost.restData.type = type;
                }
            }

            var params = {
                'urlParams': $scope.tableCost.restData
            };

            tableService.getTable($scope.tableCost.restURL, params, function(data){
                if(data.errorCode === 0){
                    $scope.tableCost = tableService.table($scope.tableCost, params, data);

                    var height = costView.height('table');
                    setTimeout(function() {
                        costView.slimscroll('.table-container tbody', height);
                        $(window).resize(function(){
                            height = costView.height('table');
                            costView.slimscroll('.table-container tbody', height);
                        });
                    }, 10);
                }
            });
        };

        /**
         * 费用类型左侧大类
         */
        $scope.getBigType = function(){
            costService.getBigType(function(data){
                if(data.errorCode === 0){
                    $scope.cost.bigType = data.data;

                    //重刷表格
                    $scope.getCostTable(0);

                    var height = costView.height('bigType');
                    setTimeout(function() {
                        costView.slimscroll('#cost-block', height);
                        $(window).resize(function(){
                            height = costView.height('bigType');
                            costView.slimscroll('#cost-block', height);
                        });
                    }, 10);
                }
            });
        };
        $scope.getBigType();

        /**
         * 删除费用子类型
         */
        $scope.delCost = function(){
            var param = [];

            var oldData = tableService.getSelectTable($scope.tableCost.tableBody);

            if(!oldData.length){
                costView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                    tip: Lang.getValByKey("cost", 'cost_code_delCostType')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application:'delete',
                        operationEvent: function () {
                            costService.delCost(param, function(data){
                                if(data.errorCode === 0){
                                    costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                    costView.promptBox('closePrompt');

                                    //更新table表数据
                                    $scope.$apply($scope.getCostTable());
                                }else{
                                    costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                                }
                            });
                        }
                    }
                ]
            };
            costView.promptBox(opt);
        };


        /*============================以下为点击添加费用类型代码============================*/
        var bar = $('#nest-CostFrom .label-text');
        costView.propmtCostEvent(bar);

        /**
         * 添加费用子类型
         */
        $scope.addCost = function(){
            //清除angular表单脏值检测
            $scope.CostFrom.$setPristine();
            $scope.CostFrom.$setUntouched();

            $('#nest-CostFrom').find('.title').text(Lang.getValByKey("cost", 'cost_page_newcost'));

            $scope.nestCostFrom = true;
            $("#nest-CostFrom").attr('style','');

            $scope.costName = '';
            $scope.costCode = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;

            if($scope.cost.type){
                $scope.costTypeName = typeNameById($scope.cost.type);
                $scope.costTypeValue = $scope.cost.type;
            }else{
                $scope.costTypeName = '';
                $scope.costTypeValue = '';
            }

            $('#globalization').find('.input-text').each(function(){
                $(this).val('');
                $(this).next('.verification').children('span').html('');
            });

            //弹框里的菜单显示隐藏公共事件
            costView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        /** 关闭费用类型弹框 */
        $scope.cancelCost = function(){
            $scope.nestCostFrom = false;
            $scope.cost.id ? $scope.cost.id = 0 : '';    //修改标志位重置

            $("#code-msg").removeClass('remote-invalid');
        };

        /**
         * 新增费用类型
         */
        $scope.saveCost = function(){
            if(!$scope.costName){
                $scope.CostFrom.costName.$setDirty();
            }
            if(!$scope.costCode){
                $scope.CostFrom.costCode.$setDirty();
            }
            if(!$scope.costTypeName){
                $scope.CostFrom.costTypeName.$setDirty();
            }

            if($("#code-msg").hasClass('remote-invalid')
                || !$scope.CostFrom.$valid){
                costView.displayErrorBox(bar);
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
                    'name': $scope.costName,
                    'code': $scope.costCode,
                    'type': $scope.costTypeValue,
                    'description': $scope.remark,
                    'i18n': i18n
                }
            };

            if($scope.cost.id){    //修改
                config.seatParams = {'id': $scope.cost.id};

                costService.saveEditCost(config, function(data){
                    if(data.errorCode === 0){
                        costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        $scope.nestCostFrom = false;

                        //更新table表数据
                        $scope.getCostTable();

                        //编辑完成重置状态位
                        $scope.cost.id ? $scope.cost.id = 0 : '';
                    }else{
                        costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{    //新增
                costService.saveCost(config, function(data){

                    if(data.errorCode === 0){
                        costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        $scope.nestCostFrom = false;

                        //更新table表数据
                        $scope.getCostTable();
                    }else{
                        costView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        /**
         * 编码校验
         */
        $scope.checkCode = function(){
            var config = {
                'urlParams':{
                    'code': $scope.costCode,
                    'sid': $scope.cost.id
                }
            };
            if($scope.costCode){
                costService.checkCode(config, function(data){

                    if(data.errorCode != 0){    //编码重复
                        $scope.CostFrom.costCode.errorTips = data.msg;
                        $("#code-msg").removeClass("ng-hide").addClass('remote-invalid');
                    }else{    //编码不重复
                        $("#code-msg").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.CostFrom.costCode.errorTips = "";
                    }
                });
            }
        };


        /* ==============================修改费用类型=============================*/
        $scope.editCost = function(id){
            $scope.cost.id = id;
            $scope.CostFrom.costCode.errorTips = '';

            $('#nest-CostFrom').find('.title').text(Lang.getValByKey("cost", 'cost_code_costDetail'));

            $scope.nestCostFrom = true;
            $("#nest-CostFrom").attr('style','');
            costView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');

            costService.getCostDetail(id, function(data){
                if(data && data.errorCode === 0){
                    $scope.costName = data.data.name;
                    $scope.costCode = data.data.code;
                    $scope.costTypeName = typeNameById(data.data.type);
                    $scope.costTypeValue = data.data.type;

                    i18nEdit(data.data.i18n);

                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);
                }
            });
        };

        /**
         * 国际化
         */
        $scope.international = function() {
            window.location.href = '#/international?q=cost';
        };

        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        /**
         * 通过费用类型type 获取费用类型名称
         * @param type    费用类型Id
         * @returns {string}    费用类型名称
         */
        function typeNameById(type){
            var ret = '';
            angular.forEach($scope.cost.bigType, function(val){
                if(val.code == type){
                    ret = val.name;
                }
            });
            return ret;
        }

        /**
         * 点击费用类型详情显示i18n国际化处理
         * @param i18n    i18n:[]
         */
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

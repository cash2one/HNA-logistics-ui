app.controller("ruleCtrl", ["$scope", "orderNumberService",'orderNumberView', "tableService", function($scope, orderNumberService,orderNumberView, tableService) {
    var tablehearder,tableHeaderSize,restURL;
    $scope.ruleInfo = {id: ''};
    $scope.ruleUseInfoId = 1;

    var bar = $('#nest-ruleInfoFrom .label-text');
    airportFromBar();
    function airportFromBar() {
        barClick(bar);
    }

    if($scope.module==="channelNumber"){
        tablehearder = [
            Lang.getValByKey('common', 'common_thead_number'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_serviceName'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_supplier'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_rule'),
            Lang.getValByKey('orderNumber', 'orderNumber_add_createWay'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_status')
        ];
        tableHeaderSize =['10%','19%','16%','26%','12%','12%'];
        restURL = 'logistics.getChannelNumberRule'
    }else{
        tablehearder = [
            Lang.getValByKey('common', 'common_thead_number'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_productTeam'),
            Lang.getValByKey('orderNumber', 'orderNumber_add_product'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_rule'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_create'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_status')
        ];
        tableHeaderSize =['10%','19%','18%','26%','12%','10%'];
        restURL = 'logistics.getWaybillNumberRule'
    }

    $scope.tableModel = {
        'tableHeader': tablehearder,
        'tableHeaderSize': tableHeaderSize,
        'tableBody': [],
        'restURL': restURL,
        'restData': {
            'q': '',
            'serviceUid': '',
            'supplierId': '',
            'productUid': '',
            'refParentGroupId': '',
            'productGroupId': '',
            'status': '1',
            'pageIndex': 1,
            'pageSize': 10,
            'sort': ''
        },
        'selectNumber': 0,
        'selectFlag': false
    };

    $scope.getTable = function(isSearch){
        $scope.tableModel.restData.serviceUid = $scope.ruleInfoServiceUid;
        $scope.tableModel.restData.supplierId = $scope.ruleInfoSupplierId;
        $scope.tableModel.restData.productUid = $scope.ruleInfoProductUid;
        $scope.tableModel.restData.refParentGroupId = $scope.ruleInfoProductTeamFirstId;
        $scope.tableModel.restData.productGroupId = $scope.ruleInfoProductTeamLeafId;
        if(isSearch){
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.status = $scope.ruleUseInfoId;
        }
        var config = {
            'urlParams': $scope.tableModel.restData
        };
        tableService.getTable($scope.tableModel.restURL, config, function(data){
            if(data.errorCode === 0){
                $scope.tableModel = tableService.table($scope.tableModel, config, data);
                var height = $('.order-table-rule').height() - 256;
                setTimeout(function() {
                    $('.table-container tbody').slimscroll({ height: height });
                    $(window).resize(function(){
                        height = $('.order-table-rule').height() - 256;
                        $('.table-container tbody').slimscroll({ height: height });
                    });
                }, 10);
            }
        });
    };
    $scope.getTable();

    //重置
    $scope.resetData = function() {
        $scope.tableModel.restData.ruleInfoServiceUid = "";
        $scope.tableModel.restData.supplierId ="";
        $scope.tableModel.restData.ruleInfoProduct ="";
        $scope.tableModel.restData.productUid = "";
        $scope.tableModel.restData.refParentGroupId = "";
        $scope.tableModel.restData.productGroupId = "";
        $scope.ruleInfoService = "";
        $scope.ruleInfoServiceUid = "";
        $scope.ruleInfoSupplier = "";
        $scope.ruleInfoSupplierId = "";
        $scope.ruleInfoProductTeamFirst = "";
        $scope.ruleInfoProductTeamFirstId = "";
        $scope.ruleInfoProductTeamLeaf = "";
        $scope.ruleInfoProductTeamLeafId = "";
        $scope.ruleInfoProduct = "";
        $scope.ruleInfoProductUid = "";
        $scope.searchProductTeamLeafRules = [];
        if(searchProductTeamRuleLeafEle){
            searchProductTeamRuleLeafEle.clearData();
        }
        $scope.tableModel.restData.status = "1";
        $scope.ruleUseInfoId = "1";
        $scope.ruleUseInfo = Lang.getValByKey("orderNumber", 'orderNumber_select_all');
        $scope.tableModel.restData.pageIndex = 1;
        $scope.getTable();
    };

    $scope.$watch('tableModel', function(newValue, oldValue) {
        if (newValue === oldValue) {return;}
        $scope.canStartUse = false;
        $scope.canEndUse = false;
        $scope.selectData = tableService.getSelectTable($scope.tableModel.tableBody);
        $scope.selectDataLen = $scope.selectData.length;
        angular.forEach($scope.selectData, function(value, key){
            if($scope.selectDataLen > 1){
                $scope.canEndUse = true;
                $scope.canStartUse = true;
            }
            if($scope.selectDataLen = 1){
                if($scope.selectData[0].status == 3){
                    $scope.canEndUse = true;
                }
                if($scope.selectData[0].status == 2){
                    $scope.canStartUse = true;
                }
            }
        });
    }, true);

    //规则启用
    $scope.ruleStartUse = function() {
        var config = {},tipContentData,
            tipContent = '<span class="tipContentData">'+Lang.getValByKey("orderNumber", 'orderNumber_number_example')+'</span>';

        var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
        if(!oldData.length){
            orderNumberView.promptBox({isDelay:true,type: 'errer',manualClose:true,
                contentDelay:Lang.getValByKey("common", 'common_code_noSelected')});
            return false;
        }
        angular.forEach(oldData, function(val){
            config = {'seatParams':{'id':val.id}};
        });

        orderNumberService.orderNumberSimulateUsed(config, function(data){
            if(data.errorCode === 0){
                angular.forEach(data.data, function(value){
                    tipContent += '<span class="tipContentData">['+value+']</span>';
                });
                tipContent += Lang.getValByKey("orderNumber", 'orderNumber_starUse_ruleTips');

                var opt = {
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: tipContent
                    },
                    operation: [{
                        type: 'submit',
                        description: Lang.getValByKey("orderNumber", 'orderNumber_button_startUse'),
                        application: '',
                        operationEvent: function () {
                            orderNumberService.orderNumberStarUsed(config, function(data){
                                orderNumberView.promptBox('closePrompt');
                                if(data.errorCode === 0){
                                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                    $scope.getTable();
                                    $scope.$apply();
                                }else{
                                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                                }
                            });
                        }
                    }]
                };
                orderNumberView.promptBox(opt);
                $scope.$apply();
            }else{
                return orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
            }
        });
    };

    //规则停用
    $scope.ruleEndUse = function() {
        var config = {};
        var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
        if(!oldData.length){
            orderNumberView.promptBox({isDelay:true,type: 'errer',manualClose:true,
                contentDelay:Lang.getValByKey("common", 'common_code_noSelected')});
            return false;
        }
        angular.forEach(oldData, function(val){
            config = {'seatParams':{'id':val.id}};
        });
        var opt = {
            title: Lang.getValByKey("common", 'common_prompt_title'),
            type: 'warning',
            content: {
                tip: Lang.getValByKey("orderNumber", 'orderNumber_endUse_ruleTips')
            },
            operation: [{
                type: 'submit',
                description: Lang.getValByKey("orderNumber", 'orderNumber_button_endUse'),
                application: '',
                operationEvent: function () {
                    orderNumberService.orderNumberEndUsed(config, function(data){
                        orderNumberView.promptBox('closePrompt');
                        if(data.errorCode === 0){
                            orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                            $scope.getTable();
                            $scope.$apply();
                        }else{
                            orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                        }
                    });
                }
            }]
        };
        orderNumberView.promptBox(opt);
    };

    function initInput(){
        if($scope.module==='channelNumber'){
            $scope.serviceRuleRequired = true;
            $scope.productTeamRuleRequired = false;
        }else{
            $scope.serviceRuleRequired = false;
            $scope.productTeamRuleRequired = true;
        }
        $scope.informWayTypeRadio = true;
        $scope.informWayNoteRadio = true;
        $scope.informWayMailRadio = true;
        $scope.createWayTypeRadio = true;
        $scope.createWayAutoRadio = true;
        $scope.createWayHandRadio = true;
        $scope.serviceRule = "";
        $scope.serviceRuleUid = "";
        $scope.productTeamRule = "";
        $scope.productTeamRuleId = "";
        $scope.productRule = "";
        $scope.productRuleUId = "";
        $scope.regexRule = "";
        $scope.regexRuleInfo = "";
        $scope.regexRuleInfoShow = false;
        $scope.regexFormatRule = "";
        $scope.regexRuleId = "";
        $scope.numberPrefix = "";
        $scope.seriesNumber = "";
        $scope.seriesNumberError = false;
        $scope.seriesNumberErrorTips = "";
        $scope.regexWeiRule = "";
        $scope.numberSuffix = "";
        $scope.createWayType = '1';
        $scope.generatorCounter = 500;
        $scope.thresholdSet = 200;
        $scope.warningSet = "";
        $scope.informWayType = "email";
        $scope.phoneNumber = "";
        $scope.mailAddress = "";
        $('input[name="phoneNumber"]').css("border-color","#BDBDBD");
        $scope.phoneNumberError = false;
        $scope.phoneNumberErrorTips = "";
        $('input[name="mailAddress"]').css("border-color","#BDBDBD");
        $scope.mailAddressError = false;
        $scope.mailAddressErrorTips = ""
    }
    function initDisabled(flag){
        $scope.serviceRuleDisabled = flag;
        $scope.productRuleTeamDisabled = flag;
        $scope.productRuleDisabled = flag;
        $scope.regexRuleDisabled = flag;
        if($scope.module==='waybillNumber'){
            $scope.numberPrefixDisabled = true;
        }else{
            $scope.numberPrefixDisabled = flag;
        }
        $scope.seriesNumberDisabled = flag;
        $scope.regexWeiRuleDisabled = flag;
        $scope.numberSuffixDisabled = flag;
        $scope.generatorCounterDisabled = flag;
        $scope.thresholdSetDisabled = flag;
        $scope.warningSetDisabled = flag;
        $scope.phoneNumberDisabled = flag;
        $scope.mailAddressDisabled = flag;
    }
    //添加规则
    $scope.ruleAdd = function() {
        $scope.ruleInfoFrom.$setPristine();
        $scope.ruleInfoFrom.$setUntouched();
        initInput();
        $scope.ruleInfo.id = '';
        initDisabled(false);
        $scope.regexWeiRuleShow = false;
        $scope.nestRuleInfoFrom = true;
        $scope.productRuleDisabled = true;
        $("#nest-ruleInfoFrom").css("display", "table");
        $scope.title = Lang.getValByKey("orderNumber", 'orderNumber_add_rule');
        var ele = $('.language-international input');
        ele.each(function (i) {
            ele.eq(i).val('');
        });
        loadBar(bar);

        $(".input-text").removeClass("ng-dirty");
        $(".errors").addClass("ng-hide");
        $('button[name="prompt-save"]').addClass('save').removeClass('edit');
    };

    //修改规则
    $scope.ruleEdit = function(id) {
        $scope.ruleInfo.id = id;
        loadBar(bar);
        initInput();
        initDisabled(false);
        $scope.regexWeiRuleShow = false;
        $scope.productRuleDisabled = true;
        $scope.nestRuleInfoFrom = true;
        $("#nest-ruleInfoFrom").css("display", "table");
        $(".input-text").removeClass("ng-dirty");
        $(".errors").addClass("ng-hide");
        $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        $scope.title = Lang.getValByKey("orderNumber", 'orderNumber_edit_rule');
        orderNumberService.orderNumberGetRuleDetail({'seatParams':{'id':id}}, function(data){
            if(data && data.errorCode === 0){
                var data = data.data;
                if(data.status === 2){
                    //启用（全部不能修改）
                    $scope.informWayTypeRadio = false;
                    if(data.noticeType ==="sms"){
                        $scope.informWayMailRadio = false;
                        $scope.informWayNoteRadio = true;
                    }else{
                        $scope.informWayMailRadio = true;
                        $scope.informWayNoteRadio = false;
                    }
                    $scope.createWayTypeRadio = false;
                    if(data.createMethod.toString() ==="1"){
                        $scope.createWayAutoRadio = true;
                        $scope.createWayHandRadio = false;
                    }else{
                        $scope.createWayAutoRadio = false;
                        $scope.createWayHandRadio = true;
                    }
                    initDisabled(true);
                }else if(data.status === 3){
                    //停用
                    if(data.isUpdateAll){
                        //停用(没生成) 修改全部
                        initDisabled(false);
                    }else {
                        //停用(已生成)  修改部分
                        initDisabled(true);
                        $scope.generatorCounterDisabled = false;
                        $scope.thresholdSetDisabled = false;
                        $scope.warningSetDisabled = false;
                        $scope.phoneNumberDisabled = false;
                        $scope.mailAddressDisabled = false;
                    }
                }

                if($scope.module==='channelNumber'){
                    $scope.serviceRule = data.refUidName + '(' + data.refUidCode + ')';
                    $scope.serviceRuleUid = data.refUid;
                }
                if($scope.module==='waybillNumber'){
                    $scope.productTeamRule = data.refName;
                    $scope.productTeamRuleId = data.refId;
                    $scope.productRuleUId = data.refUid;
                    if(data.refUidName){
                        $scope.productRule = data.refUidName + '(' + data.refUidCode + ')';
                    }
                }
                $scope.regexRule = data.name;
                $scope.regexFormatRule = data.format;
                $scope.regexRuleId = data.formatRule;
                $scope.numberPrefix = data.prefix;
                $scope.seriesNumber = data.serialNumber;
                if($scope.seriesNumber.indexOf('?') !== -1){
                    $scope.currentData = {
                        example : data.example,
                        validateLength : data.validateLength,
                        verifyCodeIndex : data.verifyCodeIndex
                    };
                    $scope.regexWeiRuleShow = true;
                    $scope.regexWeiRule = data.verifyName;
                    $scope.regexWeiRuleCode = data.verifyRule;
                }else{
                    $scope.regexWeiRuleShow = false;
                    $scope.regexWeiRuleCode = "";
                    $scope.regexWeiRule = "";
                }
                $scope.numberSuffix = data.postfix;
                $scope.createWayType = data.createMethod.toString();
                if($scope.createWayType ==='1'){
                    $scope.generatorCounter = data.batchNumber;
                    $scope.thresholdSet = data.generateThreshold
                }else{
                    $scope.generatorCounter = 500;
                    $scope.thresholdSet = 200
                }
                $scope.warningSet = data.warnThreshold;
                $scope.informWayType = data.noticeType;
                if($scope.informWayType ==="sms"){
                    $scope.phoneNumber = data.receiver
                }else if($scope.informWayType ==="email"){
                    $scope.mailAddress = data.receiver
                }
            }
        });
    };

    //关闭
    $scope.closeRule = function() {
        initInput();
        $scope.ruleInfo.id = '';
        $scope.regexWeiRuleShow = false;
        $(".input-text").removeClass("ng-dirty");
        $(".errors").addClass("ng-hide");
        $scope.nestRuleInfoFrom = false;
    };

    //校验序列
    $scope.checkSeriesNumber = function(){
        if($scope.seriesNumber){
            if($scope.seriesNumber.indexOf('?') !== -1){
                $scope.regexWeiRuleShow = true;
                //$scope.regexWeiRuleCode = "";
                //$scope.regexWeiRule = "";
                if($.isEmptyObject($scope.currentData)){
                    $scope.regexWeiRuleCode = "";
                    $scope.regexWeiRule = "";
                    $scope.seriesNumberError = false;
                    $scope.seriesNumberErrorTips = "";
                }else{
                    checkSeriesNumber($scope.currentData)
                }
            }else{
                $scope.regexWeiRuleShow = false;
                $scope.regexWeiRuleCode = "";
                $scope.regexWeiRule = "";
                $scope.seriesNumberError = false;
                $scope.seriesNumberErrorTips = "";
                $scope.currentData = {}
            }
        }else{
            $scope.regexWeiRuleShow = false;
            $scope.regexWeiRuleCode = "";
            $scope.regexWeiRule = "";
            $scope.seriesNumberError = false;
            $scope.seriesNumberErrorTips = "";
            $scope.currentData = {}
        }
    };

    //校验阈值
    $scope.checkThresholdSet = function(){
        if($scope.thresholdSet && $scope.generatorCounter && parseInt($scope.thresholdSet) >= parseInt($scope.generatorCounter)){
            $scope.thresholdSetError = true;
            $scope.thresholdSetErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_content_thresholdSet')
        }else{
            $scope.thresholdSetError = false;
            $scope.thresholdSetErrorTips = "";
        }
    };

    //校验手机号码
    function checkPhoneNumberFn(value){
        var REGEXP = /^1(3|5|6|7|8|9)\d{9}$/;
        if (value && !REGEXP.test(value)) {
            $scope.phoneNumberError = true;
            $('input[name="phoneNumber"]').css("border-color", "#FA787E");
            $scope.phoneNumberErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_checkout_reminder')
        } else {
            $scope.phoneNumberError = false;
            $('input[name="phoneNumber"]').css("border-color", "#BDBDBD");
            $scope.phoneNumberErrorTips = ""
        }
    }
    $scope.checkPhoneNumber = function(){
        if($scope.phoneNumber.indexOf(';') !== -1 || $scope.phoneNumber.indexOf('；') !== -1) {
            var key = $scope.phoneNumber.replace(/[;；\/]/g,','),flag = true;
            var REGEXP = /^1(3|5|6|7|8|9)\d{9}$/;
            angular.forEach(key.split(','), function (value, key) {
                if(value && !REGEXP.test(value)){
                    flag = false
                }
            });
            if(flag){
                $scope.phoneNumberError = false;
                $('input[name="phoneNumber"]').css("border-color", "#BDBDBD");
                $scope.phoneNumberErrorTips = ""
            }else{
                $scope.phoneNumberError = true;
                $('input[name="phoneNumber"]').css("border-color", "#FA787E");
                $scope.phoneNumberErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_checkout_reminder')
            }
        }else {
            checkPhoneNumberFn($scope.phoneNumber)
        }
    };

    //校验邮箱地址
    function checkMailAddressFn(value){
        var REGEXP = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(value && !REGEXP.test(value)) {
            $scope.mailAddressError = true;
            $('input[name="mailAddress"]').css("border-color","#FA787E");
            $scope.mailAddressErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_checkout_reminder')
        }else{
            $scope.mailAddressError = false;
            $('input[name="mailAddress"]').css("border-color","#BDBDBD");
            $scope.mailAddressErrorTips = ""
        }
    }
    $scope.checkMailAddress = function(){
        if($scope.mailAddress.indexOf(';') !== -1 || $scope.mailAddress.indexOf('；') !== -1) {
            var key = $scope.mailAddress.replace(/[;；\/]/g,','),flag = true;
            var REGEXP = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            angular.forEach(key.split(','), function (value, key) {
                if(value && !REGEXP.test(value)){
                    flag = false
                }
            });
            if(flag){
                $scope.mailAddressError = false;
                $('input[name="mailAddress"]').css("border-color","#BDBDBD");
                $scope.mailAddressErrorTips = ""
            }else{
                $scope.mailAddressError = true;
                $('input[name="mailAddress"]').css("border-color","#FA787E");
                $scope.mailAddressErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_checkout_reminder')
            }
        }else{
            checkMailAddressFn($scope.mailAddress)
        }
    };

    //保存规则
    $scope.saveRule = function() {
        if (!$scope.serviceRule && $scope.module==='channelNumber') {
            $scope.ruleInfoFrom.serviceRule.$setDirty();
        }
        if (!$scope.productTeamRule && $scope.module==='waybillNumber') {
            $scope.ruleInfoFrom.productTeamRule.$setDirty();
        }
        if (!$scope.regexRule) {
            $scope.ruleInfoFrom.regexRule.$setDirty();
        }
        if (!$scope.seriesNumber) {
            $scope.ruleInfoFrom.seriesNumber.$setDirty();
        }
        if ($scope.seriesNumberError || $scope.thresholdSetError) {
            return
        }
        if (!$scope.regexWeiRule && $scope.regexWeiRuleShow) {
            $scope.ruleInfoFrom.regexWeiRule.$setDirty();
        }
        if (!$scope.generatorCounter && $scope.createWayType === "1") {
            $scope.ruleInfoFrom.generatorCounter.$setDirty();
        }
        if (!$scope.thresholdSet && $scope.createWayType === "1") {
            $scope.ruleInfoFrom.thresholdSet.$setDirty();
        }
        if($scope.createWayType === "2"){
            $scope.generatorCounter = 500;
            $scope.thresholdSet = 200
        }
        showErrorModel(bar);
        if (!$scope.ruleInfoFrom.$valid) {
            scrollToErrorView($(".switch-list"));
            return;
        }

        var receiver,batchNumber,generateThreshold,refUid,postfix;

        if($scope.module==='channelNumber'){
            refUid = $scope.serviceRuleUid;
            postfix = $scope.numberSuffix.toUpperCase()
        }else if($scope.module==='waybillNumber'){
            refUid = $scope.productRuleUId;
            postfix = "";
        }

        if($scope.informWayType ==="sms"){
            if($scope.phoneNumberError){
                return;
            }
            receiver= $scope.phoneNumber
        }else if($scope.informWayType ==="email"){
            if($scope.mailAddressError){
                return;
            }
            receiver= $scope.mailAddress
        }

        if($scope.createWayType ==='1'){
            batchNumber = $scope.generatorCounter;
            generateThreshold = $scope.thresholdSet
        }else{
            batchNumber = "";
            generateThreshold = ""
        }

        var config = {
            urlParams : {
                refUid: refUid,
                formatRule: $scope.regexRuleId,
                name: $scope.regexRule,
                format: $scope.regexFormatRule,
                prefix: $scope.numberPrefix.toUpperCase(),
                serialNumber: $scope.seriesNumber,
                verifyRule: $scope.regexWeiRuleCode,
                postfix: $scope.numberSuffix.toUpperCase(),
                createMethod: $scope.createWayType,
                batchNumber:batchNumber ,
                generateThreshold: generateThreshold,
                warnThreshold: $scope.warningSet,
                noticeType: $scope.informWayType,
                receiver: receiver
            }
        };

        if($scope.module==='waybillNumber'){
            config.urlParams.refId = $scope.productTeamRuleId;
        }

        if($scope.ruleInfo.id) {
            config.seatParams = {'id': $scope.ruleInfo.id};
            orderNumberService.orderNumberRuleSaveEdit(config, function(data){
                if(data && data.errorCode === 0){
                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                    $scope.closeRule();
                    $scope.getTable();
                    $scope.ruleInfo.id = '';
                }else{
                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
        }else{
            orderNumberService.orderNumberRuleSave(config, function(data){
                if(data && data.errorCode === 0){
                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                    $scope.closeRule();
                    $scope.getTable();
                }else{
                    orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
        }
    };

    //搜索服务
    var searchServiceRuleEle;
    $scope.getSearchServiceData = function(){
          var serviceConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    status:3
                },
                seatParams:{serviceTypeCode:-1},
                isAsync: true
            };
        $scope.searchServiceRules = orderNumberService.getServiceShort(serviceConfig);
        orderNumberView.rebuildServiceName($scope.searchServiceRules);
        if(searchServiceRuleEle){
            searchServiceRuleEle.destroy();
        }
        searchServiceRuleEle = selectFactory({
            data: $scope.searchServiceRules,
            id: "search-ruleService",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                if(data || currentPage){
                    serviceConfig= {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage ? currentPage : 1,
                            pageSize: 10,
                            status:3
                        },
                        seatParams:{serviceTypeCode:-1},
                        isAsync: true
                    };
                    $scope.searchServiceRules = orderNumberService.getServiceShort(serviceConfig);
                    orderNumberView.rebuildServiceName($scope.searchServiceRules);
                    attachEvent.setData($scope.searchServiceRules);
                }
            },
            attrTextModel: function(name, data,currentData) {
                $scope.ruleInfoServiceUid = currentData.uid;
                $scope.ruleInfoService = currentData.name;
                $scope.$apply();
            }
        });
        searchServiceRuleEle.open();
    };
    //搜索供应商
    var searchSupplierRuleEle;
    $scope.getSearchSupplierData = function(){
        var serviceConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                }
            };
        $scope.searchSupplierRules = orderNumberService.getSupplierShort(serviceConfig);
        orderNumberView.rebuildServiceName($scope.searchSupplierRules);
        if(searchSupplierRuleEle){
            searchSupplierRuleEle.destroy();
        }
        searchSupplierRuleEle = selectFactory({
            data: $scope.searchSupplierRules,
            id: "search-ruleSupplier",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                if(data || currentPage){
                    serviceConfig= {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage ? currentPage : 1,
                            pageSize: 10
                        }
                    };
                    $scope.searchSupplierRules = orderNumberService.getSupplierShort(serviceConfig);
                    orderNumberView.rebuildServiceName($scope.searchSupplierRules);
                    attachEvent.setData($scope.searchSupplierRules);
                }
            },
            attrTextModel: function(name, data,currentData) {
                $scope.ruleInfoSupplierId = currentData.id;
                $scope.ruleInfoSupplier = currentData.name;
                $scope.$apply();
            }
        });
        searchSupplierRuleEle.open();
    };
    //搜索产品组
    var searchProductTeamRuleEle,groupLeft = null;
    $scope.getSearchProductTeamFirstData = function(){
        $scope.searchProductTeamRules = orderNumberService.getProductTeamLeafRuleShort(null);
        if(searchProductTeamRuleEle){
            searchProductTeamRuleEle.destroy();
        }
        searchProductTeamRuleEle = selectFactory({
            data: $scope.searchProductTeamRules,
            id: "search-ruleProductTeam-first",
            isCreateNewSelect:true,
            defaultText:Lang.getValByKey("orderNumber", "orderNumber_select_all"),
            attrTextModel: function(name, data,currentData) {
                if($.isEmptyObject(currentData)){
                    $scope.ruleInfoProductTeamFirst = "";
                    $scope.ruleInfoProductTeamFirstId = "";
                    $scope.searchProductTeamLeafRules = [];
                    searchProductTeamRuleLeafEle.clearData();
                }
                $scope.ruleInfoProductUid = "";
                $scope.ruleInfoProduct = "";
                $scope.ruleInfoProductTeamFirst = currentData.name;
                $scope.ruleInfoProductTeamFirstId = currentData.id;
                delete $scope.ruleInfoProductTeamLeafId;
                delete $scope.ruleInfoProductTeamLeaf;
                $scope.$apply();
            }
        });
        searchProductTeamRuleEle.open();
    };
    var searchProductTeamRuleLeafEle = null;
    $scope.getSearchProductTeamLeafData = function() {
        if($scope.ruleInfoProductTeamFirstId){
            $scope.searchProductTeamLeafRules = orderNumberService.getProductTeamLeafRuleShort($scope.ruleInfoProductTeamFirstId);
            if(searchProductTeamRuleLeafEle){
                searchProductTeamRuleLeafEle.destroy();
            }
            searchProductTeamRuleLeafEle = selectFactory({
                data: $scope.searchProductTeamLeafRules,
                id: "search-ruleProductTeam-leaf",
                isCreateNewSelect: true,
                defaultText:Lang.getValByKey("orderNumber", "orderNumber_select_all"),
                attrTextModel: function (name, data, currentData) {
                    $scope.ruleInfoProductUid = "";
                    $scope.ruleInfoProduct = "";
                    $scope.ruleInfoProductTeamLeafId = currentData.id;
                    $scope.ruleInfoProductTeamLeaf = currentData.name;
                    $scope.$apply();
                }
            });
            searchProductTeamRuleLeafEle.open();
        }
    };
    //搜索产品
    var searchProductRuleEle;
    $scope.getSearchProductData = function(){
        var serviceConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    status:3,
                    includeAllAudit:true,
                    topGrade:$scope.ruleInfoProductTeamFirstId || '',
                    secondGrade:$scope.ruleInfoProductTeamLeafId ||''
                }
            };
        $scope.searchProductRules = orderNumberService.getProductRuleShort(serviceConfig);
        orderNumberView.rebuildServiceName($scope.searchProductRules);
        if(searchProductRuleEle){
            searchProductRuleEle.destroy();
        }
        searchProductRuleEle = selectFactory({
            data: $scope.searchProductRules,
            id: "search-ruleProduct",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                if(data || currentPage){
                    serviceConfig= {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage ? currentPage : 1,
                            pageSize: 10,
                            status:3,
                            includeAllAudit:true,
                            topGrade:$scope.ruleInfoProductTeamFirstId || '',
                            secondGrade:$scope.ruleInfoProductTeamLeafId ||''
                        }
                    };
                    $scope.searchProductRules = orderNumberService.getProductRuleShort(serviceConfig);
                    orderNumberView.rebuildServiceName($scope.searchProductRules);
                    attachEvent.setData($scope.searchProductRules);
                }
            },
            attrTextModel: function(name, data,currentData) {
                $scope.ruleInfoProductUid = currentData.uid;
                $scope.ruleInfoProduct = currentData.name;
                $scope.$apply();
            }
        });
        searchProductRuleEle.open();
    };
    //搜索状态
    var ruleUseInfoEle;
    $scope.getSearchRuleUseInfoData = function(){
        var searchRuleUseInfos = [
            {code:1,name:Lang.getValByKey("orderNumber", 'orderNumber_select_all')},
            {code:2,name:Lang.getValByKey("orderNumber", 'orderNumber_select_stared')},
            {code:3,name:Lang.getValByKey("orderNumber", 'orderNumber_select_stopped')}
        ];
        if(ruleUseInfoEle){
            ruleUseInfoEle.destroy();
        }
        ruleUseInfoEle = selectFactory({
            data: {data:searchRuleUseInfos},
            id: "rule-useInfo",
            isCreateNewSelect:true,
            defaultText:'',
            attrTextModel: function(name, data,currentData) {
                $scope.ruleUseInfoId = currentData.code;
                $scope.ruleUseInfo = currentData.name;
                $scope.$apply();
            }
        });
        ruleUseInfoEle.open();
    };
    //添加服务
    var serviceRuleEle;
    $scope.getServiceRuleData = function(){
        var serviceConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    status:3
                },
                seatParams:{serviceTypeCode:-1},
                isAsync: true
            };
        $scope.addServiceRules = orderNumberService.getServiceShort(serviceConfig);
        orderNumberView.rebuildServiceName($scope.addServiceRules);
        if(serviceRuleEle){
            serviceRuleEle.destroy();
        }
        serviceRuleEle = selectFactory({
            data: $scope.addServiceRules,
            id: "rule-serviceRule",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            height: 240,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
            defaultText: Lang.getValByKey("common", "common_select_tips"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                if(data || currentPage){
                    serviceConfig= {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage ? currentPage : 1,
                            pageSize: 10,
                            status:3
                        },
                        seatParams:{serviceTypeCode:-1},
                        isAsync: true
                    };
                    $scope.addServiceRules = orderNumberService.getServiceShort(serviceConfig);
                    orderNumberView.rebuildServiceName($scope.addServiceRules);
                    attachEvent.setData($scope.addServiceRules);
                }
            },
            attrTextModel: function(name, data,currentData) {
                $scope.serviceRuleUid = currentData.uid;
                $scope.serviceRule = currentData.name;
                $scope.$apply();
            }
        });
        serviceRuleEle.open();
    };
    //添加产品组
    var productTeamRuleEle;
    $scope.getProductTeamRuleData = function(){
        var productTeamRules;
        $scope.addProductTeamRules = orderNumberService.getProductTeamRuleShort();
        productTeamRules = [
            {code:2,prefixName:'122'},
            {code:3,prefixName:'132'},
            {code:4,prefixName:'112'},
            {code:5,prefixName:'192'},
            {code:7,prefixName:'212'},
            {code:8,prefixName:'222'},
            {code:9,prefixName:'232'},
            {code:12,prefixName:'332'},
            {code:13,prefixName:'392'},
            {code:17,prefixName:'592'},
            {code:18,prefixName:'492'},
            {code:19,prefixName:'692'}
        ];
        if(productTeamRuleEle){
            productTeamRuleEle.destroy();
        }
        productTeamRuleEle = selectFactory({
            data: $scope.addProductTeamRules,
            id: "rule-productTeamRule",
            isCreateNewSelect:true,
            height: 240,
            defaultCount:100,
            defaultText: Lang.getValByKey("orderNumber", "orderNumber_select_tips"),
            attrTextModel: function(name, data,currentData) {
                if($.isEmptyObject(currentData)){
                    $scope.numberPrefix = '';
                    $scope.productRuleUId = '';
                    $scope.productRule = '';
                    $scope.productRuleDisabled = true;
                }else{
                    $scope.productRuleDisabled = false;
                }
                $scope.productRuleUId = '';
                $scope.productRule = '';
                angular.forEach(productTeamRules, function(value, key){
                    if(value.code === currentData.id){
                        $scope.numberPrefix = value.prefixName;
                        $scope.numberPrefixDisabled = true;
                    }
                });
                $scope.productTeamRuleId = currentData.id;
                $scope.productTeamRule = currentData.name;
                $scope.topGrade = currentData.parentId;
                $scope.$apply();
            }
        });
        productTeamRuleEle.open();
    };
    //添加产品
    var productRuleEle;
    $scope.getProductRuleData = function(){
        var productConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    status:3,
                    includeAllAudit:true,
                    topGrade:$scope.topGrade || '',
                    secondGrade:$scope.productTeamRuleId ||''
                }
            };
        $scope.addProductRules = orderNumberService.getProductRuleShort(productConfig);
        orderNumberView.rebuildServiceName($scope.addProductRules);
        if(productRuleEle){
            productRuleEle.destroy();
        }
        productRuleEle = selectFactory({
            data: $scope.addProductRules,
            id: "rule-productRule",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            height: 240,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
            defaultText: Lang.getValByKey("common", "common_select_tips"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                if(data || currentPage){
                    productConfig= {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage ? currentPage : 1 ,
                            pageSize: 10,
                            status:3,
                            includeAllAudit:true,
                            topGrade:$scope.topGrade || '',
                            secondGrade:$scope.productTeamRuleId || ''
                        }
                    };
                    $scope.addProductRules = orderNumberService.getProductRuleShort(productConfig);
                    orderNumberView.rebuildServiceName($scope.addProductRules);
                    attachEvent.setData($scope.addProductRules);
                }
            },
            attrTextModel: function(name, data,currentData) {
                $scope.productRuleUId = currentData.uid;
                $scope.productRule = currentData.name;
                $scope.$apply();
            }
        });
        productRuleEle.open();
    };
    //添加校验规则
    var regexRuleEle;
    $scope.getRegexRuleData = function(){
        if(regexRuleEle){
            regexRuleEle.destroy();
        }
        regexRuleEle = selectFactory({
            data: [],
            id: "rule-regexRule",
            isSearch: true,
            pagination: true,
            isCreateNewSelect:true,
            height: 240,
            closeLocalSearch: true,
            searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_verify_placeholder"),
            defaultText: Lang.getValByKey("common", "common_select_tips"),
            onSearchValueChange:function(attachEvent, data,currentPage) {
                var regexRuleConfig= {
                    urlParams: {
                        q: data || "",
                        pageIndex:currentPage || 1,
                        pageSize: 10
                    }
                };
                orderNumberService.getRegexRule(regexRuleConfig, function(res){
                    if(res.errorCode === 0){
                        $scope.addRegexRules = res;
                    }
                });
                attachEvent.setData($scope.addRegexRules);
            },
            attrTextModel: function(name,data,currentData) {
                if(!currentData.name){
                    $scope.regexRuleInfo = '';
                    $scope.regexRuleInfoShow = false;
                }else{
                    $scope.regexRuleInfo = Lang.getValByKey("orderNumber", "orderNumber_title_example") + currentData.example;
                    $scope.regexRuleInfoShow = true;
                }
                $scope.regexRuleId = currentData.code;
                $scope.regexRule = currentData.name;
                $scope.regexFormatRule = currentData.format;
                $scope.$apply();
            }
        });
        regexRuleEle.open();
    };
    //添加校验位规则
    var regexWeiRuleEle;
    $scope.getRegexWeiRuleData = function(){
        orderNumberService.getRegexWeiRule(function(res){
            if(res.errorCode === 0){
                if(regexWeiRuleEle){
                    regexWeiRuleEle.destroy();
                }
                regexWeiRuleEle = selectFactory({
                    data: res,
                    id: "rule-regexWeiRule",
                    defaultText:Lang.getValByKey("orderNumber", "orderNumber_select_tips"),
                    isCreateNewSelect:true,
                    height:120,
                    attrTextModel: function(name, data,currentData) {
                        if($.isEmptyObject(currentData)){
                            $scope.seriesNumberError = false;
                            $scope.seriesNumberErrorTips = "";
                            $scope.regexWeiRuleCode = "";
                            $scope.regexWeiRule = "";
                            $scope.currentData = {};
                            $scope.$apply();
                            return
                        }
                        $scope.regexWeiRuleCode = currentData.code;
                        $scope.regexWeiRule = currentData.name;
                        if(!$scope.seriesNumber){
                            $scope.$apply();
                            return
                        }
                        checkSeriesNumber(currentData);
                        $scope.$apply();
                    }
                });
                regexWeiRuleEle.open();
            }
        });
    };
    function checkSeriesNumber(currentData){
        $scope.currentData = currentData;
        var flag =true;
        if($scope.seriesNumber.indexOf('-') !== -1){
            $scope.seriesNumber.split('-').forEach(function(value,key){
                if(value.length - 1 !== currentData.validateLength ||
                    value.indexOf('?') !== currentData.verifyCodeIndex){
                    flag = false;
                }
            })
        }else{
            if($scope.seriesNumber.toString().length - 1 !== currentData.validateLength ||
                $scope.seriesNumber.toString().indexOf('?') !== currentData.verifyCodeIndex){
                flag = false;
            }
        }
        if(flag){
            $scope.seriesNumberError = false;
            $scope.seriesNumberErrorTips = "";
        }else{
            $scope.seriesNumberError = true;
            $scope.seriesNumberErrorTips = Lang.getValByKey("orderNumber", 'orderNumber_content_regexRule') + currentData.example;
        }
    }

}]);
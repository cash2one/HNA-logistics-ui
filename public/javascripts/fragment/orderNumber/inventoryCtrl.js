easySpa.require([
    'public/common/calander.js'
], function() {
    app.controller("inventoryCtrl", ["$scope",'orderNumberService', 'orderNumberView', "tableService", function($scope, orderNumberService,orderNumberView, tableService) {
        orderNumberView.initCalander();
        $scope.invertoryBeginTime = getBeforeDate(6) + ' 00:00:00';
        $scope.invertoryEndTime = new Date().format("yyyy-MM-dd 23:59:59");
        $scope.inventoryInfo = {id: 0};
        var tablehearder,tableHeaderSize,restURL;
        if($scope.module==="channelNumber"){
            tablehearder = [
                Lang.getValByKey('orderNumber', 'orderNumber_table_batchNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_service'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_supplier'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_starNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_endNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_used'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_createTime')
            ];
            tableHeaderSize =['13%','12%','15%','15%','15%','14%','16%'];
            restURL = 'logistics.getChannelNumberBatch'
        }else{
            tablehearder = [
                Lang.getValByKey('orderNumber', 'orderNumber_table_batchNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_clientele'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_productTeam'),
                Lang.getValByKey('orderNumber', 'orderNumber_add_product'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_starNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_endNumber'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_used'),
                Lang.getValByKey('orderNumber', 'orderNumber_table_createTime')
            ];
            tableHeaderSize =['12%','12%','12%','12%','13%','13%','12%','14%'];
            restURL = 'logistics.getWaybillNumberBatch'
        }
        $scope.tableModel = {
            'tableHeader': tablehearder,
            'tableHeaderSize': tableHeaderSize,
            'tableBody': [],
            'restURL': restURL,
            'restData': {
                'q': '',
                'batchNumber': '',
                'waybillNumber': '',
                'channelNumber': '',
                'serviceUid': '',
                'productUid': '',
                'refParentGroupId': '',
                'productGroupId': '',
                'startTime':getBeforeDate(6) + ' 00:00:00',
                'endTime':new Date().format("yyyy-MM-dd 23:59:59"),
                'pageIndex': 1,
                'pageSize': 10,
                'sort': ''
            },
            'selectNumber': 0,
            'selectFlag': false
        };
        $scope.getTable = function(isSearch){
            $scope.tableModel.restData.startTime =  $scope.invertoryBeginTime;
            $scope.tableModel.restData.endTime = $scope.invertoryEndTime;
            $scope.tableModel.restData.serviceUid = $scope.serviceUid;
            $scope.tableModel.restData.productUid = $scope.productUid;
            $scope.tableModel.restData.refParentGroupId = $scope.inventoryInfoProductTeamFirstId;
            $scope.tableModel.restData.productGroupId = $scope.inventoryInfoProductTeamLeafId;
            $scope.tableModel.restData.batchNumber = $scope.searchBatchNumber;
            if($scope.tableModel.restData.channelNumber || $scope.tableModel.restData.waybillNumber){
                $scope.tableModel.restData.batchNumber ="";
                $scope.tableModel.restData.startTime =  "";
                $scope.tableModel.restData.endTime = "";
                $scope.tableModel.restData.serviceUid = "";
                $scope.tableModel.restData.productUid = "";
                $scope.tableModel.restData.refParentGroupId = "";
                $scope.tableModel.restData.productGroupId = "";
            }

            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var height,config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    if($scope.module==="channelNumber"){
                        height = $('.order-table-inventory').height() - 304;
                    }else{
                        height = $('.order-table-inventory').height() - 353;
                    }
                    setTimeout(function() {
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            if($scope.module==="channelNumber"){
                                height = $('.order-table-inventory').height() - 304;
                            }else{
                                height = $('.order-table-inventory').height() - 353;
                            }
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        //重置
        $scope.resetData = function() {
            $scope.tableModel.restData.batchNumber = "";
            $scope.searchBatchNumber = "";
            $scope.tableModel.restData.waybillNumber = "";
            $scope.tableModel.restData.channelNumber = "";
            $scope.tableModel.restData.serviceUid = "";
            $scope.tableModel.restData.productUid = "";
            $scope.tableModel.restData.refParentGroupId = "";
            $scope.tableModel.restData.productGroupId = "";
            $scope.service = "";
            $scope.serviceUid = "";
            $scope.product = "";
            $scope.productUid = "";
            $scope.inventoryInfoProductTeamFirst = "";
            $scope.inventoryInfoProductTeamFirstId = "";
            $scope.inventoryInfoProductTeamLeaf = "";
            $scope.inventoryInfoProductTeamLeafId = "";
            $scope.tableModel.restData.pageIndex = 1;
            if(searchProductTeamRuleLeafEle){
                searchProductTeamRuleLeafEle.clearData();
            }
            $scope.invertoryBeginTime = getBeforeDate(6) + ' 00:00:00';
            $scope.invertoryEndTime = new Date().format("yyyy-MM-dd 23:59:59");
            $scope.tableModel.restData.startTime = getBeforeDate(6) + ' 00:00:00';
            $scope.tableModel.restData.endTime = new Date().format("yyyy-MM-dd 23:59:59");
            $scope.getTable();
        };

        //生成单号
        $scope.createNumber = function() {
            $scope.inventoryInfoFrom.$setPristine();
            $scope.inventoryInfoFrom.$setUntouched();
            if($scope.module==='channelNumber'){
                $scope.serviceInventoryRequired = true;
                $scope.clienteleInventoryRequired = false
            }else{
                $scope.serviceInventoryRequired = false;
                $scope.clienteleInventoryRequired = true
            }
            $scope.serviceInventory = "";
            $scope.serviceInventoryUid = "";
            $scope.createAllInventory = "";
            $scope.nestInventoryInfoFrom = true;
            $scope.productInventoryDisabled = true;
            $("#nest-inventoryInfoFrom").css("display", "table");
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        //获取单号详情
        $scope.editNumber = function(id) {
            $scope.inventoryInfo.id = id;
            $scope.editInventoryInfo= true;
            $("#nest-editInventoryInfoFrom").css("display", "table");
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            orderNumberService.orderNumberGetInventoryDetail({'seatParams':{'batchNo':id}}, function(data){
                if(data && data.errorCode === 0){
                    $scope.createWayInventory = data.data.generateMethodName;
                    $scope.operatorInventory = data.data.createUserName+' '+ data.data.createUserCode ;
                }
            });
        };

        //关闭生成单号
        $scope.closeInventory = function() {
            $scope.serviceInventory = "";
            $scope.serviceInventoryUid = "";
            $scope.clienteleInventory = "";
            $scope.clienteleInventoryId = "";
            $scope.productTeamInventory = "";
            $scope.productTeamInventoryId = "";
            $scope.productInventory = "";
            $scope.productInventoryUid = "";
            $scope.createAllInventory = "";
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $scope.nestInventoryInfoFrom = false;
            $scope.editInventoryInfo= false;
            $scope.addInventoryInfo= false;
        };

        //确认生成单号
        $scope.saveInventory = function() {
            if (!$scope.serviceInventory && $scope.module==='channelNumber') {
                $scope.inventoryInfoFrom.serviceInventory.$setDirty();
            }
            if (!$scope.productTeamInventory && $scope.module==='waybillNumber') {
                $scope.inventoryInfoFrom.productTeamInventory.$setDirty();
            }
            if (!$scope.createAllInventory) {
                $scope.inventoryInfoFrom.createAllInventory.$setDirty();
            }

            if (!$scope.inventoryInfoFrom.$valid) {
                scrollToErrorView($(".switch-list"));
                return;
            }

            var refUid;
            if($scope.module==='channelNumber'){
                refUid = $scope.serviceInventoryUid;
            }else if($scope.module==='waybillNumber'){
                refUid = $scope.productInventoryUid;
            }

            var config = {
                urlParams : {
                    refUid: refUid,
                    numbers: $scope.createAllInventory
                }
            };

            if($scope.module==='waybillNumber'){
                config.urlParams.customerId = $scope.clienteleInventoryId;
                config.urlParams.refId = $scope.productTeamInventoryId;
            }

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip:Lang.getValByKey("orderNumber", 'orderNumber_title_inventory')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("orderNumber", 'orderNumber_button_ok'),
                    application:'',
                    operationEvent: function (){
                        orderNumberService.orderNumberInventorySave(config, function(data){
                            orderNumberView.promptBox('closePrompt');
                            if(data && data.errorCode === 0 && data.data !== 0){
                                orderNumberView.promptBox({
                                    isDelay:true,
                                    contentDelay:Lang.getValByKey("orderNumber", 'orderNumber_new_success') + data.data,
                                    type: 'success',
                                    time: 3000
                                });
                                $scope.closeInventory();
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                orderNumberView.promptBox({
                                    isDelay:true,
                                    contentDelay:Lang.getValByKey("orderNumber", 'orderNumber_new_lose') ,
                                    type: 'errer',
                                    manualClose:true,
                                    time: 3000
                                });
                            }
                        });
                    }
                }]
            };
            orderNumberView.promptBox(opt);
        };

        //搜索服务
        var searchInventoryServicEle;
        $scope.getSearchInventoryServiceData = function(){
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
            $scope.searchInventoryServics = orderNumberService.getServiceShort(serviceConfig);
            orderNumberView.rebuildServiceName( $scope.searchInventoryServics);
            if(searchInventoryServicEle){
                searchInventoryServicEle.destroy();
            }
            searchInventoryServicEle = selectFactory({
                data: $scope.searchInventoryServics,
                id: "search-inventoryService",
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
                        $scope.searchInventoryServics = orderNumberService.getServiceShort(serviceConfig);
                        orderNumberView.rebuildServiceName( $scope.searchInventoryServics);
                        attachEvent.setData($scope.searchInventoryServics);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.serviceUid = currentData.uid;
                    $scope.service = currentData.name;
                    $scope.$apply();
                }
            });
            searchInventoryServicEle.open();
        };
        //搜索产品
        var searchInventoryProductEle;
        $scope.getSearchInventoryProductData = function(){
            var serviceConfig= {
                    urlParams: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10,
                        status:3,
                        includeAllAudit:true,
                        topGrade:$scope.inventoryInfoProductTeamFirstId || '',
                        secondGrade:$scope.inventoryInfoProductTeamLeafId ||''
                    }
                };
            $scope.searchInventoryProducts = orderNumberService.getProductRuleShort(serviceConfig);
            orderNumberView.rebuildServiceName( $scope.searchInventoryProducts);
            if(searchInventoryProductEle){
                searchInventoryProductEle.destroy();
            }
            searchInventoryProductEle = selectFactory({
                data: $scope.searchInventoryProducts,
                id: "search-inventoryProduct",
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
                                topGrade:$scope.inventoryInfoProductTeamFirstId || '',
                                secondGrade:$scope.inventoryInfoProductTeamLeafId ||''
                            }
                        };
                        $scope.searchInventoryProducts = orderNumberService.getProductRuleShort(serviceConfig);
                        orderNumberView.rebuildServiceName( $scope.searchInventoryProducts);
                        attachEvent.setData($scope.searchInventoryProducts);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.productUid = currentData.uid;
                    $scope.product = currentData.name;
                    $scope.$apply();
                }
            });
            searchInventoryProductEle.open();
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
                id: "search-inventoryProductTeam-first",
                isCreateNewSelect:true,
                defaultText:Lang.getValByKey("orderNumber", "orderNumber_select_all"),
                attrTextModel: function(name, data,currentData) {
                    if($.isEmptyObject(currentData)){
                        $scope.inventoryInfoProductTeamFirst = "";
                        $scope.inventoryInfoProductTeamFirstId = "";
                        $scope.searchProductTeamLeafRules = [];
                        searchProductTeamRuleLeafEle.clearData();
                    }
                    $scope.productUid = "";
                    $scope.product = "";
                    $scope.inventoryInfoProductTeamFirst = currentData.name;
                    $scope.inventoryInfoProductTeamFirstId = currentData.id;
                    delete $scope.inventoryInfoProductTeamLeafId;
                    delete $scope.inventoryInfoProductTeamLeaf;
                    $scope.$apply();
                }
            });
            searchProductTeamRuleEle.open();
        };
        var searchProductTeamRuleLeafEle = null;
        $scope.getSearchProductTeamLeafData = function() {
            if($scope.inventoryInfoProductTeamFirstId){
                $scope.searchProductTeamLeafRules = orderNumberService.getProductTeamLeafRuleShort($scope.inventoryInfoProductTeamFirstId);
                if(searchProductTeamRuleLeafEle){
                    searchProductTeamRuleLeafEle.destroy();
                }
                searchProductTeamRuleLeafEle = selectFactory({
                    data: $scope.searchProductTeamLeafRules,
                    id: "search-inventoryProductTeam-leaf",
                    isCreateNewSelect: true,
                    defaultText:Lang.getValByKey("orderNumber", "orderNumber_select_all"),
                    attrTextModel: function (name, data, currentData) {
                        $scope.productUid = "";
                        $scope.product = "";
                        $scope.inventoryInfoProductTeamLeafId = currentData.id;
                        $scope.inventoryInfoProductTeamLeaf = currentData.name;
                        $scope.$apply();
                    }
                });
                searchProductTeamRuleLeafEle.open();
            }
        };
        //添加服务
        var serviceInventoryEle;
        $scope.getServiceInventoryData = function(){
            var serviceConfig= {
                    urlParams: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10
                    }
                };
            $scope.addServiceInventorys = orderNumberService.getServiceLoadShort(serviceConfig);
            orderNumberView.rebuildServiceName( $scope.addServiceInventorys);
            if(serviceInventoryEle){
                serviceInventoryEle.destroy();
            }
            serviceInventoryEle = selectFactory({
                data: $scope.addServiceInventorys,
                id: "service-inventory",
                isSearch: true,
                isCreateNewSelect:true,
                pagination: true,
                height: 240,
                closeLocalSearch: true,
                searchPlaceHoder: Lang.getValByKey("orderNumber", "orderNumber_service_placeholder"),
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    if(data || currentPage){
                        serviceConfig= {
                            urlParams: {
                                q: data,
                                pageIndex:currentPage ? currentPage : 1,
                                pageSize: 10
                            }
                        };
                        $scope.addServiceInventorys = orderNumberService.getServiceLoadShort(serviceConfig);
                        orderNumberView.rebuildServiceName( $scope.addServiceInventorys);
                        attachEvent.setData($scope.addServiceInventorys);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.serviceInventoryUid = currentData.uid;
                    $scope.serviceInventory = currentData.name;
                    $scope.$apply();
                }
            });
            serviceInventoryEle.open();
        };
        //添加产品组
        var productTeamRuleEle;
        $scope.getProductTeamInventoryData = function(){
            $scope.addProductTeamRules = orderNumberService.getProductTeamRuleShort();
            if(productTeamRuleEle){
                productTeamRuleEle.destroy();
            }
            productTeamRuleEle = selectFactory({
                data: $scope.addProductTeamRules,
                id: "productTeam-inventory",
                isCreateNewSelect:true,
                height: 240,
                defaultCount:100,
                defaultText: Lang.getValByKey("orderNumber", "orderNumber_select_tips"),
                attrTextModel: function(name, data,currentData) {
                    if($.isEmptyObject(currentData)){
                        $scope.productInventoryUid = '';
                        $scope.productInventory = '' ;
                        $scope.productInventoryDisabled = true;
                    }else{
                        $scope.productInventoryDisabled = false;
                    }
                    $scope.productInventoryUid = '';
                    $scope.productInventory = '' ;
                    $scope.productTeamInventoryId = currentData.id;
                    $scope.productTeamInventory = currentData.name;
                    $scope.topGrade = currentData.parentId;
                    $scope.$apply();
                }
            });
            productTeamRuleEle.open();
        };
        //添加产品
        var productInventoryEle;
        $scope.getProductInventoryData = function(){
            var productConfig= {
                    urlParams: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10,
                        productGroupId:$scope.productTeamInventoryId ||''
                    }
                };
            $scope.addProductInventorys = orderNumberService.getProductInventoryShort(productConfig);
            orderNumberView.rebuildServiceName( $scope.addProductInventorys);
            if(productInventoryEle){
                productInventoryEle.destroy();
            }
            productInventoryEle = selectFactory({
                data: $scope.addProductInventorys,
                id: "product-inventory",
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
                                pageIndex: currentPage ? currentPage : 1,
                                pageSize: 10,
                                productGroupId:$scope.productTeamInventoryId ||''
                            }
                        };
                        $scope.addProductInventorys = orderNumberService.getProductInventoryShort(productConfig);
                        orderNumberView.rebuildServiceName( $scope.addProductInventorys);
                        attachEvent.setData($scope.addProductInventorys);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.productInventoryUid = currentData.uid;
                    $scope.productInventory = currentData.name;
                    $scope.$apply();
                }
            });
            productInventoryEle.open();
        };
        //添加客户
        var clienteleInventoryEle;
        $scope.getClienteleInventoryData = function(){
            var clienteletConfig= {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    userType:1
                }
            };
            $scope.addClienteleInventorys = orderNumberService.getClienteleShort(clienteletConfig);
            orderNumberView.rebuildClienteleName( $scope.addClienteleInventorys);
            if(clienteleInventoryEle){
                clienteleInventoryEle.destroy();
            }
            clienteleInventoryEle = selectFactory({
                data: $scope.addClienteleInventorys,
                showTextField: 'userName',
                id: "clientele-inventory",
                isSearch: true,
                pagination: true,
                isCreateNewSelect:true,
                height: 240,
                closeLocalSearch: true,
                searchPlaceHoder:Lang.getValByKey("orderNumber", "orderNumber_clientele_placeholder"),
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    if(data || currentPage){
                        clienteletConfig= {
                            urlParams: {
                                q: data || '',
                                pageIndex: currentPage || 1,
                                pageSize: 10,
                                userType:1
                            }
                        };
                        $scope.addClienteleInventorys = orderNumberService.getClienteleShort(clienteletConfig);
                        orderNumberView.rebuildClienteleName( $scope.addClienteleInventorys);
                        attachEvent.setData($scope.addClienteleInventorys);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.clienteleInventoryId = currentData.id;
                    $scope.clienteleInventory = currentData.userName;
                    $scope.$apply();
                }
            });
            clienteleInventoryEle.open()
        };
        //导入服务
        var serviceLoadNumberEle;
        $scope.getServiceLoadNumberData = function(){
            var serviceConfig= {
                    urlParams: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10,
                        status:-1
                    },
                    seatParams:{serviceTypeCode:-1},
                    isAsync: true
                };
            $scope.addServiceLoadNumbers = orderNumberService.getServiceShort(serviceConfig);
            orderNumberView.rebuildServiceName( $scope.addServiceLoadNumbers);
            if(serviceLoadNumberEle){
                serviceLoadNumberEle.destroy();
            }
            serviceLoadNumberEle = selectFactory({
                data: $scope.addServiceLoadNumbers,
                id: "service-loadNumber",
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
                                status:-1
                            },
                            seatParams:{serviceTypeCode:-1},
                            isAsync: true
                        };
                        $scope.addServiceLoadNumbers = orderNumberService.getServiceShort(serviceConfig);
                        orderNumberView.rebuildServiceName( $scope.addServiceLoadNumbers);
                        attachEvent.setData($scope.addServiceLoadNumbers);
                    }
                },
                attrTextModel: function(name, data,currentData) {
                    $('input[type="file"]').val("");
                    $(".serviceLoadNumberInput").css("border-color","#BDBDBD");
                    $scope.serviceLoadNumberUid = currentData.uid;
                    $scope.serviceLoadNumber = currentData.name;
                    $scope.$apply();
                }
            });
            serviceLoadNumberEle.open();
        };

        //导入单号
        $scope.loadNumber = function() {
            $scope.loadNumberFrom.$setPristine();
            $scope.loadNumberFrom.$setUntouched();
            $scope.nestLoadNumber = true;
            $scope.uploadNumbering = false;
            $scope.canLoadNumber = true;
            $("#nest-loadNumber").css("display", "table");
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        $scope.getFile = function(e){
            if(!$scope.serviceLoadNumber) {
                $(".serviceLoadNumberInput").css("border-color","#FA787E");
                $scope.loadNumberFrom.serviceLoadNumber.$setDirty();
            }else{
                $(".serviceLoadNumberInput").css("border-color","#BDBDBD")
            }
            if(!$scope.loadNumberFrom.$valid) {
                return;
            }

            var result = orderNumberService.uploadInventoryData($scope.avatarFile,$scope.serviceLoadNumberUid);
            if(!result){
                $('input[type="file"]').val("");
                return false;
            }
            if(result.errorlocal){
                $('input[type="file"]').val("");
                orderNumberView.promptBox({isDelay:true, contentDelay:Lang.getValByKey("orderNumber", result.errorlocal), type: 'errer', manualClose:true});
            }else{
                result.then(function(res){
                    if(res.data.errorCode === 0){
                        $scope.canLoadNumber = false;
                        $scope.uploadNumbering = true;
                        $scope.errorNumber = res.data.data.errorNumber;
                        $scope.total = res.data.data.total;
                        $scope.successNumber = res.data.data.successNumber;
                        $scope.uploadResultTrue = res.data.data.success;
                        $scope.uploadResult = res.data.data.result;
                        res.data.data.result.length ? $scope.hasUploadResultData = true : $scope.hasUploadResultData = false;
                    }
                    else{
                        orderNumberView.promptBox({isDelay:true, contentDelay: res.data.msg , type: 'errer', manualClose:true});
                    }
                });
            }
            $scope.$apply();
        };

        //关闭导入单号
        $scope.closeLoadNumber = function() {
            $scope.serviceLoadNumber = "";
            $('input[type="file"]').val("");
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $scope.nestLoadNumber = false;
            $scope.uploadNumbering = false;
        };

        //确认导入单号
        $scope.saveLoadNumber = function() {
            if(!$scope.serviceLoadNumber) {
                $(".serviceLoadNumberInput").css("border-color","#FA787E");
                $scope.loadNumberFrom.serviceLoadNumber.$setDirty();
            }else{
                $(".serviceLoadNumberInput").css("border-color","#BDBDBD")
            }
            if (!$scope.loadNumberFrom.$valid) {
                return;
            }
            var config = {
                urlParams:$scope.uploadResultTrue,
                seatParams:{serviceUid:$scope.serviceLoadNumberUid}
            },tipContentData=Lang.getValByKey("orderNumber", 'orderNumber_content_gong');
            if($scope.errorNumber){
                tipContentData += $scope.total + Lang.getValByKey("orderNumber", 'orderNumber_content_bar') +
                    $scope.errorNumber + Lang.getValByKey("orderNumber", 'orderNumber_content_abr');
            }else{
                tipContentData += $scope.total + Lang.getValByKey("orderNumber", 'orderNumber_content_rab');
            }
            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip:tipContentData
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("orderNumber", 'orderNumber_button_ok'),
                    application:'',
                    operationEvent: function (){
                        orderNumberService.orderNumberInventoryLoadSave(config, function(data){
                            orderNumberView.promptBox('closePrompt');
                            if(data && data.errorCode === 0){
                                orderNumberView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                $scope.closeLoadNumber();
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
    }]);
});
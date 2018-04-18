easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/tab',
    "widget/select",
    'widget/parseUrl',
    'public/common/tableController.js',
    'public/common/pictureController.js',
    'public/common/areaController.js',
    'public/javascripts/fragment/supplier/supplierCtrl.js',
    'public/javascripts/fragment/selectTypes/selectTypesCtrl.js',
    'public/javascripts/fragment/selectTypes/selectTypesService.js'
], function () {
    app.controller('servicesApprovalCtrl', ['$scope', 'servicesApprovalService', 'servicesApprovalView', 'tableService', 'areaService', 'suppliersService', 'pictureService', 'selectTypesService',
        function($scope, servicesApprovalService, servicesApprovalView, tableService, areaService, suppliersService, pictureService, selectTypesService) {
        /**========================= 初始化数据 =========================**/
        $scope.tabIndex = $('#m-tab-index').tab({'callback': callbackTabInit});
        $scope.intertype = 'logistics';    //物流-供应商
        $scope.onlineStatusName = Lang.getValByKey("servicesApproval", 'servicesApproval_online_all');
        $scope.onlineStatusValue = 1;
        $scope.mainBlock = 'list';
    
        $scope.onlineStatusData = {
            data:[
                {id:'-2', name: Lang.getValByKey("servicesApproval", 'servicesApproval_online_all')},
                {id:'3', name: Lang.getValByKey("servicesApproval", 'servicesApproval_state_audit')},
                {id:'4', name: Lang.getValByKey("servicesApproval", 'servicesApproval_online_enable')},
                {id:'5', name: Lang.getValByKey("servicesApproval", 'servicesApproval_online_stop')}
            ]
        };
    
        $scope.tableUnCheckModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_name'),
                Lang.getValByKey("common", 'common_code_code'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_content'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_type'),
                // Lang.getValByKey("servicesApproval", 'servicesApproval_table_area'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_online_state')
            ],
            tableBody: [],
            restURL: 'logistics.getServicesList',
            restData: {
                q: '',
                status: 2,    //待审核2；
                orderby: 'submittime',
                pageIndex: 1,
                pageSize: 10
            },
            selectNumber: 0,
            selectFlag: false
        };
        $scope.tableCheckDoneModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_name'),
                Lang.getValByKey("common", 'common_code_code'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_content'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_table_type'),
                // Lang.getValByKey("servicesApproval", 'servicesApproval_table_area'),
                Lang.getValByKey("servicesApproval", 'servicesApproval_online_state')
            ],
            tableBody: [],
            restURL: 'logistics.getServicesList',
            restData: {
                q: '',
                status: -2,    //全部-2；已审核3；已启用4；已停用5；
                orderby: 'submittime',
                pageIndex: 1,
                pageSize: 10,
                asc: false
            },
            selectNumber: 0,
            selectFlag: false
        };
        /**========================= 初始化数据 End =========================**/
    
    
        /**========================= table数据加载 =================================**/
        $scope.index = 0;
        function callbackTabInit(index){
            $scope.index = index;
            if(index == 0){
                $scope.tableUnCheckModel.restData.status = 2;
                $scope.getTypeTable($scope.typeId, null, $scope.tableUnCheckModel);
            }
            if(index == 1){
                $scope.tableCheckDoneModel.restData.status = 3;
    
                $scope.onlineStatusValue = 3;
                $scope.onlineStatusName = Lang.getValByKey("servicesApproval", 'servicesApproval_state_audit');
                $scope.getTypeTable($scope.typeId, null, $scope.tableCheckDoneModel);
            }
            $scope.$apply();
        };
    
        /** 初始加载服务类型 */
        $scope.$on('$viewContentLoaded',function(){
            servicesApprovalService.getServiceTypes(function(response){
                if(response.errorCode == 0){
                    $scope.types = response.data;
                    $scope.typeId = -1;
    
                    $scope.getTypeTable($scope.typeId, null, $scope.tableUnCheckModel);
                }
            });
        });
        // function setScrollDetail(){
        //     $('.table-container tbody').slimscroll({
        //         height: $('.content-main').height() - 240
        //     });
        // };
        // $(window).on("resize",setScrollDetail);
    
        /** 服务list列表信息 */
        $scope.getTypeTable = function(id, $event, tableModel){
            if(!tableModel){
                if($scope.index == 0){
                    tableModel = $scope.tableUnCheckModel;
                }else{
                    tableModel = $scope.tableCheckDoneModel;
                }
            }
            if($event){
                $scope.seniorChecked = false;
                $scope.showSenior = false;
    
                $scope.tableUnCheckModel.restData.q = '';
                $scope.tableUnCheckModel.restData.pageIndex = 1;
    
                $scope.tableCheckDoneModel.restData.q = '';
                $scope.tableCheckDoneModel.restData.pageIndex = 1;
    
                $scope.qUnCheck = '';
                $scope.qCheckDone = '';
    
                $scope.onlineStatusValue = 3;
                $scope.onlineStatusName = Lang.getValByKey("servicesApproval", 'servicesApproval_state_audit');
                $scope.tableCheckDoneModel.restData.status = 3;
            }
    
            $scope.typeId = id;
    
            var params = {
                seatParams : {serviceTypeId : $scope.typeId},
                urlParams  : tableModel.restData
            };
    
            tableService.getTable(tableModel.restURL, params, function(data){
                if(data.errorCode == 0){
                    tableModel = tableService.table(tableModel, params, data);
    
                    tableReData(tableModel);
                }
            });
            // setScrollDetail();
        };
    
        /**
         * watch tableUnCheckModel的变化。
         */
        $scope.$watch('tableUnCheckModel',  function(newValue, oldValue) {
            if (newValue === oldValue) { return; }
            tableReData($scope.tableUnCheckModel);
        }, true);
        /**
         * watch tableUnCheckModel的变化。
         */
        $scope.$watch('tableCheckDoneModel',  function(newValue, oldValue) {
            if (newValue === oldValue) { return; }
            tableReData($scope.tableCheckDoneModel);
        }, true);
    
        function tableReData(tableModel){
            angular.forEach(tableModel.tableBody, function(value, key){
                if(value.areas && value.areas.length){
                    tableModel.tableBody[key].serviceArea = '';
                    for(var i=0,len=value.areas.length; i<len; i++){
                        if(tableModel.tableBody[key].serviceArea){
                            tableModel.tableBody[key].serviceArea += '，' + sliceLastNode(value.areas[i].name, '/');
                        }else{
                            tableModel.tableBody[key].serviceArea += sliceLastNode(value.areas[i].name, '/');
                        }
                    }
                }
            });
        }
    
        /** 选择等级下拉框 */
        function getSigleDataByName(name, data){
            var data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].name == name) {
                    return data[index];
                }
            }
        }
        $scope.initOnLineSelectList = function(){
            var data = $scope.onlineStatusData;
    
            selectFactory({
                data: data,
                id: "onlineSelect",
                defaultText: '',
                attrTextModel: function(name) {
                    var stateData;
                    if(!name) {
                        stateData = {};
                    } else {
                        stateData = getSigleDataByName(name, data);
                    }
                    if ($scope.onlineStatusName === name) return;
                    $scope.onlineStatusName = name;
                    $scope.onlineStatusValue = stateData.id;
    
                    $scope.tableCheckDoneModel.restData.status = $scope.onlineStatusValue;
                    $scope.tableCheckDoneModel.restData.pageIndex = 1;
                    $scope.getTypeTable($scope.typeId, null, $scope.tableCheckDoneModel);
                    $scope.$apply();
                }
            });
        };
    
        /** 检索待审核服务 */
        $scope.getUnCheckServiceLists = function(){
            $scope.tableUnCheckModel.restData.pageIndex = 1;
            $scope.qUnCheck = $scope.tableUnCheckModel.restData.q;
            $scope.getTypeTable($scope.typeId, null, $scope.tableUnCheckModel);
        };
    
        /** 检索已审核服务 */
        $scope.getCheckDoneServiceLists = function(){
            $scope.tableCheckDoneModel.restData.pageIndex = 1;
            $scope.qCheckDone = $scope.tableCheckDoneModel.restData.q;
            $scope.getTypeTable($scope.typeId, null, $scope.tableCheckDoneModel);
        };
    
        /**========================== table数据加载 End =============================**/
    
        /** 获取待审核服务详情 */
        $scope.editUnCheckServiceDetail = function(id){
            $scope.serviceTitle = Lang.getValByKey("servicesApproval", 'servicesApproval_title_detail');
            $scope.isAudit = true;    //打回草稿或审核服务。
            $scope.validateCodeError = false;
            $scope.mainBlock = 'detail';
            $scope.detailTabIndex.selected(0);
            $scope.visible = true;
            $scope.isVisible = false;
    
            $scope.showAuthor = true;
    
            $scope.serviceId = id;
            $scope.serviceSpanInfo(id);
    
            //清除angular表单脏值检测
            $scope.serviceForm.$setPristine();
            $scope.serviceForm.$setUntouched();
            //清理审核意见表单
            $scope.auditSubmitStatus = false;
            $scope.auditStatus = $scope.auditRemark = '';
            $scope.auditForm.$setPristine();
            $scope.auditForm.$setUntouched();
    
            setTimeout(function(){
                $('.from-box').scrollTop(0);
            },10);
        };
        $scope.serviceSpanInfo = function(id){
            var config = {
                seatParams : {uid : id},
            }
            servicesApprovalService.getServiceById(config, function(res){
                console.log(res.data.status);
                // test
                if(res.errorCode == 0){
                    if (res.data.status === 3) {
                        if(res.data.statusName === '已停用'){
                            $scope.showEdit = true;
                        }else{
                            $scope.showEdit = false;
                        }
                        if (typeof res.data.isOnline === 'boolean') {
                            $scope.isOffline = !res.data.isOnline;
                        } else {
                            $scope.isOffline = false;
                        }
                    }else {
                        $scope.isOffline = false;
                    }
                    
                    // 服务的id
                    $scope.currentServicesId = res.data.id;
                    $scope.currentServicesStatus = res.data.status;

                    $scope.serviceData = res.data;
                    $scope.name =  $scope.serviceData.name;
                    $scope.code =  $scope.serviceData.code;
                    $scope.serviceTypeName = $scope.serviceData.serviceTypeName;
                    $scope.serviceTypeIds = $scope.serviceData.serviceTypeCodes;
                    $scope.subServiceTypeCode = $scope.serviceData.subServiceTypeCode;
                    switch ($scope.serviceData.subServiceTypeCode) {
                        case 'MAINLINESHIP':
                            $scope.subServiceTypeName = '海运';
                            break;
                        case 'MAINLINEAIR':
                            $scope.subServiceTypeName = '空运';
                            break;
                        case 'MAINLINEOTHER':
                            $scope.subServiceTypeName = '其他';
                            break;
                        default:
                            break;
                    }
                    $scope.lineName = $scope.serviceData.lineName ? $scope.serviceData.lineName + '(' + $scope.serviceData.lineCode + ')' : '';
                    $scope.lineId = $scope.serviceData.lineId;
                    $scope.className = $scope.serviceData.className;
                    $scope.classIds = $scope.serviceData.classId;
                    $scope.serviceContent = $scope.serviceData.serviceContent;
                    $scope.supplierName = $scope.serviceData.supplierName;
                    $scope.supplierId = $scope.serviceData.supplierId;
                    $scope.description = $scope.serviceData.description;
                    $scope.userName = $scope.serviceData.userName;
                    $scope.createTime = $scope.serviceData.createTime;
                    $scope.estimatedTime = $scope.serviceData.estimatedTime;
                    $scope.estimatedUnitValue = $scope.serviceData.estimatedUnitName;
                    $scope.weightLimitMin = $scope.serviceData.weightLimitMin;
                    $scope.weightLimitMax = $scope.serviceData.weightLimitMax;
                    $scope.weightLimitUnitCode = $scope.serviceData.weightLimitUnitCode;
                    $scope.getFlightsData($scope.lineId, false);
                    
                    //国家地区
                    /** 国家地区id集 */
                    $scope.choosedData = [];
                    var map = {};
                    angular.forEach($scope.serviceData.areas, function(value, key){
                        map = {
                            'figureCode': value.figureCode,
                            'name': value.name.split('/')[value.name.split('/').length - 1]
                        };
                        $scope.choosedData.push(map);
                    });
    
                    /** 国家地区名称显示 */
                    var inputStr = '';
                    angular.forEach($scope.choosedData, function(value, key){
                        inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                    });
    
                    inputStr ? inputStr = inputStr.slice(1) : '';
                    $scope.regionZone = inputStr;
                    //货物类型
                    $scope.listGoodsTypeIds = $scope.serviceData.cargoTypes;
                    $scope.goodsTypeIdsInfo = $scope.serviceData.cargoTypeName;
                }
            });
        };
    
        // 初始化干线类型
        $scope.initLineType = function () {
            var data = {
                data: [{ id: 1, code: 'MAINLINESHIP', name: '海运' }, { id: 2, code: 'MAINLINEAIR', name: '空运' }, { id: 3, code: 'MAINLINEOTHER', name: '其他' }],
            };
            selectFactory({
                data: data,
                defaultText: '',
                id: 'initLineType',
                attrTextField: {
                    'ng-value': 'code',
                },
                attrTextId: function (code) {
                    $scope.subServiceTypeCode = code;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.subServiceTypeName = name;
                    $scope.$apply();
                },
            }).open();
        }
        // 初始化航线数据
        $scope.initLineIds = function () {
            selectFactory({
                data: [],
                id: 'lineId',
                defaultText: '请选择',
                showTextField: 'nameCode',
                isSearch: true,
                closeLocalSearch: true,
                searchPlaceHoder: '请输入航线名称或编码',
                pagination: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    servicesApprovalService.getLines({ subServiceTypeCode: $scope.subServiceTypeCode, params: { q: data, pageIndex: currentPage || 1 } }, function (res) {
                        res.data.forEach(function(item) {
                            item.nameCode = item.name + '(' + item.code + ')';
                        });
                        attachEvent.setData(res);
                    });
                },
                attrTextField: {
                    'ng-value': 'id',
                },
                attrTextModel: function (nameCode) {
                    $scope.lineName = nameCode;
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    if (!id) {
                        $scope.flightTable.tableBody = [];
                        $scope.lineId = '0';
                        $scope.$apply();
                        return;
                    }
                    $scope.lineId = id;
                    $scope.getFlightsData(id, true);
                    $scope.$apply();
                },
            }).open();
        }
        // 初始化航班表格数据
        $scope.flightTable = {
            tableHeader: [Lang.getValByKey('common', 'common_thead_number'), '航班号', '承运公司', '出发时间', '到达时间'],
            tableBody: [],
            // restURL: '',
            // restData: { lineId: $scope.lineId },
            selectNumber: 0,
            selectFlag: false,
        };
        // 根据航线id获取航班/港口
        $scope.getFlightsData = function (id, showChecked) {
            if (!id || id === 0) {
                $scope.flightTable.tableBody = [];
                return;
            }
            var params = { urlParams: { lineId: id, pageSize: 1000 } };
            var url = $scope.subServiceTypeCode === 'MAINLINESHIP' ? 'logistics.getShipFlights' : 'logistics.getAirFlights'
            tableService.getTable(url, params, function (res) {
                if (res.errorCode === 0) {
                    var resData = angular.copy(res);
                    var data = [];
                    if (!showChecked) {
                        if ($scope.serviceData.classId && $scope.serviceData.classId.length) {
                            for (var i = 0, iLen = $scope.serviceData.classId.length; i < iLen; i += 1) {
                                for (var j = 0, jLen = resData.data.length; j < jLen; j += 1) {
                                    if ($scope.serviceData.classId[i] === resData.data[j].id) {
                                        data.push(resData.data[j]);
                                    }
                                }
                            }
                        }
                        resData.data = data;
                    }
                    $scope.flightTable = tableService.table($scope.flightTable, params, resData);
                    if (showChecked) {
                        if ($scope.serviceData.classId && $scope.serviceData.classId.length) {
                            for (var i = 0, iLen = $scope.serviceData.classId.length; i < iLen; i += 1) {
                                for (var j = 0, jLen = $scope.flightTable.tableBody.length; j < jLen; j += 1) {
                                    if ($scope.serviceData.classId[i] === $scope.flightTable.tableBody[j].id) {
                                        $scope.flightTable.tableBody[j].checkbox = true;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        };
        // 提交航线航班数据
        $scope.submitFlights = function () {
            var selectArr = tableService.getSelectTable($scope.flightTable.tableBody);
            if ($scope.lineName && !selectArr.length) {
                $(document).promptBox({isDelay: true, contentDelay: '请至少选择一个航班！', type: 'errer', manualClose: true,});
                return;
            }
            $scope.flightTable.tableBody = JSON.parse(JSON.stringify(selectArr));
            $scope.classIds = selectArr.map(function (item) { return item.id });

            var config = {
                seatParams: {
                    uid: $scope.serviceId
                },
                urlParams: {
                    lineId: $scope.lineId,
                    classIds: $scope.classIds
                }
            };
            servicesApprovalService.submitFlights(config, function (res) {
                if (res.errorCode === 0) {
                    $scope.setGrey = false;
                    $scope.isVisibleDraft = true;
                    $scope.isVisible = false;
                    $scope.isVisibleEdit = true;
                    $scope.visible = true;

                    $scope.serviceId = res.data;
                    $scope.serviceSpanInfo(res.data);
                    // 清除angular表单脏值检测
                    $scope.mainlineForm.$setPristine();
                    $scope.mainlineForm.$setUntouched();
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.msg,
                        type: 'success',
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.msg,
                        type: 'errer',
                        manualClose: true,
                    });
                }
            });
        }

        /** 返回待审核列表 */
        $scope.goBack = function(){
            $scope.mainBlock = 'list';
            $scope.getTypeTable($scope.typeId);
        };
    
        /** 编辑待审核服务详情 */
        $scope.editService = function(){
            //清除angular表单脏值检测
            $scope.serviceForm.$setPristine();
            $scope.serviceForm.$setUntouched();
    
            $scope.validateCodeError = false;
            $scope.visible = false;
            $scope.isVisible = true;
    
            var config = {
                seatParams : {uid : $scope.serviceId},
            }
            servicesApprovalService.getServiceById(config, function(res){
                if(res.errorCode == 0){
                    $scope.serviceData = res.data;
    
                    $scope.nameInfo =  $scope.serviceData.name;
                    $scope.codeInfo =  $scope.serviceData.code;
                    $scope.serviceTypeName = $scope.serviceData.serviceTypeName;
                    $scope.serviceTypeIds = $scope.serviceData.serviceTypeCodes;
                    $scope.serviceContentInfo = $.trim($scope.serviceData.serviceContent);
                    $scope.supplierName = $scope.serviceData.supplierName;
                    $scope.supplierId = $scope.serviceData.supplierId;
                    $scope.descriptionInfo = $.trim($scope.serviceData.description);
                    $scope.getFlightsData($scope.lineId, true);
                    //国家地区
                    /** 国家地区id集 */
                    $scope.choosedData = [];
                    var map = {};
                    angular.forEach($scope.serviceData.areas, function(value, key){
                        map = {
                            'figureCode': value.figureCode,
                            'name': value.name.split('/')[value.name.split('/').length - 1]
                        };
                        $scope.choosedData.push(map);
                    });
    
                    /** 国家地区名称显示 */
                    var inputStr = '';
                    angular.forEach($scope.choosedData, function(value, key){
                        inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                    });
    
                    inputStr ? inputStr = inputStr.slice(1) : '';
                    $scope.regionZone = inputStr;
    
                    //货物类型
                    $scope.listGoodsTypeIds = $scope.serviceData.cargoTypes;
                    $scope.goodsTypeIdsInfo = $scope.serviceData.cargoTypeName;
                }
            });
        };
        
        /** 取消待审核服务详情 */
        $scope.cancelService = function(){
            $scope.visible = true;
            $scope.isVisible = false;
    
            $scope.serviceSpanInfo($scope.serviceId);
        };
    
        /**================= 国家地区弹框调用事件 =================*/
        /** 选择服务范围 */
        $scope.selectRegion = function(){
            $scope.initCtrl();
            $(document).promptBox({
                title: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_title_area'),
                isHidden:true,
                boxWidth:true,
                isNest:true,
                loadData : function(){
                    $scope.loadRegionData();
                },
                content: {
                    nest: $('#serviceZone')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_prompt_confirm'),
                        operationEvent: function(){
                            $(document).promptBox('closeFormPrompt');
                            /** 国家地区名称显示 */
                            var inputStr = '';
                            angular.forEach($scope.areaModel.selectedData, function(value, key){
                                inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1] ;
                            });
    
                            inputStr ? inputStr = inputStr.slice(1) : '';
                            $scope.regionZone = inputStr;
    
                            /** 国家地区id集 */
                            $scope.choosedData = [];
                            var map = {};
                            angular.forEach($scope.areaModel.selectedData, function(value, key){
                                map = {
                                    'figureCode': value.interId,
                                    'name': value.name.split('/')[value.name.split('/').length - 1]
                                };
                                $scope.choosedData.push(map);
                            });
    
                            $scope.$apply();
                        }
                    }
                ]
            });
        };
        /** 初始化areaModel */
        var areaModel = {
            unSelectedData: [],
            selectedData: [],
            candidateFlag: false,
            selectedFlag: false
        }
        /** loadData */
        $scope.loadRegionData = function(){
            areaModel.unSelectedData = servicesApprovalService.getCountry().data;
            areaModel.selectedData = $scope.choosedData;
            $scope.tab.toggle(0);
            $scope.areaModel = areaService.initArea(areaModel);
        };
        /**================= 国家地区弹框调用事件 end =================*/
    
        /** ================添加货物类型============= */
        $scope.selectGoodTypes = function(){
            $(document).promptBox({
                isHidden:true,
                title: Lang.getValByKey("servicesApproval", 'servicesApproval_placeholder_goods_type'),
                isNest:true,
                loadData : function(){
                    loadGoodsTypeData();
                },
                content: {
                    nest: $('#getUnGoodTypes')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_prompt_confirm'),
                        operationEvent: function(){
                            submitGoodsTypes();
                        }
                    }
                ]
            });
        };
    
        $scope.selectTypesModel = {
            selectedGoods : [],
            listGoodsTypes : $scope.listGoodsTypes
        }
    
        function loadGoodsTypeData(){
            $scope.selectTypesModel.selectedGoods = [];
            servicesApprovalService.getGoodTypes(function(response){
                if(response.errorCode == 0){
                    var sid = $scope.listGoodsTypeIds;
    
                    for(var i in response.data){
                        response.data[i].id = response.data[i].code;
                        response.data[i].checked = false;
                        for(var j in sid){
                            if(response.data[i].id == sid[j]){
                                response.data[i].checked = true;
                            }
                        }
                    };
    
                    var typeData = [];
                    for(var i in response.data){
                        if(response.data[i].name){
                            typeData.push(response.data[i])
                        }
                    };
                    $scope.selectTypesModel.listGoodsTypes = typeData;
                    $scope.selectTypesModel = selectTypesService.init($scope.selectTypesModel);
                }
            });
        };
    
        function submitGoodsTypes(){
            var types = $('#getUnGoodTypes input.active'),
                arr = [],
                arrName = '';
            types.each(function(i){
                arr.push(types.eq(i).data('id'));
                if(i == types.length-1){
                    arrName += types.eq(i).parent().data('name');
                }else{
                    arrName += types.eq(i).parent().data('name')+'，';
                };
            });
    
            $scope.goodsTypeIdsInfo = arrName;
            $scope.listGoodsTypeIds = arr;
    
            $(document).promptBox('closeFormPrompt');
            $scope.$apply();
        };
        /** ================添加货物类型 end============= */
    
        /** 检索供应商 */
        function clearNextAddress(currentEle) {
            var nextEle = currentEle.next;
            if(nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNextAddress(nextEle);
        }
        function getSigleDataByName(name, data) {
            var data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].name == name) {
                    return data[index];
                }
            }
        }
        $scope.initSelectList = function(){
            var data,
                supplierEle;
    
            var countryConfig = {
                urlParams: {
                    q: $scope.countryName
                },
                isAsync: true
            };
    
            /** 获取供应商数据 */
            data = servicesApprovalService.retrievalSupplier(countryConfig);
    
            var listData = [],arr = [],supData = [];
            var arrData = data.data;
            for(var i in arrData){
                arr[i] = {};
                arr[i].id = arrData[i].id
                arr[i].name = arrData[i].name + '，' + arrData[i].code;
                listData.push(arr[i]);
            }
            supData.data = listData;
    
            supplierEle = selectFactory({
                data: supData,
                id: "supplier",
                isSearch: true,
                isUsePinyin: true,
                attrTextModel: function(name, data) {
                    var supplierData;
                    if(!name) {
                        supplierData = {};
                    } else {
                        supplierData = getSigleDataByName(name, data);
                    }
    
                    $scope.supplierId  = supplierData.id;
                    if(!supplierData.name){
                        $scope.supplierName = '';
                    }else{
                        $scope.supplierName = supplierData.name.split('，')[0];
                    };
                    $("#supplier").val($scope.supplierName);
                    $scope.$apply();
                    clearNextAddress(supplierEle);
                }
            });
        };
    
        /** 选择服务类型 */
        $scope.selectServiceTypes = function(){
            var data,
                typesEle;
    
            /** 检索国家事件 */
            data = servicesApprovalService.getServicesTypeList();
            data.data.splice(0,1)
    
            typesEle = selectFactory({
                data: data,
                id: "serviceType",
                isUsePinyin: true,
                attrTextModel: function(name, data) {
                    var typesData;
                    if(!name) {
                        typesData = {};
                    } else {
                        typesData = getSigleDataByName(name, data);
                    }
    
                    $scope.serviceTypeIds  = [typesData.code];
                    $scope.serviceTypeName = typesData.name;
                    $scope.subServiceTypeCode = 'MAINLINESHIP';
                    $scope.subServiceTypeName = '海运';
                    $scope.$apply();
                    clearNextAddress(typesEle);
                }
            });
        };
    
        /** 服务内容去掉空格 */
        $scope.removeSpace = function(){
            if($.trim($scope.serviceContentInfo).length){
                return true;
            }else{
                $scope.serviceContentInfo = $.trim($scope.serviceContentInfo);
            };
        };
    
        /** 修改保存服务 */
        $scope.submitService = function(){
            if(!$scope.nameInfo){
                $scope.serviceForm.nameInfo.$setDirty();
            }
            if(!$scope.codeInfo){
                $scope.serviceForm.codeInfo.$setDirty();
            }
            if(!$scope.serviceTypeName){
                $scope.serviceForm.serviceTypeName.$setDirty();
            }
            if ($scope.serviceTypeIds.indexOf('ST004') !== -1 && !$scope.subServiceTypeName) {
                $scope.serviceForm.subServiceTypeName.$setDirty();
            }
            if ($scope.estimatedTime && !$scope.estimatedUnitValue) {
                $scope.serviceForm.estimatedTime.$setDirty();
            }
            if(!$scope.serviceContentInfo){
                $scope.serviceForm.serviceContentInfo.$setDirty();
            }
            if(!$scope.goodsTypeIdsInfo){
                $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
            }
            if(!$scope.goodsTypeIdsInfo){
                $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
            }
            if(!$scope.supplierName){
                $scope.serviceForm.supplierName.$setDirty();
            }

            var config = {
                seatParams: {uid: $scope.serviceId},
                urlParams : {
                    name: $scope.nameInfo,
                    code: $scope.codeInfo,
                    serviceTypeCodes: $scope.serviceTypeIds,
                    subServiceTypeCode: $scope.subServiceTypeCode,
                    serviceContent: $.trim($scope.serviceContentInfo),
                    areas: [],
                    cargoTypes: $scope.listGoodsTypeIds,
                    supplierId: $scope.supplierId,
                    estimatedTime: $scope.estimatedTime,
                    estimatedUnit: $scope.estimatedUnit,
                    weightLimitMin: $scope.weightLimitMin,
                    weightLimitMax: $scope.weightLimitMax,
                    weightLimitUnitCode: $scope.weightLimitUnitCode,
                    description: $.trim($scope.descriptionInfo)
                }
            };
    
            var map = {};
            angular.forEach($scope.choosedData, function(value, key){
                map = {
                    "figureCode": value.figureCode,
                    "name": value.name
                };
                config.urlParams.areas.push(map);
            });
    
            if($scope.validateCodeError == true){
                return false;
            };
    
            if(!$scope.serviceForm.$valid){
                return false;
            }
            servicesApprovalService.editServicesApproval(config, function(res){
                if(res.errorCode == 0){
                    $scope.isVisibleDraft = true;
                    $scope.isVisible = false;
                    $scope.visible = true;
    
                    $scope.serviceId = res.data;
                    $scope.serviceSpanInfo(res.data);
    
                    //清除angular表单脏值检测
                    $scope.serviceForm.$setPristine();
                    $scope.serviceForm.$setUntouched();
                    $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                }
            });
        };
    
        /** 供应商详情 */
        $scope.supplierModel = {
            supplierData: []
        };
        $scope.pictureModel = {
            'edit': true,    //是否编辑状态
            'uploadShow': false,    //是否显示上传按钮图标
            'picture': [],  //图片存放地址
            accept:'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
        };
        $scope.getUnCheckSupplier = function(supplierId){
    
            $scope.tabs.selected(0);
            $scope.mainBlock = 'suppler';
    
            var config = {
                seatParams:{
                    sid : supplierId,
                    intertype: $scope.intertype
                }
            };
            servicesApprovalService.getSupplierById(config, function(res){
                if(res.errorCode == 0){
                    $scope.supplierModel.supplierData = res.data;
                    //组装类型
                    var str = '';
                    angular.forEach($scope.supplierModel.supplierData.serviceTypes, function(value, key){
                        if(key == $scope.supplierModel.supplierData.serviceTypes.length - 1){
                            str += value.supplierTypeName
                        }else{
                            str += value.supplierTypeName + ','
                        }
                    });
                    $scope.supplierModel.supplierData.serviceTypes = str;
                    //组装评价等级
                    $('#stars').rating('update', parseInt($scope.supplierModel.supplierData.rank));
                    $('#stars').rating('refresh',
                        {min: 0,
                            max: 5,
                            step: 1,
                            size: 'xs',
                            animate: true,
                            displayOnly: true,
                            showClear: false,
                            showCaption: false
                        });
                    //组装营业执照
                    $scope.pictureModel.picture = pictureEdit($scope.supplierModel.supplierData.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
    
                    $scope.supplierModel = suppliersService.initSupplier($scope.supplierModel);
                };
            });
        };
        /** 编辑素有营业执照id数组 */
        function pictureEdit(picture){
            var length = picture ? picture.length : 0;
            var map = {}, ret = [];
            for(var i=0; i<length; i++){
                map = {
                    'picUrlID': picture[i],
                    'delshow': false
                }
                ret.push(map);
            }
            return ret;
        };
    
        /** 返回服务 */
        $scope.goSupplerBack = function(){
            $scope.mainBlock = 'detail';
        };
    
        $scope.submitCheckedService = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].uid);
            };
    
            var config = {urlParams: arr};
            servicesApprovalService.examineServices(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');
                    $scope.getTypeTable($scope.typeId);
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };
        /** 单个审核服务通过 */
        $scope.goCheckService = function(){
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_check_enable')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function (){
                            var config = {urlParams: [$scope.serviceId]};
                            servicesApprovalService.examineServices(config, function(response){
                                if(response.errorCode == 0){
                                    $scope.mainBlock = 'list';
                                    $(document).promptBox('closePrompt');
                                    $scope.getTypeTable($scope.typeId);
                                    $scope.$apply();
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                }else{
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                }
                            });
                        }
                    }
                ]
            });
        };
    
        $scope.submitCheckToDraft = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].uid);
            };
    
            var config = {urlParams: arr};
            servicesApprovalService.toDraftServices(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');
                    $scope.getTypeTable($scope.typeId);
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };
        /** 单个打回草稿 */
        $scope.backDraft = function(){
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_draft_tip')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function (){
                            var config = {urlParams: [$scope.serviceId]};
                            servicesApprovalService.toDraftServices(config, function(response){
                                if(response.errorCode == 0){
                                    $scope.mainBlock = 'list';
                                    $(document).promptBox('closePrompt');
                                    $scope.getTypeTable($scope.typeId);
                                    $scope.$apply();
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                }else{
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                }
                            });
                        }
                    }
                ]
            });
        };
    
        $scope.submitCheckedDoneService = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].uid);
            };
    
            var config = {urlParams: arr};
            servicesApprovalService.enableServices(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');
                    $scope.getTypeTable($scope.typeId);
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };
        /** 单个启用服务 */
        $scope.toEnableSingleServices = function(){
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_check_tip')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function (){
                            var config = {urlParams: [$scope.serviceId]};
                            servicesApprovalService.enableServices(config, function(response){
                                if(response.errorCode == 0){
                                    $scope.mainBlock = 'list';
                                    $(document).promptBox('closePrompt');
                                    $scope.getTypeTable($scope.typeId);
                                    $scope.$apply();
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                }else{
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                }
                            });
                        }
                    }
                ]
            });
        };
    
        $scope.submitUnCheckedDoneService = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].uid);
            };
    
            var config = {urlParams: arr};
            servicesApprovalService.unEnableServices(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');
                    $scope.getTypeTable($scope.typeId);
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };
        /** 单个停用服务 */
        /*$scope.toUnEnableSingleServices = function(){
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_check_stop')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function (){
                            var config = {urlParams: [$scope.serviceId]};
                            servicesApprovalService.unEnableServices(config, function(response){
                                if(response.errorCode == 0){
                                    $scope.mainBlock = 'list';
                                    $(document).promptBox('closePrompt');
                                    $scope.getTypeTable($scope.typeId);
                                    $scope.$apply();
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                }else{
                                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                }
                            });
                        }
                    }
                ]
            });
        };*/
    
        /** 审核通过详情 */
        $scope.editUnCheckedDetail = function(id){
            $scope.serviceTitle = Lang.getValByKey("servicesApproval", 'servicesApproval_title_detail');
            $scope.isAudit = false;
            $scope.validateCodeError = false;
            $scope.mainBlock = 'detail';
            $scope.detailTabIndex.selected(0);
            $scope.visible = true;
            $scope.isVisible = false;
    
            $scope.serviceId = id;
            $scope.serviceSpanInfo(id);
            if($scope.serviceData.isOnline){
                $scope.enableName = '停用';
                $scope.enableValue = false;
            }else{
                $scope.enableName = '启用';
                $scope.enableValue = true;
            }
    
            //清除angular表单脏值检测
            $scope.serviceForm.$setPristine();
            $scope.serviceForm.$setUntouched();
            setTimeout(function(){
                $('.from-box').scrollTop(0);
            },10);
        };
    
        /** 异步校验编码 */
        $scope.validateCode = function(){
            if(!$scope.codeInfo) return;
            var id;
            if($scope.isVisibleDraft == false){
                id = '';
            }else{
                id = $scope.serviceId;
            }
    
            var config = {
                urlParams:{
                    code: $scope.codeInfo,
                    uid: id
                }
            };
            servicesApprovalService.validateServiceCode(config, function(response){
                if(response.errorCode == 0){
                    $scope.validateCodeError = false;
                }else{
                    $scope.validateCodeError = true;
                }
            });
        };
        $scope.removeValidateCode = function(){
            $scope.validateCodeError = false;
        };
    
        /**
         * 提交审核审核
         */
        $scope.submitAudit = function(){
            $scope.auditSubmitStatus = true;
            if(!$scope.auditRemark){
                $scope.auditForm.auditRemark.$setDirty();
            }
            if(!$scope.auditForm.$valid){
                return;
            }
            var config = {
                'urlParams':{
                    'msg':$scope.auditRemark
                },
                'seatParams':{
                    'uid':$scope.serviceId
                }
            };
            if($scope.auditStatus == 1){    //打回草稿
                servicesApprovalService.draftService(config, function(res){
                    if(res.errorCode === 0){
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
    
                        setTimeout(function(){$scope.mainBlock = 'list'; $scope.getTypeTable($scope.typeId);$scope.$apply();}, 1500);
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }else if($scope.auditStatus == 2){    //审核通过
                servicesApprovalService.auditService(config, function(res){
                    if(res.errorCode === 0){
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
    
                        setTimeout(function(){$scope.mainBlock = 'list'; $scope.getTypeTable($scope.typeId);$scope.$apply();}, 1500);
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }
        };
    
        $scope.enabled = function(flag){
            if(flag == true){    //启用
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_check_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function (){
                                var config = {urlParams: [$scope.serviceId]};
                                servicesApprovalService.enableServices(config, function(response){
                                    if(response.errorCode == 0){
                                        $scope.enableName = Lang.getValByKey("servicesApproval", "servicesApproval_btn_stop");
                                        $scope.enableValue = false;
                                        $scope.$apply();
                                        $(document).promptBox('closePrompt');
                                        setTimeout(function(){$scope.mainBlock = 'list'; $scope.getTypeTable($scope.typeId);$scope.$apply();}, 1500);
                                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                    }else{
                                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                    }
                                });
                            }
                        }
                    ]
                });
            }else{    //停用
              $(document).promptBox({
                  title: Lang.getValByKey("common", 'common_prompt_title'),
                  type: 'success',
                  content: {
                      tip: Lang.getValByKey("servicesApproval", 'servicesApproval_prompt_check_stopNormal')
                  },
                  operation: [
                      {
                          type: 'submit',
                          description: Lang.getValByKey("common", 'common_pagination_confirm'),
                          operationEvent: function (){
                              var config = {
                                  'urlParams': [$scope.serviceId],
                                  'seatParams':{'isconfirmed':false}
                              };
                              servicesApprovalService.unEnableServices(config, function(response){
                                  if(response.errorCode == 0){
                                      $scope.enableName = Lang.getValByKey("servicesApproval", "servicesApproval_btn_enable");
                                      $scope.enableValue = true;
                                      $scope.$apply();
                                      $(document).promptBox('closePrompt');
                                      setTimeout(function(){$scope.mainBlock = 'list'; $scope.getTypeTable($scope.typeId);$scope.$apply();}, 1500);
                                      $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                  }else if(response.errorCode == 206006){
                                    $(document).promptBox({
                                        title: Lang.getValByKey("common", 'common_prompt_title'),
                                        type: 'success',
                                        content: {
                                            tip: response.msg
                                        },
                                        operation: [
                                            {
                                                type: 'submit',
                                                description: Lang.getValByKey("common", 'common_pagination_confirm'),
                                                operationEvent: function (){
                                                    $(document).promptBox('closePrompt');
    
                                                    var config = {
                                                        'urlParams':[$scope.serviceId],
                                                        'seatParams': {'isconfirmed':true}
                                                    };
                                                    servicesApprovalService.unEnableServices(config, function(res){
                                                      if(res.errorCode == 0){
                                                          $scope.enableName = Lang.getValByKey("servicesApproval", "servicesApproval_btn_enable");
                                                          $scope.enableValue = true;
                                                          $scope.$apply();
                                                          $(document).promptBox('closePrompt');
                                                          $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                                                      }else{
                                                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                                                      }
                                                    });
                                                }
                                            }
                                        ]
                                    });
                                  }else{
                                      $(document).promptBox('closePrompt');
                                      $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                  }
                              });
                          }
                      }
                  ]
              });
            }
        };
    
        /**
         * 查看流转过程
         */
        $scope.showFlowProcess = function(uid, name){
            if(!uid){ return ; }
    
            $scope.mainBlock = 'process';
            $scope.processTitle = name;
    
            var config = {
                'seatParams':{
                    'uid':uid
                }
            };
            servicesApprovalService.getServiceProcess(config, function(res){
                if(res.errorCode === 0){
                    $scope.streamList = res.data;
                }
            });
        };
    
        function sliceLastNode(str, separator){
            if(!str || !separator){ return ''; }
    
            var index = str.lastIndexOf(separator);
            if(index != -1){
                str = str.slice(index+1);
            }
            return str;
        }
        /**
         * 服务审核详情tab by jinxyang
         */
    
        $scope.detailTabIndex = $('#detail-tab').tab({"callback": callbackDetailTabInit});
    
        // 判断标签页, 获取服务范围
        function callbackDetailTabInit(index) {
            if(index === 1){
                //获取计重规则信息
                $scope.getWeightRule($scope.currentServicesId);
                $scope.initSelect();
            }
            if (index === 2) getServiceRange();
            $scope.serviceSpanInfo($scope.serviceId);
            $scope.visible = true;
            $scope.isVisible = false;
            try{
                $scope.$apply();
            }catch(e){
                console.log('$apply() is error');
            }
        }
        $scope.getWeightRule = function(id){
            var config = {
                seatParams: {id: id},
            };
            servicesApprovalService.getServiceWeightRule(config,function(res){
                if(res.errorCode === 0){
                    res.data = res.data ? res.data : {};
                    $scope.isVolume = res.data.isVolume ? 'true' : 'false';
                    $scope.isremarkVolume = res.data.isVolume ? "是" : "否";
                    $scope.showVolumeDetail = res.data.isVolume ? true : false;
                    $scope.volumeFactor = res.data.volumeFactor;
                    $scope.weightValueTye = res.data.weightValueTye;
                    
                    if(res.data.weightValueTye === 'max'){
                        $scope.weightValueName = "实重和体积重取最大";
                    }else if(res.data.weightValueTye === 'min'){
                        $scope.weightValueName = "实重和体积重取最小";
                    }else {
                        $scope.weightValueName = "";
                    }
                }
                
            });
            $scope.isEdit = false;
        };
        //编辑计重规则（已停用状态）
        $scope.editWeightRule = function(){
            $scope.isEdit = true;
        };
        $scope.initSelect = function() {
            var data = servicesApprovalService.getWeightValueMode();
            var weightValueMode = selectFactory({
                data: data,
                id: 'type-select-input',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                attrTextModel: function (name, data, currentItem) {
                    if (!name) {
                        $scope.weightValueTye = '';
                        $scope.weightValueName = '';
                    } else {
                        $scope.weightValueTye = currentItem.code; // 给后台
                        $scope.weightValueName = name;
                        $scope.ruleForm.valueMode.$setPristine();
                    }

                    $scope.$apply();
                },
            });
        };
        $scope.SetIsConsiderVolume = function () {
            if ($scope.isVolume == 'false') {
                $scope.isremarkVolume = "否";
                $scope.showVolumeDetail = false;
                $scope.volumeFactor = '';
                $scope.weightValueTye = '';
                
            } else {
                $scope.isremarkVolume = "是";
                $scope.showVolumeDetail = true;
                $scope.volumeFactor = '';
                $scope.weightValueTye = 'max';
                $scope.weightValueName = '实重和体积重取最大';
                
                //     $scope.data.valueModeCode = 'max';
                // if($scope.dataOld.valueModeCode){
                //     $scope.data.valueMode = $scope.dataOld.valueMode;
                //     $scope.data.valueModeCode = $scope.dataOld.valueModeCode;
                // }else {
                //     $scope.data.valueMode = '实重和体积重取最大';
                //     $scope.data.valueModeCode = 'max';
                // }
                // $scope.data.volumeFactor = $scope.dataOld.volumeFactor;
            }
            $scope.ruleForm.$setPristine();
        };
        
        $scope.cancelWeight = function(){
            $scope.ruleForm.$setPristine();
            $scope.ruleForm.$setUntouched();
            $scope.isEdit = false;
            $scope.getWeightRule($scope.currentServicesId);
        }
        //提交修改的计重规则
        $scope.submitWeight = function(){
            if ($scope.isVolume === 'true' && !$scope.ruleForm.$valid) {
                if (!$scope.volumeFactor) {
                    $scope.ruleForm.volumeFactor.$setDirty();
                }
                if (!$scope.valueMode) {
                    $scope.ruleForm.valueMode.$setDirty();
                }
                return;
            }
            var isVolume,volumeFactor;
            if($scope.isVolume === 'true'){
                isVolume = true;
            }else{
                isVolume = false;
            }
            if($scope.volumeFactor){
                volumeFactor = Number($scope.volumeFactor)
            }else{
                volumeFactor = '';
            }
            var config = {
                seatParams: {uid: $scope.serviceId},
                urlParams: {
                    isVolume: isVolume,
                    volumeFactor: volumeFactor,
                    weightValueTye: $scope.weightValueTye
                }
            };
            servicesApprovalService.serviceWeightRule(config,function(res){
                if (res.errorCode != 0) {
                    // 服务器异常
                    $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                } else {
                    $scope.isVisible = false;
                    $scope.isVisibleEdit = true;
                    $scope.visible = true;
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.msg,
                        type: 'success',
                        time: 3000
                    });
                    $scope.getWeightRule($scope.currentServicesId);
                }
            });
        };
        // 获取服务范围
        function getServiceRange() {
    
            // 表格配置
            $scope.serviceRangeModel = {
                'tableHeader': [ //表头
                    '序号',
                    '类型范围',
                    '编码',
                    '创建者',
                    '创建时间',
                    '分区详情',
                    '备注'
                ],
                'tableBody': [],                                        //表格数据
                'restURL': 'logistics.getServiceRange',                 //请求地址
                'restData': {                                           //发送参数
                    'id': $scope.currentServicesId
                },
                'selectNumber': 0,                                      //勾选数量
                'selectFlag': false                                     //全选标识
            };
    
            var params = {
                'seatParams': $scope.serviceRangeModel.restData
            }
    
            // 获取表格数据
            tableService.getTable($scope.serviceRangeModel.restURL, params, function(res) {
    
                if (res.errorCode == 0){
                    // 配置分页
                    res.pagination = {
                        'currentPage':1,
                        'currentResult':0,
                        'pageSize':10,
                        'totalPage':0,
                        'totalResult':0
                    };
    
                    // 绑定数据
                    $scope.serviceRangeModel = tableService.table($scope.serviceRangeModel, params, res);
    
                    // 检测起点终点是否存在
                    var tableBody = $scope.serviceRangeModel && $scope.serviceRangeModel.tableBody;
    
                    $scope.startDisabled = false;
                    $scope.endDisabled = false;
                    $scope.disabledAdd = false;
    
                    if (tableBody) {
                        for (var i = 0, l = tableBody.length; i < l; i++) {
                            if (tableBody[i].type === 's') {
                                $scope.startDisabled = true;
                            } else if (tableBody[i].type === 'e'){
                                $scope.endDisabled = true;
                            }
                        }
    
                        if ($scope.startDisabled && $scope.endDisabled) {
                            $scope.disabledAdd = true;
                        }
                    }
    
                    $('#serviceRangeTable').removeAttr('style');
                    // $scope.$apply();
                }
            });
        }
    
        $scope.regionDetail = function(schemaUid, name){
            var status = $scope.isOffline ? '1' : '';
            window.location.href = '#/regionDetail?schemaId=' + schemaUid + '&name=' + name
                + '&q=servicesApproval&uid=' + $scope.serviceId + '&checkStatus=' + $scope.currentServicesStatus + '&status=' + status;
        };
    
        var uParams = parseUrl.getParams();
    
        if (uParams.uid) {
            $scope.serviceTitle = Lang.getValByKey("servicesApproval", 'servicesApproval_title_detail');
            $scope.isAudit = true;    //打回草稿或审核服务。
            $scope.validateCodeError = false;
            $scope.mainBlock = 'detail';
            $scope.visible = true;
            $scope.isVisible = false;
    
            $scope.showAuthor = true;
    
            $scope.serviceId = uParams.uid;
            $scope.serviceSpanInfo(uParams.uid);
    
            if (uParams.status != 2) {
                $scope.isAudit = false;
    
                if($scope.serviceData.isOnline){
                    $scope.enableName = '停用';
                    $scope.enableValue = false;
                }else{
                    $scope.enableName = '启用';
                    $scope.enableValue = true;
                }
            }
            
            $scope.detailTabIndex.toggle(2);
        }
    
        // 添加服务
        $scope.add = function() {
    
            $scope.showCode = false;
    
            if ($scope.startDisabled) {
                $scope.rangeRadio = 'e';
            } else {
                $scope.rangeRadio = 's';
            }
    
            //清除angular表单脏值检测
            $scope.regionForm.$setPristine();
            $scope.regionForm.$setUntouched();
            $scope.regionForm.$setUntouched();
            $scope.isSaveNext = true;
    
            $scope.proRegionID = 0;
    
            $scope.code = '';
            $scope.description = '';
    
            $(document).promptBox({
                title: '添加分区方案',
                loadTitle: function(){
                    return '添加分区方案'
                },
                isMiddle: true,
                isNest:true,
                content: {
                     nest: $('#regionDetail'),
                },
                loadData: function(){
                     $('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveSeriviceRegion();
                            $(document).promptBox('closeFormPrompt');
                            $scope.$apply();
                        }
                    }
                ]
            });
        }
    
        // 保存或修改
        $scope.saveSeriviceRegion = function(){
    
            if (!$scope.rangeRadio) return;
            if ($scope.proRegionID && !$scope.code) $scope.regionForm.code.$setDirty();
            if ($("#code-msg").hasClass('remote-invalid') || !$scope.regionForm.$valid) return;
    
            var config = {
                urlParams: {
                    'serviceId': $scope.serviceData.id,
                    'type': $scope.rangeRadio,
                    'remark': $.trim($scope.description)
                },
                seatParams: {}
            };
    
            var name = $scope.rangeRadio === 's' ? '起点范围' : '终点范围';
    
            if ($scope.proRegionID) { // 修改
                config.seatParams.id = $scope.proRegionID;
    
                servicesApprovalService.editServicesRegion(config, function(data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
    
                        if($scope.isSaveNext){
                            $scope.regionDetail(data.data, name);
                        }else{
                            getServiceRange();
                        }
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose:true
                        });
                    }
                });
    
            } else { // 添加
    
                servicesApprovalService.saveServicesRegion(config, function(data) {
    
                    if (data.errorCode === 0) {
    
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success'
                        });
    
                        if ($scope.isSaveNext) {
                            $scope.regionDetail(data.data, name);
                        } else {
                            getServiceRange();
                        }
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    }
                });
            }
        };
    
        // 删除服务
        $scope.del=function(){
            var param = [];
    
            var selData = tableService.getSelectTable($scope.serviceRangeModel.tableBody);
    
            if(!selData.length){
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }
    
            //组织数据
            angular.forEach(selData, function(val){
                param.push(val.id);
            });
    
            var config = {
                'urlParams': param,
                'serviceId': $scope.serviceData.id
            };
    
            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: '确定删除已选产品范围？'
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application:'delete',
                        operationEvent: function() {
                            servicesApprovalService.deleteServicesRegion(config, function(data){
    
                                if(data.errorCode === 0){
    
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: data.msg,
                                        type: 'success'
                                    });
                                    $(document).promptBox('closePrompt');
    
                                    getServiceRange();
                                    $scope.serviceRangeModel.restData.id = $scope.serviceData.id;
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
                        }
                    }
                ]
            };
            $(document).promptBox(opt);
        }
    
        $scope.editable = true; // 草稿状态可编辑，其他状态不可编辑
        $scope.edit = function(value) {
    
            $scope.startDisabled = false; // 起点范围
            $scope.endDisabled = false; // 终点范围
            $scope.showCode = true;
    
            var data = $scope.serviceRangeModel && $scope.serviceRangeModel.tableBody;
    
            if (data.length >= 2) {
                $scope.startDisabled = true;
                $scope.endDisabled = true;
            }
    
            //清除angular表单脏值检测
            $scope.regionForm.$setPristine();
            $scope.regionForm.$setUntouched();
            $scope.regionForm.$setUntouched();
            $scope.isSaveNext = true;
            $scope.rangeRadio = value.type;
    
            $scope.code = value.code;
            $scope.description = value.remark;
            $scope.proRegionID = value.id;
    
            $(document).promptBox({
                title: '编辑分区方案',
                loadTitle: function(){
                    return '编辑分区方案'
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#regionDetail'),
                },
                loadData: function(){
                    $('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveSeriviceRegion();
                            $(document).promptBox('closeFormPrompt');
                            $scope.$apply();
                        }
                    }
                ]
            });
        };
    
        $scope.selectTimeTypes = function(){
            servicesApprovalService.getProductEstimated(null, function (result) {
                $scope.estimatedList = result.data;
                selectFactory({
                    data: result,
                    id: "intenTimeType",
                    attrTextField: {
                        "ng-value": "code"
                    },
                    attrTextId: function(code){
                        $scope.estimatedUnit = code;
                        $scope.$apply();
                    },
                    attrTextModel: function(name, data) {
                        $scope.estimatedUnitValue = name;
                        $scope.$apply();
                    }
                });
            });
        };
    
        $scope.getSupplier = function(supplierId){
            $scope.tabs.selected(0);
            $scope.mainBlock = 'suppler';
    
            var config = {
                seatParams:{
                    sid : supplierId,
                    'intertype':"logistics"
                }
            };
            servicesApprovalService.getSupplierById(config, function(res){
                if(res.errorCode == 0){
                    $scope.supplierModel.supplierData = res.data;
                    //组装类型
                    var str = '';
                    angular.forEach($scope.supplierModel.supplierData.serviceTypes, function(value, key){
                        if(key == $scope.supplierModel.supplierData.serviceTypes.length - 1){
                            str += value.supplierTypeName
                        }else{
                            str += value.supplierTypeName + ','
                        }
                    });
                    $scope.supplierModel.supplierData.serviceTypes = str;
                    //组装评价等级
                    $('#stars').rating('update', parseInt($scope.supplierModel.supplierData.rank));
                    $('#stars').rating('refresh',
                        {min: 0,
                            max: 5,
                            step: 1,
                            size: 'xs',
                            animate: true,
                            displayOnly: true,
                            showClear: false,
                            showCaption: false
                        });
                    //组装营业执照
                    $scope.pictureModel.picture = pictureEdit($scope.supplierModel.supplierData.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
    
                    $scope.supplierModel = suppliersService.initSupplier($scope.supplierModel);
                };
            });
        };
    
    
        $scope.getSupplierListData = function(q){
            q = q ? q : '';
            var config = {
                'urlParams': {
                    'q': q
                },
                "seatParams": {"intertype":"logistics"}
            };
            return servicesApprovalService.retrievalSupplier(config);
        };
        $scope.getSupplierList = function(){
            $scope.supplierDatas = servicesApprovalService.retrievalSupplier({"seatParams":{"intertype":"logistics"}});
            rebuildName($scope.supplierDatas.data);
    
            var supplierEle = selectFactory({
                data: $scope.supplierDatas,
                id: "supplier",
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data) {
                    var suppliers = $scope.getSupplierListData(data);
                    rebuildName(suppliers.data);
                    attachEvent.setData(suppliers);
                },
                attrTextModel: function(name, data) {
                    var supplierData;
                    if(!name) {
                        supplierData = {};
                    } else {
                        supplierData = getSigleDataByName(name, data);
                    }
    
                    $scope.supplierId  = supplierData.id;
    
                    if(!supplierData.name){
                        $scope.supplierName = '';
                    }else{
                        $scope.supplierName = supplierData.name.split('，')[0];
                    };
    
                    $("#supplier").val($scope.supplierName);
                    $scope.$apply();
                    clearNextAddress(supplierEle);
                }
            });
    
            supplierEle.setData($scope.supplierDatas);
            supplierEle.open();
            $('#supplier').val($scope.supplierName);
        };
    
        function rebuildName(data){
            if(!data) return;
            for(var index = 0;index <data.length;index++) {
                data[index].name = data[index].name + '(' +data[index].code + ')';
            }
        }
    }]);
});


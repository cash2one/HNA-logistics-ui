easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select',
    'public/common/calander.js',
    'public/javascripts/shippingSetting/20161224/shippingSettingDetailController.js',
],function () {
    app.controller('shippingSettingCtrl', ['$scope', 'shippingSettingService', 'shippingSettingView','tableService', function($scope, shippingSettingService, shippingSettingView,tableService) {
        $scope.shipSetting = {id: 0};
        $scope.getLanguage = function(){
            shippingSettingService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        $scope.initCalander = function(){
            shippingSettingView.initCalander($scope);
            $scope.clearStartTime = $scope.tableModel.restData.startTime;
            $scope.clearEndTime = $scope.tableModel.restData.endTime;
        };

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_num'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_departurePort'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_arrivalPort'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_departureTime'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_arrivalTime'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_name'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_company'),
                Lang.getValByKey("shippingSetting", 'shippingSetting_vessel_totalTime')
            ],
            'tableBody': [],
            'restURL': 'logistics.getShipFlights',//表格获取接口
            'restData': {
                'q': '',
                'startPortId': '',
                'endPortId': '',
                'startTime': '',
                'endTime': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': ''
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        $scope.getTable = function(isSearch){
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.startPortId = $scope.searchStartShipCode;
            $scope.tableModel.restData.endPortId = $scope.searchEndShipCode;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    $scope.nestShipSettingForm = false;
                    setTimeout(function(){
                        var height = $(".shippingSetting-table-page").height() - 330;
                        $("#list .table-container tbody").slimscroll({height: height});
                        $(window).resize(function(){
                            height = $(".shippingSetting-table-page").height() - 330;  //重新计算高度
                            $("#list .table-container tbody").slimscroll({height: height});
                         });
                    }, 10);
                }
            })
        };

        $scope.initCalander();

        $scope.getTable();

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length){
                shippingSettingView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
                return false;
            }
            angular.forEach(oldData, function(val){
                param.push(val.id);
            });
            config = {
                'urlParams': param
            };
            var opt = {
                title: Lang.getValByKey("common", "common_prompt_title"),
                type: "warning",
                content: {
                    tip: Lang.getValByKey("shippingSetting", "shippingSetting_code_modelDelTips")
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", "common_page_delete"),
                    application: 'delete',
                    operationEvent: function(){
                        shippingSettingService.del(config, function(data){
                            shippingSettingView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                shippingSettingView.promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'success'
                                });
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                shippingSettingView.promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'error',
                                    manualClose: true
                                })
                            }
                        });
                    }
                }]
            };

            shippingSettingView.promptBox(opt);
        };

        $scope.clearData = function(){
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            $scope.tableModel.restData.startPortId = "";
            $scope.tableModel.restData.endPortId = "";
            $scope.tableModel.restData.startTime = $scope.clearStartTime;
            $scope.tableModel.restData.endTime = $scope.clearEndTime;
            $scope.searchStartShip = "";
            $scope.searchEndShip = "";
            $scope.searchStartShipCode = "";
            $scope.searchEndShipCode = "";
            $scope.getTable();
        };
        var DATE_FORMAT = /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/;
        $scope.checkStartTime = function () {
            if(!DATE_FORMAT.test($scope.tableModel.restData.startTime)){
                $scope.tableModel.restData.startTime = '';
            }
        }
        $scope.checkEndTime = function () {
            if(!DATE_FORMAT.test($scope.tableModel.restData.endTime)){
                $scope.tableModel.restData.endTime = '';
            }
        }

        var searchStartShipEle, searchEndShipEle;
        $scope.initSelectList = function(){
            var portConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            };
            $scope.searchStartShips = $scope.searchEndShips = shippingSettingService.getPortShort(portConfig);
            //搜索起运港
            searchStartShipEle = selectFactory({
                data: $scope.searchStartShips,
                isSearch: true,
                id: "search-start",
                pagination: true,
                onSearchValueChange: function(attachEvent, data, currentPage){
                    $scope.searchStartShips = $scope.getShipPortData(data,currentPage);
                    angular.forEach($scope.searchStartShips.data, function(value, key){
                        value.name = value.name + "(" + value.englishName + ")";
                    });
                    attachEvent.setData($scope.searchStartShips);
                },
                attrTextModel: function(name, data){
                    $scope.searchStartShipCode = getPortByName(name, data);
                    $scope.searchStartShip = name;
                    if($scope.searchStartShip == $scope.searchEndShip){
                        $("#search-start").val("");
                        $scope.sarchStartShip = "";
                    }
                    $scope.$apply();
                }
            });
            //搜索目的港
            searchEndShipEle = selectFactory({
                data: $scope.searchEndShips,
                isSearch: true,
                id: "search-end",
                pagination: true,
                onSearchValueChange: function(attachEvent, data, currentPage){
                    $scope.searchEndShips = $scope.getShipPortData(data,currentPage);
                    angular.forEach($scope.searchEndShips.data, function(value, key){
                        value.name = value.name + "(" + value.englishName + ")";
                    });
                    attachEvent.setData($scope.searchEndShips);
                },
                attrTextModel: function(name, data){
                    $scope.searchEndShipCode = getPortByName(name, data);
                    $scope.searchEndShip = name;
                    if($scope.searchEndShip == $scope.searchStartShip){
                        $("#search-end").val("");
                        $scope.searchEndPort = "";
                    }
                    $scope.$apply();
                }
            })
        };

        $scope.getShipPortData = function(q,currentPage){
            if(!currentPage){
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                'urlParams': {
                    q: q,
                    pageIndex: currentPage,
                    pageSize: 10,
                    includeAllAudit: true
                },
                isAsync: true
            };
            var data = shippingSettingService.getPortShort(config);
            return data;
        };

        function getPortByName(name, data){
            if(!data){
                data = shippingSettingService.getShippingShort();
            }
            if(!name){
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++){
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)){
                    return data[index].id;
                }
            }
            return "无匹配结果";
        };


        // add by yezi start
        
        $scope.add = function () {

            $scope.showDetail = true;
            $scope.$broadcast('addshippingSettingDetail', {});
        }


        $scope.closeDetailPage = function () {
            $scope.showDetail = false;
            $scope.clearData();
        }
        
        $scope.editShipSettingDetail = function (value) {
            $scope.showDetail = true;
            var config = {
                'seatParams': {
                    'id': value
                }
            };
            shippingSettingService.getShippingLine(config, function(data){
                if(data.errorCode === 0){
                    $scope.$broadcast('editshippingSettingDetail', data.data);
                }
            });

        }
        // add by yezi end

}])
});























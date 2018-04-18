easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'public/common/tableController.js',
    'widget/slides'
],function(){
    app.controller('shippingLineCtrl', ['$scope', 'shippingLineService', 'shippingLineView', 'tableService', function($scope, shippingLineService, shippingLineView,tableService) {
        $scope.shippingLine = {id: 0};
        $scope.getLanguage = function(){
            shippingLineService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_name'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_code'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_type'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_starPort'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_endPort'),
                Lang.getValByKey("shippingLine", 'shippingLine_page_line'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getShippingLineTable',//表格获取接口
            'restData': {
                'q': '',
                'countryCodeFrom': '',
                'codeStart': '',
                'countryCodeTo': '',
                'codeEnd': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': ''
            },
            'selectNumber': 0,
            'selectFlag': false
        };
        $scope.getTable = function(isSearch){
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.countryCodeFrom = $scope.countryStartSearchCode;
            $scope.tableModel.restData.codeStart = $scope.codeStart;
            $scope.tableModel.restData.countryCodeTo = $scope.countryEndSearchCode;
            $scope.tableModel.restData.codeEnd = $scope.codeEnd;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    var height = $('.shipping-table-page').height() - 330;
                    setTimeout(function() {
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            height = $('.shipping-table-page').height() - 330;    //重新计算高度
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        $scope.clearData = function() {
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.countryCodeFrom = "";
            $scope.tableModel.restData.countryCodeTo = "";
            $scope.tableModel.restData.codeStart = "";
            $scope.tableModel.restData.codeEnd = "";

            $scope.countryStartSearchCode = "";
            $scope.countryStartSearch = "";
            $scope.airportStartSearch = "";
            $scope.codeStart = "";
            $scope.countryEndSearchCode = "";
            $scope.countryEndSearch = "";
            $scope.airportEndSearch = "";
            $scope.codeEnd = "";
            $scope.getTable();
        };

        var bar = $('#nest-ShippingLineForm .label-text');
        shippingLineView.propmtCostEvent(bar);
        $scope.add = function(){
            $scope.ShippingLineForm.$setPristine();
            $scope.ShippingLineForm.$setUntouched();
            $scope.nestShippingLineForm = true;
            $('#nest-ShippingLineForm').attr('style','').find('.title').text(Lang.getValByKey("shippingLine", 'shippingLine_page_add'));
            $(".remote-invalid").removeClass('remote-invalid');
            $scope.attachPortList = [{
                attachPort: '',
                attachPortCode: ''
            }];
            $scope.shippingLineName = '';
            $scope.shippingLineCode = '';
            $scope.addShippingLineType = '';
            $scope.addShippingLineTypeCode = '';
            $scope.addStartPort = '';
            $scope.addEndPort = '';
            $scope.addStartPortCode  = '';
            $scope.addEndPortCode  = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;
            setTimeout(function () {
                bindAttachPortListSelect();
                $scope.$apply();
            }, 200);
            shippingLineView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        $scope.checkShippingLineCode = function(){
            var config = {
                'urlParams':{
                    'code': $scope.shippingLineCode,
                    'id': $scope.shippingLine.id
                }
            };
            if($scope.shippingLineCode){
                shippingLineService.checkShippingLineCode(config, function(data){
                    if(data.errorCode != 0){
                        $scope.ShippingLineForm.shippingLineCode.errorTips = "编码已存在";
                        $("#code-msg-code").removeClass("ng-hide").addClass('remote-invalid');
                        angular.element($(".validate-code").addClass("ng-invalid"));
                    }else{
                        $("#code-msg-code").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.ShippingLineForm.shippingLineCode.errorTips = "";
                        angular.element($(".validate-code").removeClass("ng-invalid"));
                    }
                });
            }
        };

        $scope.edit = function(id){
            $scope.shippingLine.id = id;
            $scope.addStartPort = '';
            $scope.addEndPort = '';
            $scope.addStartPortCode  = '';
            $scope.addEndPortCode = '';
            $(".remote-invalid").removeClass('remote-invalid');
            $('#nest-ShippingLineForm').attr('style','').find('.title').text('海运航线详情');
            $scope.nestShippingLineForm = true;
            shippingLineView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            setTimeout(function () {
                bindAttachPortListSelect();
                $scope.$apply();
            }, 200);
            shippingLineService.getDetail({'seatParams':{'id':id}}, function(data){
                if(data && data.errorCode === 0){
                    var ports = data.data.ports;
                    var len = ports.length;
                    $scope.shippingLineName = data.data.name;
                    $scope.shippingLineCode = data.data.code;
                    $scope.addShippingLineType = data.data.typeName;
                    $scope.addShippingLineTypeCode = data.data.type;
                    $scope.addStartPort = ports[0].portName + '('+ports[0].portEnglishName + ')';
                    $scope.addEndPort = ports[len-1].portName + '('+ports[len-1].portEnglishName + ')';
                    $scope.addStartPortCode  = ports[0].portId;
                    $scope.addEndPortCode  = ports[len-1].portId;
                    if(len>2){
                        $scope.attachPortList=[];
                        angular.forEach(ports,function(value, key){
                            if(key != 0 && key != len-1){
                                var map = {
                                    attachPort: value.portName + '('+ports[0].portEnglishName + ')',
                                    attachPortCode: value.portId
                                };
                                $scope.attachPortList.push(map);
                            }
                        });
                    }
                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);
                }
            });
        };

        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length){
                shippingLineView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
                return false;
            }
            angular.forEach(oldData, function(val){
                param.push(val.id);
            });
            config = {'urlParams': param};
            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("shippingLine", 'shippingLine_code_modelDelTips')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", 'common_page_delete'),
                    application:'delete',
                    operationEvent: function () {
                        shippingLineService.del(config, function(data){
                            shippingLineView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                            }
                        });
                    }
                }]
            };
            shippingLineView.promptBox(opt);
        };

        $scope.cancel = function(){
            $("#add-startPort, #add-endPort").removeAttr("style");
            $scope.nestShippingLineForm = false;
            $("#code-msg-code").addClass("ng-hide").removeClass('remote-invalid');
            $scope.ShippingLineForm.shippingLineCode.errorTips = "";
            $scope.attachPortList = [{
                attachPort: '',
                attachPortCode: ''
            }];
            $scope.shippingLine.id ? $scope.shippingLine.id = 0 : '';
        };

        $scope.save = function(){
            $scope.shippingLineName = $scope.shippingLineName === undefined ? "" : $scope.shippingLineName;
            $scope.shippingLineCode = $scope.shippingLineCode === undefined ? "" : $scope.shippingLineCode;
            if(!$scope.shippingLineName.trim()){
                $scope.ShippingLineForm.shippingLineName.$setDirty();
            }
            if(!$scope.shippingLineCode.trim()){
                $scope.ShippingLineForm.shippingLineCode.$setDirty();
            }
            if(!$scope.addShippingLineType){
                $scope.ShippingLineForm.addShippingLineType.$setDirty();
            }
            if(!$scope.addStartPort){
                $scope.ShippingLineForm.addStartPort.$setDirty();
            }
            if(!$scope.addEndPort){
                $scope.ShippingLineForm.addEndPort.$setDirty();
            }

            if($("#code-msg").hasClass('remote-invalid') || $("#code-msg-code").hasClass('remote-invalid') || !$scope.ShippingLineForm.$valid || $("#add-startPort").css("border-color") == "rgb(250, 120, 126)" || $("#add-endPort").css("border-color") == "rgb(250, 120, 126)"){
                scrollToErrorView($(".switch-list"));
                shippingLineView.displayErrorBox(bar);
                return;
            }
            var ports = [];
            if($scope.attachPortList[0].attachPort){
                var map = {};
                ports.push({'portId':$scope.addStartPortCode});
                angular.forEach($scope.attachPortList,function(value, key){
                    map = {
                        "portId": value.attachPortCode
                    };
                    ports.push(map);
                });
                ports.push({'portId':$scope.addEndPortCode});
            } else{
                ports.push({'portId':$scope.addStartPortCode});
                ports.push({'portId':$scope.addEndPortCode});
            }

            var config = {
                urlParams : {
                    name: $scope.shippingLineName.trim(),
                    code: $scope.shippingLineCode.trim(),
                    type: $scope.addShippingLineTypeCode,
                    ports: ports,
                    description: $scope.remark
                }
            };
            if($scope.shippingLine.id) {
                config.seatParams = {'id': $scope.shippingLine.id};
                shippingLineService.saveEdit(config, function(data){
                    if(data && data.errorCode === 0){
                        shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestShippingLineForm = false;
                        $scope.getTable();
                        $scope.shippingLine.id ? $scope.shippingLine.id = 0 : '';
                        $scope.attachPortList = [{
                            attachPort: '',
                            attachPortCode: ''
                        }];
                    }else{
                        shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{
                shippingLineService.save(config, function(data){
                    if(data && data.errorCode === 0){
                        shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestShippingLineForm = false;
                        $scope.getTable();
                        $scope.attachPortList = [{
                            attachPort: '',
                            attachPortCode: ''
                        }];
                    }else{
                        shippingLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        var countryStartSearchEle,
            cityStartSearchEle,
            countryEndSearchEle,
            cityEndSearchEle,
            addShippingLineTypeEle,
            addStartPortEle,
            addEndPortEle;
        $scope.initSelectList = function() {
            var portConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            },lineTypeConfig = {urlParams:{catalog:'biz.linetype.base'}};
            $scope.countryStartSearchs = $scope.countryEndSearchs = shippingLineService.getCountry(portConfig);
            $scope.addShippingLineTypes = shippingLineService.getShippingLineType(lineTypeConfig);
            $scope.addStartPorts = $scope.addEndPorts = $scope.addAttachPorts = shippingLineService.getShippingPort(portConfig);
            //搜索始发地国家
            countryStartSearchEle = selectFactory({
                data: $scope.countryStartSearchs,
                isSearch: true,
                id: "countryStartSearch",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称或二字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.countryStartSearchs = $scope.getCountryData(data,currentPage);
                    attachEvent.setData($scope.countryStartSearchs);
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.countryStartSearchCode = currentData.figureCode;
                    $scope.countryStartSearch = name;
                    $scope.airportStartSearch = '';
                    $scope.codeStart = '';

                    $scope.$apply();
                    clearNextAddress(countryStartSearchEle);
                }
            });
            //搜索始发地机场
            cityStartSearchEle = selectFactory({
                data: [],
                isSearch: true,
                id: "airportStartSearch",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder:"请输入名称",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.airportStartSearchs = getPortListByCountryId(data,currentPage ,$scope.countryStartSearchCode);
                    rebuildPortName($scope.airportStartSearchs);
                    attachEvent.setData($scope.airportStartSearchs);
                },
                attrTextModel: function(name, data,currentItem) {
                    $scope.airportStartSearch = currentItem.name;
                    $scope.codeStart = currentItem.englishName;
                    $scope.$apply();
                }
            });
            //搜索目的地国家
            countryEndSearchEle = selectFactory({
                data: $scope.countryEndSearchs,
                isSearch: true,
                id: "countryEndSearch",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称或二字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.countryEndSearchs = $scope.getCountryData(data,currentPage);
                    attachEvent.setData($scope.countryEndSearchs);
                },
                attrTextModel: function(name, data,currentData) {
                    $scope.countryEndSearchCode = currentData.figureCode;
                    $scope.countryEndSearch = name;
                    $scope.cityEndSearch = "";
                    $scope.cityEndSearchCode = "";
                    $scope.airportEndSearch = "";
                    $scope.codeEnd = "";
                    $scope.$apply();
                    clearNextAddress(countryEndSearchEle);
                }
            });
            //搜索目的地机场
            cityEndSearchEle = selectFactory({
                data: [],
                isSearch: true,
                id: "airportEndSearch",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder:"请输入名称",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.airportEndSearchs = getPortListByCountryId(data,currentPage ,$scope.countryEndSearchCode);
                    rebuildPortName($scope.airportEndSearchs);
                    attachEvent.setData($scope.airportEndSearchs);
                },
                attrTextModel: function(name, data,currentItem) {
                    $scope.airportEndSearch = currentItem.name;
                    $scope.codeEnd = currentItem.englishName;
                    $scope.$apply();
                }
            });
            //添加航线类型
            addShippingLineTypeEle = selectFactory({
                data: $scope.addShippingLineTypes,
                id: "add-shippingLineType",
                defaultText: '',
                attrTextModel: function(name, data,currentData) {
                    $scope.addShippingLineType = currentData.name;
                    $scope.addShippingLineTypeCode = currentData.code;
                    $scope.$apply();
                }
            });
            //添加起运港
            addStartPortEle = selectFactory({
                data: $scope.addStartPorts,
                isSearch: true,
                id: "add-startPort",
                pagination: true,
                height: 240,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addStartPorts = $scope.getCurrentShippingData(data,currentPage);
                    rebuildPortName($scope.addStartPorts);
                    attachEvent.setData($scope.addStartPorts);
                },
                attrTextModel: function(name, data,currentData) {
                    if(currentData.cityId === null || currentData.countryId === null){
                        angular.element("#add-startPort").css("borderColor","#FA787E");
                        shippingLineView.promptBox({isDelay:true,contentDelay:"港口信息错误",type: 'errer',manualClose:false});
                    }else{
                        angular.element("#add-startPort").removeAttr("style");
                    };
                    $scope.addStartPortCode = getPortByName(name, data);
                    $scope.addStartPort = currentData.name;
                    if($scope.addEndPort == $scope.addStartPort) {
                        $("#add-startPort").val("");
                        $scope.addStartPort = "";
                    }
                    $scope.$apply();
                }
            });
            //添加目的港
            addEndPortEle = selectFactory({
                data: $scope.addEndPorts,
                id: "add-endPort",
                isSearch: true,
                pagination: true,
                height: 240,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addEndPorts = $scope.getCurrentShippingData(data,currentPage);
                    rebuildPortName($scope.addEndPorts);
                    attachEvent.setData($scope.addEndPorts);
                },
                attrTextModel: function(name, data,currentData) {
                    if(currentData.cityId === null || currentData.countryId === null){
                        angular.element("#add-endPort").css("borderColor","#FA787E");
                        shippingLineView.promptBox({isDelay:true,contentDelay:"港口信息错误",type: 'errer',manualClose:false});
                    }else{
                        angular.element("#add-endPort").removeAttr("style");
                    };
                    $scope.addEndPortCode = getPortByName(name, data);
                    $scope.addEndPort = currentData.name;
                    if($scope.addEndPort == $scope.addStartPort) {
                        $("#add-endPort").val("");
                        $scope.addEndPort = "";
                    }
                    $scope.$apply();
                }
            });
        };

        $scope.getCountryData = function (q,currentPage) {
            if(!currentPage) {
                currentPage = 1;
            }

            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    "pageIndex": currentPage,
                    "pageSize": 10
                }
            };
            var data = shippingLineService.getCountry(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };


        function clearNextAddress(currentEle) {
            var nextEle = currentEle.next;
            if(nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNextAddress(nextEle);
        }

        function getStartCityListByCountryId(countryId,data) {
            var cityConfig = {
                urlParams: {
                    countryCode: countryId,
                    parentId: countryId,
                    q: data ? data.trim() :""
                },
                isAsync: true
            };
            return  shippingLineService.getCity(cityConfig);
        }

        $scope.getCityList = function(data,currentPage ,countryId) {
            if(!currentPage) {
                currentPage = 1;
            }
            var cityConfig = {
                urlParams: {
                    countryCode: countryId,
                    parentId: countryId,
                    q: data ? data.trim() :"",
                    pageIndex: currentPage,
                    pageSize: 10
                }
            };
            return  shippingLineService.getCity(cityConfig);
        };

        $scope.getCurrentShippingData = function(q,currentPage){
            if (!currentPage) {
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
            var data = shippingLineService.getShippingPort(config);
            return data;
        };
        function getPortByName(name, data) {
            if(!data) {
                data = shippingLineService.getShippingPort();
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return data[index].id;
                }
            }
            return "无匹配结果";
        }

        $scope.attachPortList = [{
            attachPort: '',
            attachPortCode: ''
        }];
        $scope.setAttachPortList = function (index) {
            var id = 'attachPort-' + index;
            Select.sharePool[id].setData($scope.addAttachPorts);
        };
        function bindAttachPortListSelect() {
            for(var i = 0; i < $scope.attachPortList.length;i++){
                var index = i;
                Select.sharePool['attachPort-' + index] = null;
                var addAttachPortEle = selectFactory({
                    data: $scope.addAttachPorts,
                    id: 'attachPort-' + index,
                    isSearch: true,
                    pagination: true,
                    height: 240,
                    closeLocalSearch: true,
                    searchPlaceHoder: "请输入名称",
                    defaultText: Lang.getValByKey("common", "common_select_tips"),
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        var portList = $scope.getCurrentShippingData(data, currentPage);
                        rebuildPortName(portList);
                        attachEvent.setData(portList);
                    },
                    attrTextModel: function (name, data, currentData) {
                        if (!name) {
                            $scope.attachPortList[index].attachPort = '';
                            $scope.attachPortList[index].attachPortCode = '';
                        } else {
                            $scope.attachPortList[index].attachPort = currentData.name;
                            $scope.attachPortList[index].attachPortCode = getPortByName(name, data);
                            $scope.$apply();
                        }
                    }
                });
            }
        }

        $scope.addAttachPort = function () {
            for(var index = 0; index < $scope.attachPortList.length; index++) {
                if ($.trim($scope.attachPortList[index].attachPort) == '') {
                    return;
                }
            }
            $scope.attachPortList.push({
                attachPort: '',
                attachPortCode: ''
            });
            setTimeout(function () {
                bindAttachPortListSelect();
                $scope.$apply();
            }, 200);
        };

        $scope.deleteAttachPort = function () {
            $scope.attachPortList.splice($scope.attachPortList.length - 1, 1);
        };

        function getPortListByCountryId(data,currentPage,countryId) {
            var cityConfig = {
                seatParams: {
                    countryId: countryId ? countryId:'',
                    pageIndex:currentPage ? currentPage:1,
                    pageSize:10,
                    q: data ? data.trim() :""
                }
            };
            return  shippingLineService.getPortListByCountryId(cityConfig);
        }

        function rebuildPortName(data) {
            var data = data.data;
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].name + '(' + data[index].englishName + ')';
            }
        }
    }]);
});



easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'public/common/tableController.js',
    'widget/slides'
],function() {
    app.controller('airLineCtrl', ['$scope', 'airLineService', 'airLineView','tableService', function ($scope, airLineService, airLineView,tableService) {
        $scope.airlineId = {id: 0};
        $scope.getLanguage = function(){
            airLineService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("airLine", 'airLine_page_name'),
                Lang.getValByKey("airLine", 'airLine_page_code'),
                Lang.getValByKey("airLine", 'airLine_page_type'),
                Lang.getValByKey("airLine", 'airLine_page_startAirport'),
                // Lang.getValByKey("airLine", 'airLine_page_stopoverAirport'),
                Lang.getValByKey("airLine", 'airLine_page_endAirport'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getAirLineTable',//表格获取接口
            'restData': {
                'q': '',
                'countryCodeFrom': '',
                'triadCodeStart': '',
                'countryCodeTo': '',
                'triadCodeEnd': '',
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
            $scope.tableModel.restData.triadCodeStart  = $scope.triadCodeStart;
            $scope.tableModel.restData.countryCodeTo = $scope.countryEndSearchCode;
            $scope.tableModel.restData.triadCodeEnd  = $scope.triadCodeEnd;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    var height = $('.airline-table-page').height() - 330;
                    setTimeout(function() {
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            height = $('.airline-table-page').height() - 330;    //重新计算高度
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        $scope.clearData = function() {
            $scope.q = "";
            $scope.tableModel.restData.q = "";
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.countryCodeFrom = "";
            $scope.tableModel.restData.countryCodeTo = "";
            $scope.tableModel.restData.triadCodeStart = "";
            $scope.tableModel.restData.triadCodeEnd = "";

            $scope.countryStartSearchCode = "";
            $scope.countryStartSearch = "";
            $scope.airportStartSearch = "";

            $scope.triadCodeStart = "";
            $scope.airportEndSearch = "";
            $scope.triadCodeEnd = "";

            $scope.countryEndSearchCode = "";
            $scope.countryEndSearch = "";

            $scope.getTable();
        };

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length){
                airLineView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                    tip: Lang.getValByKey("airLine", 'airLine_code_modelDelTips')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", 'common_page_delete'),
                    application:'delete',
                    operationEvent: function () {
                        airLineService.del(config, function(data){
                            airLineView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                            }
                        });
                    }
                }]
            };
            airLineView.promptBox(opt);
        };

        var bar = $('#nest-airLineForm .label-text');
        airLineView.propmtCostEvent(bar);
        $scope.add = function(){
            $scope.airLineForm.$setPristine();
            $scope.airLineForm.$setUntouched();
            $scope.nestAirLineForm = true;
            $('#nest-airLineForm').attr('style','').find('.title').text(Lang.getValByKey("airLine", 'airLine_page_add'));
            $(".remote-invalid").removeClass('remote-invalid');
            $scope.airLineName = '';
            $scope.airLineCode = '';
            $scope.addAirLineType="INTERNAL";
            $scope.addStartAirport = '';
            $scope.addStopoverAirport = '';
            $scope.addEndAirport = '';
            $scope.addStartAirportCode  = '';
            $scope.addStopoverAirportCode  = '';
            $scope.addEndAirportCode  = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;
            airLineView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        $scope.edit = function(id){
            $scope.airlineId.id = id;
            $scope.addStartAirport = '';
            $scope.addStopoverAirport = '';
            $scope.addEndAirport = '';
            $scope.addStartAirportCode  = '';
            $scope.addStopoverAirportCode  = '';
            $scope.addEndAirportCode  = '';
            $(".remote-invalid").removeClass('remote-invalid');
            $('#nest-airLineForm').attr('style','').find('.title').text('空运航线详情');
            $scope.nestAirLineForm = true;
            airLineView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            airLineService.getDetail({'seatParams':{'id':id}}, function(data){
                if(data && data.errorCode === 0){
                    var airports = data.data.airports || [];
                    if(airports.length ===3){
                        $scope.addStartAirport = airports[0].airportTriadCode + '('+airports[0].airportName +')';
                        $scope.addStopoverAirport = airports[1].airportTriadCode + '('+airports[1].airportName +')';
                        $scope.addEndAirport = airports[2].airportTriadCode + '('+airports[2].airportName +')';
                        $scope.addStartAirportCode  = airports[0].airportId;
                        $scope.addStopoverAirportCode  = airports[1].airportId;
                        $scope.addEndAirportCode  = airports[2].airportId;
                    }
                    if(airports.length ===2){
                        $scope.addStartAirport = airports[0].airportTriadCode + '('+airports[0].airportName +')';
                        $scope.addEndAirport = airports[1].airportTriadCode + '('+airports[1].airportName +')';
                        $scope.addStartAirportCode  = airports[0].airportId;
                        $scope.addEndAirportCode  = airports[1].airportId;
                    }
                    $scope.airLineName = data.data.name;
                    $scope.airLineCode = data.data.code;
                    $scope.addAirLineType = data.data.type;
                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);
                }
            });
        };

        $scope.save = function(){
            $scope.airLineName = $scope.airLineName === undefined ? "" : $scope.airLineName;
            $scope.airLineCode = $scope.airLineCode === undefined ? "" : $scope.airLineCode;
            if(!$scope.airLineName.trim()){
                $scope.airLineForm.airLineName.$setDirty();
            }
            if(!$scope.airLineCode.trim()){
                $scope.airLineForm.airLineCode.$setDirty();
            }
            if(!$scope.addAirLineType){
                $scope.airLineForm.addAirLineType.$setDirty();
            }
            if(!$scope.addStartAirport){
                $scope.airLineForm.addStartAirport.$setDirty();
            }
            if(!$scope.addEndAirport){
                $scope.airLineForm.addEndAirport.$setDirty();
            }

            if($("#code-msg").hasClass('remote-invalid') || $("#code-msg-code").hasClass('remote-invalid')|| !$scope.airLineForm.$valid){
                scrollToErrorView($(".switch-list"));
                airLineView.displayErrorBox(bar);
                return;
            }

            var airports;
            $scope.addStopoverAirportCode ? airports = [
                {'airportId':$scope.addStartAirportCode},
                {'airportId':$scope.addStopoverAirportCode},
                {'airportId':$scope.addEndAirportCode}
            ] : airports = [
                {'airportId':$scope.addStartAirportCode},
                {'airportId':$scope.addEndAirportCode}
            ];
            var config = {
                urlParams : {
                    name: $scope.airLineName.trim(),
                    code: $scope.airLineCode.trim(),
                    type: $scope.addAirLineType,
                    airports:airports,
                    description: $scope.remark
                }
            };
            if($scope.airlineId.id) {
                config.seatParams = {'id': $scope.airlineId.id};
                airLineService.saveEdit(config, function(data){
                    if(data && data.errorCode === 0){
                        airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestAirLineForm = false;
                        $scope.getTable();
                        $scope.airlineId.id ? $scope.airlineId.id = 0 : '';
                    }else{
                        airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{
                airLineService.save(config, function(data){
                    if(data && data.errorCode === 0){
                        airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestAirLineForm = false;
                        $scope.getTable();
                    }else{
                        airLineView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        $scope.cancel = function(){
            $scope.nestAirLineForm = false;
            $("#code-msg-code").addClass("ng-hide").removeClass('remote-invalid');
            $scope.airLineForm.airLineCode.errorTips = "";
            $scope.airlineId.id ? $scope.airlineId.id = 0 : '';
        };

        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        $scope.checkAirLineCode = function(){
            var config = {
                'urlParams':{
                    'code': $scope.airLineCode,
                    'id': $scope.airlineId.id
                }
            };
            if($scope.airLineCode){
                airLineService.checkAirLineCode(config, function(data){
                    if(data.errorCode != 0){
                        $scope.airLineForm.airLineCode.errorTips = "编码已存在";
                        $("#code-msg-code").removeClass("ng-hide").addClass('remote-invalid');
                        angular.element($(".validate-code").addClass("ng-invalid"));
                    }else{
                        $("#code-msg-code").addClass("ng-hide").removeClass('remote-invalid');
                        angular.element($(".validate-code").removeClass("ng-invalid"));
                        $scope.airLineForm.airLineCode.errorTips = "";
                    }
                });
            }
        };

        var countryStartSearchEle,
            cityStartSearchEle,
            countryEndSearchEle,
            cityEndSearchEle,
            addStartAirportEle,
            addEndAirportEle,
            addStopoverAirportEle;
        $scope.initSelectList = function() {
            var portConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            };
            $scope.addStartAirports = $scope.addEndAirports = $scope.addStopoverAirports = airLineService.getAirportShort(portConfig);
            $scope.countryStartSearchs = $scope.countryEndSearchs = airLineService.getCountry(portConfig);
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
                    $scope.triadCodeStart = '';

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
                searchPlaceHoder:"请输入名称或者三字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.airportStartSearchs = getAirPortListByCountryId(data,currentPage ,$scope.countryStartSearchCode);
                    rebuildAirportName($scope.airportStartSearchs);
                    attachEvent.setData($scope.airportStartSearchs);
                },
                attrTextModel: function(name, data,currentItem) {
                    $scope.airportStartSearch = currentItem.name;
                    $scope.triadCodeStart = currentItem.triadCode;
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

                    $scope.airportEndSearch = '';
                    $scope.triadCodeEnd = '';
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
                searchPlaceHoder:"请输入名称或者三字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.airportEndSearchs = getAirPortListByCountryId(data,currentPage ,$scope.countryEndSearchCode);
                    rebuildAirportName($scope.airportEndSearchs);
                    attachEvent.setData($scope.airportEndSearchs);
                },
                attrTextModel: function(name, data,currentItem) {
                    $scope.airportEndSearch = currentItem.name;
                    $scope.triadCodeEnd = currentItem.triadCode;
                    $scope.$apply();
                }
            });
            //添加始发机场
            addStartAirportEle = selectFactory({
                data: $scope.addStartAirports,
                isSearch: true,
                id: "add-startAirport",
                height: 240,
                pagination: true,
                closeLocalSearch: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                searchPlaceHoder: "请输入名称或三字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.addStartAirports = $scope.getCurrentAirData(data,currentPage);
                    rebuildAirportName($scope.addStartAirports)
                    attachEvent.setData($scope.addStartAirports);
                },
                attrTextModel: function(name, data) {
                    $scope.addStartAirportCode = getPortByName(name, data);
                    $scope.addStartAirport = name;
                    if($scope.addStartAirport == $scope.addEndAirport) {
                        $("#add-startAirport").val("");
                        $scope.addStartAirport = "";
                    }
                    $scope.$apply();
                }
            });
            //添加经停机场
            addStopoverAirportEle = selectFactory({
                data: $scope.addStopoverAirports,
                id: "add-stopoverAirport",
                isSearch: true,
                height: 240,
                pagination: true,
                closeLocalSearch: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                searchPlaceHoder: "请输入名称或三字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.addStopoverAirports = $scope.getCurrentAirData(data,currentPage);
                    rebuildAirportName($scope.addStopoverAirports)
                    attachEvent.setData($scope.addStopoverAirports);
                },
                attrTextModel: function(name, data) {
                    $scope.addStopoverAirportCode = getPortByName(name, data);
                    $scope.addStopoverAirport = name;
                    $scope.$apply();
                }
            });
            //添加目的机场
            addEndAirportEle = selectFactory({
                data: $scope.addEndAirports,
                id: "add-endAirport",
                isSearch: true,
                height: 240,
                pagination: true,
                closeLocalSearch: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                searchPlaceHoder: "请输入名称或三字码",
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.addEndAirports = $scope.getCurrentAirData(data,currentPage);
                    rebuildAirportName($scope.addEndAirports)
                    attachEvent.setData($scope.addEndAirports);
                },
                attrTextModel: function(name, data) {
                    $scope.addEndAirportCode = getPortByName(name, data);
                    $scope.addEndAirport = name;
                    if($scope.addEndAirport == $scope.addStartAirport) {
                        $("#add-endAirport").val("");
                        $scope.addEndAirport = "";
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
            var data = airLineService.getCountry(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };

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
            return  airLineService.getCity(cityConfig);
        };

        $scope.getCurrentAirData = function(q,currentPage){
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
            var data = airLineService.getAirportShort(config);
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

        function getAirPortListByCountryId(data,currentPage,countryId) {
                var cityConfig = {
                    seatParams: {
                        countryId: countryId ?countryId:'',
                        pageIndex:currentPage ? currentPage:1,
                        pageSize:10,
                        q: data ? data.trim() :""
                    }
                };
                return  airLineService.getAirPortListByCountryId(cityConfig);
        }

        function getPortByName(name, data) {
            if(!data) {
                data = airLineService.getAirportShort();
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return  data[index].id;
                }
            }
            return "无匹配结果";
        }

        function rebuildAirportName(data) {
            var data = data.data;
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].triadCode + '(' + data[index].name + ')';
            }
        }
    }]);
});

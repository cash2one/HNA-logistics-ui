easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'widget/flatpickr',
    'public/common/tableController.js',
    'widget/slides'
],function() {
    app.controller('flightSettingCtrl', ['$scope', 'flightSettingService', 'flightSettingView','tableService', function ($scope, flightSettingService, flightSettingView,tableService) {
        $scope.flightSetting = {id:''};
        $scope.conf = [];
        $scope.airportNames=[];
        var flatpickrId=[], optional_config = {
            enableTime: true,
            noCalendar: true,
            enableSeconds: false,
            time_24hr: true,
            dateFormat: "H:i",
            defaultDate:"",
            minuteIncrement: 1,
            defaultHour: 12,
            onOpen:function(dateObject, dateString, event){
                if(!dateString){
                    event.setDate("12:00",false,"H:i")
                } else {
                    event.resetDefaultDate(dateString);
                }
            },
            onClose:function(dateObject, dateString){reWriteTime();},
            defaultMinute: 0
        };
        function reWriteTime() {
            if($scope.isSame === "false"){
                var sunStrTime,sunArrTime,
                    strMon = $("#startTime_Mon"),strTue = $("#startTime_Tue"),
                    strWed = $("#startTime_Wed"),strThu = $("#startTime_Thu"),
                    strFri = $("#startTime_Fri"),strSat = $("#startTime_Sat"),
                    endMon = $("#endTime_Mon"),endTue = $("#endTime_Tue"),
                    endWed = $("#endTime_Wed"),endThu = $("#endTime_Thu"),
                    endFri = $("#endTime_Fri"),endSat = $("#endTime_Sat");

                $scope.startTime_Sun = sunStrTime = $("#startTime_Sun").val();
                $scope.endTime_Sun = sunArrTime = $("#endTime_Sun").val();
                if(!strMon.val() && !strTue.val() && !strWed.val() &&
                    !strThu.val() && !strFri.val() && !strSat.val()
                ){
                    $scope.startTime_Sat = $scope.startTime_Fri = $scope.startTime_Thu =
                    $scope.startTime_Wed = $scope.startTime_Tue = $scope.startTime_Mon = $scope.startTime_Sun;
                    strMon.val(sunStrTime);
                    strTue.val(sunStrTime);
                    strWed.val(sunStrTime);
                    strThu.val(sunStrTime);
                    strFri.val(sunStrTime);
                    strSat.val(sunStrTime);
                }
                if(!endMon.val() && !endTue.val() && !endWed.val() &&
                    !endThu.val() && !endFri.val() && !endSat.val()
                ){
                    $scope.endTime_Sat = $scope.endTime_Fri = $scope.endTime_Thu =
                    $scope.endTime_Wed = $scope.endTime_Tue = $scope.endTime_Mon = $scope.endTime_Sun;
                    endMon.val(sunArrTime);
                    endTue.val(sunArrTime);
                    endWed.val(sunArrTime);
                    endThu.val(sunArrTime);
                    endFri.val(sunArrTime);
                    endSat.val(sunArrTime);
                }

                $scope.startTime_Mon = strMon.val();
                $scope.startTime_Tue = strTue.val();
                $scope.startTime_Wed = strWed.val();
                $scope.startTime_Thu = strThu.val();
                $scope.startTime_Fri = strFri.val();
                $scope.startTime_Sat = strSat.val();
                $scope.endTime_Mon = endMon.val();
                $scope.endTime_Tue = endTue.val();
                $scope.endTime_Wed = endWed.val();
                $scope.endTime_Thu = endThu.val();
                $scope.endTime_Fri = endFri.val();
                $scope.endTime_Sat = endSat.val();
                $scope.$apply();
                //checkSaveFlightSetting(false)
            }
            if($scope.isSame === "true"){
                $scope.startTime_day = $("#startTime_day").val();
                $scope.endTime_day = $("#endTime_day").val();
                $scope.$apply();
                //checkSaveFlightSetting(true)
            }
        }

        $scope.changeRadio= function(query){
            $scope.flatpickrId = getFlatpickrId(query);
            initFlatpickr();
        };
        function getFlatpickrId(query){
            if (query === "true") {
                flatpickrId = [
                    "startTime_day","endTime_day"
                ];
            } else {
                flatpickrId = [
                    "startTime_Sun","endTime_Sun",
                    "startTime_Mon","endTime_Mon",
                    "startTime_Tue","endTime_Tue",
                    "startTime_Wed","endTime_Wed",
                    "startTime_Thu","endTime_Thu",
                    "startTime_Fri","endTime_Fri",
                    "startTime_Sat","endTime_Sat"
                ];
            }
            return flatpickrId
        }
        function initFlatpickr(){
            optional_config.defaultDate="";
            $scope.flatpickrId.forEach(function(value,index){
                var id = "#" + value;
                if($(id).val()){
                    $(id).val("");
                }
                $(id).flatpickr(optional_config);
            });
            if($scope.isSame ==="true"){
                $scope.startTime_day = "";
                $scope.endTime_day = "";
                $scope.$apply();
                //checkSaveFlightSetting(true);
            }else{
                $scope.startTime_Sun = "";
                $scope.endTime_Sun = "";
                $scope.startTime_Mon = "";
                $scope.endTime_Mon = "";
                $scope.startTime_Tue = "";
                $scope.endTime_Tue = "";
                $scope.startTime_Wed = "";
                $scope.endTime_Wed = "";
                $scope.startTime_Thu = "";
                $scope.endTime_Thu = "";
                $scope.startTime_Fri = "";
                $scope.endTime_Fri = "";
                $scope.startTime_Sat = "";
                $scope.endTime_Sat = "";
                $scope.$apply();
                //checkSaveFlightSetting(false);
            }
        }

        $scope.getLanguage = function(){
            flightSettingService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        $("#startTime").flatpickr(optional_config);
        $("#endTime").flatpickr(optional_config);

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("flightSetting", 'flightSetting_page_name'),
                Lang.getValByKey("flightSetting", 'flightSetting_fly_start'),
                Lang.getValByKey("flightSetting", 'flightSetting_fly_end'),
                Lang.getValByKey("flightSetting", 'flightSetting_fly_time'),
                Lang.getValByKey("flightSetting", 'flightSetting_fly_type'),
                Lang.getValByKey("flightSetting", 'flightSetting_fly_company'),
                Lang.getValByKey("flightSetting", 'flightSetting_line_Type')
            ],
            'tableBody': [],
            'restURL': 'logistics.getFlightSettingTable',//表格获取接口
            'restData': {
                'q': '',
                'startAirportId': '',
                'endAirportId': '',
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
            $scope.tableModel.restData.startAirportId = $scope.searchStartFlightCode;
            $scope.tableModel.restData.endAirportId = $scope.searchEndFlightCode;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    tableReData();
                    $scope.nestFlightSettingForm = false;
                    setTimeout(function() {
                        var height = $('.flightSetting-table-page').height() - 330;
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            height = $('.flightSetting-table-page').height() - 330;    //重新计算高度
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        $scope.$watch('tableModel',  function(newValue, oldValue) {
            if (newValue === oldValue) {return; }

            tableReData();
        }, true);

        function tableReData(){
            angular.forEach($scope.tableModel.tableBody, function(value, key) {
                $scope.tableModel.tableBody[key].flightTimes = '';
                if(value.isSame) {
                    if(value.startTime && value.endTime){
                        $scope.tableModel.tableBody[key].flightTimes = value.startTime +"-"+ value.endTime;
                    }
                }else{
                    if(value.details[0].startTime || value.details[1].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[0].startTime + "-" + value.details[1].arriveTime + "，"
                    }
                    if(value.details[2].startTime || value.details[3].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[2].startTime + "-" + value.details[3].arriveTime + "，"
                    }
                    if(value.details[4].startTime || value.details[5].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[4].startTime + "-" + value.details[5].arriveTime + "，"
                    }
                    if(value.details[6].startTime || value.details[7].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[6].startTime + "-" + value.details[7].arriveTime + "，"
                    }
                    if(value.details[8].startTime || value.details[9].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[8].startTime + "-" + value.details[9].arriveTime + "，"
                    }
                    if(value.details[10].startTime || value.details[11].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[10].startTime + "-" + value.details[11].arriveTime + "，"
                    }
                    if(value.details[12].startTime || value.details[13].arriveTime){
                        $scope.tableModel.tableBody[key].flightTimes += value.details[12].startTime + "-" + value.details[13].arriveTime
                    }
                }
            })
        }

        $scope.clearData = function() {
            optional_config.defaultDate="";
            $("#startTime").flatpickr(optional_config);
            $("#endTime").flatpickr(optional_config);
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.startAirportId = "";
            $scope.tableModel.restData.endAirportId = "";
            $scope.tableModel.restData.startTime = "";
            $scope.tableModel.restData.endTime = "";
            $scope.searchStartFlight = "";
            $scope.searchEndFlight = "";
            $scope.searchStartFlightCode = "";
            $scope.searchEndFlightCode = "";
            $scope.getTable();
        };

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length){
                flightSettingView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                    tip: Lang.getValByKey("flightSetting", 'flightSetting_code_modelDelTips')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", 'common_page_delete'),
                    application:'delete',
                    operationEvent: function () {
                        flightSettingService.del(config, function(data){
                            flightSettingView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                            }
                        });
                    }
                }]
            };
            flightSettingView.promptBox(opt);
        };

        var searchStartFlightEle,searchEndFlightEle,addFlightCompanyEle,addFlightTypeEle,addFlightLineEle,addAirportTypeEle;
        $scope.addAirportTypes = [
            {code:1,name:Lang.getValByKey("flightSetting", 'flightSetting_self_airLine')},
            {code:2,name:Lang.getValByKey("flightSetting", 'flightSetting_SPA_airLine')},
            {code:3,name:Lang.getValByKey("flightSetting", 'flightSetting_car_airLine')}
        ];
        $scope.initSelectList = function() {
            var portConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            };
            $scope.searchStartFlights  = $scope.searchEndFlights = flightSettingService.getAirportShort(portConfig);
            $scope.addFlightCompanys  = flightSettingService.getCarrierCompanyShort(portConfig);
            $scope.addFlightTypes  = flightSettingService.getAirplaneModels(portConfig);
            $scope.addFlightLines  = flightSettingService.getAirLineShort(portConfig);
            //搜索始发机场
            searchStartFlightEle = selectFactory({
                data: $scope.searchStartFlights,
                isSearch: true,
                closeLocalSearch:true,
                id: "search-start",
                pagination: true,
                searchPlaceHoder: "请输入名称或三字码",
                onSearchValueChange:function(attachEvent, data, currentPage) {
                    $scope.searchStartFlights = $scope.getAirportData(data,currentPage);
                    attachEvent.setData($scope.searchStartFlights);
                },
                attrTextModel: function(name, data) {
                    $scope.searchStartFlightCode = getPortByName(name, data);
                    $scope.searchStartFlight = name;
                    if($scope.searchStartFlight == $scope.searchEndFlight) {
                        $("#search-start").val("");
                        $scope.searchStartFlight = "";
                    }
                    $scope.$apply();
                }
            });
            //搜索目的机场
            searchEndFlightEle = selectFactory({
                data: $scope.searchEndFlights,
                isSearch: true,
                id: "search-end",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称或三字码",
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.searchEndFlights = $scope.getAirportData(data,currentPage);
                    attachEvent.setData($scope.searchEndFlights);
                },
                attrTextModel: function(name, data) {
                    $scope.searchEndFlightCode = getPortByName(name, data);
                    $scope.searchEndFlight = name;
                    if($scope.searchEndFlight == $scope.searchStartFlight) {
                        $("#search-end").val("");
                        $scope.searchEndPort = "";
                    }
                    $scope.$apply();
                }
            });

            //添加航运公司
            addFlightCompanyEle = selectFactory({
                data: $scope.addFlightCompanys,
                isSearch: true,
                id: "flightCompany",
                pagination: true,
                searchPlaceHoder: "请输入名称或二字码",
                closeLocalSearch: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addFlightCompanys = $scope.getCarrierCompanyData(data,currentPage);
                    attachEvent.setData($scope.addFlightCompanys);
                },
                attrTextModel: function(name, data) {
                    $scope.flightCompanyCode = getPortByName(name, data);
                    $scope.flightCompany = name;
                    $scope.$apply();
                }
            });
            //添加机型
            addFlightTypeEle = selectFactory({
                data: $scope.addFlightTypes,
                isSearch: true,
                id: "flightType",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称或四字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addFlightTypes = $scope.getAirplaneModelData(data,currentPage);
                    attachEvent.setData($scope.addFlightTypes);
                },
                attrTextModel: function(name, data) {
                    $scope.flightTypeCode = getPortByName(name, data);
                    $scope.flightType = name;
                    $scope.$apply();
                }
            });
            //添加所属航线
            addFlightLineEle = selectFactory({
                data: $scope.addFlightLines,
                isSearch: true,
                id: "flightLine",
                pagination: true,
                closeLocalSearch: true,
                searchPlaceHoder: "请输入名称或编码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addFlightLines = $scope.getAirlineData(data,currentPage);
                    attachEvent.setData($scope.addFlightLines);
                },
                attrTextModel: function(name, data) {
                    $scope.flightLineCode = getPortByName(name, data);
                    $scope.flightLine = name;
                    flightSettingService.getAirLineDetail({'seatParams':{'id':$scope.flightLineCode ? $scope.flightLineCode:""}}, function(data){
                        if(data && data.errorCode === 0){
                            $scope.airportName = data.data.airports[0].airportName + " - "
                                +data.data.airports[data.data.airports.length-1].airportName;

                            $scope.airportTriadCode = data.data.airports[0].airportTriadCode + " - "
                                +data.data.airports[data.data.airports.length-1].airportTriadCode;

                            $scope.startAirportId = data.data.airports[0].airportId;
                            $scope.arriveAirportId = data.data.airports[data.data.airports.length-1].airportId;
                            $scope.baseInfoForm.$valid = false;
                            if($scope.isSame ==="true"){
                                $scope.startTime_day = "";
                                $scope.endTime_day = "";
                                $scope.$apply();
                                //checkSaveFlightSetting(true);
                            }else{
                                $scope.startTime_Sun = "";
                                $scope.endTime_Sun = "";
                                $scope.startTime_Mon = "";
                                $scope.endTime_Mon = "";
                                $scope.startTime_Tue = "";
                                $scope.endTime_Tue = "";
                                $scope.startTime_Wed = "";
                                $scope.endTime_Wed = "";
                                $scope.startTime_Thu = "";
                                $scope.endTime_Thu = "";
                                $scope.startTime_Fri = "";
                                $scope.endTime_Fri = "";
                                $scope.startTime_Sat = "";
                                $scope.endTime_Sat = "";
                                $scope.$apply();
                                //checkSaveFlightSetting(false);
                            }
                            $scope.changeRadio($scope.isSame)
                        }
                    });
                }
            });
            //添加航班类型
            addAirportTypeEle = selectFactory({
                data: {data:$scope.addAirportTypes},
                id: 'airportType',
                isUsePinyin: true,
                defaultText:'',
                attrTextModel: function (name, data) {
                    $scope.airportTypeId = getPortByName(name, data,true);
                    $scope.airportType = name;
                    $scope.$apply();
                }
            });
        };

        $scope.getAirportData = function(q,currentPage){
            var config = getDataConfig(q,currentPage);
            var data = flightSettingService.getAirportShort(config);
            angular.forEach(data.data, function(value, key){
                value.name = value.triadCode +'('+ value.name +')';
            });
            return data;
        };
        $scope.getAirlineData = function(q,currentPage){
            var config = getDataConfig(q,currentPage);
            var data = flightSettingService.getAirLineShort(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };
        $scope.getCarrierCompanyData = function(q,currentPage){
            var config = getDataConfig(q,currentPage);
            var data = flightSettingService.getCarrierCompanyShort(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.figureCode +')';
            });
            return data;
        };
        $scope.getAirplaneModelData = function(q,currentPage){
            var config = getDataConfig(q,currentPage);
            var data = flightSettingService.getAirplaneModels(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.icao +')';
            });
            return data;
        };
        function getDataConfig(q,currentPage) {
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
            return config
        }
        function getPortByName(name, data,flag) {
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return flag?data[index].code: data[index].id;
                }
            }
        }

        $scope.goBack = function () {
            if($scope.editable) {
                $scope.flightSetting.id = '';
                $scope.validateCodeError = false;
                $scope.getTable();
            }else{
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey('common', 'common_back_confirm')
                    },
                    cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                    operation: [
                        {
                            type: 'submit',
                            application: 'delete',
                            description: Lang.getValByKey('common', 'common_back_yes'),
                            operationEvent: function () {
                                $scope.flightSetting.id = '';
                                $scope.validateCodeError = false;
                                $scope.clearData();
                                $scope.$apply();
                                $(document).promptBox('closePrompt');
                            }
                        }
                    ]
                });
            }
        };

        $scope.cancelFightSetting = function () {
            if($scope.isEdit){
                $scope.editable = true;
                $scope.flightSettingDetail($scope.flightSetting.id);
            }else{
                $scope.nestFlightSettingForm = false;
                $scope.validateCodeError = false;
            }
        };

        $scope.add = function(){
            $scope.baseInfoForm.$setPristine();
            $scope.baseInfoForm.$setUntouched();
            $scope.conf=[];
            $scope.nestFlightSettingForm = true;
            $scope.editable = false;
            $scope.isEdit = false;
            $scope.isSame = "true";
            $scope.isStopOver = "false";
            $scope.flatpickrId = getFlatpickrId("true");

            $scope.flightCode = "";
            $scope.flightLineCode = "";
            $scope.flightLine = "";
            $scope.flightCompanyCode = "";
            $scope.flightCompany = "";
            $scope.flightTypeCode = "";
            $scope.flightType = "";

            $scope.airportName = "";
            $scope.airportTriadCode = "";
            $scope.startAirportId = "";
            $scope.arriveAirportId = "";
            $scope.startTime = "";
            $scope.arriveTime = "";
            $scope.sun_startTime = "";
            $scope.sun_arriveTime = "";
            $scope.mon_startTime = "";
            $scope.mon_arriveTime = "";
            $scope.tue_startTime = "";
            $scope.tue_arriveTime = "";
            $scope.wed_startTime = "";
            $scope.wed_arriveTime = "";
            $scope.thu_startTime = "";
            $scope.thu_arriveTime = "";
            $scope.fri_startTime = "";
            $scope.fri_arriveTime = "";
            $scope.sat_startTime = "";
            $scope.sat_arriveTime = "";

            $scope.airportType = $scope.addAirportTypes[0].name;
            $scope.airportTypeId = $scope.addAirportTypes[0].code;
        };

        $scope.flightSettingDetail = function(id){
            $scope.baseInfoForm.$setPristine();
            $scope.baseInfoForm.$setUntouched();
            $scope.flightSetting.id = id;
            $scope.nestFlightSettingForm = true;
            $scope.editable = true;

            var config = {seatParams: { id: id}};
            flightSettingService.getDetail(config, function (res) {
                if (res.errorCode === 0) {
                    $scope.flightCode = res.data.code;//航班号
                    $scope.flightLineCode = res.data.airlineId;
                    $scope.flightLine = res.data.airlineName;//所属航线
                    $scope.flightCompanyCode = res.data.carrierCompanyId;
                    $scope.flightCompany = res.data.carrierCompanyName;//航空公司
                    $scope.flightTypeCode = res.data.airplaneModelId;
                    $scope.flightType = res.data.airplaneModelName;//机型
                    $scope.airportTypeId =  res.data.type;
                    $scope.airportType = res.data.typeName;

                    var details = res.data.details;
                    $scope.airportName = details[0].airportName + " - " +details[1].airportName;
                    $scope.airportTriadCode = details[0].airportTriadCode + " - " +details[1].airportTriadCode;

                    if(res.data.isSame){
                        $scope.isSame = "true";
                        $scope.startTime = details[0].startTime;
                        $scope.arriveTime = details[1].arriveTime
                    }else{
                        $scope.isSame = "false";
                        $scope.sun_startTime = details[0].startTime;
                        $scope.sun_arriveTime = details[1].arriveTime;
                        $scope.mon_startTime = details[2].startTime;
                        $scope.mon_arriveTime = details[3].arriveTime;
                        $scope.tue_startTime = details[4].startTime;
                        $scope.tue_arriveTime = details[5].arriveTime;
                        $scope.wed_startTime = details[6].startTime;
                        $scope.wed_arriveTime = details[7].arriveTime;
                        $scope.thu_startTime = details[8].startTime;
                        $scope.thu_arriveTime = details[9].arriveTime;
                        $scope.fri_startTime = details[10].startTime;
                        $scope.fri_arriveTime = details[11].arriveTime;
                        $scope.sat_startTime = details[12].startTime;
                        $scope.sat_arriveTime = details[13].arriveTime;
                    }
                    if(res.data.isStopOver){
                        $scope.isStopOver = "true";
                    }else{
                        $scope.isStopOver = "false";
                    }
                }
            });
        };

        $scope.editFlightSetting = function () {
            $scope.baseInfoForm.$setPristine();
            $scope.baseInfoForm.$setUntouched();
            $scope.nestFlightSettingForm = true;
            $scope.isEdit=true;
            $scope.editable = false;
            var config = {
                seatParams: { id: $scope.flightSetting.id }
            };
            flightSettingService.getDetail(config, function (res) {
                if (res.errorCode === 0) {
                    $scope.flightCode = res.data.code;//航班号
                    $scope.flightLineCode = res.data.airlineId;
                    $scope.flightLine = res.data.airlineName;//所属航线
                    $scope.flightCompanyCode = res.data.carrierCompanyId;
                    $scope.flightCompany = res.data.carrierCompanyName;//航空公司
                    $scope.flightTypeCode = res.data.airplaneModelId;
                    $scope.flightType = res.data.airplaneModelName;//机型
                    $scope.airportTypeId =  res.data.type;
                    $scope.airportType = res.data.typeName;

                    var details = res.data.details;
                    $scope.startAirportId = details[0].airportId;
                    $scope.arriveAirportId = details[1].airportId;
                    if(res.data.isSame){
                        $scope.isSame = "true";
                        flatpickrData(getFlatpickrId("true"),details);
                        $scope.startTime_day = details[0].startTime;
                        $scope.endTime_day = details[1].arriveTime;
                    }else{
                        $scope.isSame = "false";
                        flatpickrData(getFlatpickrId("false"),details);
                        $scope.startTime_Sun = details[0].startTime;
                        $scope.endTime_Sun = details[1].arriveTime;
                        $scope.startTime_Mon = details[2].startTime;
                        $scope.endTime_Mon = details[3].arriveTime;
                        $scope.startTime_Tue = details[4].startTime;
                        $scope.endTime_Tue = details[5].arriveTime;
                        $scope.startTime_Wed = details[6].startTime;
                        $scope.endTime_Wed = details[7].arriveTime;
                        $scope.startTime_Thu = details[8].startTime;
                        $scope.endTime_Thu = details[9].arriveTime;
                        $scope.startTime_Fri = details[10].startTime;
                        $scope.endTime_Fri = details[11].arriveTime;
                        $scope.startTime_Sat = details[12].startTime;
                        $scope.endTime_Sat = details[13].arriveTime;
                    }
                    if(res.data.isStopOver){
                        $scope.isStopOver = "true";
                    }else{
                        $scope.isStopOver = "false";
                    }
                }
            });
        };
        function flatpickrData(flatpickrId,details){
            flatpickrId.forEach(function(value,index){
                var id = "#" + value;
                if(index % 2 === 0){
                    $(id).val(details[index].startTime);
                    optional_config.defaultDate = details[index].startTime
                }else{
                    $(id).val(details[index].arriveTime);
                    optional_config.defaultDate = details[index].arriveTime
                }
                $(id).flatpickr(optional_config);
            });
        }

        $scope.submitFightSetting = function () {
            var isSame,isStopOver;
            $scope.isSame === "true"? isSame = true : isSame = false;
            $scope.isStopOver === "true"? isStopOver = true : isStopOver = false;
            if(isSame){
                if(!$scope.startTime_day){
                    $scope.startTime_day = $("#startTime_day").val();
                }
                if(!$scope.endTime_day){
                    $scope.endTime_day = $("#endTime_day").val();
                }
                $scope.conf = [
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_day
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_day
                    }
                ]
            }else{
                if(!$scope.startTime_Sun){
                    $scope.startTime_Sun = $("#startTime_Sun").val();
                }
                if(!$scope.endTime_Sun){
                    $scope.endTime_Sun = $("#endTime_Sun").val();
                }
                if(!$scope.startTime_Mon){
                    $scope.startTime_Mon = $("#startTime_Mon").val();
                }
                if(!$scope.endTime_Mon){
                    $scope.endTime_Mon = $("#endTime_Mon").val();
                }
                if(!$scope.startTime_Tue){
                    $scope.startTime_Tue = $("#startTime_Tue").val();
                }
                if(!$scope.endTime_Tue){
                    $scope.endTime_Tue = $("#endTime_Tue").val();
                }
                if(!$scope.startTime_Wed){
                    $scope.startTime_Wed = $("#startTime_Wed").val();
                }
                if(!$scope.endTime_Wed){
                    $scope.endTime_Wed = $("#endTime_Wed").val();
                }
                if(!$scope.startTime_Thu){
                    $scope.startTime_Thu = $("#startTime_Thu").val();
                }
                if(!$scope.endTime_Thu){
                    $scope.endTime_Thu = $("#endTime_Thu").val();
                }
                if(!$scope.startTime_Fri){
                    $scope.startTime_Fri = $("#startTime_Fri").val();
                }
                if(!$scope.endTime_Fri){
                    $scope.endTime_Fri = $("#endTime_Fri").val();
                }
                if(!$scope.startTime_Sat){
                    $scope.startTime_Sat = $("#startTime_Sat").val();
                }
                if(!$scope.endTime_Sat){
                    $scope.endTime_Sat = $("#endTime_Sat").val();
                }
                $scope.conf = [
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Sun
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Sun
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Mon
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Mon
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Tue
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Tue
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Wed
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Wed
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Thu
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Thu
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Fri
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Fri
                    },
                    {
                        airportId:$scope.startAirportId,
                        startTime:$scope.startTime_Sat
                    },
                    {
                        airportId:$scope.arriveAirportId,
                        arriveTime:$scope.endTime_Sat
                    }
                ]
            }
            if (!$scope.flightCode) {
                $scope.baseInfoForm.flightCode.$setDirty();
            }
            if (!$scope.flightCompany) {
                $scope.baseInfoForm.flightCompany.$setDirty();
            }
            if (!$scope.flightType) {
                $scope.baseInfoForm.flightType.$setDirty();
            }
            if (!$scope.flightLine) {
                $scope.baseInfoForm.flightLine.$setDirty();
            }
            if (!$scope.flightLineCode) {
                $scope.baseInfoForm.flightLineCode.$setDirty();
            }

            if (!checkSaveFlightSetting(isSame) || !$scope.baseInfoForm.$valid || $scope.validateCodeError) {
                scrollToErrorView($(".from-box"));
                return;
            }

            var config = {
                urlParams : {
                    code: $scope.flightCode,
                    airlineId: $scope.flightLineCode,
                    carrierCompanyId: $scope.flightCompanyCode,
                    type: $scope.airportTypeId,
                    airplaneModelId: $scope.flightTypeCode,
                    isSame: isSame,
                    isStopOver:isStopOver,
                    details: $scope.conf
                }
            };
            if($scope.flightSetting.id) {
                config.seatParams = {'id': $scope.flightSetting.id};
                flightSettingService.saveEdit(config, function(data){
                    if(data && data.errorCode === 0){
                        flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestFlightSettingForm = false;
                        $scope.getTable();
                        $scope.flightSetting.id ='';
                    }else{
                        flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                    optional_config.defaultDate="";
                });
            }else{
                flightSettingService.save(config, function(data){
                    if(data && data.errorCode === 0){
                        flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestFlightSettingForm = false;
                        $scope.getTable();
                    }else{
                        flightSettingView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                    optional_config.defaultDate="";
                });
            }
        };

        function checkSaveFlightSetting(isSame) {
            if(isSame){
                if(!$scope.startTime_day) {
                    $scope.baseInfoForm.startTime_day.$setDirty();
                }
                if(!$scope.endTime_day) {
                    $scope.baseInfoForm.endTime_day.$setDirty();
                }
            }else{
                if (!$scope.startTime_Sun) {
                    $scope.baseInfoForm.startTime_Sun.$setDirty();
                }
                if (!$scope.endTime_Sun) {
                    $scope.baseInfoForm.endTime_Sun.$setDirty();
                }
                if (!$scope.startTime_Mon) {
                    $scope.baseInfoForm.startTime_Mon.$setDirty();
                }
                if (!$scope.endTime_Mon) {
                    $scope.baseInfoForm.endTime_Mon.$setDirty();
                }
                if (!$scope.startTime_Tue) {
                    $scope.baseInfoForm.startTime_Tue.$setDirty();
                }
                if (!$scope.endTime_Tue) {
                    $scope.baseInfoForm.endTime_Tue.$setDirty();
                }
                if (!$scope.startTime_Wed) {
                    $scope.baseInfoForm.startTime_Wed.$setDirty();
                }
                if (!$scope.endTime_Wed) {
                    $scope.baseInfoForm.endTime_Wed.$setDirty();
                }
                if (!$scope.startTime_Thu) {
                    $scope.baseInfoForm.startTime_Thu.$setDirty();
                }
                if (!$scope.endTime_Thu) {
                    $scope.baseInfoForm.endTime_Thu.$setDirty();
                }
                if (!$scope.startTime_Fri) {
                    $scope.baseInfoForm.startTime_Fri.$setDirty();
                }
                if (!$scope.endTime_Fri) {
                    $scope.baseInfoForm.endTime_Fri.$setDirty();
                }
                if (!$scope.startTime_Sat) {
                    $scope.baseInfoForm.startTime_Sat.$setDirty();
                }
                if (!$scope.endTime_Sat) {
                    $scope.baseInfoForm.endTime_Sat.$setDirty();
                }
            }
            console.log("$valid===",$scope.baseInfoForm.$valid)
            return $scope.baseInfoForm.$valid;
        }

        $scope.checkFlightsCode = function () {
            if (!$scope.flightCode) {
                return;
            }

            var config = {
                urlParams: {
                    code: $scope.flightCode,
                    id:$scope.flightSetting.id ? $scope.flightSetting.id:''
                }
            };
            flightSettingService.checkFlightsCode(config, function (response) {
                if(response.errorCode === 0) {
                    $scope.validateCodeError = false;
                    angular.element($(".validate-code").removeClass("ng-invalid"));
                }else{
                    $scope.validateCodeError = true;
                    angular.element($(".validate-code").addClass("ng-invalid"));
                }
            });
        };

        $scope.cancelErrorCode = function () {
            $scope.validateCodeError = false;
            angular.element($(".validate-code").removeClass("ng-invalid"));
        };
    }]);
});

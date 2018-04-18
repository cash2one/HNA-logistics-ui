easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/tab',
    "widget/select",
    'public/common/tableController.js'
], function() {
    app.controller('internationalCtrl', ['$scope', 'internationalService', 'internationalView', 'tableService', function($scope, internationalService, internationalView, tableService) {
        var internationalEle = null;
        var sort = "";
        $scope.isHide = true//费用的国际化页面需要隐藏搜索功能
        //根据url判断需要调用那个接口
        var url = window.location.href,
            param = easySpa.queryUrlValByKey("q"),
            restUrl,
            tableHead,
            opstions = [];
        if(param == 'stationAirport') {
            $scope.title = Lang.getValByKey("international", 'international_code_airport');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenamethree');
            restUrl = "logistics.getAirportsInternational"; //获取国际化列表接口
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_airportName'),
                Lang.getValByKey("international", 'international_code_threeCode')
            ]; //国际化列表表头
            opstions = {id : 'refId', name:'name',code: 'triadCode', localName : 'localName'}; //国际化列表统一返回字段
            sort = "triadCode";
        } else if(param == 'stationPort'){
            $scope.title = Lang.getValByKey("international", 'international_code_port');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placeport');
            restUrl = "logistics.getPortsInternational"; //获取国际化列表接口
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_portName'),
                Lang.getValByKey("international", 'international_code_portcode')
            ]; //国际化列表表头
            opstions = {id : 'id', name:'name',code: 'code', localName : 'localName'}; //国际化列表统一返回字段
            sort = "code";

        }else if(param == "country") {
            $scope.title = Lang.getValByKey("international", 'international_code_country');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenametwo');
            restUrl = "logistics.countryInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_countryName'),
                Lang.getValByKey("international", 'international_code_twoCode')
            ];
            opstions = {id : 'refId', name:'name',code: 'figureCode', localName : 'localName'};
            sort = "figureCode";
        }else if(param == "carrierAirline"){
            $scope.title = Lang.getValByKey("international", 'international_code_airline');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenametwo');
            restUrl = "logistics.companyInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_airlineName'),
                Lang.getValByKey("international", 'international_code_twoCode')
            ];
            opstions = {id : 'refId', name:'name',code: 'figureCode', localName : 'localName'};
            sort = "figureCode";
        }else if(param == 'cost'){
            $scope.title = Lang.getValByKey("international", 'international_code_cost');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenamecode');
            restUrl = "logistics.getCostInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_costName'),
                Lang.getValByKey("common", 'common_code_code')
            ];
            opstions = {id : 'refId', name:'name',code: 'code', localName : 'localName'};
            sort = "code";
        }else if(param == 'account') {
            $scope.title = Lang.getValByKey("international", 'international_code_account');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenamecode');
            restUrl = "logistics.getAccountInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_accountName'),
                Lang.getValByKey("common", 'common_code_code')
            ];
            opstions = {id : 'refId', name:'name',code: 'code', localName : 'localName'};
            sort = "code";
        } else if(param == "currency") {
            $scope.title = Lang.getValByKey("international", 'international_code_currency');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenamethree');
            restUrl = "logistics.currencyInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_currency_name'),
                Lang.getValByKey("international", 'international_code_threeCode')
            ];
            opstions = {id : 'refId', name:'name', code: 'code', localName : 'localName'};
            sort = "code";
        }else if(param == 'transportAirplane'){
            $scope.title = Lang.getValByKey("international", 'international_code_modelInter');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_placenamethree');
            restUrl = "logistics.getTransportAirplaneInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_modelName'),
                Lang.getValByKey("international", 'international_code_threeCode')
            ];
            opstions = {id : 'id', name:'name',code: 'iata', localName : 'localName'};
            sort = "iata";
        }else if(param == 'transportShip'){
            $scope.title = Lang.getValByKey("international", 'international_code_shipInter');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_ship_placeport');
            restUrl = "logistics.getShipInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_shipName'),
                Lang.getValByKey("international", 'international_code_shipNameEn')
            ];
            opstions = {id : 'id', name:'name',code: 'nameEn', localName : 'localName'};
            sort = "nameEn";
        }else if(param == 'carrierMaritime'){
            $scope.title = Lang.getValByKey("international", 'international_code_carrierMaritimeCompany');
            $scope.placeholder = Lang.getValByKey("international", 'international_code_carrierMaritimePlacehold');
            restUrl = "logistics.getShippingCompanyInternational";
            tableHead = [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("international", 'international_code_carrierMaritimeName'),
                Lang.getValByKey("international", 'international_code_carrierMaritimeCode')
            ];
            opstions = {id : 'id', name:'name', code:'code',localName : 'localName'};
            sort = "code";
        }

        $scope.internationalModel = {
            more: false,
            userWord: '',
            tableHeader: tableHead,
            tableBody: [],
            restURL: restUrl,
            restData: {
                q: '',
                unfilled: false,
                locked: -1,
                pageIndex: 1,
                pageSize: 10,
            },
            seatData:{
                uid:''
            },
            selectNumber: 0,
            selectFlag: false
        };
        $scope.localName = '繁體中文';
        $scope.localCode = 'zh-hk';
        $scope.seniorText = Lang.getValByKey("common", 'common_page_advancedFilter');

        /** 初始加载国际化列表 */
        $scope.$on('$viewContentLoaded',function(){
            loadListData();
        });

        function setScrollDetail(){

            if($scope.isHide){
                if($scope.showSenior == true) {
                    $('.table-container tbody').slimscroll({
                        height: $('.content-main').height() - 364
                    });
                }else{
                    $('.table-container tbody').slimscroll({
                        height: $('.content-main').height() - 315
                    });
                }
            }else{
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 234
                });
            }
        }
        $(window).on("resize",setScrollDetail);
        function loadListData(){
            $scope.lang = $scope.localCode;
            $scope.internationalModel.restData["sort"] = sort;
            var params = {
                seatParams : {language : $scope.lang},
                urlParams: $scope.internationalModel.restData
            };
            tableService.getTable($scope.internationalModel.restURL, params, function(data) {
                if(data.errorCode === 0) {
                    var packageData = data.data;
                    var Arr = [];
                    for(var i in packageData) {
                        Arr[i] = {};
                        Arr[i].id = packageData[i][opstions.id];
                        Arr[i].name = packageData[i][opstions.name];
                        Arr[i].localName = $.trim(packageData[i][opstions.localName]);
                        Arr[i].code = packageData[i][opstions.code];
                    };
                    data.data = Arr;
                    $scope.internationalModel = tableService.table($scope.internationalModel, params, data);
                    setScrollDetail();
                    if(data.data.length === 0){
                        $('.table-container tbody').slimscroll({
                            height: 0
                        });
                    }
                }
            });
            $scope.showSenior == true;
            // setScrollDetail();
            $('.user-table tbody').append($('.validate-text'));
        }

        $scope.showLanguage = function(){
            internationalService.getInternational(function(res){
                if(res.errorCode == 0){
                    internationalEle = selectFactory({
                        data: res,
                        maxHeight: 240,
                        minHeight: 34,
                        offset: 4,
                        id: "language",
                        defaultText: "",
                        showTextField: "localName",
                        attrTextModel: function(name, res) {
                            var internationalData = getSigleDataByName(name, res);
                            if(internationalData) {
                                $scope.localName = internationalData.localName;
                                $scope.localCode = internationalData.code;
                            };
                            loadListData();
                            $scope.$apply();
                        }
                    });
                    internationalEle.build();
                    internationalEle.updateData(res);
                }
            });

        };
        function getSigleDataByName(name, data) {
            var data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].localName == name) {
                    return data[index];
                }
            }
        };
        /** 返回 */
        $scope.goBack = function(){
            if($scope.showEditInternational){
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("common", 'common_back_confirm')
                    },
                    cancelDescription: Lang.getValByKey("common", 'common_back_no'),
                    operation: [
                        {
                            type: 'submit',
                            application: 'delete',
                            description: Lang.getValByKey("common", 'common_back_yes'),
                            operationEvent: function () {
                                $(document).promptBox('closePrompt');
                                window.location.href = '#/'+ param;
                            }
                        }
                    ]
                })
            }else{
                window.location.href = '#/'+ param;
            }
        };

        /** 编辑 */
        $scope.editInternational = function() {
            if(!$scope.internationalModel.pagination.isVisiblePage) {//编辑按钮不可点击
                $(document).promptBox({isDelay:true, contentDelay:"无结果，不可编辑！", type: 'errer', manualClose:true});
                return;
            }
            $scope.isHide = false;
            $scope.showEditInternational = true;
            loadListData();
        };

        /** input框输入值后，获取当前返回参数 */
        $scope.languageInfo = function($event) {
            /*var validateName  = /[`~!@#$￥%^……&*()（）\/——+=\|\\、\[\]{};；：:'’‘"“”,，.。?？<>《》]+/;
             if((validateName.test($($event.target).val()))) {
             $($event.target).addClass('error');
             $scope.validateInput = true;
             return false;
             }else {
             setTimeout(function() {
             if(!$(".lang-name").hasClass("error")) {
             $scope.validateInput = false;
             $scope.$apply();
             }
             }, 100);
             $($event.target).removeClass('error');
             return false;
             };*/
            $($event.target).data('name', $($event.target).val());
        };

        /** 保存 */
        $scope.save = function(){
            if($scope.validateInput) {//校验不通过则无法保存
                return;
            }
            var ele = $('.edit-international input'),
                dataParams = [],arr = [],config;

            ele.each(function(i){
                arr[i] = {};
                arr[i].language = $scope.localCode;
                arr[i].localName = ele.eq(i).data('name');
                arr[i].refId = ele.eq(i).data('ref');
                dataParams.push(arr[i])
            });

            config = {urlParams : dataParams, async: false};
            $scope.isHide = true;
            //根据url判断需要调用那个接口
            if(param == 'stationAirport'){
                internationalService.saveInternational(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            } else if(param == 'stationPort'){
                internationalService.savePortInternational(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'country'){
                internationalService.saveCountryInternational(config, function(res){
                    if(res.errorCode == 0) {
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            } else if(param == "currency") {
                internationalService.saveCurrencyInternational(config, function(res){
                    if(res.errorCode == 0) {
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }
            else if(param == 'carrierAirline'){
                internationalService.saveCompanyInternational(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'cost'){
                internationalService.saveCostInternational(config, function(res){
                    if(res.errorCode == 0) {
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'account'){
                internationalService.saveAccountInternational(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'transportAirplane'){
                internationalService.saveTransportAirplaneInternational(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'transportShip'){
                internationalService.saveInternationalShip(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }else if(param == 'carrierMaritime'){
                internationalService.saveInternationalCarrierMaritime(config, function(res){
                    if(res.errorCode == 0){
                        $scope.showEditInternational = false;
                        loadListData();
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        /** 取消 */
        $scope.cancel = function(){
            $scope.validateInput = false;
            $scope.showEditInternational = false;
            $scope.isHide = true;
            loadListData();
        };

        /** 检索国际化 */
        $scope.retrievalInternational = function(){
            $scope.isSeach = true;
            $scope.internationalModel.restData.pageIndex = 1;
            $scope.q = $scope.internationalModel.restData.q;
            loadListData();
        };

        /** 高级筛选 */
        $scope.seniorFilter = function() {
            if($scope.showSenior == true){
                $scope.seniorText = Lang.getValByKey("common", 'common_page_advancedFilter');
                if($scope.seniorChecked) {
                    $scope.checkSenior();
                }
            }else{
                $scope.seniorText = Lang.getValByKey("common", 'common_page_ordinaryFilter');
            }
            $scope.showSenior = !$scope.showSenior;
            setScrollDetail();
        };

        /** 筛选未填写项 */
        $scope.checkSenior = function() {
            $scope.seniorChecked = !$scope.seniorChecked;
            if($scope.seniorChecked == true) {
                $scope.internationalModel.restData.unfilled = true;
            }else {
                $scope.internationalModel.restData.unfilled = false;
            };
            loadListData();
        };
        $scope.$watch('internationalModel.tableBody',function(newValue,oldValue, scope) {//字段转换
            if(param == "country") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].figureCode) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].figureCode;
                    }
                }
            }
            if(param == "stationAirport") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].triadCode) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].triadCode;
                    }
                }
            }
            if(param == "carrierAirline") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].figureCode) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].figureCode;
                    }
                }
            }
            if(param == "transportAirplane") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].iata) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].iata;
                    }
                }
            }
            if(param == "transportShip") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].nameEn) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].nameEn;
                    }
                }
            }
            if(param == "carrierMaritime") {
                for (var index = 0; index < newValue.length; index++) {
                    if(newValue[index].code) {
                        $scope.internationalModel.tableBody[index].code = newValue[index].code;
                    }
                }
            }
        });

    }]);
});
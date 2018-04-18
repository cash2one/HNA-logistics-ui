easySpa.require([
    'widget/tab',
    'widget/select',
    'widget/calander',
    'widget/prompt'
], function(){
    app.controller('tryBillingCtrl', ['$scope', 'tryBillingService', 'tryBillingView', function($scope, tryBillingService, tryBillingView) {

        //初始化为 服务成本计费
        $scope.type = 'service';

        //初始化数据
        $scope.groupType = [
            {'id':1,'name':'海运','checked':false},
            {'id':6,'name':'空运','checked':false},
            {'id':11,'name':'速递','checked':false}
        ];

        //初始化时间控件
        tryBillingView.initCalander();

        /**====================================下拉列表======================================**/
        var servicesEle, productsEle, clientEle, accountEle, goodsEle, weightUnitEle, countryEle, provinceEle, cityEle, areaEle, streetEle, otherEle;
        /**
         * 获取服务下拉框
         */
        $scope.getServicesData = function(q, currentPage){
            q = q ? q : '';
            currentPage = currentPage ? currentPage : 1;
            var config = {
                'urlParams': {
                    'q': q,
                    'pageIndex': currentPage,
                    'pageSize': 10,
                    'status': 4
                },
                'seatParams':{
                    'serviceTypeId': -1
                }
            };
            var data = tryBillingService.getServices(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };
        $scope.getServices = function(){
            if(servicesEle){ return; }
            servicesEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-service",
                showTextField: "name",
                pagination: true,
                attrTextField: {
                    "ng-value": "uid"
                },
                closeLocalSearch: true,
                isSaveInputVal:true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.servicesData = $scope.getServicesData(data, currentPage);
                    attachEvent.setData($scope.servicesData);
                },
                attrTextId: function(uid){
                    $scope.iInputServicesValue = uid;
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.iInputServices = name;
                    $scope.$apply();
                }
            });
            servicesEle.open();
        };

        /**
         * 获取产品下拉列表
         */
        $scope.getProductData = function(q, currentPage) {
            q = q ? q : '';
            currentPage = currentPage ? currentPage : 1;
            var config = {
                'urlParams': {
                    'q': q,
                    'pageIndex': currentPage,
                    'pageSize': 10,
                    'groupId': $scope.topGrade,
                    'isForCalculate':false
                }
            };
            if($scope.topGrade == 11){
                config.urlParams.isForCalculate = true;
            }
            var data = tryBillingService.getProducts(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };
        $scope.getProducts = function(){
            if(productsEle){ return; }
            productsEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                searchPlaceHoder: '请输入名称或编码',
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-product",
                showTextField: "name",
                pagination: true,
                attrTextField: {
                    "ng-value": "uid"
                },
                isSaveInputVal:true,
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.productsData = $scope.getProductData(data, currentPage);
                    attachEvent.setData($scope.productsData);
                },
                attrTextId: function(uid){
                    $scope.iInputProductsValue = uid;
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.iInputProducts = name;
                    $scope.$apply();
                }
            });
            productsEle.open();
        };

        /**
         * 客户下拉框
         */
        $scope.getClientData = function(q, currentPage){
            q = q ? q : '';
            currentPage = currentPage ? currentPage : 1;
            var config = {
                'urlParams': {
                    'q': q,
                    'refCombos':'',
                    'isLocked': -1,
                    'evaluateLeval':-1,
                    'beyondLeval': false,
                    'pageIndex': currentPage,
                    'pageSize': 10,
                    'sortName': 'evaluateLeval',
                    'isAsc': false
                }
            };
            var data = tryBillingService.getClient(config);
            angular.forEach(data.data, function(value, key){
                value.userName += '('+ value.code +')';
            });
            return data;
        };
        $scope.getClient = function(){
            if(clientEle){ return; }
            clientEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-client",
                showTextField: "userName",
                closeLocalSearch: true,
                pagination: true,
                isSaveInputVal:true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.clientData = $scope.getClientData(data, currentPage);
                    attachEvent.setData($scope.clientData);
                },
                attrTextField: {
                    "ng-value": "id"
                },
                attrTextId: function(id){
                    $scope.iInputClientValue = id;
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.iInputClient = name;
                    $scope.$apply();
                }
            });
            clientEle.open();
        };

        /**
         * 获取结算方式下拉框
         */
        $scope.getAccountData = function(q, currentPage){
            q = q ? q : '';
            currentPage = currentPage ? currentPage : 1;
            var config = {
                'urlParams': {
                    'q': q,
                    'pageIndex': currentPage,
                    'pageSize': 10
                }
            };
            var data = tryBillingService.getAccount(config);
            angular.forEach(data.data, function(value, key) {
                value.name += '('+ value.code +')';
            });
            return data;
        };
        $scope.getAccount = function(){
            if(accountEle){ return; }
            accountEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-account",
                showTextField: "name",
                closeLocalSearch: true,
                pagination: true,
                isSaveInputVal:true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.accountData = $scope.getAccountData(data, currentPage);
                    attachEvent.setData($scope.accountData);
                },
                attrTextField: {
                    "ng-value": "id"
                },
                attrTextId: function(id){
                    $scope.iAccountValue = id;
                },
                attrTextModel: function(name){
                    $scope.iAccount = name;
                    $scope.$apply();
                }
            });
            accountEle.open();
        };

        /**
         * 获取货物类型下拉框
         */
        $scope.getGoods = function(){
            if(goodsEle){ return; }

            $scope.goodsData = tryBillingService.getGoods();

            goodsEle = selectFactory({
                data: $scope.goodsData,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-goods",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    $scope.iInputGoodsTypeValue = code;
                },
                attrTextModel: function(name){
                    $scope.iInputGoodsType = name;
                    $scope.$apply();
                }
            });
            goodsEle.setData($scope.goodsData);
            goodsEle.open();
            $('#select-goods').val($scope.iInputGoodsType);
        };

        /**
         * 重量单位
         */
        $scope.getWeightUnit = function(){
            if(weightUnitEle){ return; }

            $scope.weightUnitList = tryBillingService.getWeightUnitList();

            weightUnitEle = selectFactory({
                data: $scope.weightUnitList,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-weight-unit",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    $scope.iInputWeightUnitValue = code;
                },
                attrTextModel: function(name){
                    $scope.iInputWeightUnit = name;
                    $scope.$apply();
                }
            });
            weightUnitEle.setData($scope.weightUnitList);
            weightUnitEle.open();
            $('#select-weight-unit').val($scope.iInputWeightUnit);
        };

        /**
         * 获取国家列表
         * @param type
         */
        $scope.getCountry = function(type) {
            $scope.countryData = tryBillingService.getCountry();
            angular.forEach($scope.countryData.data, function(value, key){
                value.name += '('+ value.figureCode +')';
            });
            if(type == 'start'){
                id = 'select-start-address';
            }else{
                id = 'select-end-address';
            }
            countryEle = selectFactory({
                data: $scope.countryData,
                isSearch: true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                showTextField: "name",
                pagination: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.countryData = tryBillingService.getCountry({
                        urlParams: {
                            pageIndex: currentPage,
                            q: data
                        }
                    });
                    angular.forEach($scope.countryData.data, function(value, key) {
                        value.name += '('+ value.figureCode +')';
                    });
                    countryEle.setData($scope.countryData);
                },
                closeLocalSearch: true,
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    if(type == 'start'){
                        $scope.iInputStartValue = code;

                        //其他国家地区数据清空
                        $scope.iOtherStart = $scope.iOtherStartValue = '';

                        //其四级联动数据清空
                        $scope.iProvinceStart = $scope.iProvinceStartValue = '';
                        $scope.iCityStart = $scope.iCityStartValue = '';
                        $scope.iAreaStart = $scope.iAreaStartValue = '';
                        $scope.iStreetStart = $scope.iStreetStartValue = '';
                    }else{
                        $scope.iInputEndValue = code;

                        //其他国家地区数据清空
                        $scope.iOtherEnd = $scope.iOtherEndValue = '';

                        //其四级联动数据清空
                        $scope.iProvinceEnd = $scope.iProvinceEndValue = '';
                        $scope.iCityEnd = $scope.iCityEndValue = '';
                        $scope.iAreaEnd = $scope.iAreaEndValue = '';
                        $scope.iStreetEnd = $scope.iStreetEndValue = '';
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iInputStart = name;
                    }else{
                        $scope.iInputEnd = name;
                    }
                    $scope.$apply();
                }
            });
            countryEle.setData($scope.countryData);
            countryEle.open();
            if(type == 'start'){
                $('#select-start-address').val($scope.iInputStart);
            }else{
                $('#select-end-address').val($scope.iInputEnd);
            }
        };

        /**
         * 获取地区数据
         * @param config
         * @returns {*}
         */
        $scope.getAddressData = function(config){
            return tryBillingService.getAddressSearch(config);
        };

        /**
         * 其他国家地区
         * @param type
         */
        $scope.getOther = function(type){
            if(type == 'start'){
                var id = 'select-start-other';
            }else{
                var id = 'select-end-other';
            }
            Select.sharePool[id] = null;
            otherEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                pagination: true,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    var countryCode = type == 'start' ? $scope.iInputStartValue : $scope.iInputEndValue;
                    var config = {
                        'urlParams':{
                            'countryCode':countryCode,
                            'parentId':countryCode,
                            'q':data || '',
                            'pageIndex': currentPage || 1,
                            'pageSize':10
                        }
                    };
                    $scope.otherData = $scope.getAddressData(config);
                    attachEvent.setData($scope.otherData);
                },
                attrTextId: function(id){
                    if(type == 'start'){
                        $scope.iOtherStartValue = id;
                    }else{
                        $scope.iOtherEndValue = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iOtherStart = name;
                    }else{
                        $scope.iOtherEnd = name;
                    }
                    $scope.$apply();
                }
            });
            otherEle.open();
        };

        /**
         * 获取省
         * @param type
         */
        $scope.getProvince = function(type){
            if(type == 'start'){
                var id = 'select-start-province';
            }else{
                var id = 'select-end-province';
            }

            Select.sharePool[id] = null;
            provinceEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                defaultCount:100,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data) {
                    var countryCode = type == 'start' ? $scope.iInputStartValue : $scope.iInputEndValue;
                    var config = {
                        'urlParams':{
                            'countryCode':countryCode,
                            'parentId':countryCode,
                            'q':data || '',
                            'pageIndex': 1,
                            'pageSize': 100
                        }
                    };
                    $scope.provinceData = $scope.getAddressData(config);
                    console.log($scope.provinceData);
                    attachEvent.setData($scope.provinceData);
                },
                attrTextId: function(id){
                    if(type == 'start'){
                        $scope.iProvinceStartValue = id;

                        $scope.iCityStart = $scope.iCityStartValue = '';
                        $scope.iAreaStart = $scope.iAreaStartValue = '';
                        $scope.iStreetStart = $scope.iStreetStartValue = '';
                    }else{
                        $scope.iProvinceEndValue = id;

                        $scope.iCityEnd = $scope.iCityEndValue = '';
                        $scope.iAreaEnd = $scope.iAreaEndValue = '';
                        $scope.iStreetEnd = $scope.iStreetEndValue = '';
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iProvinceStart = name;
                    }else{
                        $scope.iProvinceEnd = name;
                    }
                    $scope.getCity(type)
                    $scope.$apply();
                }
            });
            provinceEle.open();
        };

        /**
         * 获取市
         * @param type
         */
        $scope.getCity = function(type){
            if(type == 'start'){
                if(!$scope.iProvinceStartValue){
                    return;
                }
                var id = 'select-start-city';
            }else{
                if(!$scope.iProvinceEndValue){
                    return;
                }
                var id = 'select-end-city';
            }
            Select.sharePool[id] = null;

            cityEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                defaultCount:100,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data) {
                    if(type == 'start'){
                        var countryCode = $scope.iInputStartValue;
                        var parentId = $scope.iProvinceStartValue;
                    }else{
                        var countryCode = $scope.iInputEndValue;
                        var parentId = $scope.iProvinceEndValue;
                    }
                    var config = {'urlParams':{'countryCode':countryCode,'parentId':parentId,'q':data, 'pageIndex':1, 'pageSize':1000}};
                    $scope.cityData = $scope.getAddressData(config);
                    attachEvent.setData($scope.cityData);
                },
                attrTextId: function(id){
                    if(type == 'start'){
                        $scope.iCityStartValue = id;

                        $scope.iAreaStart = $scope.iAreaStartValue = '';
                        $scope.iStreetStart = $scope.iStreetStartValue = '';
                    }else{
                        $scope.iCityEndValue = id;

                        $scope.iAreaEnd = $scope.iAreaEndValue = '';
                        $scope.iStreetEnd = $scope.iStreetEndValue = '';
                    }
                    $scope.getArea(type)
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iCityStart = name;
                    }else{
                        $scope.iCityEnd = name;
                    }
                    $scope.$apply();
                }
            });
            cityEle.open();
        };

        /**
         * 获取县
         * @param type
         */
        $scope.getArea = function(type){
            if(type == 'start'){
                if(!$scope.iCityStartValue){
                    return;
                }
                var id = 'select-start-area';
            }else{
                if(!$scope.iCityEndValue){
                    return;
                }
                var id = 'select-end-area';
            }
            Select.sharePool[id] = null;

            areaEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultCount:100,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data) {

                    if(type == 'start'){
                        var countryCode = $scope.iInputStartValue;
                        var parentId = $scope.iCityStartValue;
                    }else{
                        var countryCode = $scope.iInputEndValue;
                        var parentId = $scope.iCityEndValue;
                    }
                    var config = {'urlParams':{'countryCode':countryCode,'parentId':parentId,'q':data, 'pageIndex':1, 'pageSize':100}};

                    $scope.areaData = $scope.getAddressData(config);
                    attachEvent.setData($scope.areaData);
                },
                attrTextId: function(id){
                    if(type == 'start'){
                        $scope.iAreaStartValue = id;

                        $scope.iStreetStart = $scope.iStreetStartValue = '';
                    }else{
                        $scope.iAreaEndValue = id;

                        $scope.iStreetEnd = $scope.iStreetEndValue = '';
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iAreaStart = name;
                    }else{
                        $scope.iAreaEnd = name;
                    }
                    $scope.getStreet(type);
                    $scope.$apply();
                }
            });
            areaEle.open();
        };

        /**
         * 获取街道
         * @param type
         */
        $scope.getStreet = function(type){
            if(type == 'start'){
                if(!$scope.iAreaStartValue){
                    return;
                }
                var id = 'select-start-street';
            }else{
                if(!$scope.iAreaEndValue){
                    return;
                }
                var id = 'select-end-street';
            }
            Select.sharePool[id] = null;

            streetEle = selectFactory({
                data: [],
                isSearch:true,
                isUsePinyin:true,
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: id,
                defaultCount:100,
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data) {
                    if(type == 'start'){
                        var countryCode = $scope.iInputStartValue;
                        var parentId = $scope.iAreaStartValue;
                    }else{
                        var countryCode = $scope.iInputEndValue;
                        var parentId = $scope.iAreaEndValue;
                    }
                    var config = {'urlParams':{'countryCode':countryCode,'parentId':parentId,'q':data,'pageIndex':1,'pageSize':100}};
                    $scope.streetData = $scope.getAddressData(config);
                    attachEvent.setData($scope.streetData);
                },
                attrTextId: function(id){
                    if(type == 'start'){
                        $scope.iStreetStartValue = id;
                    }else{
                        $scope.iStreetEndValue = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    if(type == 'start'){
                        $scope.iStreetStart = name;
                    }else{
                        $scope.iStreetEnd = name;
                    }
                    $scope.$apply();
                }
            });
            streetEle.open();
        };

        /**
         * 产品分类复选框勾选
         * @param typeId  1:海运、6:空运、11:速递。
         */
        $scope.checkGroupType = function(typeId){
            $scope.selLength = 0;


            angular.forEach($scope.groupType, function(value, key){
                if(typeId == value.id){
                    $scope.groupType[key].checked = !$scope.groupType[key].checked;
                }

                if(value.checked){ ++$scope.selLength; $scope.topGrade = value.id;}
            });

            //清除产品数据
            $scope.iInputProducts = '';
            $scope.iInputProductsValue = '';

            if($scope.selLength != 1){
                $scope.topGrade = '';
            }
        };

        /**
         * 计算
         */
        $scope.count = function(){
            if($scope.iInputStartValue && $scope.iInputStartValue != 'CN'){
                $scope.iCityStartValue = $scope.iOtherStartValue;
            }

            if($scope.iInputEndValue && $scope.iInputEndValue != 'CN'){
                $scope.iCityEndValue = $scope.iOtherEndValue;
            }

            var config = {
                'urlParams':{
                    'packages':[],
                    'calcDate':$scope.iInputBeginTime,
                    'cargoTypeCode':$scope.iInputGoodsTypeValue,
                    'fromCountry':$scope.iInputStartValue,
                    'fromProvince':$scope.iProvinceStartValue,
                    'fromCity':$scope.iCityStartValue,
                    'fromArea':$scope.iAreaStartValue,
                    'fromStreet':$scope.iStreetStartValue,
                    'toCountry':$scope.iInputEndValue,
                    'toProvince':$scope.iProvinceEndValue,
                    'toCity':$scope.iCityEndValue,
                    'toArea':$scope.iAreaEndValue,
                    'toStreet':$scope.iStreetEndValue
                }
            };

            if($scope.type == 'service'){
                config.urlParams.serviceUid = $scope.iInputServicesValue;
                config.urlParams.settleMentId = $scope.iAccountValue;
            }else{
                config.urlParams.productUid = $scope.iInputProductsValue;
                config.urlParams.customerId = $scope.iInputClientValue;

                config.urlParams.groupType = [];
                angular.forEach($scope.groupType, function(value, key){
                    value.checked ? config.urlParams.groupType.push(value.id) : '';
                });
            }

            $('#weight-box .row').each(function(index){
                var map = {};

                var weight = $.trim($(this).find('.weight-value').val());

                var dom = $('#volume-box .row').eq(index);
                var length = $.trim(dom.find('.volume-length').val()),
                    width = $.trim(dom.find('.volume-width').val()),
                    height = $.trim(dom.find('.volume-height').val());

                map = {
                    'weight':weight,
                    'unitCode':$scope.iInputWeightUnitValue,
                    'length':length,
                    'width':width,
                    'height':height
                };
                config.urlParams.packages.push(map);
            });

            $scope.msg = '';
            $scope.calcMsgs = [];
            $scope.result = [];

            if($scope.type == 'service'){
                tryBillingService.calcService(config, function(res){
                    $scope.serviceCache = res;

                    $scope.msg = res.msg;
                    $scope.errorCode = res.errorCode;
                    $scope.calcMsgs = res.data.calcMsgs;
                    $scope.result = res.data.result;

                    //缓存请求数据
                    $scope.serviceCacheReq = {
                        'packages':[],
                        'weightUnit':$scope.iInputWeightUnitValue,
                        'weightUnitName':$scope.iInputWeightUnit,
                        'calcDate':$scope.iInputBeginTime,
                        'cargoTypeCode':$scope.iInputGoodsTypeValue,
                        'cargoTypeName':$scope.iInputGoodsType,
                        'fromCountry':$scope.iInputStartValue,
                        'fromCountryName':$scope.iInputStart,
                        'fromProvince':$scope.iProvinceStartValue,
                        'fromProvinceName':$scope.iProvinceStart,
                        'fromCity':$scope.iCityStartValue,
                        'fromCityName':$scope.iCityStart,
                        'fromArea':$scope.iAreaStartValue,
                        'fromAreaName':$scope.iAreaStart,
                        'fromStreet':$scope.iStreetStartValue,
                        'fromStreetName':$scope.iStreetStart,
                        'toCountry':$scope.iInputEndValue,
                        'toCountryName':$scope.iInputEnd,
                        'toProvince':$scope.iProvinceEndValue,
                        'toProvinceName':$scope.iProvinceEnd,
                        'toCity':$scope.iCityEndValue,
                        'toCityName':$scope.iCityEnd,
                        'toArea':$scope.iAreaEndValue,
                        'toAreaName':$scope.iAreaEnd,
                        'toStreet':$scope.iStreetEndValue,
                        'toStreetName':$scope.iStreetEnd
                    };

                    for(var i=0, l=config.urlParams.packages.length; i<l; i++){
                        var map = {
                            'height':config.urlParams.packages[i].height,
                            'length':config.urlParams.packages[i].length,
                            'unitCode':config.urlParams.packages[i].unitCode,
                            'weight':config.urlParams.packages[i].weight,
                            'width':config.urlParams.packages[i].width,
                        };
                        $scope.serviceCacheReq.packages.push(map);
                    }
                });
            }else{
                tryBillingService.calcProduct(config, function(res){
                    $scope.productCache = res;

                    $scope.msg = res.msg;
                    $scope.errorCode = res.errorCode;
                    $scope.calcMsgs = res.data.calcMsgs;
                    $scope.result = res.data.result;

                    //缓存请求数据
                    $scope.productCacheReq = {
                        'packages':[],
                        'weightUnit':$scope.iInputWeightUnitValue,
                        'weightUnitName':$scope.iInputWeightUnit,
                        'calcDate':$scope.iInputBeginTime,
                        'cargoTypeCode':$scope.iInputGoodsTypeValue,
                        'cargoTypeName':$scope.iInputGoodsType,
                        'fromCountry':$scope.iInputStartValue,
                        'fromCountryName':$scope.iInputStart,
                        'fromProvince':$scope.iProvinceStartValue,
                        'fromProvinceName':$scope.iProvinceStart,
                        'fromCity':$scope.iCityStartValue,
                        'fromCityName':$scope.iCityStart,
                        'fromArea':$scope.iAreaStartValue,
                        'fromAreaName':$scope.iAreaStart,
                        'fromStreet':$scope.iStreetStartValue,
                        'fromStreetName':$scope.iStreetStart,
                        'toCountry':$scope.iInputEndValue,
                        'toCountryName':$scope.iInputEnd,
                        'toProvince':$scope.iProvinceEndValue,
                        'toProvinceName':$scope.iProvinceEnd,
                        'toCity':$scope.iCityEndValue,
                        'toCityName':$scope.iCityEnd,
                        'toArea':$scope.iAreaEndValue,
                        'toAreaName':$scope.iAreaEnd,
                        'toStreet':$scope.iStreetEndValue,
                        'toStreetName':$scope.iStreetEnd
                    };

                    for(var i=0, l=config.urlParams.packages.length; i<l; i++){
                        var map = {
                            'height':config.urlParams.packages[i].height,
                            'length':config.urlParams.packages[i].length,
                            'unitCode':config.urlParams.packages[i].unitCode,
                            'weight':config.urlParams.packages[i].weight,
                            'width':config.urlParams.packages[i].width,
                        };
                        $scope.productCacheReq.packages.push(map);
                    }
                });
            }

        };

        $scope.goods = {
            'weight':[
                {
                    'value':'',
                    'unitVal':'',
                    'unitName':''
                }
            ],
            'volume':[
                {
                    'length':'',
                    'width':'',
                    'height':''
                }
            ]
        };
        $scope.addGoodsAttr = function(){
            if(!$scope.iInputWeightUnit){
                $(document).promptBox({isDelay:true,contentDelay:'请先选择重量单位',type: 'errer',manualClose:true});
                return;
            }

            var map = {
                'value':'',
                'unitVal':'',
                'unitName':''
            };
            $scope.goods.weight.push(map);

            map = {
                'length':'',
                'width':'',
                'height':''
            };
            $scope.goods.volume.push(map);
        };

        $scope.resetGoodsAttr = function(){
            $scope.goods = {
                'weight':[
                    {
                        'value':'',
                        'unitVal':'',
                        'unitName':''
                    }
                ],
                'volume':[
                    {
                        'length':'',
                        'width':'',
                        'height':''
                    }
                ]
            };
            Select.sharePool['select-weight-unit'] = '';
            weightUnitEle = null;
        };

        /**
         * 切换服务成本计费 和 产品计费
         * @param type
         */
        $scope.tabChange = function(type){
            $scope.type = type;

            var res = null, req = null;
            if(type == 'service'){
                res = $scope.serviceCache || {};
                req = $scope.serviceCacheReq || {};
            }else{
                res = $scope.productCache || {};
                req = $scope.productCacheReq || {};
            }

            if(!res.msg){
                res = {
                    'msg':'',
                    'errorCode':'',
                    'data':{
                        'calcMsgs':'',
                        'result':''
                    }
                };
            }
            if(res){
                $scope.msg = res.msg;
                $scope.errorCode = res.errorCode;
                $scope.calcMsgs = res.data.calcMsgs;
                $scope.result = res.data.result;
            }

            $scope.iInputWeightUnitValue = req.weightUnit || '';
            $scope.iInputWeightUnit = req.weightUnitName || '';
            $scope.iInputBeginTime = req.calcDate || '';
            $scope.iInputGoodsTypeValue = req.cargoTypeCode || '';
            $scope.iInputGoodsType = req.cargoTypeName || '';
            $scope.iInputStartValue = req.fromCountry || '';
            $scope.iInputStart = req.fromCountryName || '';
            $scope.iProvinceStartValue = req.fromProvince || '';
            $scope.iProvinceStart = req.fromProvinceName || '';
            $scope.iCityStartValue = req.fromCity || '';
            $scope.iCityStart = req.fromCityName || '';
            $scope.iAreaStartValue = req.fromArea || '';
            $scope.iAreaStart = req.fromAreaName || '';
            $scope.iStreetStartValue = req.fromStreet || '';
            $scope.iStreetStart = req.fromStreetName || '';
            $scope.iInputEndValue = req.toCountry || '';
            $scope.iInputEnd = req.toCountryName || '';
            $scope.iProvinceEndValue = req.toProvince || '';
            $scope.iProvinceEnd = req.toProvinceName || '';
            $scope.iCityEndValue = req.toCity || '';
            $scope.iCityEnd = req.toCityName || '';
            $scope.iAreaEndValue = req.toArea || '';
            $scope.iAreaEnd = req.toAreaName || '';
            $scope.iStreetEndValue = req.toStreet || '';
            $scope.iStreetEnd = req.toStreetName || '';

            $scope.goods = {
                'weight':[],
                'volume':[]
            };
            if(req.packages && req.packages.length){
                for(var i=0,l=req.packages.length; i<l; i++){
                    var map = {
                        'value':req.packages[i].weight,
                        'unitVal':req.packages[i].unitCode,
                        'unitName':''
                    };
                    $scope.goods.weight.push(map);

                    map = {
                        'length':req.packages[i].length,
                        'width':req.packages[i].width,
                        'height':req.packages[i].height
                    };
                    $scope.goods.volume.push(map);
                }
            }else{
                $scope.resetGoodsAttr();
            }
        };
    }]);
});
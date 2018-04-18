app.factory('stationPortView', ["tableService","stationPortService" ,function(tableService,stationPortService) {
    var stationPortView = {
        getCityList:function($scope,data,currentPage) {
            if(!currentPage) {
                currentPage = 1;
            }

            var cityConfig = {
                urlParams: {
                    countryCode: $scope.countryId,
                    "parentId": $scope.countryId,
                    q: data ? data.trim() :"",
                    "pageIndex": currentPage,
                    "pageSize": 10
                }
            };
            return  stationPortService.getCity(cityConfig);
        },
        getCountryData:function (q,currentPage) {
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
            return stationPortService.getCountry(config);

        },
        rebuildName:function(data) {
            if (!data) {
                return;
            }
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].name + '(' + data[index].figureCode + ')';
            }
        },
        initSelect:function ($scope,countryEle,citySearchEle) {
            function clearNextAddress(currentEle) {
                var nextEle = currentEle.next;
                if(nextEle == null) {
                    return;
                }
                nextEle.clearData();
                nextEle.id = null;
                return clearNextAddress(nextEle);
            }

            var data = {};
            var that = this;

            data = this.getCountryData();
            this.rebuildName(data.data);

            countryEle = selectFactory({
                data: data,
                id: "countrySearch",
                isSearch: true,
                onBeforeShow:false,
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var countryData = that.getCountryData(data,currentPage);
                    that.rebuildName(countryData.data);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function(name, data, currentData) {
                    $scope.countrySearch = name;
                    $scope.countrySearchId  = currentData.figureCode;
                    $scope.citySearch = "";
                    $scope.citySearchId = "";
                    var cityConfig = {
                        urlParams: {
                            countryCode: $scope.countrySearchId,
                            "parentId": $scope.countrySearchId,
                            q: ''
                        },
                        isAsync: true
                    };
                    $scope.figureCode = currentData.figureCode;
                    $scope.countryId  = currentData.figureCode;
                    $scope.$apply();
                    clearNextAddress(countryEle);
                }
            });
            /*初始化市区start*/
            citySearchEle = selectFactory({
                data: [],
                isSearch: true,
                id: "citySearch",
                isSaveInputVal:true,
                closeLocalSearch:true,
                pagination: true,
                searchPlaceHoder:"请输入城市名称",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var data = that.getCityList($scope,data,currentPage);

                    attachEvent.setData(data);
                    $scope.$apply();
                },
                attrTextModel: function(name, data, currentData) {
                    $scope.citySearch = name;
                    $scope.citySearchId = currentData.id;
                    $scope.$apply();
                }
            });
            countryEle.next = citySearchEle;
            /*初始化市区end*/
        },

        initTable:function ($scope) {
            $scope.tableModel = {
                more: false,
                userWord: '',
                tableHeader: [
                    Lang.getValByKey("common", 'common_thead_number'),
                    Lang.getValByKey("stationPort", 'stationPort_table_name'),
                    Lang.getValByKey("stationPort", 'stationPort_table_nameEn'),
                    Lang.getValByKey("stationPort", 'stationPort_table_code'),
                    Lang.getValByKey("stationPort", 'stationPort_table_country'),
                    Lang.getValByKey("stationPort", 'stationPort_table_city'),
                    Lang.getValByKey("stationPort", 'stationPort_table_addr'),
                    Lang.getValByKey("stationPort", 'stationPort_table_type'),
                    Lang.getValByKey("stationPort", 'common_page_remarks')
                ],
                tableBody: [],
                restURL: "logistics.getAllPorts",
                restData: {
                    q: '',
                    locked: -1,
                    pageIndex: 1,
                    pageSize: 10,
                    sort:'code'
                },
                seatData:{
                    uid:''
                },
                selectNumber: 0,
                selectFlag: false
            };

            $scope.refreshTableData();

        },

        initPromptSelect:function ($scope,countrySelectElm,citySelectElm) {

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

            var data;

            /** 检索国家事件 */
            data = this.getCountryData();
            this.rebuildName(data.data);
            var that = this;

            countrySelectElm = selectFactory({
                data: data,
                id: "country",
                isSearch: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var countryData = that.getCountryData(data,currentPage);
                    that.rebuildName(countryData.data);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function(name, data) {
                    var countryData;
                    if(!name) {
                        countryData = {};
                    } else {
                        countryData = getSigleDataByName(name, data);
                    }
                    $scope.countryId  = countryData.figureCode;
                    $scope.countryName = countryData.name;
                    $scope.cityName = "";
                    $scope.cityId = "";
                    $scope.isEditCity = false;
                    $scope.$apply();
                    clearNextAddress(countrySelectElm);

                }
            });
            /** 检索城市事件 */
            citySelectElm = selectFactory({
                data: [],
                id: "city",
                isSearch: true,
                isSaveInputVal :"true",
                closeLocalSearch:true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                pagination: true,
                searchPlaceHoder:"请输入城市名称",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var data = that.getCityList($scope,data,currentPage);
                    attachEvent.setData(data);
                    $scope.$apply();
                },
                attrTextModel: function(name, data) {
                    var cityData;
                    if(!name) {
                        cityData = {};
                    } else {
                        cityData = getSigleDataByName(name, data);
                    }
                    $scope.cityName = cityData.name;
                    $scope.cityId = cityData.id;
                    $scope.$apply();
                }
            });
            countrySelectElm.next = citySelectElm;
            
        }

    };
    
    return stationPortView;
}]);
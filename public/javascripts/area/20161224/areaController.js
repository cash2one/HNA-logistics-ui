easySpa.require([
    "widget/tab",
    "widget/select",
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt'
],function(){
    app.controller('areaCtrl', ['$scope', '$compile', 'areaService', 'areaView', 'tableService', function($scope, $compile, areaService, areaView, tableService) {
        areaView.initTab(function(index) {
            if(index == 1) {
                $(".no-result").addClass("hidden");
                initTable();
            }
        });
        var provinceEle;
        var cityEle;
        var areaEle;
        var streetEle;
        var countryCode = "CN";
        function getSigleDataByName(name, data) {
            var data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].name == name) {
                    return data[index];
                }
            }
        }
        function clearNextAddress(currentEle) {
            var nextEle = currentEle.next;
            if(nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNextAddress(nextEle);
        }
        $scope.initSelectList = function() {
            var data;
            /*初始化省份start*/
            data = areaService.getAddressData(countryCode, "CN");
            provinceEle = selectFactory({
                data: data,
                id: "province",
                defaultCount: data.data.length,
                attrTextModel: function(name, data) {
                    var provinceData;
                    if(!name) {
                        provinceData = {};
                    } else {
                        provinceData = getSigleDataByName(name, data);
                    }
                    $scope.detailData = provinceData;
                    provinceEle.id = provinceData.id;
                    $scope.$apply();
                    clearNextAddress(provinceEle);
                    if(!name) {
                        return;
                    }
                    var cityData = areaService.getAddressData(countryCode, provinceEle.id);
                    if(!cityData.data.length) {
                        cityEle.setData([]);
                    } else {
                        cityEle.setData(cityData);
                        cityEle.setDefaultCount(cityData.data.length);
                        if(cityData.data.length > 0) {
                            cityEle.open();
                        }
                    }
                }
            });
            /*初始化省份end*/

            /*初始化市区start*/
            cityEle = selectFactory({
                data: [],
                id: "city",
                attrTextModel: function(name, data) {
                    var cityData;
                    if(!name) {
                        cityData = {};
                    } else {
                        cityData = getSigleDataByName(name, data);
                    }
                    $scope.detailData = cityData;
                    cityEle.id = cityData.id;
                    $scope.$apply();
                    clearNextAddress(cityEle);
                    if(!name) {
                        return;
                    }
                    var areaData = areaService.getAddressData(countryCode, cityEle.id);
                    if(!areaData.data.length) {
                        areaEle.setData([]);
                    } else {
                        areaEle.setData(areaData);
                        areaEle.setDefaultCount(areaData.data.length);
                        if(areaData.data.length > 0) {
                            areaEle.open();
                        }
                    }

                }
            });
            provinceEle.next = cityEle;
            /*初始化市区end*/

            /*初始化市区街道start*/
            areaEle = selectFactory({
                data: [],
                id: "area",
                attrTextModel: function(name, data) {
                    var areaData;
                    if(!name) {
                        areaData = {};
                    } else {
                        areaData = getSigleDataByName(name, data);
                    }
                    $scope.detailData = areaData;
                    areaEle.id = areaData.id;
                    $scope.$apply();
                    clearNextAddress(areaEle);
                    if(!name) {
                        return;
                    }
                    var streetData = areaService.getAddressData(countryCode, areaEle.id);
                    if(!streetData.data.length) {
                        streetEle.setData([]);
                    } else {
                        streetEle.setData(streetData);
                        streetEle.setDefaultCount(streetData.data.length);
                        if(streetData.data.length > 0) {
                            streetEle.open();
                        }
                    }
                }
            });
            cityEle.next = areaEle;
            /*初始化市区街道end*/

            /*乡镇初始化start*/
            streetEle = selectFactory({
                data: [],
                id: "street",
                attrTextModel: function(name, data) {
                    var streetData;
                    if(!name) {
                        streetData = {};
                    } else {
                        streetData = getSigleDataByName(name, data);
                    }
                    $scope.detailData = streetData;
                    streetEle.id = streetData.id;
                    $scope.$apply();
                }
            });
            areaEle.next = streetEle;
            /*乡镇初始化end*/

        }
        $scope.searchCountry = function() {
            $scope.tableModel.restData.pageIndex = 1;
            loadCountryData();
        }
        function setScroll() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 250
            });
        }
        function loadCountryData() {
            var params = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, params, function(data){
                $scope.q = $scope.tableModel.restData.q;
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    setTimeout(function() {
                        setScroll();
                        $(window).on("resize", setScroll);
                        $scope.$apply();
                        $(".no-result").removeClass("hidden");
                    }, 500);
                }
            });
        }
        function initTable() {
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey("area", "area_country_id"),
                    Lang.getValByKey("area", "area_country_name"),
                    Lang.getValByKey("area", "area_city_name"),
                    Lang.getValByKey("area", "area_code_start"),
                    Lang.getValByKey("area", "area_code_end"),
                    Lang.getValByKey("area", "area_code_parentId")
                ],
                tableHeaderSize: [
                    '8%',
                    '22%',
                    '22%',
                    '16%',
                    '16%',
                    '16%'
                ],
                tableBody: [],
                restURL: "logistics.searchList",
                restData: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                }
            };
            loadCountryData();
        }
    }]);
});

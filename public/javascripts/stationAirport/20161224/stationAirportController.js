easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'public/common/tableController.js',
    "widget/tab",
    "widget/select"
],function() {
    app.controller('stationAirportCtrl', ['$scope', 'stationAirportService', 'stationAirportView', 'tableService', function ($scope, stationAirportService, stationAirportView, tableService) {
        $scope.tableModel = {
            more: false,
            userWord: '',
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("stationAirport", 'airport_table_name'),
                Lang.getValByKey("stationAirport", 'airport_table_triadCode'),
                Lang.getValByKey("stationAirport", 'airport_table_tetradCode'),
                Lang.getValByKey("stationAirport", 'airport_table_country'),
                Lang.getValByKey("stationAirport", 'airport_table_city'),
                Lang.getValByKey("stationAirport", 'airport_table_remark')
            ],
            tableBody: [],
            restURL: "logistics.getAllAirports",
            restData: {
                q: '',
                locked: -1,
                pageIndex: 1,
                pageSize: 10,
                sort: 'triadCode',
                asc: true
            },
            seatData: {
                uid: ''
            },
            selectNumber: 0,
            selectFlag: false
        };

        /** 获取语言库 */
        $scope.getLanguage = function () {
            stationAirportService.getLanguage(function (data) {
                if (data.errorCode === 0) {
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        /** 初始加载机场信息列表 */
        $scope.$on('$viewContentLoaded', function () {
            loadListData();
        });

        function loadListData() {
            var params = {
                'urlParams': $scope.tableModel.restData
            };

            tableService.getTable($scope.tableModel.restURL, params, function (data) {
                if (data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
            });

            setScrollDetail();
            $(window).on("resize", setScrollDetail);

            function setScrollDetail() {
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 270
                });
            };
        };

        function rebuildName(data) {
            if (!data) {
                return;
            }
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].name + '(' + data[index].code + ')';
            }
        }

        $scope.getCountryData = function (q, currentPage) {
            if (!currentPage) {
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
            return stationAirportService.getCountry(config);
        };

        var countryEle;
        var citySearchEle;
        var data = {};
        /*初始化国家start*/
        data = $scope.getCountryData();
        rebuildName(data.data);

        countryEle = selectFactory({
            data: data,
            id: "countrySearch",
            isSearch: true,
            pagination: true,
            searchPlaceHoder: "请输入国家名称或二字码",
            onSearchValueChange: function (attachEvent, data, currentPage) {
                var countryData = $scope.getCountryData(data, currentPage);
                rebuildName(countryData.data);
                attachEvent.setData(countryData);
            },
            attrTextModel: function (name, data, currentData) {
                $scope.countrySearch = name;
                $scope.countrySearchId = currentData.figureCode;
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
                $scope.countryId = currentData.figureCode;
                $scope.$apply();
                clearNextAddress(countryEle);
                // if(!$scope.figureCode){
                //     citySearchEle.setData([]);
                //     return;
                // }
                // var cityData = stationAirportService.getCity(cityConfig);
                // if(!cityData.data.length) {
                //     citySearchEle.setData([]);
                // } else {
                //     citySearchEle.setData(cityData);
                // }
            }
        });
        /*初始化市区start*/
        citySearchEle = selectFactory({
            data: [],
            isSearch: true,
            pagination: true,
            searchPlaceHoder: "请输入城市名称",
            id: "citySearch",
            isSaveInputVal: "true",
            closeLocalSearch: true,
            onSearchValueChange: function (attachEvent, data, currentPage) {
                attachEvent.setData(getCityList(data, currentPage));
                $scope.$apply();
            },
            attrTextModel: function (name, data, currentData) {
                $scope.citySearch = name;
                $scope.citySearchId = currentData.id;
                $scope.$apply();
            }
        });
        countryEle.next = citySearchEle;
        /*初始化市区end*/
        $scope.clearDate = function () {
            $scope.countrySearch = "";
            $scope.countrySearchId = "";
            $scope.citySearch = "";
            $scope.citySearchId = "";
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            citySearchEle.setData([]);
            $scope.retrievalAirport();
        }
        /** 机场弹框菜单显示隐藏 */
        var bar = $('#nest-AirportFrom .label-text');
        airportFromBar();
        function airportFromBar() {
            barClick(bar);
        };

        function getCityListByCountryId(data) {
            var cityConfig = {
                urlParams: {
                    countryCode: $scope.countrySearchId,
                    "parentId": $scope.countrySearchId,
                    q: data ? data.trim() : ""
                },
                isAsync: true
            };
            return stationAirportService.getCity(cityConfig);
        };

        $scope.resetCitySearchData = function () {

            if (Select.sharePool["citySearch"]) {
                if (!$scope.countrySearchId) {
                    Select.sharePool["citySearch"].setData({});
                } else {
                    Select.sharePool["citySearch"].setData(getCityListByCountryId());
                    // Select.sharePool["citySearch"].inputElement.val($scope.citySearch);
                }

            }
        }

        /** 打开机场弹框 */
        $scope.addAirport = function () {
            $('.select-list-box').empty();
            $scope.textNumber = 140;

            $scope.showAirportName = false;
            $scope.showTriadCode = false;
            $scope.showTetradCode = false;

            $('#nest-AirportFrom').css('display', 'table');
            $scope.title = Lang.getValByKey("stationAirport", 'airport_prompt_new');
            $scope.nestAirportFrom = true;
            $scope.isEditCity = true;

            $scope.airportName = '';
            $scope.countryName = '';
            $scope.cityName = '';
            $scope.triadCode = '';
            $scope.tetradCode = '';
            $scope.remark = '';
            var ele = $('.language-international input');
            ele.each(function (i) {
                ele.eq(i).val('');
            });

            loadBar(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        /** 关闭机场弹框 */
        $scope.closePrompt = function () {
            $scope.nestAirportFrom = false;
            //清除angular表单脏值检测
            $scope.AirportFrom.$setPristine();
            $scope.AirportFrom.$setUntouched();
        };

        /** 加载初始检索事件 */
        function clearNextAddress(currentEle) {
            var nextEle = currentEle.next;
            if (nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNextAddress(nextEle);
        }

        function getSigleDataByName(name, data) {
            var data = data.data;
            for (var index = 0; index < data.length; index++) {
                if (data[index].name == name) {
                    return data[index];
                }
            }
        }

        var getCityList = function (data, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }

            var cityConfig = {
                urlParams: {
                    countryCode: $scope.countryId,
                    "parentId": $scope.countryId,
                    q: data ? data.trim() : "",
                    "pageIndex": currentPage,
                    "pageSize": 10
                }
            };
            return stationAirportService.getCity(cityConfig);
        };
        $scope.initSelectList = function () {
            var data;
            /** 检索国家事件 */
            data = $scope.getCountryData();
            rebuildName(data.data);
            countryEle = selectFactory({
                data: data,
                id: "country",
                height: 240,
                isSearch: true,
                pagination: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                searchPlaceHoder: "请输入国家名称或二字码",
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    var countryData = $scope.getCountryData(data, currentPage);
                    rebuildName(countryData.data);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function (name, data) {
                    var provinceData;
                    if (!name) {
                        provinceData = {};
                    } else {
                        provinceData = getSigleDataByName(name, data);
                    }
                    $scope.countryId = provinceData.figureCode;
                    $scope.countryName = provinceData.name;
                    $scope.isEditCity = false;

                    $scope.cityName = '';
                    //$scope.AirportFrom.cityName.$pristine();

                    $scope.$apply();
                    clearNextAddress(countryEle);
                    // var cityList = getCityList();
                    // if(cityList.data){
                    //     if(cityList.data.length){
                    //         cityEle.setData(getCityList());
                    //     }else{
                    //         cityEle.setData([]);
                    //     }
                    // }
                }
            });

            /** 检索城市事件 */
            cityEle = selectFactory({
                data: [],
                id: "city",
                height: 240,
                isSearch: true,
                isSaveInputVal: "true",
                closeLocalSearch: true,
                pagination: true,
                searchPlaceHoder: "请输入城市名称",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    attachEvent.setData(getCityList(data, currentPage));
                    $scope.$apply();
                },
                attrTextModel: function (name, data) {
                    var cityData;
                    if (!name) {
                        cityData = {};
                    } else {
                        cityData = getSigleDataByName(name, data);
                    }
                    $scope.cityName = cityData.name;
                    $scope.cityId = cityData.id;
                    $scope.$apply();
                    clearNextAddress(cityEle);
                }
            });
            countryEle.next = cityEle;

        };

        $scope.test = function () {
            if (cityEle) {
                cityEle.clearData();
                if (!$scope.countryId) {
                    cityEle.setData({});
                } else {
                    cityEle.setData(getCityList());
                    cityEle.inputElement.val($scope.cityName);
                }

            }

        };


        /** 新建机场保存 */
        $scope.savePrompt = function () {
            if (!$scope.airportName) {
                $scope.AirportFrom.airportName.$setDirty();
            }
            ;
            if (!$scope.countryName) {
                $scope.AirportFrom.countryName.$setDirty();
            }
            ;
            if (!$scope.cityName) {
                $scope.AirportFrom.cityName.$setDirty();
            }
            ;
            if (!$scope.triadCode) {
                $scope.AirportFrom.triadCode.$setDirty();
            }
            ;
            if (!$scope.tetradCode) {
                $scope.AirportFrom.tetradCode.$setDirty();
            }
            ;
            var ele = $('.language-international input');
            var i18nData = [], Arr = [];
            ele.each(function (i) {
                Arr[i] = {};
                Arr[i].language = ele.eq(i).data('code');
                Arr[i].localName = ele.eq(i).val();
                Arr[i].refId = ele.eq(i).data('id');
                i18nData.push(Arr[i]);
            });

            var triadCode = '';
            if($scope.triadCode !== undefined){
                for (var i = 0; i < $scope.triadCode.length; i++) {
                    triadCode += $scope.triadCode[i].toLocaleUpperCase();
                }
                ;
            }

            var tetradCode = '';
            if($scope.tetradCode !== undefined){
                for (var i = 0; i < $scope.tetradCode.length; i++) {
                    tetradCode += $scope.tetradCode[i].toLocaleUpperCase();
                }
                ;
            }

            var config = {
                urlParams: {
                    name: $scope.airportName,
                    countryId: $scope.countryId,
                    cityId: $scope.cityId,
                    triadCode: triadCode.toUpperCase(),
                    tetradCode: tetradCode.toUpperCase(),
                    remark: $scope.remark,
                    i18n: i18nData
                }
            };

            showErrorModel(bar);

            if ($scope.showTriadCode == true) {
                $scope.AirportFrom.$valid = false;
            }
            ;

            if (!$scope.AirportFrom.$valid) {
                scrollToErrorView($(".switch-list"));
                return;
            }
            ;

            if ($('button[name="prompt-save"]').hasClass('save')) {
                stationAirportService.saveAirport(config, function (res) {
                    if (res.errorCode == 0) {
                        loadListData();
                        $scope.nestAirportFrom = false;

                        //清除angular表单脏值检测
                        $scope.AirportFrom.$setPristine();
                        $scope.AirportFrom.$setUntouched();
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                    ;
                })
            } else {
                config = $.extend({}, {seatParams: {id: $scope.clickTrId}}, config);
                stationAirportService.updateAirport(config, function (res) {
                    if (res.errorCode == 0) {
                        loadListData();
                        $scope.nestAirportFrom = false;

                        //清除angular表单脏值检测
                        $scope.AirportFrom.$setPristine();
                        $scope.AirportFrom.$setUntouched();
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                    ;
                });
            }
            ;

        };

        /** 弹框修改机场信息 */
        $scope.editAirportInfo = function ($event) {
            $('.select-list-box').empty();
            $('#nest-AirportFrom').css('display', 'table');
            $scope.showAirportName = false;
            $scope.showTriadCode = false;
            $scope.showTetradCode = false;

            $scope.isEditCity = false;

            loadBar(bar);
            $scope.title = Lang.getValByKey("stationAirport", 'airport_prompt_edit');
            $scope.nestAirportFrom = true;
            var element = $($event.target)[0].nodeName == 'SPAN' ? $($event.target).parent() : $($event.target);
            $scope.clickTrId = element.parent().parent().data('id');
            var config = {seatParams: {id: $scope.clickTrId}};
            stationAirportService.getAirportDetail(config, function (res) {
                if (res.errorCode == 0) {
                    var value = res.data;
                    $scope.airportName = value.name;
                    $scope.countryName = value.countryName + '(' + value.countryId + ')';
                    $scope.cityName = value.cityName;
                    $scope.countryId = value.countryId;
                    $scope.triadCode = value.triadCode;
                    $scope.tetradCode = value.tetradCode;
                    $scope.remark = $.trim(value.remark);

                    var ele = $('.language-international input');

                    if (Array.isArray(value.i18n) && value.i18n.length == 0) {
                        ele.each(function (i) {
                            ele.eq(i).val("");
                        });

                    } else {
                        ele.each(function (i) {
                            for (var j in value.i18n) {
                                if (ele.eq(i).data('code') == value.i18n[j].language) {
                                    ele.eq(i).data('id', value.i18n[j].refId);
                                    ele.eq(i).data('code', value.i18n[j].language);
                                    ele.eq(i).val($.trim(value.i18n[j].localName));
                                }
                                ;
                            }
                            ;
                        });

                    }

                    $scope.textNumber = 140 - $scope.remark.length;
                }
            });
            $('button[name="prompt-save"]').removeClass('save').addClass('edit');
        };

        /** 删除机场信息 */
        $scope.deleteAirport = function () {
            if ($scope.tableModel.selectNumber != 0 && $('.user-table tbody tr').length != 0) {
                var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("stationAirport", 'airport_prompt_delete')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                submitDeleteAirport(selectArr);
                            }
                        }
                    ]
                });
            } else {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("stationAirport", 'airport_prompt_delay_tip'),
                    type: 'errer',
                    manualClose: true
                });
            }
            ;
        };

        function submitDeleteAirport(selectArr) {
            var arr = [];
            for (var i in selectArr) {
                arr.push(selectArr[i].id);
            }
            var config = {urlParams: arr};
            stationAirportService.deleteAirports(config, function (response) {
                if (response.errorCode == 0) {
                    $(document).promptBox('closePrompt');
                    loadListData();
                    $(document).promptBox({isDelay: true, contentDelay: response.msg, type: 'success'});
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: response.msg,
                        type: 'errer',
                        manualClose: true
                    });
                }
            });
            $scope.$apply();
        };

        /** 检索机场 */
        $scope.retrievalAirport = function () {
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.countryId = $scope.countrySearchId;
            $scope.tableModel.restData.cityId = $scope.citySearchId;
            loadListData();
        };

        /** 国际化 */
        $scope.internationalization = function () {
            window.location.href = '#/international?q=stationAirport';
        };

        /*$scope.removeValidateName = function(){
         $scope.showAirportName = false;
         };

         /!** 校验机场名称 *!/
         $scope.validateName = function(){
         if(!$scope.airportName) return;
         var config = {urlParams: {name: $scope.airportName}};
         stationAirportService.validateAirportName(config, function(res){
         if(res.errorCode == 0){
         $scope.showAirportName = false;
         }else{
         $scope.showAirportName = true;
         };
         });
         };*/

        $scope.removeValidateTriadCode = function () {
            $scope.showTriadCode = false;
        };

        /** 校验三字码 */
        $scope.validateTriadCode = function () {
            if (!$scope.triadCode) return;
            if ($('button[name="prompt-save"]').hasClass('save')) {
                var config = {urlParams: {triadCode: $scope.triadCode}};
            } else {
                var config = {
                    urlParams: {
                        triadCode: $scope.triadCode,
                        id: $scope.clickTrId
                    }
                };
            }

            stationAirportService.validateAirportTriadCode(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.showTriadCode = false;
                } else {
                    $scope.showTriadCode = true;
                    angular.element($(".validate-triad-code").addClass("ng-invalid"));
                }
                ;
            });
        };

        /*$scope.removeValidateTetradCode = function(){
         $scope.showTetradCode = false;
         };

         /!** 校验四字码 *!/
         $scope.validateTetradCode = function(){
         if(!$scope.tetradCode) return;
         var config = {urlParams: {tetradCode: $scope.tetradCode}};
         stationAirportService.validateAirportTetradCode(config, function(res){
         if(res.errorCode == 0){
         $scope.showTetradCode = false;
         }else{
         $scope.showTetradCode = true;
         };
         });
         };*/

        /**** 计算输入框数量 */
        $scope.textNumber = 140;
        $scope.showTextNumber = function () {
            $scope.textNumber = 140 - $scope.remark.length;
        };

        /** 国际化校验 */
        /*$scope.langVerification = function($event){
         var dom = $event.target;

         var val = $.trim($(dom).val());

         var reg  = /[`~!@#$￥%^……&*()（）\/——+=\|\\、\[\]{};；：:'’‘"“”,，.。?？<>《》]+/;
         if(reg.test(val)){
         $(dom).addClass('lang-invalid ng-invalid ng-dirty').next('.verification').children('span').html('符号仅限“-”、“_”');
         return false;
         }else{
         $(dom).removeClass('lang-invalid ng-invalid ng-dirty').next('.verification').children('span').html('');
         return false;
         }
         };*/

        /**** 小写转大写 */
        $scope.valueTolocaleUpperCase = function ($event, maxLength) {
            var value = $.trim($($event.target).val());
            if (value.length > maxLength) {
                $($event.target).val(value.substr(0, maxLength))
                value = value.substr(0, maxLength);
            }
            ;

            $($event.target).val($.trim(value.toLocaleUpperCase()));
        };

    }]);
});

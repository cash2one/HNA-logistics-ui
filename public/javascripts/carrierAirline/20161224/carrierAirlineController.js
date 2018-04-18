easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'public/common/tableController.js',
    "widget/tab",
    "widget/select"
],function() {
    app.controller('carrierAirlineCtrl', ['$scope', 'carrierAirlineService', 'carrierAirlineView', 'tableService', function ($scope, carrierAirlineService, carrierAirlineView, tableService) {

        $scope.tableModel = {
            more: false,
            userWord: '',
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("carrierAirline", 'company_table_name'),
                Lang.getValByKey("carrierAirline", 'company_table_country'),
                Lang.getValByKey("carrierAirline", 'company_table_triadCode'),
                Lang.getValByKey("carrierAirline", 'company_table_tetradCode'),
                Lang.getValByKey("carrierAirline", 'company_table_remark')
            ],
            tableBody: [],
            restURL: "logistics.getCompanys",
            restData: {
                q: '',
                locked: -1,
                pageIndex: 1,
                pageSize: 10,
                sort: 'figureCode',
                asc: true,
                countryId: undefined
            },
            seatData: {
                uid: ''
            },
            selectNumber: 0,
            selectFlag: false
        };

        /** 获取语言库 */
        $scope.getLanguage = function () {
            carrierAirlineService.getLanguage(function (data) {
                if (data.errorCode === 0) {
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        /** 初始加载机场信息列表 */
        $scope.$on('$viewContentLoaded', function () {
            loadListData();
            initCountry();
        });


        function initCountry() {
            var countrySearchEle;
            var data = {};
            /*初始化国家start*/
            // data = carrierAirlineService.getCountry();
            // angular.forEach( data.data , function(value, key){
            //     value.name += "(" + value.figureCode + ")";
            // });

            data = $scope.getCountryData();
            rebuildName(data.data);

            countrySearchEle = selectFactory({
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
                    $scope.countrySearchId = currentData.figureCode;
                    $scope.countrySearch = name;
                    $scope.$apply();
                }
            });

        }

        $scope.clearData = function () {
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            $scope.tableModel.restData.countryId = undefined;
            $scope.countrySearchId = '';
            $scope.countrySearch = '';

            loadListData();

        }

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

        /** 机场弹框菜单显示隐藏 */
        var bar = $('#nest-AirportFrom .label-text');
        airportFromBar();
        function airportFromBar() {
            barClick(bar);
        };

        /** 打开机场弹框 */
        $scope.addAirport = function () {
            $('.select-list-box').empty();
            $scope.textNumber = 140;

            $('#nest-AirportFrom').css('display', 'table');
            $scope.title = Lang.getValByKey("carrierAirline", 'company_prompt_new');
            $scope.nestAirportFrom = true;
            $scope.isEditCity = true;
            $scope.showTriadCode = false;

            $scope.airportName = '';
            $scope.countryName = '';
            $scope.countryId = '';
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
            return carrierAirlineService.getCountry(config);
        };

        function rebuildName(data) {
            if (!data) {
                return;
            }
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].name + '(' + data[index].code + ')';
            }
        }

        $scope.initSelectList = function () {
            var data,
                countryEle;

            /** 检索国家事件 */
            data = $scope.getCountryData();
            rebuildName(data.data);

            countryEle = selectFactory({
                data: data,
                id: "country",
                isSearch: true,
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
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
                    $scope.$apply();
                    clearNextAddress(countryEle);
                }
            });

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
                    figureCode: triadCode.toUpperCase(),
                    triadCode: tetradCode.toUpperCase(),
                    description: $scope.remark,
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
                carrierAirlineService.saveCompany(config, function (res) {
                    if (res.errorCode == 0) {

                        var arr = [];
                        var config = {seatParams: {id: res.data}};
                        carrierAirlineService.getCompanyById(config, function (res) {
                            if (res.errorCode == 0) {
                                var value = res.data;
                                arr.push(value);
                            }
                        });

                        var params = {
                            'urlParams': $scope.tableModel.restData
                        };
                        tableService.getTable($scope.tableModel.restURL, params, function (response) {
                            if (response.errorCode === 0) {
                                $scope.tableModel = tableService.table($scope.tableModel, params, response);
                            }
                        });

                        $scope.nestAirportFrom = false;

                        //清除angular表单脏值检测
                        $scope.AirportFrom.$setPristine();
                        $scope.AirportFrom.$setUntouched();
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                })
            } else {
                config = $.extend({}, {seatParams: {id: $scope.clickTrId}}, config);
                carrierAirlineService.editCompany(config, function (res) {
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
            loadBar(bar);
            $scope.title = Lang.getValByKey("carrierAirline", 'company_prompt_edit');
            $scope.nestAirportFrom = true;
            $scope.showTriadCode = false;
            var element = $($event.target)[0].nodeName == 'SPAN' ? $($event.target).parent() : $($event.target);
            $scope.clickTrId = element.parent().parent().data('id');
            var config = {seatParams: {id: $scope.clickTrId}};
            carrierAirlineService.getCompanyById(config, function (res) {
                if (res.errorCode == 0) {
                    var value = res.data;
                    $scope.airportName = value.name;
                    $scope.countryId = value.countryId;
                    if (value.countryName == null) {
                        $('input[name="countryName"]').val('')
                    } else {
                        $scope.countryName = value.countryName +'('+value.countryId+')'
                    }
                    ;
                    $scope.triadCode = value.figureCode;
                    $scope.tetradCode = value.triadCode;
                    $scope.remark = value.description;

                    $scope.AirportFrom.$valid = true;
                    var ele = $('.language-international input');
                    ele.each(function (i) {
                        for (var j = 0, l = value.i18n.length; j < l; j++) {
                            if (ele.eq(i).data('code') == value.i18n[j].language) {
                                ele.eq(i).data('id', value.i18n[j].refId);
                                ele.eq(i).data('code', value.i18n[j].language);
                                ele.eq(i).val($.trim(value.i18n[j].localName));
                            }
                        }
                    });

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
                        tip: Lang.getValByKey("carrierAirline", 'company_prompt_delete')
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
                    contentDelay: Lang.getValByKey("carrierAirline", 'company_prompt_delay_tip'),
                    type: 'errer',
                    manualClose: true
                });
            }
            ;
        };

        function submitDeleteAirport(selectArr) {
            var arr = [];
            for (var i = 0, l = selectArr.length; i < l; i++) {
                arr.push(selectArr[i].id);
            }
            var config = {urlParams: arr};
            carrierAirlineService.deleteCompanyById(config, function (response) {
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
            loadListData();
        };

        /** 国际化 */
        $scope.internationalization = function () {
            window.location.href = '#/international?q=carrierAirline';
        };

        /*$scope.removeValidateName = function(){
         $scope.showAirportName = false;
         };

         /!** 校验机场名称 *!/
         $scope.validateName = function(){
         if(!$scope.airportName) return;
         var config = {urlParams: {name: $scope.airportName}};
         carrierAirlineService.validateCompanyName(config, function(res){
         if(res.errorCode == 0){
         $scope.showAirportName = false;
         }else{
         $scope.showAirportName = true;
         };
         });
         };*/


        /** 校验二字码 */
        $scope.validateTriadCode = function () {
            if (!$scope.triadCode) return;
            if ($('button[name="prompt-save"]').hasClass('save')) {
                var config = {urlParams: {figureCode: $scope.triadCode}};
            } else {
                var config = {
                    urlParams: {
                        figureCode: $scope.triadCode,
                        id: $scope.clickTrId
                    }
                };
            }
            ;

            carrierAirlineService.validateCompanyFigureCode(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.showTriadCode = false;
                } else {
                    $scope.showTriadCode = true;
                    angular.element($(".validate-triad-code").addClass("ng-invalid"));
                }
                ;
            });
        };

        $scope.removeValidateTriadCode = function () {
            $scope.showTriadCode = false;
        };

        /*$scope.removeValidateTetradCode = function(){
         $scope.showTetradCode = false;
         };

         /!** 校验三字码 *!/
         $scope.validateTetradCode = function(){
         if(!$scope.tetradCode) return;
         var config = {urlParams: {triadCode: $scope.tetradCode}};
         carrierAirlineService.validateAirportTriadCode(config, function(res){
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
        $scope.valueTolocaleUpperCase = function ($event, maxLength) {
            var value = $.trim($($event.target).val());
            if (value.length > maxLength) {
                $($event.target).val(value.substr(0, maxLength));
                value = value.substr(0, maxLength);
            }

            $($event.target).val($.trim(value.toLocaleUpperCase()));
        };
    }]);
});
easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'public/common/tableController.js',
    "widget/tab",
    "widget/select"
],function() {
    app.controller('stationPortCtrl', ['$scope', 'stationPortService', 'stationPortView', 'tableService', function ($scope, stationPortService, stationPortView, tableService) {

        $.extend($scope, {
            refreshTableData: function () {
                var params = {
                    'urlParams': $scope.tableModel.restData
                };

                function setScroll() {
                    $('.table-container tbody').slimscroll({
                        height: $('.content-main').height() - 270
                    });
                };
                tableService.getTable($scope.tableModel.restURL, params, function (data) {
                    $scope.q = $scope.tableModel.restData.q;
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                        setTimeout(function () {
                            setScroll();
                            $(window).on("resize", setScroll);
                            $scope.$apply();
                            $(".table-box").focus();
                        }, 100);
                    }
                });

            },
            /** 检索机场 */
            retrievalPort: function () {
                $scope.q = $scope.tableModel.restData.q;
                $scope.tableModel.restData.pageIndex = 1;
                $scope.tableModel.restData.countryId = $scope.countrySearchId;
                $scope.tableModel.restData.cityId = $scope.citySearchId;
                $scope.refreshTableData();
            },
            clearData: function () {
                $scope.countrySearch = "";
                $scope.countrySearchId = "";
                $scope.citySearch = "";
                $scope.citySearchId = "";
                $scope.tableModel.restData.q = "";
                $scope.q = "";
                $scope.retrievalPort();

            },
            resetCitySearchData: function () {

            },
            //弹框部分
            /** 获取语言库 */
            getLanguage: function () {
                stationPortService.getLanguage(function (data) {
                    if (data.errorCode === 0) {
                        $scope.language = data.data;
                    }
                });
            },
            resetCityData: function () {

            },
            checkPortCode: function () {
                if (!$scope.code) return;

                if ($('button[name="prompt-save"]').hasClass('save')) {
                    var config = {urlParams: {code: $scope.code}};
                } else {
                    var config = {
                        urlParams: {
                            code: $scope.code,
                            id: $scope.id
                        }
                    };
                }
                stationPortService.checkPortCode(config, function (returnData) {
                    if (returnData.errorCode != 0) {
                        $scope.showCodeExist = true;
                    } else {
                        $scope.showCodeExist = false;
                    }

                })

            },
            addPort: function () {
                $scope.getLanguage();
                $scope.showCodeExist = false;

                $('.select-list-box').empty();
                $scope.textNumber = 140;
                $scope.addrNumber = 140;

                $('#nest-PortFrom').css('display', 'table');
                $scope.title = Lang.getValByKey("stationPort", 'stationPort_prompt_new');
                $scope.nestPortFrom = true;
                $scope.isEditCity = true;

                $scope.portName = '';
                $scope.portNameEn = '';
                $scope.countryName = '';
                $scope.cityName = '';
                $scope.portAddr = '';
                $scope.portType = "sea_port";
                $scope.code = '';

                $scope.remark = '';
                var ele = $('.language-international input');
                ele.each(function (i) {
                    ele.eq(i).val('');
                });

                loadBar(bar);
                $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            },
            closePrompt: function () {
                $scope.nestPortFrom = false;
                //清除angular表单脏值检测
                $scope.PortFrom.$setPristine();
                $scope.PortFrom.$setUntouched();
            },
        })

        function checkSave() {
            if (!$scope.portName) {
                $scope.PortFrom.portName.$setDirty();
            }
            if (!$scope.portNameEn) {
                $scope.PortFrom.portNameEn.$setDirty();
            }
            ;
            if (!$scope.countryName) {
                $scope.PortFrom.countryName.$setDirty();
            }
            ;
            if (!$scope.cityName) {
                $scope.PortFrom.cityName.$setDirty();
            }
            ;
            if (!$scope.portAddr) {
                $scope.PortFrom.portAddr.$setDirty();
            }
            ;

            if (!$scope.showCodeExist) {
                $scope.PortFrom.code.$setDirty();
            }
            ;

            if ($scope.showCodeExist == true) {
                $scope.PortFrom.$valid = false;
            }
            ;

            showErrorModel(bar);

            if (!$scope.PortFrom.$valid) {
                scrollToErrorView($(".switch-list"));
                return false;
            } else {
                return true;
            }
        }


        /** 新建港口保存 */
        $scope.savePrompt = function () {

            if (checkSave() != true) {
                return false;
            }

            var ele = $('.language-international input');
            var i18nData = [], Arr = [];
            ele.each(function (i) {
                Arr[i] = {};
                Arr[i].language = ele.eq(i).data('code');
                Arr[i].localName = ele.eq(i).val();
                Arr[i].refId = ele.eq(i).data('id');
                i18nData.push(Arr[i]);
            });

            var config = {
                urlParams: {
                    name: $scope.portName,
                    englishName: $scope.portNameEn,
                    countryName: $scope.countryName,
                    countryId: $scope.countryId,
                    cityName: $scope.cityName,
                    cityId: $scope.cityId,
                    address: $scope.portAddr,
                    type: $scope.portType,
                    typeName: $scope.portType,
                    code: $scope.code,
                    remark: $scope.remark,
                    i18n: i18nData
                }
            };

            if ($('button[name="prompt-save"]').hasClass('save')) {
                stationPortService.savePort(config, function (res) {
                    if (res.errorCode == 0) {
                        $scope.nestPortFrom = false;
                        $scope.PortFrom.$setPristine();
                        $scope.PortFrom.$setUntouched();

                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});

                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                })
            } else {
                config = $.extend({}, {seatParams: {id: $scope.id}}, config);
                stationPortService.modifyPort(config, function (res) {
                    if (res.errorCode == 0) {

                        $scope.nestPortFrom = false;

                        //清除angular表单脏值检测
                        $scope.PortFrom.$setPristine();
                        $scope.PortFrom.$setUntouched();

                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                    ;
                });
            }
            ;

            $scope.refreshTableData();

        };


        /** 修改港口保存 */
        $scope.editPortInfo = function (value) {
            $scope.showCodeExist = false;

            $('.select-list-box').empty();
            $('#nest-PortFrom').css('display', 'table');

            $scope.isEditCity = false;


            loadBar(bar);
            $scope.title = Lang.getValByKey("stationPort", 'port_prompt_edit');
            $scope.nestPortFrom = true;

            $scope.portName = value.name;
            $scope.portNameEn = value.englishName;
            $scope.countryName = value.countryName +'(' + value.countryId +')';
            $scope.countryId = value.countryId;
            $scope.cityName = value.cityName;
            $scope.cityId = value.cityId;
            $scope.portAddr = value.address;
            $scope.portType = value.type;
            $scope.code = value.code;
            $scope.remark = $.trim(value.remark);
            $scope.textNumber = 140 - $scope.remark.length;

            $scope.id = value.id;

            var config = {seatParams: {id: $scope.id}};
            stationPortService.getPortById(config, function (res) {
                if (res.errorCode == 0) {
                    value = res.data;
                    $scope.portType = value.type;

                    console.log(value.i18n);

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

                }

            })


            $('button[name="prompt-save"]').removeClass('save').addClass('edit');

        }

        /** 删除机场信息 */
        $scope.deletePort = function () {
            if ($scope.tableModel.selectNumber != 0 && $('.user-table tbody tr').length != 0) {
                var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("stationPort", 'port_prompt_delete')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                submitDeletePort(selectArr);
                            }
                        }
                    ]
                });
            } else {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_table_delTips'),
                    type: 'errer',
                    manualClose: true
                });
            }
            ;
        };

        function submitDeletePort(selectArr) {
            var arr = [];
            for (var i in selectArr) {
                arr.push(selectArr[i].id);
            }
            var config = {urlParams: arr};
            stationPortService.delPort(config, function (response) {
                if (response.errorCode == 0) {
                    $(document).promptBox('closePrompt');
                    $scope.refreshTableData();

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


        function init() {
            $scope.getLanguage();
        }

        init();

        $scope.internationalization = function () {
            window.location.href = '#/international?q=stationPort';
        };


        var bar = $('#nest-PortFrom .label-text');
        airportFromBar();
        function airportFromBar() {
            barClick(bar);
        };


        var countryEle = {};
        var citySearchEle = {};
        var countrySelectElm = {};
        var citySelectElm = {};

        stationPortView.initSelect($scope, countryEle, citySearchEle);
        stationPortView.initTable($scope);
        stationPortView.initPromptSelect($scope, countrySelectElm, citySelectElm);

        $scope.getCityList = function (data, currentPage) {
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
            return stationPortService.getCity(cityConfig);
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
            return stationPortService.getCity(cityConfig);
        };

        $scope.resetCitySearchData = function () {

            if (Select.sharePool["citySearch"]) {
                if (!$scope.countrySearchId) {
                    Select.sharePool["citySearch"].setData({});
                } else {
                    Select.sharePool["citySearch"].setData(getCityListByCountryId());
                }

            }
        }

        $scope.resetCityData = function () {

            if (Select.sharePool["city"]) {
                if (!$scope.countryId) {
                    Select.sharePool["city"].setData({});
                } else {
                    Select.sharePool["city"].setData($scope.getCityList());
                }

            }
        }

        $scope.textNumber = 140;
        $scope.showTextNumber = function () {

            $scope.textNumber = 140 - $scope.remark.length;
        };

        $scope.addrNumber = 140;
        $scope.showAddrNumber = function () {
            if (!$scope.portAddr) {
                $scope.addrNumber = 140
            } else {
                $scope.addrNumber = 140 - $scope.portAddr.length;
            }

        };

        $scope.clearCodeExistTip = function () {
            $scope.showCodeExist = false;

        }
    }]);
});

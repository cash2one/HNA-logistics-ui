easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select',
    'public/lib/pinyin.js',
    'public/lib/pinyin-util.js'
],function(){
    app.controller('currencyCtrl', ['$scope', 'currencyService', 'currencyView', 'tableService', function($scope, currencyService, currencyView, tableService) {
        $scope.isCreateNewCurrency = true;
        $scope.oldCountryName = "";
        function submitDeleteCurrency(param) {
            currencyService.delCurrency(param, function(data) {
                if(data.errorCode === 0) {
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                    $(document).promptBox('closePrompt');
                    //更新table表数据
                    loadCurrencyData();
                } else{
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
        }
        var bar = $('#nest-currencyFrom .label-text');
        currencyFromBar();
        function currencyFromBar() {
            barClick(bar);
        };
        $scope.international = function() {
            window.location.href = '#/international?q=currency';
        };
        $scope.initSelectList = function() {
            $scope.data = currencyService.getCountryList();
            for(var index = 0; index < $scope.data.data.length; index++) {
                $scope.data.data[index].name = $scope.data.data[index].name + "(" + $scope.data.data[index].code + ")";
            }
            selectFactory({
                data: $scope.data,
                id: "country-text",
                isSearch: true,
                defaultText: '请选择',
                searchPlaceHoder: '请输入国家名称或二字码',
                multipleSign: ",",
                pagination: true,
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.data = $scope.getCountryData(data,currentPage);
                    attachEvent.setData($scope.data);
                },
                attrTextModel: function (name, data) {
                    $scope.countryName = name;
                    $scope.$apply();
                }
            });
        };
        $scope.getCountryData = function(q,currentPage){
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
            var data = currencyService.getCountryList(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };

        $scope.checkTriadCode = function() {
            if(!$scope.triadCode || typeof $scope.triadCode == "undefined") {
                return false;
            }
            $scope.triadCode = $scope.triadCode.toLocaleUpperCase();
            if($.trim($scope.triadCode).length != 3) {
                $scope.currencyFrom.triadCode.$setDirty();
                $scope.currencyFrom.triadCode.errorTips = Lang.getValByKey("currency", "currency_input_three_code_limit");
                $("#triad-code-msg").removeClass("ng-hide");
                return false;
            } else {
                $("#triad-code-msg").addClass("ng-hide");
                $scope.currencyFrom.triadCode.errorTips = "";
            }
            return true;
        }
        $scope.verifyCodeExist = function() {
            if(!$scope.checkTriadCode()) {
                return;
            }
            if(!$scope.triadCode || typeof $scope.triadCode == "undefined") {
                return;
            }
            if($scope.triadCode && $scope.triadCode != $scope.oldTriadCode) {
                currencyService.verifyCodeExist({
                    seatParams: {
                        "code": $scope.triadCode
                    }
                }, function(data) {
                    if(data.errorCode == 0 && data.data.length > 0) {
                        $scope.currencyFrom.triadCode.$setDirty();
                        $scope.currencyFrom.triadCode.errorTips = "三字码已存在";
                        $("#triad-code-msg").removeClass("ng-hide");
                        angular.element($(".check-triad-code").addClass("ng-invalid"));
                    } else {
                        $("#triad-code-msg").addClass("ng-hide");
                        $scope.currencyFrom.triadCode.errorTips = "";
                        angular.element($(".check-triad-code").removeClass("ng-invalid"));
                    }
                });
            }
        }
        $scope.editCurrency = function(value) {
            $("#nest-currencyFrom").css("display", "table");
            $scope.isCreateNewCurrency = false;
            $scope.promptTitle = Lang.getValByKey("currency", "currency_detail_title");
            $scope.nestCurrencyFrom = true;
            $scope.currencyName = value.name;
            $scope.countryName = value.organization;
            $scope.triadCode = value.code;
            $scope.mark = value.csymbol;
            $scope.oldTriadCode = value.code;
            $scope.oldCountryName = value.organization;
            $scope.id = value.id;
            currencyService.verifyCodeExist({
                seatParams: {
                    "code": $scope.triadCode
                }
            }, function(data) {
                languages = data.data;
                var languageArray = [];
                for(var index = 0; index < $scope.langList.length; index++) {//先做清理
                    $scope.langList[index].val = "";
                    $scope.langList[index].refId = "";
                }
                if(languages && languages.length > 0) {
                    for(var index = 0; index < $scope.langList.length; index++) {
                        languageArray.push($scope.langList[index].code);
                    }
                    for(var index = 0; index < languages.length; index++) {
                        var language = languages[index].language;
                        if(languageArray.indexOf(language) > -1) {
                            $scope.langList[languageArray.indexOf(language)].val = $.trim(languages[index].localName);
                            $scope.langList[languageArray.indexOf(language)].refId = languages[index].refId;
                        }
                    }
                }
            });
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            loadBar(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        /** 打开币种弹框 */
        $scope.add = function() {
            $scope.promptTitle = Lang.getValByKey("currency", "currency_create_title");
            $scope.isCreateNewCurrency = true;
            $("#nest-currencyFrom").css("display", "table");
            $scope.nestCurrencyFrom = true;
            //$scope.promptTitle = Lang.getValByKey("country", "country_create_title");
            $scope.currencyName = '';
            $scope.countryName = '';
            $scope.triadCode = '';
            $scope.mark = '';
            $scope.oldTriadCode = '';
            $(".input-text").removeClass("ng-dirty");
            $scope.oldCountryName = "";
            loadBar(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            for (var index = 0; index < $scope.langList.length; index++) {//清除国际化内容
                $scope.langList[index].val = "";
                $scope.langList[index].refId = "";
            }
        };
        $scope.delete = function() {//删除一条记录
            if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                var param = [];
                var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                if(!oldData.length) {
                    accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("currency", "currency_prompt_delay_tip"),type: 'errer',manualClose:true});
                    return false;
                }
                //组织数据
                angular.forEach(oldData, function(val) {
                    param.push(val.id);
                });
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("currency", 'currency_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function() {
                                submitDeleteCurrency(param);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("currency", 'currency_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        }
        function getOrganizationByCode(countryName) {
            $scope.data = currencyService.getCountryList({
                "urlParams": {
                    pageSize: 1000
                }
            });
            var allCountryList = $scope.data.data;
            var countryNameList = countryName.split("，");
            var countryCodeList = [];
            for(var index = 0; index < countryNameList.length; index++) {
                var currentCountryName =  countryNameList[index];
                if(currentCountryName.indexOf("(") > -1) {
                    currentCountryName = currentCountryName.substring(0, currentCountryName.indexOf("("));
                }
                for(var jndex = 0;  jndex < allCountryList.length; jndex++) {
                    if(allCountryList[jndex].name.indexOf("(") > -1) {
                        allCountryList[jndex].name = allCountryList[jndex].name.substring(0, allCountryList[jndex].name.indexOf("("));
                    }
                    if($.trim(currentCountryName) == allCountryList[jndex].name) {
                        countryCodeList.push(allCountryList[jndex].code);
                        break;
                    }
                }
            }
            return countryCodeList.join("，");

        }
        /** 关闭国家弹框 */
        $scope.closePrompt = function() {
            $scope.nestCurrencyFrom = false;
        };
        $scope.savePrompt = function() {
            showErrorModel(bar);
            $scope.verifyCodeExist();
            $scope.countryName = $("#country-text").val();
            if(!$scope.currencyName) {
                $scope.currencyFrom.currencyName.$setDirty();
            };
            if(!$scope.countryName) {
                $scope.currencyFrom.countryName.$setDirty();
            };
            if(!$scope.triadCode){
                $scope.currencyFrom.triadCode.$setDirty();
            };
            if(!$scope.mark){
                $scope.currencyFrom.mark.$setDirty();
            };
            if(!$scope.currencyFrom.$valid){
                return;
            };
            // var noResult = $(".no-result");
            // for(var index = 0; index < noResult.length; index++) {
            //     var ulEle = $(noResult[index]).closest('ul');
            //     ulEle.css("visibility", "visible");
            // }
            // if(noResult.length > 0) {
            //     return;
            // }
            var errorEles = $(".errors");
            for(var index = 0; index < errorEles.length; index++) {
                if(!$(errorEles[index]).hasClass("ng-hide")) {
                    return;
                }
            }
            //组织国际化数据start
            var i18n = [];
            for(var index = 0; index < $scope.langList.length; index++) {
                if(!$.trim($scope.langList[index].val)) {
                    $scope.langList[index].val = "";
                }
                i18n.push({
                    "language": $scope.langList[index].code,
                    "localName": $scope.langList[index].val,
                    "refId": $scope.langList[index].refId
                });
            }
            var countryCode = getOrganizationByCode($scope.countryName);
            if($scope.isCreateNewCurrency) {//新增货币
                currencyService.createCurrency({
                    "name": $scope.currencyName,
                    "organization": countryCode,
                    "code": $scope.triadCode,
                    "csymbol": $scope.mark,
                    "i18n": i18n
                }, function(data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadCurrencyData();
                    }
                });
            } else {//更新货币
                currencyService.updateCurrency({
                    "name": $scope.currencyName,
                    "organization": countryCode,
                    "code": $scope.triadCode,
                    "csymbol": $scope.mark,
                    "i18n": i18n,
                    "id": $scope.id
                }, function (data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadCurrencyData();
                    }
                });
            }
            //组织国际化数据end
        }
        $scope.searchCurrency = function() {
            $scope.tableModel.restData.pageIndex = 1;
            loadCurrencyData();
        }
        function setScroll() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 250
            });
        }
        function loadCurrencyData() {
            var params = {
                'urlParams': $scope.tableModel.restData,
                'seatParams': {
                    "language": "zh-CN"
                }
            };
            tableService.getTable($scope.tableModel.restURL, params, function(data) {
                $scope.q = $scope.tableModel.restData.q;
                if(data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    setTimeout(function() {
                        setScroll();
                        $(window).on("resize", setScroll);
                        $scope.$apply();
                        $(".table-box").focus();
                    }, 100);
                }
            });
        }
        function initTable() {
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey("currency", "currency_id"),
                    Lang.getValByKey("currency", "currency_name"),
                    Lang.getValByKey("currency", "currency_country"),
                    Lang.getValByKey("currency", "currency_three_code"),
                    Lang.getValByKey("currency", "currency_mark")
                ],
                tableHeaderSize: [
                    '5%',
                    '27%',
                    '21%',
                    '21%',
                    '21%'
                ],
                tableBody: [],
                restURL: "logistics.searchCurrencyList",
                restData: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    isAsc: true,
                    unfilled: false
                },
                selectNumber: 0,
                selectFlag: false
            };
            loadCurrencyData();
        }
        function initLangList() {
            $scope.langList = currencyService.getInternational().data;
        }
        initLangList();
        initTable();
    }]);
});

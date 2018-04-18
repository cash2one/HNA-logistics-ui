easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt'
], function() {
    app.controller('countryCtrl', ['$scope', 'countryService', 'countryView', 'tableService', function($scope, countryService, countryView, tableService) {
        $scope.searchCountry = function() {
            $scope.tableModel.restData.pageIndex = 1;
            loadCountryData();
        }
        $scope.promptTitle = Lang.getValByKey("country", "country_create_title");
        $scope.isCreateNewCountry = true;
        $scope.delete = function() {
            if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                var param = [];
                var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                if(!oldData.length) {
                    accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("country", "country_prompt_delay_tip"),type: 'errer',manualClose:true});
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
                        tip: Lang.getValByKey("country", 'country_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function() {
                                submitDeleteCountry(param);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("country", 'country_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        }
        $scope.international = function() {
            window.location.href = '#/international?q=country';
        }
        $scope.checkCountry = function() {
            /*if($scope.countryName && $scope.countryName != $scope.oldCountryName) {
             countryService.checkCountryName({
             "name": $scope.countryName
             }, function(data) {
             if(data.errorCode != 0) {//国家重复
             $scope.countryFrom.countryName.$setDirty();
             $scope.countryFrom.countryName.errorTips = data.msg;
             $("#name-msg").removeClass("ng-hide");
             } else {//国家不重复
             $("#name-msg").addClass("ng-hide");
             $scope.countryFrom.countryName.errorTips = "";
             }
             });
             } else if($scope.countryName == $scope.oldCountryName) {
             $("#name-msg").addClass("ng-hide");
             $scope.countryFrom.countryName.errorTips = "";
             }*/
        }
        $scope.checkFigureCode = function() {
            if(!$scope.fingerCode) {
                return;
            }
            $scope.fingerCode = $scope.fingerCode.toLocaleUpperCase();
            if($.trim($scope.fingerCode).length != 2) {
                $scope.countryFrom.fingerCode.$setDirty();
                $scope.countryFrom.fingerCode.errorTips = Lang.getValByKey("country", "country_input_two_code_limit");
                $("#figure-code-msg").removeClass("ng-hide");
            } else if($scope.fingerCode && $scope.fingerCode != $scope.id) {
                countryService.checkFigureCode({
                    "figureCode": $scope.fingerCode
                }, function(data) {
                    if(data.errorCode != 0) {//二字码重复
                        $scope.countryFrom.fingerCode.$setDirty();
                        $scope.countryFrom.fingerCode.errorTips = data.msg;
                        $("#figure-code-msg").removeClass("ng-hide");
                        angular.element($(".check-figure-code").addClass("ng-invalid"));
                    } else {//二字码不重复
                        $("#figure-code-msg").addClass("ng-hide");
                        $scope.countryFrom.fingerCode.errorTips = "";
                    }
                });
            } else if($scope.fingerCode == $scope.id) {
                $("#figure-code-msg").addClass("ng-hide");
                $scope.countryFrom.fingerCode.errorTips = "";
            }
        }
        $scope.checkTriadCode = function() {
            if(!$scope.triadCode) {
                return;
            }
            $scope.triadCode = $scope.triadCode.toLocaleUpperCase();
            if($.trim($scope.triadCode).length != 3) {
                $scope.countryFrom.triadCode.$setDirty();
                $scope.countryFrom.triadCode.errorTips = Lang.getValByKey("country", "country_input_three_code_limit");
                $("#triad-code-msg").removeClass("ng-hide");
            } else {
                $("#triad-code-msg").addClass("ng-hide");
                $scope.countryFrom.triadCode.errorTips = "";
            }
            /*if($scope.triadCode && $scope.triadCode != $scope.oldTriadCode) {
             countryService.checkTriadCode({
             "triadCode": $scope.triadCode
             }, function(data) {
             if(data.errorCode != 0) {//三字码重复
             $scope.countryFrom.triadCode.$setDirty();
             $scope.countryFrom.triadCode.errorTips = data.msg;
             $("#triad-code-msg").removeClass("ng-hide");
             } else {//三字码不重复
             $("#triad-code-msg").addClass("ng-hide");
             $scope.countryFrom.triadCode.errorTips = "";
             }
             });
             } else if($scope.triadCode == $scope.oldTriadCode) {
             $("#triad-code-msg").addClass("ng-hide");
             $scope.countryFrom.triadCode.errorTips = "";
             }*/
        }
        $scope.checkArea = function() {
            /*if($scope.areaCode && $scope.areaCode != $scope.oldAreaCode) {
             countryService.checkAreaCode({
             "areaCode": $scope.areaCode
             }, function(data) {
             if(data.errorCode != 0) {//地区编码重复
             $scope.countryFrom.areaCode.$setDirty();
             $scope.countryFrom.areaCode.errorTips = data.msg;
             $("#area-msg").removeClass("ng-hide");
             } else {//地区编码不重复
             $("#area-msg").addClass("ng-hide");
             $scope.countryFrom.areaCode.errorTips = "";
             }
             });
             } else if($scope.areaCode == $scope.oldAreaCode){
             $("#area-msg").addClass("ng-hide");
             $scope.countryFrom.areaCode.errorTips = "";
             }*/
        }
        $scope.editCountry = function(value) {
            $("#nest-countryFrom").css("display", "table");
            $scope.isCreateNewCountry = false;
            //$("input[name=fingerCode]").attr("disabled", "true");
            $scope.promptTitle = Lang.getValByKey("country", "country_detail_title");
            $scope.nestCountryFrom = true;
            $scope.countryName = value.name;
            $scope.fingerCode = value.figureCode;
            $scope.triadCode = value.triadCode;
            $scope.areaCode = value.areaCode;
            $scope.id = value.figureCode;
            $scope.AreaId = value.id;
            $scope.oldCountryName = value.name;
            $scope.oldTriadCode = value.triadCode;
            $scope.oldAreaCode = value.areaCode;
            var singleCountryData = countryService.getSingleDataById(value.id);
            if(singleCountryData.data && singleCountryData.data.i18n) {
                var languages = singleCountryData.data.i18n;
                if (languages.length > 0) {
                    for (var index = 0; index < languages.length; index++) {
                        var language = languages[index].language;
                        for (var jndex = 0; jndex < $scope.langList.length; jndex++) {
                            var code = $scope.langList[jndex].code;
                            if (language == code) {
                                $scope.langList[jndex].val = $.trim(languages[index].localName);
                                $scope.langList[jndex].refId = languages[index].refId;
                                break;
                            }
                        }
                    }
                } else {
                    for (var index = 0; index < $scope.langList.length; index++) {
                        $scope.langList[index].val = "";
                        $scope.langList[index].refId = "";
                    }
                }
            }
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            loadBar(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        /** 国家弹框菜单显示隐藏 */
        var bar = $('#nest-countryFrom .label-text');
        countryFromBar();
        function countryFromBar() {
            barClick(bar);
        };
        /** 打开国家弹框 */
        $scope.add = function(){
            $("#nest-countryFrom").css("display", "table");
            $scope.isCreateNewCountry = true;
            $scope.nestCountryFrom = true;
            $("input[name=fingerCode]").removeAttr("disabled");
            $scope.promptTitle = Lang.getValByKey("country", "country_create_title");
            $scope.countryName = '';
            $scope.fingerCode = '';
            $scope.triadCode = '';
            $scope.areaCode = '';
            $scope.id = '';
            $scope.oldCountryName = '';
            $scope.oldTriadCode = '';
            $scope.oldAreaCode = '';
            $(".input-text").removeClass("ng-dirty");
            loadBar(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            for (var index = 0; index < $scope.langList.length; index++) {//清除国际化内容
                $scope.langList[index].val = "";
                $scope.langList[index].refId = "";
            }
        };
        /** 关闭国家弹框 */
        $scope.closePrompt = function() {
            $scope.nestCountryFrom = false;
        };

        $scope.savePrompt = function() {
            showErrorModel(bar);
            $scope.checkFigureCode();
            $scope.checkTriadCode();
            if(!$scope.countryName){
                $scope.countryFrom.countryName.$setDirty();
            };
            if(!$scope.fingerCode){
                $scope.countryFrom.fingerCode.$setDirty();
            };
            if(!$scope.triadCode){
                $scope.countryFrom.triadCode.$setDirty();
            };
            if(!$scope.areaCode){
                $scope.countryFrom.areaCode.$setDirty();
            };
            if(!$scope.countryFrom.$valid){
                return;
            };
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
            //组织国际化数据end
            if($scope.isCreateNewCountry) {
                countryService.createCountry({
                    "name": $scope.countryName,
                    "figureCode": $scope.fingerCode,
                    "triadCode": $scope.triadCode,
                    "areaCode": $scope.areaCode,
                    "i18n": i18n
                }, function (data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey("country", "country_create_country_tips"),
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadCountryData();
                    }
                });
            } else {
                countryService.updateArea({
                    urlParams: {
                        "name": $scope.countryName,
                        "figureCode": $scope.fingerCode,
                        "triadCode": $scope.triadCode,
                        "areaCode": $scope.areaCode,
                        "i18n": i18n
                    },
                    seatParams: {
                        "id": $scope.AreaId
                    }
                }, function(data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey("country", "country_update_country_tips"),
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadCountryData();
                    }
                });
            }
        }
        function submitDeleteCountry(param) {
            countryService.delCountry(param, function(data){
                if(data.errorCode === 0) {
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                    $(document).promptBox('closePrompt');
                    //更新table表数据
                    loadCountryData();
                }else{
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
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
                    Lang.getValByKey("country", "country_id"),
                    Lang.getValByKey("country", "country_name"),
                    Lang.getValByKey("country", "country_tow_code"),
                    Lang.getValByKey("country", "country_three_code"),
                    Lang.getValByKey("country", "country_area_code")
                ],
                tableHeaderSize: [
                    '5%',
                    '25%',
                    '21%',
                    '21%',
                    '23%'
                ],
                tableBody: [],
                restURL: "logistics.countryList",
                restData: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    sort: "figureCode"
                },
                selectNumber: 0,
                selectFlag: false
            };
            loadCountryData();
        }
        function initLangList() {
            $scope.langList = countryService.getInternational().data;
        }
        initLangList();
        initTable();
    }]);

});
// easySpa.use([
//     'widget/slimscroll',
//     'public/common/tableController.js',
//     'widget/prompt'
// ]);

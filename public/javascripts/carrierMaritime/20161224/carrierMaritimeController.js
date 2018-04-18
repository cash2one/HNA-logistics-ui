easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'public/common/tableController.js',
    'widget/slides'
],function() {
    app.controller('carrierMaritimeCtrl', ['$scope', 'carrierMaritimeService', 'carrierMaritimeView','tableService', function ($scope, carrierMaritimeService, carrierMaritimeView,tableService) {
        $scope.carrierMaritimeId = {id: 0};
        $scope.getLanguage = function(){
            carrierMaritimeService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("carrierMaritime", 'carrierMaritime_page_name'),
                Lang.getValByKey("carrierMaritime", 'carrierMaritime_page_country'),
                Lang.getValByKey("carrierMaritime", 'carrierMaritime_page_code'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getShippingCompanyTable',//表格获取接口
            'restData': {
                'q': '',
                'countryId': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': 'code'
            },
            'selectNumber': 0,
            'selectFlag': false
        };
        $scope.getTable = function(isSearch){
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.countryId = $scope.searchCountryCode;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    var height = $('.carrierMaritime-table-page').height() - 255;
                    setTimeout(function() {
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            height = $('.carrierMaritime-table-page').height() - 255;    //重新计算高度
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        var bar = $('#nest-carrierMaritimeForm .label-text');
        carrierMaritimeView.propmtCostEvent(bar);
        $scope.add = function(){
            $scope.carrierMaritimeForm.$setPristine();
            $scope.carrierMaritimeForm.$setUntouched();
            $scope.nestCarrierMaritimeForm = true;
            $('#nest-carrierMaritimeForm').attr('style','').find('.title').text(Lang.getValByKey("carrierMaritime", 'carrierMaritime_page_add'));
            $(".remote-invalid").removeClass('remote-invalid');
            $scope.carrierMaritimeName = '';
            $scope.carrierMaritimeCode = '';
            $scope.addCountry = '';
            $scope.addCountryCode = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;
            $('#globalization').find('.input-text').each(function(){
                $(this).val('').removeClass('lang-invalid ng-invalid ng-dirty');
                $(this).next('.verification').children('span').html('');
            });
            carrierMaritimeView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        $scope.edit = function(id){
            $scope.carrierMaritimeId.id = id;
            $(".remote-invalid").removeClass('remote-invalid');
            $('#nest-carrierMaritimeForm').attr('style','').find('.title').text(Lang.getValByKey("carrierMaritime", 'carrierMaritime_code_modelDetail'));
            $scope.nestCarrierMaritimeForm = true;
            carrierMaritimeView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            carrierMaritimeService.getDetail({'seatParams':{'id':id}}, function(data){
                if(data && data.errorCode === 0){
                    $scope.carrierMaritimeName = data.data.name;
                    $('#carrierMaritimeName_id').val(data.data.name);
                    $scope.carrierMaritimeCode = data.data.code;
                    $('#carrierMaritimeCode_id').val(data.data.code);
                    $scope.addCountry = data.data.countryName +'('+data.data.countryId+')';
                    $scope.addCountryCode = data.data.countryId;
                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);

                    i18nEdit(data.data.i18n);
                }
            });
        };

        function i18nEdit(i18n){
            var length = i18n ? i18n.length : 0;
            $('#globalization').children('li').each(function(){
                $(this).children('input').removeClass('lang-invalid ng-invalid ng-dirty').next('.verification').children('span').html('');
                var code = $(this).children('input').val('').attr('data-code');

                for(var i=0; i<length; i++){
                    if((i18n[i].language).toLowerCase() == code.toLowerCase()){
                        $(this).children('input').val(i18n[i].localName);
                    }
                }
            });
        }

        $scope.save = function(){
            if(!$scope.carrierMaritimeName.trim()){
                $scope.carrierMaritimeForm.carrierMaritimeName.$setDirty();
            }
            if(!$scope.carrierMaritimeCode.trim()){
                $scope.carrierMaritimeForm.carrierMaritimeCode.$setDirty();
            }
            if(!$scope.addCountry){
                $scope.carrierMaritimeForm.addCountry.$setDirty();
            }
            if($scope.enNameError){
                return
            }

            var i18n = [];
            $('#globalization').children('li').each(function(){
                var localName = $.trim($(this).children('input').val());
                var map = {};
                map.language = $(this).children('input').attr('data-code');
                if(map.language === 'en-us'){
                    localName = $scope.carrierEnName;
                }

                if(localName){
                    map.localName = localName;
                    i18n.push(map);
                }
            });

            if($("#code-msg-name").hasClass('remote-invalid') || !$scope.carrierMaritimeForm.$valid){
                carrierMaritimeView.displayErrorBox(bar);
                return;
            }
            if($("#code-msg-code").hasClass('remote-invalid') || !$scope.carrierMaritimeForm.$valid){
                carrierMaritimeView.displayErrorBox(bar);
                return;
            }

            var config = {
                urlParams : {
                    name: $scope.carrierMaritimeName,
                    code: $scope.carrierMaritimeCode,
                    countryId: $scope.addCountryCode,
                    description: $scope.remark,
                    i18n: i18n
                }
            };
            if($scope.carrierMaritimeId.id) {
                config.seatParams = {'id': $scope.carrierMaritimeId.id};
                carrierMaritimeService.saveEdit(config, function(data){
                    if(data && data.errorCode === 0){
                        carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestCarrierMaritimeForm = false;
                        $scope.getTable();
                        $scope.carrierMaritimeId.id ? $scope.carrierMaritimeId.id = 0 : '';
                    }else{
                        carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{
                carrierMaritimeService.save(config, function(data){
                    if(data && data.errorCode === 0){
                        carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestCarrierMaritimeForm = false;
                        $scope.getTable();
                    }else{
                        carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length){
                carrierMaritimeView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                    tip: Lang.getValByKey("carrierMaritime", 'carrierMaritime_code_modelDelTips')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", 'common_page_delete'),
                    application:'delete',
                    operationEvent: function () {
                        carrierMaritimeService.del(config, function(data){
                            carrierMaritimeView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                carrierMaritimeView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                            }
                        });
                    }
                }]
            };
            carrierMaritimeView.promptBox(opt);
        };

        $scope.clearData = function() {
            $scope.q = "";
            $scope.tableModel.restData.q = "";
            $scope.tableModel.restData.countryId = "";
            $scope.searchCountry = "";
            $scope.searchCountryCode = "";
            $scope.getTable();
        };

        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        $scope.checkShippingCompanyCode = function(){
            var config = {
                'urlParams':{
                    'code': $scope.carrierMaritimeCode,
                    'id': $scope.carrierMaritimeId.id
                }
            };
            if($scope.carrierMaritimeCode){
                carrierMaritimeService.checkShippingCompanyCode(config, function(data){
                    if(data.errorCode != 0){
                        $scope.carrierMaritimeForm.carrierMaritimeCode.errorTips = "编码已存在";
                        $("#code-msg-code").removeClass("ng-hide").addClass('remote-invalid');
                    }else{
                        $("#code-msg-code").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.carrierMaritimeForm.carrierMaritimeCode.errorTips = "";
                    }
                });
            }
        };

        $scope.checkEnName = function(){
            var REGEXP = /^([A-Za-z\d\-\&\.\,\(\)\s]+)+$/;
            if($scope.carrierEnName && !REGEXP.test($scope.carrierEnName)){
                $scope.enNameError = true;
                $scope.enNameErrorTips = "请输入英文、数字、空格和符号 “-”、“&”、“(”、“)”、“.”、“,”";
                $('input[name="$parent.carrierEnName"]').css("border-color", "#FA787E");
            }else{
                $scope.enNameError = false;
                $scope.enNameErrorTips = "";
                $('input[name="$parent.carrierEnName"]').css("border-color", "#BDBDBD");
            }
        };

        $scope.cancel = function(){
            $scope.nestCarrierMaritimeForm = false;
            $scope.carrierMaritimeForm.carrierMaritimeCode.errorTips = "";
            $scope.carrierMaritimeId.id ? $scope.carrierMaritimeId.id = 0 : '';
            $scope.enNameError = false;
            $scope.enNameErrorTips = "";
            $('input[name="$parent.carrierEnName"]').css("border-color", "#BDBDBD");
        };

        $scope.international = function() {
            window.location.href = '#/international?q=carrierMaritime';
        };

        var searchCountryEle,addCountryEle;
        $scope.initSelectList = function() {
            var portConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            };
            $scope.searchCountrys  = $scope.addCountrys = carrierMaritimeService.getCountry(portConfig);
            //搜索国家
            searchCountryEle = selectFactory({
                data: $scope.searchCountrys,
                isSearch: true,
                id: "search-country",
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.searchCountrys = $scope.getCountryData(data,currentPage);
                    attachEvent.setData($scope.searchCountrys);
                },
                attrTextModel: function(name, data) {
                    $scope.searchCountryCode = getCountryByName(name, data);
                    $scope.searchCountry  = name;
                    $scope.$apply();
                }
            });
            //添加国家
            addCountryEle = selectFactory({
                data: $scope.addCountrys,
                isSearch: true,
                id: "add-country",
                pagination: true,
                height: 240,
                searchPlaceHoder: "请输入国家名称或二字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent,data,currentPage) {
                    $scope.addCountrys = $scope.getCountryData(data,currentPage);
                    attachEvent.setData($scope.addCountrys);
                },
                attrTextModel: function(name, data) {
                    $scope.addCountryCode = getCountryByName(name, data);
                    $scope.addCountry = name;
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
            var data = carrierMaritimeService.getCountry(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };
        function getCountryByName(name, data) {
            if(!data) {
                data = carrierMaritimeService.getCountry();
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return data[index].code;
                }
            }
            return "无匹配结果";
        }
    }]);
});
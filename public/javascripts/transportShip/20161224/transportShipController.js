easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    "widget/select",
    'public/common/tableController.js',
    'public/common/pictureController.js',
    'widget/slides'
],function(){
    app.controller('transportShipCtrl', ['$scope', 'transportShipService', 'transportShipView', 'tableService','pictureService', function($scope, transportShipService, transportShipView ,tableService,pictureService) {
        $scope.transport = {id: 0};
        $scope.getLanguage = function(){
            transportShipService.getLanguage(function(data){
                if(data.errorCode === 0){
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        var searchCountryEle,searchCompanyEle,addCountryEle,addCompanyEle;
        $scope.initSelectList = function() {
            var countryConfig = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                isAsync: true
            };
            $scope.seachCountryData  = $scope.addCountryData =  transportShipService.getCountry(countryConfig);
            $scope.seachCompanyData  =  $scope.addCompanyData =  transportShipService.getShippingCompany(countryConfig);
            //搜索国家
            searchCountryEle = selectFactory({
                data: $scope.seachCountryData,
                isSearch: true,
                id: "search-country",
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data, currentPage) {
                    $scope.seachCountryData = $scope.getProductData(data,currentPage);
                    attachEvent.setData($scope.seachCountryData);
                },
                attrTextModel: function(name, data) {
                    $scope.countrySearchCode = getcountryByName(name, data);
                    $scope.countrySearch = name;
                    $scope.$apply();
                }
            });
            //搜索船公司
            searchCompanyEle = selectFactory({
                data: $scope.seachCompanyData,
                isSearch: true,
                id: "search-company",
                pagination: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.seachCompanyData = $scope.getCurrentCompanyData(data,currentPage);
                    attachEvent.setData($scope.seachCompanyData);
                },
                attrTextModel: function(name, data) {
                    $scope.searchCompanyId = getCompanyByName(name, data);
                    $scope.searchCompanyName = name;
                    $scope.$apply();
                }
            });
            //添加国家
            addCountryEle = selectFactory({
                data: $scope.addCountryData,
                isSearch: true,
                id: "add-country",
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addCountryData = $scope.getProductData(data,currentPage);
                    attachEvent.setData($scope.addCountryData);
                },
                attrTextModel: function(name, data) {
                    $scope.countryNameCode = getcountryByName(name, data);
                    $scope.countryName = name;
                    $scope.$apply();
                }
            });
            //添加船公司
            addCompanyEle = selectFactory({
                data: $scope.addCompanyData,
                isSearch: true,
                id: "add-company",
                pagination: true,
                defaultText: Lang.getValByKey("common", "common_select_tips"),
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.addCompanyData = $scope.getCurrentCompanyData(data,currentPage);
                    attachEvent.setData($scope.addCompanyData);
                },
                attrTextModel: function(name, data) {
                    $scope.companyId = getCompanyByName(name, data);
                    $scope.companyName = name;
                    $scope.$apply();
                }
            });
        };
        $scope.getCurrentCompanyData = function(q,currentPage){
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
            var data = transportShipService.getShippingCompany(config);
            return data;
        };
        function getCompanyByName(name, data) {
            if(!data) {
                data = transportShipService.getShippingCompany()
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return  data[index].id;
                }
            }
            return "无匹配结果";
        }
        $scope.getProductData = function(q,currentPage){
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
            var data = transportShipService.getCountry(config);
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };
        function getcountryByName(name, data) {
            if(!data) {
                data = transportShipService.getCountry();
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

        $scope.clearDate = function() {
            $scope.tableModel.restData.countryId = "";
            $scope.tableModel.restData.companyId = "";
            $scope.tableModel.restData.q = "";
            $scope.q = "";
            $scope.countrySearchCode = "";
            $scope.countrySearch = "";
            $scope.searchCompanyName = "";
            $scope.searchCompanyId = "";
            $scope.getTable();
        };

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("transportShip", 'transportShip_page_nameEn'),
                Lang.getValByKey("transportShip", 'transportShip_page_name'),
                Lang.getValByKey("transportShip", 'transportShip_page_country'),
                Lang.getValByKey("transportShip", 'transportShip_page_mmsi'),
                Lang.getValByKey("transportShip", 'transportShip_page_mio'),
                Lang.getValByKey("transportShip", 'transportShip_page_callSign'),
                Lang.getValByKey("transportShip", 'transportShip_page_company'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getTransportShipTable',//表格获取接口
            'restData': {
                'countryId':'',
                'companyId':'',
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': 'nameen'
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        $scope.getTable = function(isSearch){
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.countryId = $scope.countrySearchCode;
            $scope.tableModel.restData.companyId = $scope.searchCompanyId;
            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";
            var config = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    var height = $('.ship-table-page').height() - 255;
                    setTimeout(function() {
                        $('.table-container tbody').slimscroll({ height: height });
                        $(window).resize(function(){
                            height = $('.ship-table-page').height() - 255;    //重新计算高度
                            $('.table-container tbody').slimscroll({ height: height });
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        $scope.pictureModel = {
            'edit': true,
            'uploadShow': true,
            'picture': [],
            'accept':'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,image/JPG,image/JPEG,image/PNG,image/BMP,image/TIFF,application/pdf'
        };

        $scope.getPictureUrl = function(fileid){
            $('#slides').picturePreview({pictureId : fileid}, $scope.pictureModel.picture);
        };

        $scope.getFile = function(files){
            var length = files.length;
            var picLength = $scope.pictureModel.picture.length;
            if((length + picLength) > pictureService.maxUpload){
                $(document).promptBox({isDelay:true, contentDelay: Lang.getValByKey("transportShip", 'transportShip_code_maxUploadTIps') + pictureService.maxUpload + Lang.getValByKey("transportAirplane", 'transportAirplane_code_maxUploadLastTIps'), type: 'errer', manualClose:true});
                return false;
            }
            for(var i=0; i<length; i++){
                var result = pictureService.uploadFile($scope.pictureModel, files[i]);

                if(!result){
                    return false;
                }
                if(result.errorlocal){
                    $(document).promptBox({isDelay:true, contentDelay:result.errorlocal, type: 'errer', manualClose:true});
                }else{
                    result.then(function(res){
                        if(res.data.errorCode === 0){
                            $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);

                            $(document).promptBox({isDelay:true, contentDelay: res.data.msg, type: 'success'});
                        }else{
                            $(document).promptBox({isDelay:true, contentDelay: res.data.msg , type: 'errer', manualClose:true});
                        }
                    });
                }
            }
        };

        function pictureArr(picture){
            var length = picture ? picture.length : 0;
            var ret = [];
            for(var i=0; i<length; i++){
                picture[i].picUrlID = typeof (picture[i].picUrlID) == 'object' ? picture[i].picUrlID.id : picture[i].picUrlID;
                ret.push(picture[i].picUrlID);
            }
            return ret;
        }

        function pictureEdit(picture){
            var length = picture ? picture.length : 0;
            var map = {}, ret = [];
            for(var i=0; i<length; i++){
                map = {
                    'picUrlID': picture[i],
                    'delshow': false
                }
                ret.push(map);
            }
            return ret;
        }

        var bar = $('#nest-TransportShipFrom .label-text');
        transportShipView.propmtCostEvent(bar);
        $scope.add = function(){
            //清除angular表单脏值检测
            $scope.TransportShipForm.$setPristine();
            $scope.TransportShipForm.$setUntouched();
            $scope.nestTransportShipForm = true;
            $('#nest-TransportShipFrom').attr('style','').find('.title').text(Lang.getValByKey("transportShip", 'transportShip_page_add'));
            $(".remote-invalid").removeClass('remote-invalid');
            $scope.transportShipName = '';
            $scope.transportShipNameEN = '';
            $scope.countryName = '';
            $scope.countryNameCode = '';
            $scope.companyName = '';
            $scope.companyId = '';
            $scope.transportShipMmsi = '';
            $scope.transportShipImo = '';
            $scope.transportShipCallSign = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;

            //新增时图片处理
            $scope.pictureModel.picture = [];
            $scope.pictureModel = pictureService.init($scope.pictureModel);

            $('#globalization').find('.input-text').each(function(){
                $(this).val('').removeClass('lang-invalid ng-invalid ng-dirty');
                $(this).next('.verification').children('span').html('');
            });

            transportShipView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        $scope.edit = function(id){
            $scope.transport.id = id;
            $(".remote-invalid").removeClass('remote-invalid');
            $('#nest-TransportShipFrom').attr('style','').find('.title').text(Lang.getValByKey("transportShip", 'transportShip_code_modelDetail'));
            $scope.nestTransportShipForm = true;
            transportShipView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
            transportShipService.getDetail({'seatParams':{'id':id}}, function(data){
                if(data && data.errorCode === 0){
                    $scope.transportShipName = data.data.name;
                    $scope.transportShipNameEN = data.data.nameEn;
                    $scope.countryName = data.data.countryName + '(' + data.data.countryId + ')';
                    $scope.countryNameCode = data.data.countryId;
                    $scope.companyName = data.data.companyName;
                    $scope.companyId = data.data.companyId;
                    $scope.transportShipMmsi = data.data.mmsi;
                    $scope.transportShipImo = data.data.imo;
                    $scope.transportShipCallSign = data.data.callSign;
                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);

                    $scope.pictureModel.picture = pictureEdit(data.data.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);

                    i18nEdit(data.data.i18n);
                }
            });
        };
        
        $scope.showTextNumber = function(){
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        $scope.del = function(){
            var config = {},
                param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);

            if(!oldData.length){
                transportShipView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
                return false;
            }

            //组织数据
            angular.forEach(oldData, function(val){
                param.push(val.id);
            });
            config = {'urlParams': param};

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("transportShip", 'transportShip_code_modelDelTips')
                },
                operation: [{
                    type: 'submit',
                    description: Lang.getValByKey("common", 'common_page_delete'),
                    application:'delete',
                    operationEvent: function () {
                        transportShipService.del(config, function(data){
                            transportShipView.promptBox('closePrompt');
                            if(data.errorCode === 0){
                                transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                                $scope.getTable();
                                $scope.$apply();
                            }else{
                                transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                            }
                        });
                    }
                }]
            };
            transportShipView.promptBox(opt);
        };

        $scope.international = function() {
            window.location.href = '#/international?q=transportShip';
        };

        $scope.save = function(){
            if(!$scope.transportShipNameEN){
                $scope.TransportShipForm.transportShipNameEN.$setDirty();
            }
            if(!$scope.countryName){
                $scope.TransportShipForm.countryName.$setDirty();
            }
            if(!$scope.companyName){
                $scope.TransportShipForm.companyName.$setDirty();
            }
            if(!$scope.transportShipMmsi){
                $scope.TransportShipForm.transportShipMmsi.$setDirty();
            }
            if(!$scope.transportShipImo){
                $scope.TransportShipForm.transportShipImo.$setDirty();
            }

            var pictures = [];
            pictures = pictureArr($scope.pictureModel.picture);
            var i18n = [];
            $('#globalization').children('li').each(function(){
                var localName = $.trim($(this).children('input').val());
                if(localName){
                    var map = {};
                    map.language = $(this).children('input').attr('data-code');
                    map.localName = $.trim($(this).children('input').val());
                    i18n.push(map);
                }
            });

            if($("#code-msg-nameEn").hasClass('remote-invalid') || !$scope.TransportShipForm.$valid){
                transportShipView.displayErrorBox(bar);
                return;
            }
            if($("#code-msg-name").hasClass('remote-invalid') || !$scope.TransportShipForm.$valid){
                transportShipView.displayErrorBox(bar);
                return;
            }
            if($("#code-msg-mmsi").hasClass('remote-invalid') || !$scope.TransportShipForm.$valid){
                transportShipView.displayErrorBox(bar);
                return;
            }
            if($("#code-msg-imo").hasClass('remote-invalid') || !$scope.TransportShipForm.$valid){
                transportShipView.displayErrorBox(bar);
                return;
            }

            var config = {
                urlParams : {
                    name: $scope.transportShipName,
                    nameEn: $scope.transportShipNameEN,
                    countryId: $scope.countryNameCode,
                    companyId: $scope.companyId,
                    mmsi: $scope.transportShipMmsi,
                    imo: $scope.transportShipImo,
                    callSign: $scope.transportShipCallSign,
                    description: $scope.remark,
                    i18n: i18n,
                    attachments: pictures
                }
            };
            if($scope.transport.id) {    //修改
                config.seatParams = {'id': $scope.transport.id};
                transportShipService.saveEdit(config, function(data){
                    if(data && data.errorCode === 0){
                        transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestTransportShipForm = false;
                        $scope.getTable();
                        $scope.transport.id ? $scope.transport.id = 0 : '';
                    }else{
                        transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }else{
                transportShipService.save(config, function(data){
                    if(data && data.errorCode === 0){
                        transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});
                        $scope.nestTransportShipForm = false;
                        $scope.getTable();
                    }else{
                        transportShipView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                    }
                });
            }
        };

        $scope.cancel = function(){
            $scope.nestTransportShipForm = false;
            $scope.TransportShipForm.transportShipNameEN.errorTips = "";
            $scope.TransportShipForm.transportShipMmsi.errorTips = "";
            $scope.transport.id ? $scope.transport.id = 0 : '';
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

        $scope.checkShipNameEn = function(){
            var config = {
                'urlParams':{
                    'nameen': $scope.transportShipNameEN,
                    'id': $scope.transport.id
                }
            };
            if($scope.transportShipNameEN){
                transportShipService.checkShipNameEn(config, function(data){
                    if(data.errorCode != 0){
                        $scope.TransportShipForm.transportShipNameEN.errorTips = data.msg;
                        $("#code-msg-nameEn").removeClass("ng-hide").addClass('remote-invalid');
                    }else{
                        $("#code-msg-nameEn").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.TransportShipForm.transportShipNameEN.errorTips = "";
                    }
                });
            }
        };

        $scope.checkShipMmsi = function(){
            var config = {
                'urlParams':{
                    'mmsi': $scope.transportShipMmsi,
                    'id': $scope.transport.id
                }
            };
            if($scope.transportShipMmsi){
                transportShipService.checkShipMmsi(config, function(data){
                    if(data.errorCode != 0){
                        $scope.TransportShipForm.transportShipMmsi.errorTips = data.msg;
                        $("#code-msg-mmsi").removeClass("ng-hide").addClass('remote-invalid');
                    }else{
                        $("#code-msg-mmsi").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.TransportShipForm.transportShipMmsi.errorTips = "";
                    }
                });
            }
        };

        $scope.checkShipImo = function(){
            var config = {
                'urlParams':{
                    'imo': $scope.transportShipImo,
                    'id': $scope.transport.id ? $scope.transport.id : ""
                }
            };
            if($scope.transportShipImo){
                transportShipService.checkShipImo(config, function(data){
                    if(data.errorCode != 0){
                        $scope.TransportShipForm.transportShipImo.errorTips = data.msg;
                        $("#code-msg-imo").removeClass("ng-hide").addClass('remote-invalid');
                    }else{
                        $("#code-msg-imo").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.TransportShipForm.transportShipImo.errorTips = "";
                    }
                });
            }
        };
    }]);
});
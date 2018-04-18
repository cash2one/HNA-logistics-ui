easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js',
    'public/common/pictureController.js',
    'widget/slides'
],function() {
    app.controller('transportAirplaneCtrl', ['$scope', 'transportAirplaneService', 'transportAirplaneView', 'tableService', 'pictureService', function ($scope, transportAirplaneService, transportAirplaneView, tableService, pictureService) {
        $scope.transport = {
            id: 0    //机型编辑Id保存
        };

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("transportAirplane", 'transportAirplane_page_name'),
                Lang.getValByKey("transportAirplane", 'transportAirplane_page_iata'),
                Lang.getValByKey("transportAirplane", 'transportAirplane_page_icao'),
                Lang.getValByKey("transportAirplane", 'transportAirplane_code_maxPlayLoad'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getTransportTable',
            'restData': {
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'sort': 'IATA'
            },
            'selectNumber': 0,
            'selectFlag': false
        };


        $scope.pictureModel = {
            'edit': true,    //是否编辑状态
            'uploadShow': true,    //是否显示上传按钮图标
            'picture': [],   //图片存放地址
            'accept': 'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,image/JPG,image/JPEG,image/PNG,image/BMP,image/TIFF,application/pdf'
        };

        $scope.getFile = function (files) {
            var length = files.length;
            var picLength = $scope.pictureModel.picture.length;
            if ((length + picLength) > pictureService.maxUpload) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("transportAirplane", 'transportAirplane_code_maxUploadTIps') + pictureService.maxUpload + Lang.getValByKey("transportAirplane", 'transportAirplane_code_maxUploadLastTIps'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }
            for (var i = 0; i < length; i++) {
                var result = pictureService.uploadFile($scope.pictureModel, files[i]);

                if (!result) {
                    return false;
                }
                if (result.errorlocal) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: result.errorlocal,
                        type: 'errer',
                        manualClose: true
                    });
                } else {
                    result.then(function (res) {
                        if (res.data.errorCode === 0) {
                            //res.data.data为图片对应的 picUrlID
                            $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);

                            $(document).promptBox({isDelay: true, contentDelay: res.data.msg, type: 'success'});
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.data.msg,
                                type: 'errer',
                                manualClose: true
                            });
                        }
                    });
                }
            }
        };

        /**
         * 获取语言库
         */
        $scope.getLanguage = function () {
            transportAirplaneService.getLanguage(function (data) {
                if (data.errorCode === 0) {
                    $scope.language = data.data;
                }
            });
        };
        $scope.getLanguage();

        /**
         * 获取飞机类型表格数据
         */
        $scope.getTable = function (isSearch) {
            $scope.q = $scope.tableModel.restData.q;

            isSearch ? $scope.tableModel.restData.pageIndex = 1 : "";

            var config = {
                'urlParams': $scope.tableModel.restData
            };

            tableService.getTable($scope.tableModel.restURL, config, function (data) {
                if (data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);

                    var height = $('.m-table-page').height() - 255;
                    setTimeout(function () {
                        $('.table-container tbody').slimscroll({height: height});
                        $(window).resize(function () {
                            height = $('.m-table-page').height() - 255;    //重新计算高度
                            $('.table-container tbody').slimscroll({height: height});
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        /*============================以下为点击添加机型代码============================*/
        var bar = $('#nest-TransportFrom .label-text');
        transportAirplaneView.propmtCostEvent(bar);

        /**
         * 添加飞机类型
         */
        $scope.add = function () {
            //清除angular表单脏值检测
            $scope.TransportForm.$setPristine();
            $scope.TransportForm.$setUntouched();

            $scope.nestTransportForm = true;

            $('#nest-TransportFrom').attr('style', '').find('.title').text(Lang.getValByKey("transportAirplane", 'transportAirplane_page_add'));

            $(".remote-invalid").removeClass('remote-invalid');

            $scope.transportName = '';
            $scope.transportIata = '';
            $scope.transportIcao = '';
            $scope.transportPayload = '';
            $scope.remark = '';
            $scope.textareaNumber = 140;

            //新增时图片处理
            $scope.pictureModel.picture = [];
            $scope.pictureModel = pictureService.init($scope.pictureModel);

            $('#globalization').find('.input-text').each(function () {
                $(this).val('').removeClass('lang-invalid ng-invalid ng-dirty');
                $(this).next('.verification').children('span').html('');
            });

            //弹框里的菜单显示隐藏公共事件
            transportAirplaneView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        };

        /**
         * 修改飞机类型
         * @param id
         */
        $scope.edit = function (id) {
            $scope.transport.id = id;
            $scope.TransportForm.transportIata.errorTips = '';
            $(".remote-invalid").removeClass('remote-invalid');

            $('#nest-TransportFrom').attr('style', '').find('.title').text(Lang.getValByKey("transportAirplane", 'transportAirplane_code_modelDetail'));

            $scope.nestTransportForm = true;
            transportAirplaneView.loadBarEvent(bar);
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');

            transportAirplaneService.getDetail({'seatParams': {'id': id}}, function (data) {
                if (data && data.errorCode === 0) {
                    $scope.transportName = data.data.name;
                    $scope.transportIata = data.data.iata;
                    $scope.transportIcao = data.data.icao;
                    $scope.transportPayload = data.data.payload;
                    $scope.remark = data.data.description;
                    $scope.textareaNumber = 140 - ($scope.remark ? $scope.remark.length : 0);

                    //编辑时图片处理
                    $scope.pictureModel.picture = pictureEdit(data.data.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);

                    i18nEdit(data.data.i18n);
                }
            });
        };

        $scope.showTextNumber = function () {
            $scope.textareaNumber = 140 - $scope.remark.length;
        };

        /**
         * 取消新增或编辑机型
         */
        $scope.cancel = function () {
            $scope.nestTransportForm = false;
            $scope.transport.id ? $scope.transport.id = 0 : '';
        };

        /**
         * 保存机型 新增或修改
         */
        $scope.save = function () {
            if (!$scope.transportName) {
                $scope.TransportForm.transportName.$setDirty();
            }
            if (!$scope.transportIata) {
                $scope.TransportForm.transportIata.$setDirty();
            }
            if (!$scope.transportIcao) {
                $scope.TransportForm.transportIcao.$setDirty();
            }

            if ($("#code-msg").hasClass('remote-invalid')
                || !$scope.TransportForm.$valid) {
                scrollToErrorView($(".switch-list"));
                transportAirplaneView.displayErrorBox(bar);
                return;
            }

            if ($scope.transportPayload && isNaN($scope.transportPayload)) {
                $scope.transportPayload = '';
            }

            var i18n = [];
            $('#globalization').children('li').each(function () {
                var localName = $.trim($(this).children('input').val());
                if (localName) {
                    var map = {};

                    map.language = $(this).children('input').attr('data-code');
                    map.localName = $.trim($(this).children('input').val());

                    i18n.push(map);
                }
            });

            var pictures = [];
            pictures = pictureArr($scope.pictureModel.picture);

            var config = {
                urlParams: {
                    name: $scope.transportName,
                    iata: angular.uppercase($scope.transportIata),
                    icao: angular.uppercase($scope.transportIcao),
                    payload: $scope.transportPayload,
                    description: $scope.remark,
                    i18n: i18n,
                    pictures: pictures
                }
            };

            if ($scope.transport.id) {    //修改
                config.seatParams = {'id': $scope.transport.id};

                transportAirplaneService.saveEdit(config, function (data) {
                    if (data && data.errorCode === 0) {
                        transportAirplaneView.promptBox({isDelay: true, contentDelay: data.msg, type: 'success'});

                        $scope.nestTransportForm = false;

                        //更新table表数据
                        $scope.getTable();

                        //编辑完成重置状态位
                        $scope.transport.id ? $scope.transport.id = 0 : '';
                    } else {
                        transportAirplaneView.promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    }
                });
            } else {    //新增
                transportAirplaneService.save(config, function (data) {
                    if (data && data.errorCode === 0) {
                        transportAirplaneView.promptBox({isDelay: true, contentDelay: data.msg, type: 'success'});

                        $scope.nestTransportForm = false;

                        //更新table表数据
                        $scope.getTable();
                    } else {
                        transportAirplaneView.promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });
                    }
                });
            }
        };

        /**
         * 校验机型三字码
         */
        $scope.checkIata = function () {
            var config = {
                'urlParams': {
                    'iata': angular.uppercase($scope.transportIata),
                    'id': $scope.transport.id
                }
            };
            if ($scope.transportIata) {
                transportAirplaneService.checkIata(config, function (data) {
                    if (data.errorCode != 0) {    //编码重复
                        $scope.TransportForm.transportIata.errorTips = data.msg;
                        $("#code-msg").removeClass("ng-hide").addClass('remote-invalid');
                        $(".check-iata").addClass("ng-invalid");
                    } else {    //编码不重复
                        $("#code-msg").addClass("ng-hide").removeClass('remote-invalid');
                        $(".check-iata").removeClass("ng-invalid");
                        $scope.TransportForm.transportIata.errorTips = "";
                    }
                });
            }
        };

        /**
         * 删除飞机类型
         */
        $scope.del = function () {
            var config = {},
                param = [];

            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);

            if (!oldData.length) {
                transportAirplaneView.promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }

            //组织数据
            angular.forEach(oldData, function (val) {
                param.push(val.id);
            });
            config = {'urlParams': param};

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("transportAirplane", 'transportAirplane_code_modelDelTips')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application: 'delete',
                        operationEvent: function () {
                            transportAirplaneService.del(config, function (data) {
                                transportAirplaneView.promptBox('closePrompt');
                                if (data.errorCode === 0) {
                                    transportAirplaneView.promptBox({
                                        isDelay: true,
                                        contentDelay: data.msg,
                                        type: 'success'
                                    });

                                    //更新table表数据
                                    $scope.getTable();
                                    $scope.$apply();
                                } else {
                                    transportAirplaneView.promptBox({
                                        isDelay: true,
                                        contentDelay: data.msg,
                                        type: 'errer',
                                        manualClose: true
                                    });
                                }
                            });
                        }
                    }
                ]
            };
            transportAirplaneView.promptBox(opt);
        };

        /**
         * 国际化
         */
        $scope.international = function () {
            window.location.href = '#/international?q=transportAirplane';
        };

        /**
         * 图片预览
         * @param fileid    附件ID
         */
        $scope.getPictureUrl = function (fileid) {
            $('#slides').picturePreview({pictureId: fileid}, $scope.pictureModel.picture);
        };

        function i18nEdit(i18n) {
            var length = i18n ? i18n.length : 0;

            $('#globalization').children('li').each(function () {
                $(this).children('input').removeClass('lang-invalid ng-invalid ng-dirty').next('.verification').children('span').html('');
                var code = $(this).children('input').val('').attr('data-code');

                for (var i = 0; i < length; i++) {
                    if ((i18n[i].language).toLowerCase() == code.toLowerCase()) {
                        $(this).children('input').val(i18n[i].localName);
                    }
                }
            });
        }

        /** 新建素有营业执照id数组 */
        function pictureArr(picture) {
            var length = picture ? picture.length : 0;
            var ret = [];
            for (var i = 0; i < length; i++) {
                picture[i].picUrlID = typeof (picture[i].picUrlID) == 'object' ? picture[i].picUrlID.id : picture[i].picUrlID;
                ret.push(picture[i].picUrlID);
            }
            return ret;
        }

        /** 编辑素有营业执照id数组 */
        function pictureEdit(picture) {
            var length = picture ? picture.length : 0;
            var map = {}, ret = [];
            for (var i = 0; i < length; i++) {
                map = {
                    'picUrlID': picture[i],
                    'delshow': false
                }
                ret.push(map);
            }
            return ret;
        }
    }]);
});
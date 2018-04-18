easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'widget/parseUrl',
    "widget/select",
    'widget/starRating',
    'public/javascripts/fragment/supplier/account.js',
    'public/common/tableController.js',
    'public/common/pictureController.js',
    'widget/slides'
], function () {
    app.controller('supplierCtrl', ['$scope', '$rootScope', '$compile', 'supplierService', 'supplierView', 'tableService', 'pictureService', function ($scope, $rootScope, $compile, supplierService, supplierView, tableService, pictureService) {

        $scope.paramter = window.parseUrl.getParams();

        $scope.intertype = 'logistics';    //默认为物流
        if ($scope.paramter && $scope.paramter.module == 'trade') {
            $scope.intertype = 'trade';    //贸易
        }

        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("supplier", 'supplier_table_name'),
                Lang.getValByKey("supplier", 'supplier_table_code'),
                Lang.getValByKey("supplier", 'supplier_table_level'),
                Lang.getValByKey("supplier", 'supplier_table_service')
            ],
            tableBody: [],
            restURL: "logistics.getSupplierList",
            restData: {
                q: '',
                rank: -1,
                greaterthan: false,
                pageIndex: 1,
                pageSize: 10,
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.tableBD = [];
        $scope.tableBDModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("supplier", 'supplier_table_responsibility'),
                Lang.getValByKey("supplier", 'supplier_table_full_name'),
                Lang.getValByKey("supplier", 'supplier_table_job_code'),
                Lang.getValByKey("supplier", 'supplier_table_department'),
                Lang.getValByKey("supplier", 'supplier_table_position'),
                Lang.getValByKey("supplier", 'supplier_table_mobile_phone'),
                Lang.getValByKey("supplier", 'supplier_table_telephone'),
                Lang.getValByKey("supplier", 'supplier_table_remark')
            ],
            tableBody: [],
            selectNumber: 0,
            selectFlag: false
        };

        $scope.tableContacts = [];
        $scope.tableContactsModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("supplier", 'supplier_table_responsibility'),
                Lang.getValByKey("supplier", 'supplier_table_full_name'),
                Lang.getValByKey("supplier", 'supplier_table_department'),
                Lang.getValByKey("supplier", 'supplier_table_position'),
                Lang.getValByKey("supplier", 'supplier_table_mobile_phone'),
                Lang.getValByKey("supplier", 'supplier_table_telephone'),
                Lang.getValByKey("supplier", 'supplier_table_remark')
            ],
            tableBody: [],
            selectNumber: 0,
            selectFlag: false
        }

        $scope.supplierId = '';


        $scope.mainService = '';
        $scope.bizScope = '';

        $scope.isBizTrue = false;

        $scope.ranks = { data: [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }, { id: 4, name: 4 }, { id: 5, name: 5 }] };
        $scope.rankName = 1;
        $scope.rankId = 1;
        $scope.seniorText = Lang.getValByKey("common", 'common_page_advancedFilter');

        /** 初始加载供应商类型 */
        $scope.$on('$viewContentLoaded', function () {
            if ($scope.intertype == 'trade') {
                supplierService.getTradetSupplierTypes(function (response) {
                    if (response.errorCode == 0) {
                        $scope.types = response.data;
                        $scope.typeId = -1;
                        $scope.getTypeTable($scope.typeId);
                    }
                });
            } else {
                supplierService.getSupplierTypes(function (response) {
                    if (response.errorCode == 0) {
                        $scope.types = response.data;
                        $scope.typeId = -1;

                        $scope.getTypeTable($scope.typeId);
                    }
                });
            }
        });
        function setScrollDetail() {
            if ($scope.showSenior == true) {
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 299
                });
            } else {
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 250
                });
            }
        }
        $(window).on("resize", setScrollDetail);

        /** 供应商list列表信息 */
        $scope.getTypeTable = function (id, $event) {
            if ($event) {
                /** 点击分类事件 */
                if (!$($event.target).hasClass('check')) {
                    $scope.seniorChecked = false;
                    $scope.showSenior = false;
                    $scope.tableModel.restData.greaterthan = false;
                    $scope.tableModel.restData.rank = -1;
                    $scope.tableModel.restData.q = '';
                    $scope.q='';
                    $scope.tableModel.restData.pageIndex = 1;
                    $scope.rankName = 1;
                    $scope.rankId = 1;
                    $('.type-filter li').removeClass('active');
                    $($event.target).addClass('active');
                };
                if (id != -1) {
                    $scope.hiddenTypeIds = $($event.target).text();
                } else {
                    $scope.hiddenTypeIds = undefined;
                };
            };

            $scope.typeId = id;

            var params = {
                seatParams: { serviceTypeId: $scope.typeId, intertype: $scope.intertype },
                urlParams: $scope.tableModel.restData
            }

            tableService.getTable($scope.tableModel.restURL, params, function (data) {
                if (data.errorCode == 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
            });
            setScrollDetail();
        };

        /** 高级筛选 */
        $scope.seniorFilter = function () {
            if ($scope.showSenior == true) {
                $scope.seniorText = Lang.getValByKey("common", 'common_page_advancedFilter');
                if ($scope.tableModel.restData.rank != -1) {
                    $scope.tableModel.restData.greaterthan = false;
                    $scope.tableModel.restData.rank = -1;
                    $scope.seniorChecked = false;
                    $scope.rankName = 1;
                    $scope.rankId = 1;
                    $scope.getTypeTable($scope.typeId);
                }
            } else {
                $scope.seniorText = Lang.getValByKey("common", 'common_page_ordinaryFilter');
            }
            $scope.showSenior = !$scope.showSenior;
            setScrollDetail();
        };

        /** 选择等级下拉框 */
        $scope.initRankSelectList = function () {
            var data = $scope.ranks;
            selectFactory({
                data: data,
                id: "rank",
                defaultText: '',
                attrTextModel: function (name) {
                    $scope.rankName = name;
                    $scope.rankId = name;

                    $scope.tableModel.restData.greaterthan = false;
                    $scope.tableModel.restData.rank = $scope.rankId;
                    $scope.getTypeTable($scope.typeId);
                    $scope.$apply();
                }
            });
        };
        $scope.selectRank = function () {
            $scope.seniorChecked = false;
        };

        /** 等级筛选 */
        $scope.checkSenior = function ($event) {
            $scope.seniorChecked = !$scope.seniorChecked;
            if ($scope.seniorChecked == true) {
                $scope.tableModel.restData.greaterthan = true;
                $scope.tableModel.restData.rank = $scope.rankId;
            } else {
                $scope.tableModel.restData.greaterthan = false;
                $scope.tableModel.restData.rank = $scope.rankId;
                $scope.rankName = 1;
                $scope.rankId = 1;
            };
            $scope.getTypeTable($scope.typeId, $event);
        };

        /** 列表检索 */
        $scope.retrievalList = function () {
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.pageIndex = 1;
            $scope.getTypeTable($scope.typeId);
        };

        $scope.goBack = function () {
            // if ($scope.paramter.id) {
            //     top.location.href = 'http://' + location.host + sessionStorage.getItem('detailPath');
            // }
            // $scope.main = false;
            // $scope.getTypeTable($scope.typeId);
          if($scope.isEdit || $scope.isVisible || $scope.isBizVisible){
            $(document).promptBox({
              title: Lang.getValByKey("common", 'common_prompt_title'),
              type: 'warning',
              content: {
                  tip: Lang.getValByKey("common", 'common_back_confirm')
              },
              cancelDescription: Lang.getValByKey("common", 'common_back_no'),
              operation: [
                {
                    type: 'submit',
                    application: 'delete',
                    description: Lang.getValByKey("common", 'common_back_yes'),
                    operationEvent: function () {
                      $(document).promptBox('closePrompt');
                      $scope.isEdit = false;
                      if ($scope.paramter.id) {
                          top.location.href = 'http://' + location.host + sessionStorage.getItem('detailPath');
                      }else{
                        $scope.main = false;
                        $scope.getTypeTable($scope.typeId);
                        $scope.$apply();
                      }
                    }
                }
              ]
            })
          }else{
            if ($scope.paramter.id) {
                top.location.href = 'http://' + location.host + sessionStorage.getItem('detailPath');
            }else{
              $scope.main = false;
              $scope.getTypeTable($scope.typeId);
            }
          }
        };

        /** 添加 */
        $scope.addSupplier = function () {
            $scope.tab.exdisable(0);
            $scope.rankInfo = 1;
            $scope.main = true;
            $scope.visible = false;
            $scope.isVisible = false;
            $scope.isEdit = true;
            if ($scope.validateRankError == true) {
                $scope.validateRankError = false
            };
            if ($scope.validatePictureError == true) {
                $scope.validatePictureError = false;
            };
            $scope.validateCodeError = false;
            $scope.showEmailError = false;

            $scope.nameInfo = '';
            $scope.simpleNameInfo = '';
            $scope.websiteInfo = '';
            $scope.faxInfo = '';
            $scope.codeInfo = '';
            $scope.emailInfo = '';
            $scope.oldEmail = '';
            $scope.descriptionInfo = '';
            $scope.countryInfo = '';
            $scope.listTypeIds = [];

            if ($scope.hiddenTypeIds) {
                $scope.serviceTypeIdsInfo = $scope.hiddenTypeIds + '，';
                $scope.serviceTypeIds = $scope.hiddenTypeIds + '，';

                if ($scope.typeId != -1) {
                    $scope.listTypeIds.push($scope.typeId);
                }
            } else {
                $scope.serviceTypeIdsInfo = '';
                $scope.serviceTypeIds = '';
            };

            /** 初始加载星级评价 */
            $('#stars').rating('update', 1);
            $('#stars').rating('refresh',
            {
                min: 0,
                max: 5,
                step: 1,
                size: 'xs',
                animate: true,
                displayOnly: false,
                showClear: false,
                showCaption: false
            });
            /** 获取星级评价 */
            $('#stars').on('rating.change', function (event, value, caption) {
                $scope.rankInfo = $(event.target).val();
                $scope.$apply();
            });

            $('button[name="submitSupplier"]').addClass('save').removeClass('edit');

            //清除angular表单脏值检测
            $scope.businessForm.$setPristine();
            $scope.businessForm.$setUntouched();

            $scope.financialForm.$setPristine();
            $scope.financialForm.$setUntouched();

            $scope.baseForm.$setPristine();
            $scope.baseForm.$setUntouched();

            $scope.BDForm.$setPristine();
            $scope.BDForm.$setUntouched();

            $scope.contactsForm.$setPristine();
            $scope.contactsForm.$setUntouched();
        };

        $scope.deleteSupplier = function () {
            if ($scope.tableModel.selectNumber) {
                var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

                $(document).promptBox({
                    title: Lang.getValByKey("supplier", 'supplier_prompt_title_name'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("supplier", 'supplier_prompt_tip_name')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                submitDeleteSupplier(selectArr);
                            }
                        }
                    ]
                });
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey("supplier", 'supplier_prompt_tip_tips'), type: 'errer', manualClose: true });
            };
        };
        function submitDeleteSupplier(selectArr) {
            var arr = [];
            for (var i in selectArr) {
                arr.push(selectArr[i].id);
            }
            var config = {
                urlParams: arr,
                seatParams: {
                    intertype: $scope.intertype
                }
            };
            supplierService.deleteSupplier(config, function (response) {
                if (response.errorCode == 0) {
                    $(document).promptBox('closePrompt');
                    $scope.getTypeTable($scope.typeId);
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'success' });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'errer', manualClose: true });
                }
            });
            $scope.$apply();
        };

        $scope.swichEvent = function (index) {
            $scope.validatePictureError = false;
            if (index == 0) {
                if ($('button[name="submitSupplier"]').hasClass('save')) {
                    $scope.rankInfo = 1;
                };
                $scope.cancelSupplier();
            };
            if (index == 1) {
                $scope.$broadcast('accountEvent', {}); // 向子类发出重置数据事件

                // resizeTable();
                // $scope.tableAccountModel.tableBody = tableService.addCheckbox($scope.tableAccount);
                // setScrollBDDetail();
                // $scope.$apply();
            };
            if (index == 2) {
                resizeTable();
                $scope.tableBDModel.tableBody = tableService.addCheckbox($scope.tableBD);
                setScrollBDDetail();
                $scope.$apply();
            };
            if (index == 3) {
                resizeTable();
                $scope.tableContactsModel.tableBody = tableService.addCheckbox($scope.tableContacts);
                setScrollBDDetail();
                $scope.$apply();
            };
            if (index == 4 || 5) {
                if (!$scope.isBizTrue) {
                    $scope.bizVisible = true;
                    $scope.isBizVisible = false;
                } else {
                    $scope.bizVisible = false;
                    $scope.isBizVisible = false;
                };
                $scope.$apply();
            }
            if (index == 5) {
                if ($scope.isBizTrue) {
                    $scope.pictureModel.uploadShow = true;
                    $scope.pictureModel.edit = true;
                };
                $scope.cancelFinancial();
            };
            //清除angular表单脏值检测
            $scope.businessForm.$setPristine();
            $scope.businessForm.$setUntouched();

            $scope.financialForm.$setPristine();
            $scope.financialForm.$setUntouched();

            $scope.baseForm.$setPristine();
            $scope.baseForm.$setUntouched();

            $scope.BDForm.$setPristine();
            $scope.BDForm.$setUntouched();

            $scope.contactsForm.$setPristine();
            $scope.contactsForm.$setUntouched();
            $('.from-box .tab-content').scrollTop(0);
        };

        $(window).on("resize", setScrollBDDetail);
        function setScrollBDDetail() {
            $('.table-container tbody').slimscroll({
                height: $('.content-main').height() - 299
            });
        };

        $scope.cancelTypes = function () {
            $scope.nestGetTypes = false;
        }
        /** 添加类型 */
        $scope.selectTypes = function () {
            $scope.loadData();
            $scope.nestGetTypes = true;
        };
        $scope.loadData = function () {
            $scope.selected = [];
            $scope.checked = false;
            if ($scope.intertype == 'trade') {
                supplierService.getTradetSupplierTypes(function (response) {
                    if (response.errorCode == 0) {
                        var sid = $scope.listTypeIds;

                        for (var i in response.data) {
                            response.data[i].id = response.data[i].code;
                            response.data[i].checked = false;
                            for (var j in sid) {
                                if (response.data[i].id == sid[j]) {
                                    response.data[i].checked = true;
                                }
                            }
                        };
                        response.data.splice(0, 1);
                        var typeData = [];
                        for (var i in response.data) {
                            if (response.data[i].name) {
                                typeData.push(response.data[i])
                            }
                        };
                        $scope.listTypes = typeData;
                    }
                });
            } else {
                supplierService.getSupplierTypes(function (response) {
                    if (response.errorCode == 0) {
                        var sid = $scope.listTypeIds;

                        for (var i in response.data) {
                            response.data[i].id = response.data[i].code;
                            response.data[i].checked = false;
                            for (var j in sid) {
                                if (response.data[i].id == sid[j]) {
                                    response.data[i].checked = true;
                                }
                            }
                        };
                        response.data.splice(0, 1);
                        var typeData = [];
                        for (var i in response.data) {
                            if (response.data[i].name) {
                                typeData.push(response.data[i])
                            }
                        };
                        $scope.listTypes = typeData;
                    }
                });
            }
        };

        $scope.selected = [];
        $scope.selectedTags = [];

        var updateSelected = function (action, id) {
            if (action == 'add' && $scope.selected.indexOf(id) == -1) {
                $scope.selected.push(id);
            }

            if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
                var idx = $scope.selected.indexOf(id);
                $scope.selected.splice(idx, 1);
            }
        };

        /** 选择添加类型 */
        $scope.obtainTypes = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if (checkbox.checked) {
                $(checkbox).addClass('active');
            } else {
                $(checkbox).removeClass('active');
            }
            updateSelected(action, id, checkbox.name);
        };

        $scope.isCheckType = function (id) {
            return $scope.selected.indexOf(id) >= 0;
        };

        $scope.submitTypes = function () {
            var types = $('#getTypes input.active'),
                arr = [],
                arrName = '';
            types.each(function (i) {
                arr.push(types.eq(i).data('id'));
                if (i == types.length - 1) {
                    arrName += types.eq(i).parent().data('name')
                } else {
                    arrName += types.eq(i).parent().data('name') + '，';
                };
            });

            $scope.serviceTypeIdsInfo = arrName;
            $scope.listTypeIds = arr;
            $scope.cancelTypes();
        };

        /**** 校验编码唯一 */
        $scope.validateCode = function () {
            if (!$scope.codeInfo) return;
            var id;
            if ($('button[name="submitSupplier"]').hasClass('save')) {
                id = '';
            } else {
                id = $scope.supplierId;
            }

            var config = {
                urlParams: {
                    code: $scope.codeInfo,
                    sid: id
                },
                seatParams: {
                    intertype: $scope.intertype
                }
            };
            supplierService.validateSupplierCode(config, function (response) {
                if (response.errorCode == 0) {
                    $scope.validateCodeError = false;
                    angular.element($(".validate-codes").removeClass("ng-invalid"));
                } else {
                    $scope.validateCodeError = true;
                    angular.element($(".validate-codes").addClass("ng-invalid"));
                }
            });
        };
        $scope.removeValidateCode = function () {
            $scope.validateCodeError = false;
        };

        /** 保存新建供应商 */
        $scope.submitSupplier = function () {
            if (!$scope.nameInfo) {
                $scope.baseForm.nameInfo.$setDirty();
            };
            if (!$scope.simpleNameInfo) {
                $scope.baseForm.simpleNameInfo.$setDirty();
            };
            if (!$scope.codeInfo) {
                $scope.baseForm.codeInfo.$setDirty();
            };
            if (!$scope.serviceTypeIdsInfo) {
                $scope.baseForm.serviceTypeIdsInfo.$setDirty();
            };
            if (!$scope.emailInfo) {
                $scope.baseForm.emailInfo.$setDirty();
            };
            if (!$scope.baseForm.$valid || $scope.validateCodeError == true || $scope.validateRankError == true || $scope.showEmailError == true) {
                scrollToErrorView($(".tab-content"));
                return;
            };

            var data = {
                name: $scope.nameInfo,
                simpleName: $scope.simpleNameInfo,
                code: $scope.codeInfo,
                website: $scope.websiteInfo,
                fax: $scope.faxInfo,
                email: $scope.emailInfo,
                description: $scope.descriptionInfo,
                country: $scope.countryInfo,
                serviceTypeCodes: $scope.listTypeIds,
                rank: $scope.rankInfo
            };

            if ($('button[name="submitSupplier"]').hasClass('save')) {
                var config = {
                    urlParams: data,
                    seatParams: {
                        intertype: $scope.intertype
                    }
                };
                supplierService.saveSupplier(config, function (res) {
                    if (res.errorCode == 0) {
                        $scope.isBizTrue = false;
                        $scope.editSupplierDetail(res.data);
                        $scope.getTypeTable($scope.typeId);
                        $scope.tab.enableAll();
                        $scope.supplierId = res.data;

                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    };
                });
            } else {
                var config = {
                    seatParams: {
                        sid: $scope.supplierId,
                        intertype: $scope.intertype
                    },
                    urlParams: data
                };
                supplierService.editSupplier(config, function (res) {
                    if (res.errorCode == 0) {
                        $scope.isVisible = false;
                        $scope.editSupplierDetail(res.data);
                        $scope.getTypeTable($scope.typeId);
                        $scope.supplierId = res.data;
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    };
                });
            }

        };

        /** 获取当前供应商详情 */
        $scope.editSupplierDetail = function (id) {
            $scope.supplierId = id;
            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.tab.enableAll();
                    $scope.tab.selected(0);
                    $scope.main = true;
                    $scope.visible = true;
                    $scope.isVisible = false;
                    $scope.isEdit = false;
                    $scope.validateRankError = false;
                    $scope.validateCodeError = false;
                    $scope.validatePictureError = false;
                    $scope.showEmailError = false;

                    var value = res.data,
                        arrName = '',
                        arr = [];
                    $scope.tableBD = value.bds;
                    $scope.tableContacts = value.supplierContacts;
                    $scope.mainService = value.mainService;
                    $scope.bizScope = value.bizScope;

                    $scope.mainServiceInfo = value.mainService;
                    $scope.bizScopeInfo = value.bizScope;

                    $scope.taxpayerNumber = value.taxpayerNumber;
                    $scope.bankName = value.bankName;
                    $scope.bankAccount = value.bankAccount;
                    $scope.companyTel = value.companyTel;
                    $scope.address = value.address;
                    $scope.lealPerson = value.lealPerson;

                    $scope.taxpayerNumberInfo = value.taxpayerNumber;
                    $scope.bankNameInfo = value.bankName;
                    $scope.bankAccountInfo = value.bankAccount;
                    $scope.companyTelInfo = value.companyTel;
                    $scope.addressInfo = value.address;
                    $scope.lealPersonInfo = value.lealPerson;

                    //编辑时图片处理
                    $scope.pictureModel.uploadShow = false;
                    $scope.pictureModel.edit = false;

                    $scope.pictureModel.picture = pictureEdit(value.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);

                    $scope.name = value.name;
                    $scope.simpleName = value.simpleName;
                    $scope.website = value.website;
                    $scope.fax = value.fax;
                    $scope.email = value.email;
                    $scope.code = value.code;
                    $scope.description = value.description;
                    $scope.country = value.country;
                    for (var i in value.serviceTypes) {
                        arr.push(value.serviceTypes[i].serviceTypeCode);
                        if (value.serviceTypes[i].supplierTypeName) {
                            if (i == value.serviceTypes.length) {
                                arrName += value.serviceTypes[i].supplierTypeName
                            } else {
                                arrName += value.serviceTypes[i].supplierTypeName + '，';
                            };
                        }
                    }
                    $scope.serviceTypeIdsInfo = arrName;
                    $scope.listTypeIds = arr;
                    $scope.serviceTypeIds = arrName;
                    $scope.rankInfo = parseInt(value.rank);

                    $('#stars').rating('update', parseInt(value.rank));
                    $('#stars').rating('refresh',
                        {
                            min: 0,
                            max: 5,
                            step: 1,
                            size: 'xs',
                            animate: true,
                            displayOnly: true,
                            showClear: false,
                            showCaption: false
                        });

                }
            });

            $scope.businessForm.$setPristine();
            $scope.businessForm.$setUntouched();

            $scope.financialForm.$setPristine();
            $scope.financialForm.$setUntouched();

            $scope.baseForm.$setPristine();
            $scope.baseForm.$setUntouched();

            $scope.BDForm.$setPristine();
            $scope.BDForm.$setUntouched();

            $scope.contactsForm.$setPristine();
            $scope.contactsForm.$setUntouched();
        };

        /** 编辑当前供应商详情 */
        $scope.editSupplier = function () {
            $('button[name="submitSupplier"]').addClass('edit').removeClass('save');
            $scope.isVisible = true;
            $scope.visible = false;
            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(config, function (res) {
                if (res.errorCode == 0) {
                    var value = res.data,
                        arrName = '',
                        arr = [];
                    $scope.nameInfo = value.name;
                    $scope.simpleNameInfo = value.simpleName;
                    $scope.websiteInfo = value.website;
                    $scope.faxInfo = value.fax;
                    $scope.emailInfo = value.email;
                    $scope.oldEmail = value.email;
                    $scope.codeInfo = value.code;
                    $scope.descriptionInfo = value.description;
                    $scope.countryInfo = value.country;

                    for (var i in value.serviceTypes) {
                        arr.push(value.serviceTypes[i].serviceTypeCode);
                        if (value.serviceTypes[i].supplierTypeName) {
                            if (i == value.serviceTypes.length - 1) {
                                arrName += value.serviceTypes[i].supplierTypeName
                            } else {
                                arrName += value.serviceTypes[i].supplierTypeName + '，';
                            };
                        }
                    }

                    $scope.serviceTypeIdsInfo = arrName;
                    $scope.listTypeIds = arr;
                    $scope.serviceTypeIds = arrName;
                    $scope.rankInfo = parseInt(value.rank);

                    $('#stars').rating('update', parseInt(value.rank));
                    $('#stars').rating('refresh',
                      {
                          min: 0,
                          max: 5,
                          step: 1,
                          size: 'xs',
                          animate: true,
                          displayOnly: false,
                          showClear: false,
                          showCaption: false
                      }
                    );
                    /** 获取星级评价 */
                    $('#stars').on('rating.change', function (event, value, caption) {
                        $scope.rankInfo = $(event.target).val();
                        $scope.$apply();
                    });
                }
            });
        };

        /** 取消编辑 */
        $scope.cancelSupplier = function () {
            $scope.editSupplierDetail($scope.supplierId);
            $scope.isVisible = false;
        };

        /*====== 账号 ======*/
        /*====== 账号 ======*/

        /*====== BD ======*/
        /** 添加BD */
        $scope.addBDUser = function () {
            //清除angular表单脏值检测
            $scope.BDForm.$setPristine();
            $scope.BDForm.$setUntouched();
            $scope.BDResponsibilityInfo = '';
            $scope.BDUserInfo = '';
            $scope.BDDescriptionInfo = '';
            $scope.showBDUserExist = false;
            $(document).promptBox({
                title: Lang.getValByKey("supplier", 'supplier_prompt_middle_title_add'),
                loadTitle: function () {
                    return Lang.getValByKey("supplier", 'supplier_prompt_middle_title_add')
                },
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#BDDetail'),
                },
                loadData: function () {
                    $('#nest-BDDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function () {
                            $scope.saveBDUser();
                            $scope.$apply();
                        }
                    }
                ]
            });
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

        function checkBDUserExist() {
            var param = {
                'seatParams':{
                    'supplierid':$scope.supplierId,
                    'bdid': $scope.BDUserId,
                    'id':$scope.bdId? $scope.bdId:''
                }
            }
            supplierService.checkBDUserExist(param,function (rtnData) {
                $scope.showBDUserExist = !rtnData.data
            })
        }
        $scope.initSelectList = function () {
            var data,
                BDUserEle;
            var BDUserConfig = {
                urlParams: { q: $scope.BDUserInfo },
                isAsync: true
            };
            function buildUserData(data) {
                var listData = [], arr = [];
                var BDUserData = data.data;
                for (var i = 0, l = BDUserData.length; i < l; i++) {
                    arr[i] = {};
                    arr[i].id = BDUserData[i].id
                    arr[i].name = BDUserData[i].fullName + '(' + BDUserData[i].code + ')';
                    listData.push(arr[i]);
                }
                return {data: listData};
            }
            /** 检索国家事件 */
            data = supplierService.getBDUser(BDUserConfig);
            var listData = buildUserData(data);

            BDUserEle = selectFactory({
                data: listData,
                id: "userList",
                isSearch: true,
                searchPlaceHoder: "请输入用户姓名或工号",
                isUsePinyin: true,
                closeLocalSearch: true,
                pagination: true,
                defaultText: '请选择',
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    if(!currentPage) {
                        currentPage = 1;
                    }

                    var BDUserConfig = {
                        urlParams: {
                            q: data,
                            pageIndex: currentPage,
                            pageSize: 10
                        },
                        async: true
                    };
                    supplierService.getBDUser(BDUserConfig, function(res) {
                        var listData = buildUserData(res);
                        BDUserEle.setData(listData);
                    });

                },
                attrTextModel: function (name, data, item) {
                    var callbackData;
                    if (!name) {
                        callbackData = {};
                    } else {
                        callbackData = getSigleDataByName(name, data);
                    }
                    $scope.BDUserId = callbackData.id;
                    if (callbackData.name) {
                        $scope.BDUserInfo = callbackData.name.split('(')[0];
                    }else{
                        $scope.BDUserInfo = '';
                    }


                    $("#userList").val($scope.BDUserInfo);

                    $scope.showBDUserExist = false;

                    $scope.BDUserInfo && checkBDUserExist();


                    $scope.$apply();
                    clearNextAddress(BDUserEle);
                }
            });

        };

        /** 保存BD */
        $scope.saveBDUser = function () {

            if (!$scope.user) {
                $scope.BDForm.user.$setDirty();
            };

            if($scope.showBDUserExist){
                return;
            }

            var seatParam;
            if ($('#nest-BDDetail button[name="prompt-operation"]').hasClass('save')) {
                seatParam = {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                };
            } else {
                seatParam = {
                    sid: $scope.supplierId,
                    bdid: $scope.bdId,
                    intertype: $scope.intertype
                }
            };

            var config = {
                seatParams: seatParam,
                urlParams: {
                    responsibility: $scope.BDResponsibilityInfo,
                    bdId: $scope.BDUserId,
                    description: $scope.BDDescriptionInfo
                }
            };

            if (!$scope.BDForm.$valid) {
                return;
            };

            if ($('#nest-BDDetail button[name="prompt-operation"]').hasClass('save')) {
                supplierService.addBD(config, function (res) {
                    if (res.errorCode == 0) {
                        $(document).promptBox('closeFormPrompt');
                        var sidConfig = {
                            seatParams: {
                                sid: $scope.supplierId,
                                intertype: $scope.intertype
                            }
                        };
                        supplierService.getSupplierById(sidConfig, function (data) {
                            if (data.errorCode == 0) {
                                var value = data.data;
                                $scope.tableBD = value.bds;
                            }
                        });
                        $scope.tableBDModel.tableBody = tableService.addCheckbox($scope.tableBD);
                        $scope.$apply();
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    }
                })
            } else {
                supplierService.editBD(config, function (res) {
                    if (res.errorCode == 0) {
                        $(document).promptBox('closeFormPrompt');
                        var sidConfig = {
                            seatParams: {
                                sid: $scope.supplierId,
                                intertype: $scope.intertype
                            }
                        };
                        supplierService.getSupplierById(sidConfig, function (data) {
                            if (data.errorCode == 0) {
                                var value = data.data;
                                $scope.tableBD = value.bds;
                            }
                        });
                        $scope.tableBDModel.tableBody = tableService.addCheckbox($scope.tableBD);
                        $scope.$apply();
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    }
                });
            };

        };

        /** 删除BD */
        $scope.deleteBDUser = function () {
            var selectArr = tableService.getSelectTable($scope.tableBDModel.tableBody);
            if (selectArr.length) {
                $(document).promptBox({
                    title: Lang.getValByKey("supplier", 'supplier_prompt_title_delete_bd'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("supplier", 'supplier_prompt_title_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                $scope.submitDeleteBD(selectArr);
                            }
                        }
                    ]
                });
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey("supplier", 'supplier_prompt_tip_tips'), type: 'errer', manualClose: true });
            };
        };
        $scope.submitDeleteBD = function (selectArr) {
            var arr = [];
            for (var i in selectArr) {
                arr.push(selectArr[i].bdId);
            }
            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                },
                urlParams: arr
            };
            supplierService.deleteBD(config, function (response) {
                if (response.errorCode == 0) {
                    $(document).promptBox('closePrompt');
                    var sidConfig = {
                        seatParams: {
                            sid: $scope.supplierId,
                            intertype: $scope.intertype
                        }
                    };
                    supplierService.getSupplierById(sidConfig, function (res) {
                        if (res.errorCode == 0) {
                            var value = res.data;
                            $scope.tableBD = value.bds;
                        }
                    });
                    $scope.tableBDModel.tableBody = tableService.addCheckbox($scope.tableBD);
                    $scope.$apply();
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'success' });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'errer', manualClose: true });
                }
            });
            $scope.$apply();
        };

        /** 修改BD */
        $scope.bdId = '';
        $scope.editBDDetail = function (id) {
            $scope.bdId = id;
            //清除angular表单脏值检测
            $scope.BDForm.$setPristine();
            $scope.BDForm.$setUntouched();
            $scope.showBDUserExist = false;

            for (var i in $scope.tableBD) {
                if ($scope.tableBD[i].id == id) {
                    $scope.BDResponsibilityInfo = $scope.tableBD[i].responsibility;
                    $scope.BDUserInfo = $scope.tableBD[i].name;
                    $scope.BDUserId = $scope.tableBD[i].bdId;
                    $scope.BDDescriptionInfo = $scope.tableBD[i].description;
                }
            };

            $(document).promptBox({
                title: Lang.getValByKey("supplier", 'supplier_prompt_middle_title_edit_bd'),
                loadTitle: function () {
                    return Lang.getValByKey("supplier", 'supplier_prompt_middle_title_edit_bd')
                },
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#BDDetail'),
                },
                loadData: function () {
                    $('#nest-BDDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function () {
                            $scope.saveBDUser();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };



        /*====== BD END ======*/

        /*====== 联系人 ======*/
        /** 添加联系人 */
        $scope.addContactsEvent = function () {
            //清除angular表单脏值检测
            $scope.contactsForm.$setPristine();
            $scope.contactsForm.$setUntouched();

            $scope.contactsResponsibilityInfo = '';
            $scope.contactsNameInfo = '';
            $scope.contactsDepartmentInfo = '';
            $scope.contactsPositionInfo = '';
            $scope.contactsMobilephoneInfo = '';
            $scope.contactsTelephoneInfo = '';
            $scope.contactsDescriptionInfo = '';
            $("form[name='contactsForm']").find('input').val('');

            $(document).promptBox({
                title: Lang.getValByKey("supplier", 'supplier_prompt_middle_title_add_contact'),
                loadTitle: function () {
                    return Lang.getValByKey("supplier", 'supplier_prompt_middle_title_add_contact')
                },
                isMiddle: true,
                isNest: true,
                height: 650,
                content: {
                    nest: $('#contactsDetail'),
                },
                loadData: function () {
                    $('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function () {
                            $scope.saveContacts();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** 修改联系人 */
        $scope.editContactsDetail = function (id) {
            $scope.cId = id;
            //清除angular表单脏值检测
            $scope.contactsForm.$setPristine();
            $scope.contactsForm.$setUntouched();

            for (var i in $scope.tableContacts) {
                if ($scope.tableContacts[i].id == id) {
                    $scope.contactsResponsibilityInfo = $scope.tableContacts[i].responsibility;
                    $scope.contactsNameInfo = $scope.tableContacts[i].name;
                    $scope.contactsDepartmentInfo = $scope.tableContacts[i].department;
                    $scope.contactsPositionInfo = $scope.tableContacts[i].position;
                    $scope.contactsMobilephoneInfo = $scope.tableContacts[i].mobilephone;
                    $scope.contactsTelephoneInfo = $scope.tableContacts[i].telephone;
                    $scope.contactsDescriptionInfo = $scope.tableContacts[i].description;
                }
            };

            $(document).promptBox({
                title: Lang.getValByKey("supplier", 'supplier_prompt_middle_title_edit_contact'),
                loadTitle: function () {
                    return Lang.getValByKey("supplier", 'supplier_prompt_middle_title_edit_contact')
                },
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#contactsDetail'),
                },
                loadData: function () {
                    $('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function () {
                            $scope.saveContacts();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** 保存联系人 */
        $scope.saveContacts = function () {
            $scope.contactsResponsibilityInfo = ($scope.contactsResponsibilityInfo === undefined) ? "" : $scope.contactsResponsibilityInfo.replace(/(^\s*)|(\s*$)/g, "");
            $scope.contactsDepartmentInfo = ($scope.contactsDepartmentInfo === undefined) ? "" : $scope.contactsDepartmentInfo.replace(/(^\s*)|(\s*$)/g, "");
            $scope.contactsPositionInfo = ($scope.contactsPositionInfo === undefined) ? "" : $scope.contactsPositionInfo.replace(/(^\s*)|(\s*$)/g, "");


            if (!$scope.contactsResponsibilityInfo) {
                $scope.contactsForm.contactsResponsibilityInfo.$setDirty();
            };
            if (!$scope.contactsNameInfo) {
                $scope.contactsForm.contactsNameInfo.$setDirty();
            };
            if (!$scope.contactsDepartmentInfo) {
                $scope.contactsForm.contactsDepartmentInfo.$setDirty();
            };
            if (!$scope.contactsPositionInfo) {
                $scope.contactsForm.contactsPositionInfo.$setDirty();
            };

            if (!$scope.contactsForm.$valid || !$scope.contactsResponsibilityInfo || !$scope.contactsNameInfo || !$scope.contactsDepartmentInfo
               || !$scope.contactsPositionInfo) {
                scrollToErrorView($("#nest-contactsDetail .prompt-content"));
                return;
            };

            var seatParam;
            if ($('#nest-contactsDetail button[name="prompt-operation"]').hasClass('save')) {
                seatParam = {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                };
            } else {
                seatParam = {
                    sid: $scope.supplierId,
                    cid: $scope.cId,
                    intertype: $scope.intertype
                }
            };

            var config = {
                seatParams: seatParam,
                urlParams: {
                    responsibility: $scope.contactsResponsibilityInfo,
                    name: $scope.contactsNameInfo,
                    department: $scope.contactsDepartmentInfo,
                    position: $scope.contactsPositionInfo,
                    mobilephone: $scope.contactsMobilephoneInfo,
                    telephone: $scope.contactsTelephoneInfo,
                    description: $scope.contactsDescriptionInfo
                }
            };



            if ($('#nest-contactsDetail button[name="prompt-operation"]').hasClass('save')) {
                supplierService.addContacts(config, function (res) {
                    if (res.errorCode == 0) {
                        $(document).promptBox('closeFormPrompt');
                        var sidConfig = {
                            seatParams: {
                                sid: $scope.supplierId,
                                intertype: $scope.intertype
                            }
                        };
                        supplierService.getSupplierById(sidConfig, function (data) {
                            if (data.errorCode == 0) {
                                var value = data.data;
                                $scope.tableContacts = value.supplierContacts;
                            }
                        });
                        $scope.tableContactsModel.tableBody = tableService.addCheckbox($scope.tableContacts);
                        $scope.$apply();
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    }
                })
            } else {
                supplierService.editContacts(config, function (res) {
                    if (res.errorCode == 0) {
                        $(document).promptBox('closeFormPrompt');
                        var sidConfig = {
                            seatParams: {
                                sid: $scope.supplierId,
                                intertype: $scope.intertype
                            }
                        };
                        supplierService.getSupplierById(sidConfig, function (data) {
                            if (data.errorCode == 0) {
                                var value = data.data;
                                $scope.tableContacts = value.supplierContacts;
                            }
                        });
                        $scope.tableContactsModel.tableBody = tableService.addCheckbox($scope.tableContacts);
                        $scope.$apply();
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    }
                });
            };
        };

        /** 删除联系人 */
        $scope.deleteContactsEvent = function () {
            var selectArr = tableService.getSelectTable($scope.tableContactsModel.tableBody);
            if (selectArr.length) {
                $(document).promptBox({
                    title: Lang.getValByKey("supplier", 'supplier_prompt_delete_contact'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("supplier", 'supplier_prompt_delete_tip_contact')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                $scope.submitDeleteContacts(selectArr);
                            }
                        }
                    ]
                });
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey("supplier", 'supplier_prompt_tip_tips'), type: 'errer', manualClose: true });
            };
        };
        $scope.submitDeleteContacts = function (selectArr) {
            var arr = [];
            for (var i in selectArr) {
                arr.push(selectArr[i].id);
            }
            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                },
                urlParams: arr
            };
            supplierService.deleteContacts(config, function (response) {
                if (response.errorCode == 0) {
                    $(document).promptBox('closePrompt');
                    var sidConfig = {
                        seatParams: {
                            sid: $scope.supplierId,
                            intertype: $scope.intertype
                        }
                    };
                    supplierService.getSupplierById(sidConfig, function (data) {
                        if (data.errorCode == 0) {
                            var value = data.data;
                            $scope.tableContacts = value.supplierContacts;
                        }
                    });
                    $scope.tableContactsModel.tableBody = tableService.addCheckbox($scope.tableContacts);
                    $scope.$apply();
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'success' });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: response.msg, type: 'errer', manualClose: true });
                }
            });
            $scope.$apply();
        };
        /*====== 联系人 END======*/

        /*====== 业务信息 END======*/
        /** 编辑业务信息 */
        $scope.editBusiness = function () {
            //清除angular表单脏值检测
            $scope.businessForm.$setPristine();
            $scope.businessForm.$setUntouched();

            var sidConfig = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(sidConfig, function (data) {
                if (data.errorCode == 0) {
                    var value = data.data;
                    $scope.mainServiceInfo = value.mainService;
                    $scope.bizScopeInfo = value.bizScope;
                }
            });
            $scope.bizVisible = false;
            $scope.isBizVisible = true;
        };

        /** 新建或修改保存业务信息 */
        $scope.submitBusiness = function () {

            $scope.mainServiceInfo = ($scope.mainServiceInfo === null || $scope.mainServiceInfo === undefined) ? "" : $scope.mainServiceInfo.replace(/(^\s*)|(\s*$)/g, "");

            if (!$scope.mainServiceInfo) {
                $scope.businessForm.mainServiceInfo.$setDirty();
            };

            if (!$scope.businessForm.$valid || !$scope.mainServiceInfo) {
                scrollToErrorView($(".tab-content"));
                return;
            };

            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                },
                urlParams: {
                    mainService: $scope.mainServiceInfo,
                    bizScope: $scope.bizScopeInfo
                }
            };



            supplierService.saveOrAddBusiness(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.bizVisible = true;
                    $scope.isBizVisible = false;

                    var sidConfig = {
                        seatParams: {
                            sid: $scope.supplierId,
                            intertype: $scope.intertype
                        }
                    };
                    supplierService.getSupplierById(sidConfig, function (data) {
                        if (data.errorCode == 0) {
                            var value = data.data;
                            $scope.mainService = value.mainService;
                            $scope.bizScope = value.bizScope;
                        }
                    });
                    $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                };
            });
        };

        /** 取消编辑业务信息 */
        $scope.cancelBusiness = function () {
            $scope.bizVisible = true;
            $scope.isBizVisible = false;

            var sidConfig = { seatParams: { sid: $scope.supplierId } };
            supplierService.getSupplierById(sidConfig, function (data) {
                if (data.errorCode == 0) {
                    var value = data.data;
                    $scope.mainService = value.mainService;
                    $scope.bizScope = value.bizScope;
                }
            });
            //清除angular表单脏值检测
            $scope.businessForm.$setPristine();
            $scope.businessForm.$setUntouched();
        };
        /*====== 业务信息 END======*/

        /*====== 财务信息 ======*/
        /** 编辑财务信息 */
        $scope.editFinancial = function () {
            $scope.pictureModel.uploadShow = true;
            $scope.pictureModel.edit = true;

            var sidConfig = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(sidConfig, function (data) {
                if (data.errorCode == 0) {
                    var value = data.data;
                    $scope.taxpayerNumberInfo = value.taxpayerNumber;
                    $scope.bankNameInfo = value.bankName;
                    $scope.bankAccountInfo = value.bankAccount;
                    $scope.companyTelInfo = value.companyTel;
                    $scope.addressInfo = value.address;
                    $scope.lealPersonInfo = value.lealPerson;

                    //编辑时图片处理
                    $scope.pictureModel.picture = pictureEdit(value.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
                }
            });

            $scope.bizVisible = false;
            $scope.isBizVisible = true;
            //清除angular表单脏值检测
            $scope.financialForm.$setPristine();
            $scope.financialForm.$setUntouched();
        }

        /** 取消编辑财务信息 */
        $scope.cancelFinancial = function () {
            $scope.bizVisible = true;
            $scope.isBizVisible = false;
            $scope.pictureModel.uploadShow = false;
            $scope.pictureModel.edit = false;

            var sidConfig = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(sidConfig, function (data) {
                if (data.errorCode == 0) {
                    var value = data.data;
                    $scope.validatePictureError = false;

                    $scope.taxpayerNumber = value.taxpayerNumber;
                    $scope.bankName = value.bankName;
                    $scope.bankAccount = value.bankAccount;
                    $scope.companyTel = value.companyTel;
                    $scope.address = value.address;
                    $scope.lealPerson = value.lealPerson;

                    //编辑时图片处理
                    $scope.pictureModel.picture = pictureEdit(value.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
                }
            });
            //清除angular表单脏值检测
            $scope.financialForm.$setPristine();
            $scope.financialForm.$setUntouched();
        };

        $scope.pictureModel = {
            'edit': true,    //是否编辑状态
            'uploadShow': false,    //是否显示上传按钮图标
            'picture': [],    //图片存放地址
            'accept':'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
        };

        /** 营业执照上传 */
        $scope.getFile = function (files) {
            var length = files.length;
            var picLength = $scope.pictureModel.picture.length;
            if ((length + picLength) > pictureService.maxUpload) {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey("customer", 'company_placeholder_picture') + pictureService.maxUpload + Lang.getValByKey("supplier", 'supplier_prompt_tip_picture_two'), type: 'errer', manualClose: true });
                return false;
            }
            for (var i = 0; i < length; i++) {

                var result = pictureService.uploadFile($scope.pictureModel, files[i]);

                if (!result) {
                    return false;
                }
                if (result.errorlocal) {
                    $(document).promptBox({ isDelay: true, contentDelay: result.errorlocal, type: 'errer', manualClose: true });
                } else {
                    result.then(function (res) {
                        if (res.data.errorCode === 0) {
                            //res.data.data为图片对应的 picUrlID
                            $scope.validatePictureError = false;
                            $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);

                            $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'success' });
                        } else {
                            $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'errer', manualClose: true });
                        }
                    });
                }
            }
        };

        /** 新增或修改保存财务信息 */
        $scope.submitFinancial = function () {
            if (!$scope.taxpayerNumberInfo) {
                $scope.financialForm.taxpayerNumberInfo.$setDirty();
            };
            if (!$scope.bankNameInfo) {
                $scope.financialForm.bankNameInfo.$setDirty();
            };
            if (!$scope.bankAccountInfo) {
                $scope.financialForm.bankAccountInfo.$setDirty();
            };
            if (!$scope.companyTelInfo) {
                $scope.financialForm.companyTelInfo.$setDirty();
            };
            if (!$scope.addressInfo) {
                $scope.financialForm.addressInfo.$setDirty();
            };
            if (!$scope.lealPersonInfo) {
                $scope.financialForm.lealPersonInfo.$setDirty();
            };

            var pictures = pictureArr($scope.pictureModel.picture);

            if (!pictures.length) {
                $scope.validatePictureError = true;
            } else {
                $scope.validatePictureError = false;
            };

            var config = {
                seatParams: {
                    sid: $scope.supplierId,
                    intertype: $scope.intertype
                },
                urlParams: {
                    taxpayerNumber: $scope.taxpayerNumberInfo,
                    bankName: $scope.bankNameInfo,
                    bankAccount: $scope.bankAccountInfo,
                    companyTel: $scope.companyTelInfo,
                    address: $scope.addressInfo,
                    lealPerson: $scope.lealPersonInfo,
                    attachFileIds: pictures
                }
            };

            if ($scope.validatePictureError) {
                $scope.financialForm.$valid = false;
            }

            if (!$scope.financialForm.$valid) {
                scrollToErrorView($(".tab-content"));
                return;
            };

            supplierService.saveOrAddFinancial(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.bizVisible = true;
                    $scope.isBizVisible = false;

                    var sidConfig = {
                        seatParams: {
                            sid: $scope.supplierId,
                            intertype: $scope.intertype
                        }
                    };
                    supplierService.getSupplierById(sidConfig, function (data) {
                        if (data.errorCode == 0) {
                            var value = data.data;
                            $scope.taxpayerNumber = value.taxpayerNumber;
                            $scope.bankName = value.bankName;
                            $scope.bankAccount = value.bankAccount;
                            $scope.companyTel = value.companyTel;
                            $scope.address = value.address;
                            $scope.lealPerson = value.lealPerson;
                            $scope.pictureModel.uploadShow = false;
                            $scope.pictureModel.edit = false;

                            //编辑时图片处理
                            $scope.pictureModel.picture = pictureEdit(value.files);
                            $scope.pictureModel = pictureService.init($scope.pictureModel);
                        }
                    });
                    $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                };
            });
        };

        /** 营业执照预览 */
        $scope.getPictureUrl = function (fileid) {

            $('#slides').picturePreview({ pictureId: fileid }, $scope.pictureModel.picture);
        };

        /*====== 财务信息 END======*/

        /** tab切换组件 */
        $scope.tab = supplierView.tab('#m-tab', $scope.swichEvent);

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

        $scope.getSupplierDetail = function () {
            if (!$scope.paramter.id) return;
            $scope.supplierId = $scope.paramter.id;
            var config = {
                seatParams: {
                    sid: $scope.paramter.id,
                    intertype: $scope.intertype
                }
            };
            supplierService.getSupplierById(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.tab.enableAll();
                    $scope.tab.selected(0);
                    $scope.main = true;
                    $scope.visible = true;
                    $scope.isVisible = false;
                    $scope.validateRankError = false;
                    $scope.validateCodeError = false;
                    $scope.validatePictureError = false;
                    $scope.showEmailError = false;

                    var value = res.data,
                        arrName = '',
                        arr = [];
                    $scope.tableBD = value.bds;
                    $scope.tableContacts = value.supplierContacts;
                    $scope.mainService = value.mainService;
                    $scope.bizScope = value.bizScope;

                    $scope.mainServiceInfo = value.mainService;
                    $scope.bizScopeInfo = value.bizScope;

                    $scope.taxpayerNumber = value.taxpayerNumber;
                    $scope.bankName = value.bankName;
                    $scope.bankAccount = value.bankAccount;
                    $scope.companyTel = value.companyTel;
                    $scope.address = value.address;
                    $scope.lealPerson = value.lealPerson;

                    $scope.taxpayerNumberInfo = value.taxpayerNumber;
                    $scope.bankNameInfo = value.bankName;
                    $scope.bankAccountInfo = value.bankAccount;
                    $scope.companyTelInfo = value.companyTel;
                    $scope.addressInfo = value.address;
                    $scope.lealPersonInfo = value.lealPerson;

                    //编辑时图片处理
                    $scope.pictureModel.uploadShow = false;
                    $scope.pictureModel.edit = false;

                    $scope.pictureModel.picture = pictureEdit(value.files);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);

                    $scope.name = value.name;
                    $scope.simpleName = value.simpleName;
                    $scope.website = value.website;
                    $scope.fax = value.fax;
                    $scope.code = value.code;
                    $scope.description = value.description;
                    $scope.country = value.country;
                    for (var i in value.serviceTypes) {
                        arr.push(value.serviceTypes[i].serviceTypeCode);
                        if (value.serviceTypes[i].supplierTypeName) {
                            if (i == value.serviceTypes.length) {
                                arrName += value.serviceTypes[i].supplierTypeName
                            } else {
                                arrName += value.serviceTypes[i].supplierTypeName + '，';
                            };
                        }
                    }
                    $scope.serviceTypeIdsInfo = arrName;
                    $scope.listTypeIds = arr;
                    $scope.serviceTypeIds = arrName;
                    $scope.rankInfo = parseInt(value.rank);
                    $('#stars').rating('update', parseInt(value.rank));
                }
            });
        }

        $scope.clearEmailErrorMsg = function () {
            $scope.showEmailError = false;
        }
        $scope.checkEmail = function() {
            if(!$scope.emailInfo || $scope.oldEmail == $scope.emailInfo) {
                return;
            }
            supplierService.checkSupplierUserInfoEmail({ email: $scope.emailInfo }, function (res) {
                if (res.data) {
                    $scope.showEmailError = true;
                    angular.element($(".check-emails").addClass("ng-invalid"));
                } else {
                    $scope.showEmailError = false;
                    angular.element($(".check-emails").removeClass("ng-invalid"));
                }
            });
        };

        $scope.getSupplierDetail();

    }]);
});

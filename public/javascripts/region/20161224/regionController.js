easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'public/common/tableController.js'
], function() {
    app.controller('regionCtrl', ['$scope', 'regionService', 'regionView', 'tableService', function($scope, regionService, regionView, tableService) {
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("region", 'region_table_region_name'),
                Lang.getValByKey("region", 'region_table_region_code'),
                Lang.getValByKey("region", 'region_table_region_creator'),
                Lang.getValByKey("region", 'region_table_region_created_time'),
                Lang.getValByKey("region", 'region_table_region'),
                Lang.getValByKey("region", 'region_table_remark')
            ],
            tableBody: [],
            restURL: "logistics.getRegionList",
            restData: {
                q: '',
                type: 1,
                pageIndex: 1,
                pageSize: 10,
                sort: 'createTime',
                asc: false
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.tableDeliveryModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("region", 'region_table_region_name'),
                Lang.getValByKey("region", 'region_table_region_code'),
                Lang.getValByKey("region", 'region_table_region_creator'),
                Lang.getValByKey("region", 'region_table_region_created_time'),
                Lang.getValByKey("region", 'region_table_region'),
                Lang.getValByKey("region", 'region_table_remark')
            ],
            tableBody: [],
            restURL: "logistics.getRegionList",
            restData: {
                q: '',
                type: 1,
                pageIndex: 1,
                pageSize: 10,
                sort: 'createTime',
                asc: false
            },
            selectNumber: 0,
            selectFlag: false
        };

        /** 初始加载计费分区信息列表 */
        $scope.$on('$viewContentLoaded',function() {
            $scope.loadListData();
            $scope.type = 1;
            var regionIndex = window.location.href.split('=')[1];
            if(regionIndex){
                if(regionIndex == 1){
                    $scope.tab.selected(1);
                    $scope.tableDeliveryModel.restData.type = 2;
                    $scope.tableModel.restData.q = '';
                    $scope.type = 2;
                    $scope.loadDeliveryListData();
                    window.resizeTable();
                }else{
                    $scope.tab.selected(0);
                    $scope.tableModel.restData.type = 1;
                    $scope.tableDeliveryModel.restData.q = '';
                    $scope.type = 1;
                    $scope.loadListData();
                    window.resizeTable();
                }
            };
        });

        $scope.loadListData = function(){
            var params = {
                'urlParams': $scope.tableModel.restData
            };

            tableService.getTable($scope.tableModel.restURL, params, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
            });

            setScrollDetail();
            $(window).on("resize",setScrollDetail);

            function setScrollDetail(){
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 300
                });
            };
        };

        $scope.loadDeliveryListData = function(){
            var params = {
                'urlParams': $scope.tableDeliveryModel.restData
            };

            tableService.getTable($scope.tableDeliveryModel.restURL, params, function(data){
                if(data.errorCode === 0){
                    $scope.tableDeliveryModel = tableService.table($scope.tableDeliveryModel, params, data);
                }
            });

            setScrollDetail();
            $(window).on("resize",setScrollDetail);

            function setScrollDetail(){
                $('.table-container tbody').slimscroll({
                    height: $('.content-main').height() - 300
                });
            };
        };

        $scope.swichEvent = function(index){
            if($('.prompt-content').length){
                $('.content').append($('#nest-chargingRegionDetail .prompt-content').hide());
                $(document).promptBox('closeAllPrompt');
            };
            $scope.q = '';

            var href = window.location.href;
            if(index == 0){
                $scope.tableModel.restData.type = 1;
                $scope.tableDeliveryModel.restData.q = '';
                $scope.type = 1;
                $scope.loadListData();
                window.resizeTable();
                $scope.$apply();

                if(href.indexOf('=') != -1){
                    window.location.href = href.split('=')[0] + '=' + 0;
                }else{
                    window.location.href = href.split('=')[0] + '?index=' + 0;
                };
            };
            if(index == 1){
                $scope.tableDeliveryModel.restData.type = 2;
                $scope.tableModel.restData.q = '';
                $scope.type = 2;
                $scope.loadDeliveryListData();
                window.resizeTable();
                $scope.$apply();

                if(href.indexOf('=') != -1){
                    window.location.href = href.split('=')[0] + '=' + 1;
                }else{
                    window.location.href = href.split('=')[0] + '?index=' + 1;
                };
            }
        };

        /** 获取计费分区详情 */
        $scope.getChargingRegionDetail = function(id, name, index){
            $(document).promptBox('closeAllPrompt');
            window.location.href = '#/regionDetail?schemaId='+ id +'&name='+ name + '&index='+0+'&q=region';
        };

        /** 获取派送分区详情 */
        $scope.getDeliveryRegionDetail = function(id, name, index){
            $(document).promptBox('closeAllPrompt');
            window.location.href = '#/regionDetail?schemaId='+id+'&name='+ name + '&index='+1+'&q=region';
        };

        /**======================= 计费分区 =========*/
        /** 添加计费分区 */
        $scope.addChargingRegion = function(){

            //清除angular表单脏值检测
            $scope.chargingRegionForm.$setPristine();
            $scope.chargingRegionForm.$setUntouched();
            $scope.validateCodeError = false;
            $scope.isDetailCheck = false;
            $scope.nameInfo = '';
            $scope.codeInfo = '';
            $scope.descriptionInfo = '';

            $(document).promptBox({
                title: Lang.getValByKey("region", 'region_add_charging'),
                loadTitle: function(){
                    return Lang.getValByKey("region", 'region_add_charging')
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#chargingRegionDetail'),
                },
                loadData: function(){
                    $('#nest-chargingRegionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveChargingRegion();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** 保存计费分区 */
        $scope.saveChargingRegion = function(id){

            if(!$scope.nameInfo){
                $scope.chargingRegionForm.nameInfo.$setDirty();
            };
            if(!$scope.codeInfo){
                $scope.chargingRegionForm.codeInfo.$setDirty();
            };
            id = id == undefined ? $scope.chargingRegionId : id;
            var config;
            if($('#nest-chargingRegionDetail button[name="prompt-operation"]').hasClass('save')){
                config = {
                    urlParams : {
                        type : 1,
                        name : $scope.nameInfo,
                        code : $scope.codeInfo,
                        description : $scope.descriptionInfo
                    }
                };
            }else{
                config = {
                    seatParams : {id: id},
                    urlParams : {
                        type : 1,
                        name : $scope.nameInfo,
                        code : $scope.codeInfo,
                        description : $scope.descriptionInfo
                    }
                };
            };

            if($scope.validateCodeError == true){
                $scope.chargingRegionForm.$valid = false;
            };

            if(!$scope.chargingRegionForm.$valid){
                return;
            };

            if($('#nest-chargingRegionDetail button[name="prompt-operation"]').hasClass('save')){
                regionService.addChargingRegion(config, function(res){
                    if(res.errorCode == 0){

                        if($scope.isHref == true){
                            $(document).promptBox('closeAllPrompt');
                            window.location.href = '#/regionDetail?schemaId='+ res.data +'&name='+ $scope.nameInfo + '&index=0&q=region';
                        }else{
                            $('.content').append($('#nest-chargingRegionDetail .prompt-content').hide());
                            $(document).promptBox('closeAllPrompt');
                            $scope.tableModel.restData.type = 1;
                            $scope.loadListData();
                        }

                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }else{
                regionService.editChargingRegion(config, function(res){
                    if(res.errorCode == 0){
                        $('.content').append($('#nest-chargingRegionDetail .prompt-content').hide());
                        $(document).promptBox('closeAllPrompt');
                        $scope.tableModel.restData.type = 1;
                        $scope.loadListData();
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    };
                });
            }
        };

        /** 修改计费分区 */
        $scope.editChargingRegionDetail = function(id){
            $scope.validateCodeError = false;
            $scope.chargingRegionId = id;
            $scope.isDetailCheck = true;
            //清除angular表单脏值检测
            $scope.chargingRegionForm.$setPristine();
            $scope.chargingRegionForm.$setUntouched();

            var config = {
                seatParams : {id: id}
            };

            $(document).promptBox({
                title: Lang.getValByKey("region", 'region_detail_charging'),
                loadTitle: function(){
                    return Lang.getValByKey("region", 'region_detail_charging')
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#chargingRegionDetail'),
                },
                loadData: function(){
                    $('#nest-chargingRegionDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');

                    regionService.getChargingRegionDetail(config, function(res){
                        if(res.errorCode == 0){
                            var value = res.data;
                            $scope.isDetailCheck = true;
                            $scope.nameInfo = value.name;
                            $scope.codeInfo = value.code;
                            $scope.createName = value.creator + ' ' + value.creatorCode;
                            $scope.createTime = value.createTime;
                            $scope.descriptionInfo = value.description;
                        }
                    });
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveChargingRegion($scope.chargingRegionId);
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** 异步校验计费编码 */
        $scope.validateCode = function(){
            if(!$scope.codeInfo) return;
            var id;
            if($('#nest-chargingRegionDetail button[name="prompt-operation"]').hasClass('save')){
                id = '';
            }else{
                console.log($scope.type)
                if($scope.type == 1){
                    id = $scope.chargingRegionId;
                }else{
                    id = $scope.deliveryRegionId;
                }
            }

            var config = {
                urlParams:{
                    code: $scope.codeInfo,
                    id: id
                }
            };
            regionService.validateChargingCode(config, function(response){
                if(response.errorCode == 0){
                    $scope.validateCodeError = false;
                    angular.element(".validate-codes").removeClass("ng-invalid");
                }else{
                    $scope.validateCodeError = true;
                    angular.element(".validate-codes").addClass("ng-invalid");
                }
            });
        };
        $scope.removeValidateCode = function(){
            $scope.validateCodeError = false;
        };

        /** 删除计费分区 */
        $scope.deleteChargingRegion = function(){
            var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);
            if(selectArr.length){
                $(document).promptBox({
                    title: Lang.getValByKey("region", 'region_delete_charging'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("region", 'region_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function () {
                                $scope.submitDeleteRegions(selectArr);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay: Lang.getValByKey("region", 'region_select_charging_regions'), type: 'errer', manualClose:true});
            };
        };
        $scope.submitDeleteRegions = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].id);
            }
            var config = {
                seatParams : {sid: $scope.chargingRegionId},
                urlParams : arr
            };
            regionService.deleteChargingRegion(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');

                    $scope.tableModel.restData.type = 1;
                    $scope.loadListData();
                    $scope.$apply();
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox('closePrompt');
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };

        /** 检索计费分区 */
        $scope.retrievalChargingRegion = function(){
            $scope.tableModel.restData.type = 1;
            $scope.q = $scope.tableModel.restData.q;
            $scope.tableModel.restData.pageIndex = 1;

            $scope.loadListData();
        };

        /**======================= 派送分区 =========*/
        /** 添加派送分区 */
        $scope.addDeliveryRegion = function(){
            //清除angular表单脏值检测
            $scope.chargingRegionForm.$setPristine();
            $scope.chargingRegionForm.$setUntouched();
            $scope.validateCodeError = false;
            $scope.isDetailCheck = false;

            $scope.nameInfo = '';
            $scope.codeInfo = '';
            $scope.descriptionInfo = '';

            $(document).promptBox({
                title: Lang.getValByKey("region", 'region_add_delivery'),
                loadTitle: function(){
                    return Lang.getValByKey("region", 'region_add_delivery')
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#chargingRegionDetail'),
                },
                loadData: function(){
                    $('#nest-chargingRegionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveDeliveryRegion();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** 保存派送分区 */
        $scope.saveDeliveryRegion = function(id){

            if(!$scope.nameInfo){
                $scope.chargingRegionForm.nameInfo.$setDirty();
            };
            if(!$scope.codeInfo){
                $scope.chargingRegionForm.codeInfo.$setDirty();
            };
            id = id == undefined ? $scope.deliveryRegionId : id;
            var config;
            if($('#nest-chargingRegionDetail button[name="prompt-operation"]').hasClass('save')){
                config = {
                    urlParams : {
                        type : 2,
                        name : $scope.nameInfo,
                        code : $scope.codeInfo,
                        description : $scope.descriptionInfo
                    }
                };
            }else{
                config = {
                    seatParams : {id: id || $scope.deliveryRegionId},
                    urlParams : {
                        type : 2,
                        name : $scope.nameInfo,
                        code : $scope.codeInfo,
                        description : $scope.descriptionInfo
                    }
                };
            };

            if($scope.validateCodeError == true){
                $scope.chargingRegionForm.$valid = false;
            };

            if(!$scope.chargingRegionForm.$valid){
                return;
            };

            if($('#nest-chargingRegionDetail button[name="prompt-operation"]').hasClass('save')){
                regionService.addChargingRegion(config, function(res){
                    if(res.errorCode == 0){

                        if($scope.isHref == true){
                            $(document).promptBox('closeAllPrompt');
                            window.location.href = '#/regionDetail?schemaId='+ res.data +'&name='+ $scope.nameInfo + '&index=1&q=region';
                        }else{
                            $('.content').append($('#nest-chargingRegionDetail .prompt-content').hide());
                            $(document).promptBox('closeAllPrompt');

                            $scope.tableDeliveryModel.restData.type = 2;
                            $scope.loadDeliveryListData();
                        }

                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }else{
                regionService.editChargingRegion(config, function(res){
                    if(res.errorCode == 0){
                        $('.content').append($('#nest-chargingRegionDetail .prompt-content').hide());
                        $(document).promptBox('closeAllPrompt');

                        $scope.tableDeliveryModel.restData.type = 2;
                        $scope.loadDeliveryListData();
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    };
                });
            }
        };

        /** 修改派送分区 */
        $scope.editDeliveryRegionDetail = function(id){
            $scope.validateCodeError = false;
            $scope.deliveryRegionId = id;
            $scope.isDetailCheck = true;

            //清除angular表单脏值检测
            $scope.chargingRegionForm.$setPristine();
            $scope.chargingRegionForm.$setUntouched();

            var config = {
                seatParams : {id: id}
            };

            $(document).promptBox({
                title: Lang.getValByKey("region", 'region_detail_delivery'),
                loadTitle: function(){
                    return Lang.getValByKey("region", 'region_detail_delivery')
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#chargingRegionDetail'),
                },
                loadData: function(){
                    $('#nest-chargingRegionDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');

                    regionService.getChargingRegionDetail(config, function(res){
                        if(res.errorCode == 0){
                            var value = res.data;
                            $scope.isDetailCheck = true;

                            $scope.nameInfo = value.name;
                            $scope.codeInfo = value.code;
                            $scope.createName = value.creator + ' ' + value.creatorCode;
                            $scope.createTime = value.createTime;
                            $scope.descriptionInfo = value.description;
                        }
                    });
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveDeliveryRegion($scope.deliveryRegionId);
                            $scope.$apply();
                        }
                    }
                ]
            });
        };


        /** 删除派送分区 */
        $scope.deleteDeliveryRegion = function(){
            var selectArr = tableService.getSelectTable($scope.tableDeliveryModel.tableBody);
            if(selectArr.length){
                $(document).promptBox({
                    title: Lang.getValByKey("region", 'region_delete_delivery'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("region", 'region_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function () {
                                $scope.submitDeleteDeliveryRegions(selectArr);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox('closePrompt');
                $(document).promptBox({isDelay:true, contentDelay: Lang.getValByKey("region", 'region_select_delivery_regions'), type: 'errer', manualClose:true});
            };
        };
        $scope.submitDeleteDeliveryRegions = function(selectArr){
            var arr = [];
            for(var i in selectArr){
                arr.push(selectArr[i].id);
            }
            var config = {
                seatParams : {sid: $scope.chargingRegionId},
                urlParams : arr
            };
            regionService.deleteChargingRegion(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');

                    $scope.tableDeliveryModel.restData.type = 2;
                    $scope.loadDeliveryListData();
                    $scope.$apply();
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox('closePrompt');
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };

        /** 检索计费分区 */
        $scope.retrievalDeliveryRegion = function(){
            $scope.tableDeliveryModel.restData.type = 2;
            $scope.q = $scope.tableDeliveryModel.restData.q;
            $scope.tableDeliveryModel.restData.pageIndex = 1;

            $scope.loadDeliveryListData();
        };

        /** 添加分区是否到分区详情 */
        $scope.isHrefDetail = function(){
            $scope.isHref = !$scope.isHref;
        };

        /** tab切换组件 */
        $scope.tab = regionView.tab('#m-tab', $scope.swichEvent);

    }]);
});
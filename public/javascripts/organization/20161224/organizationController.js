easySpa.require(['widget/slimscroll','widget/nestable','widget/prompt'],function(){
    app.controller('organizationCtrl', ['$scope', 'organizationService', 'organizationView', function($scope, organizationService, organizationView) {
        $scope.$on('$viewContentLoaded', function(){
            manageShowTree();
        });
        function manageShowTree(){
            $('#tree').nestable({
                isRoot:true,
                iconOpen        : 'icon-organization-Open',       /** 带加号图标 */
                iconClose       : 'icon-organization-Close',      /** 带减号图标 */
                iconSeat        : 'icon-organization',            /** 无展开图标 */
                addChildNodes   : function(newPid){ addNodesEvent(newPid); },
                deleteNodes     : function(orgId, childLength, userArr, deleteNode){ deleteNodesEvent(orgId, childLength, userArr, deleteNode); },
                childUrl        : Interface.getUrlById("logistics.treeChildUrl"),
                resetNode       : Interface.getUrlById('logistics.getOrganizationNode'),
                newItemUid      : $('input[name=newOrganizationId]'),  /** 保存成功时传入保存成功后的回调函数的id */
                searchUrl       : Interface.getUrlById("logistics.searchTreeUrl"),
                searchInput     : $('input[name=organization]'),
                searchTip       : Lang.getValByKey("organization", 'group_tree_search'),
                searchKeyNodes  : function(uid){ clickNodeEvent(uid); },
                clickNode       : function(uid){ clickNodeEvent(uid); },
                loadFirstNode   : function(uid){ clickNodeEvent(uid); },
                collapseAllNode : function(uid){ clickNodeEvent(uid); },
                treeScrollHeight: $('.tree-scroll-box'),
                newNodeText     : Lang.getValByKey("organization", 'organization_nestable_seat_tip')
            }).on('change',function(){
                var preId = $('.moving').prev().length == 0 ? 0 : $('.moving').prev().data('uid');
                var id = $('.moving').data('uid');
                var parentId = $('li[data-uid='+id+']').parent().parent('.dd-item').data('uid');
                parentId = parentId == undefined ? 0 : parentId;

                submitChangeData(id, parentId, preId);
            });

            /**** 点击新增组织事件 **/
            function addNodesEvent(newPid){
                $scope.validateOrgError = false;
                $scope.validateOrgShortError = false;
                $scope.validateCodeError = false;

                if($scope.show == false || $scope.show == undefined){
                    $scope.validate = true;
                    $scope.validateRequired = false;
                    $scope.show = !$scope.show;
                    $scope.visible = !$scope.visible;
                };

                $scope.orgId = newPid;
                $scope.organizationId = newPid;

                organizationService.getOrganization(newPid, function(data){
                    if(data.errorCode === 0){
                        $scope.parentId = data.data.parentId;
                        $scope.newParentId = data.data.parentId;
                    }
                });

                $scope.orgNameInfo = '';
                $scope.orgShortNameInfo = '';
                $scope.orgCodeInfo = '';
                $scope.descriptionInfo = '';
                $('button[name="save-org"]').removeClass('detail-save').addClass('add-save');

                //输入框字符长度
                $scope.textNumber = 140;

                //清除angular表单脏值检测
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                $scope.$apply();
            };

            /**** 点击删除组织事件 **/
            function deleteNodesEvent(orgId, childLength, userArr, deleteNode){
                clickNodeEvent(orgId);
                if(userArr != 0){
                    $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("organization", 'group_prompt_tip'), type: 'errer', manualClose:true});
                }else{
                    if(childLength == 0){
                        $('.new-nodes').remove();
                        $(document).promptBox({
                            title: Lang.getValByKey("common", 'common_prompt_title'),
                            type: 'warning',
                            content: {
                                tip: Lang.getValByKey("organization", 'group_prompt_box_tip')
                            },
                            operation: [
                                {
                                    type: 'submit',
                                    description: Lang.getValByKey("common", 'common_page_delete'),
                                    application : 'delete',
                                    operationEvent: function () {
                                        submitDeleteNodes(orgId, deleteNode);
                                    }
                                }
                            ]
                        });
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("organization", 'group_prompt_delete_tip'), type: 'errer', manualClose:true});
                    };
                };

            };

            function submitDeleteNodes(orgId, deleteNode){
                organizationService.deleteOrganization(orgId, function(data){
                    if(data.errorCode === 0){
                        $(document).promptBox('closePrompt');

                        if(deleteNode.find('li.dd-item').length == 1){
                            var delId = $('.dd-item[data-uid='+data.data+']').parent().parent().data('uid');
                            $('input[name="newOrganizationId"]').data('value', delId);
                            $('#tree').nestable('resetDeleteGroup');
                        };
                        $('li[data-uid="'+orgId+'"]').remove();

                        organizationService.getOrganization(orgId, function(data){
                            if (data.errorCode == 0){
                                $('.dd-item[data-uid="'+data.data.parentId+'"]').children('.dd3-content').addClass('active');
                                clickNodeEvent(data.data.parentId);
                            }
                        });
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'errer', manualClose:true});
                    }
                });
            };

            /**** 点击获取组织详情事件 **/
            function clickNodeEvent(uid){
                $('button[name="save-org"]').addClass('detail-save').removeClass('add-save');
                organizationService.getOrganization(uid, function(data) {
                    if (data.errorCode == 0) {
                        if($scope.show == true || $scope.visible == true){
                            $scope.validate = false;
                            $scope.validateRequired = false;
                            $scope.show = !$scope.show;
                            $scope.visible = !$scope.visible;
                        };
                        $('.new-nodes').remove();
                        var response = data.data;
                        $scope.organizationId = response.id;
                        $scope.orgId = response.parentId;
                        $scope.orgName = response.name;
                        $scope.orgShortName = response.shortName;
                        $scope.orgCode = response.code;
                        $scope.parentId = response.parentId;
                        $scope.description = response.description;
                    } else {
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'errer', manualClose:true});
                    }
                });
                $scope.$apply();
            };

            /**** 组织移动事件 **/
            function submitChangeData(id, parentId, preId){
                var config = {
                    seatParams:{
                        orgId : id
                    },
                    urlParams:{
                        targetparentid : parentId,
                        targetpreid : preId
                    }
                };

                organizationService.moveOrganization(config, function(data){
                    if (data.errorCode == 0) {
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'success'});
                    } else {
                        //$('#tree').nestable('resetTreeGroup');
                        $('input[name="newOrganizationId"]').data('value', id);
                        $('#tree').nestable('resetSearchNode');
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'errer', manualClose:true});
                    }
                });
            };
            /**** 组织移动事件end **/
        };

        /**** 取消 */
        $scope.cancelOrg = function(){
            if($('.new-nodes').length != 0){
                var uid = $('.new-nodes').parent().parent().data('uid');

                organizationService.getOrganization(uid, function(data){
                    if (data.errorCode == 0) {

                        var response = data.data;

                        $scope.orgName = response.name;
                        $scope.orgShortName = response.shortName;
                        $scope.orgCode = response.code;
                        $scope.parentId = response.parentId;
                        $scope.description = response.description;
                    } else {
                        $(document).promptBox({isDelay:true, contentDelay:data.msg, type: 'errer', manualClose:true});
                    }
                });

            }else{
                $scope.orgNameInfo = $scope.orgName;
                $scope.orgShortNameInfo = $scope.orgShortName;
                $scope.orgCodeInfo = $scope.orgCode;
                $scope.parentIdInfo = $scope.parentId;
                $scope.descriptionInfo = $scope.description;
            };

            $scope.validate = false;
            $scope.validateRequired = false;
            $scope.show = !$scope.show;
            $scope.visible = !$scope.visible;
            $('.new-nodes').parent().parent().children('.dd3-content').addClass('active');
            $('.new-nodes').remove();
            $('button[name="save-org"]').removeClass('detail-save, add-save').addClass('detail-save');

        };
        /**** 点击切换编辑 */
        $scope.editOrg = function(){
            $scope.validateOrgError = false;
            $scope.validateOrgShortError = false;
            $scope.validateCodeError = false;

            $scope.validate = true;
            $scope.validateRequired = false;
            $scope.show = !$scope.show;
            $scope.visible = !$scope.visible;

            $scope.orgNameInfo = $scope.orgName;
            $scope.orgShortNameInfo = $scope.orgShortName;
            $scope.orgCodeInfo = $scope.orgCode;
            $scope.parentNameInfo = $scope.parentName;
            $scope.isEdit = true;
            $scope.descriptionInfo = $scope.description;

            /*输入框字符长度*/
            $scope.textNumber = 140 - $scope.descriptionInfo.length;
        };


        /**** 点击切换保存 */
        $scope.saveOrgInfo = function(){
            if(!$scope.orgNameInfo){
                $scope.form.orgNameInfo.$setDirty();
            }
            if(!$scope.orgShortNameInfo){
                $scope.form.orgShortNameInfo.$setDirty();
            }
            if(!$scope.orgCodeInfo){
                $scope.form.orgCodeInfo.$setDirty();
            }


            var parentId = $('button[name="save-org"]').hasClass('detail-save') ? $scope.parentId : $scope.orgId;

            if(!parentId){
                parentId = $scope.newParentId
            };

            $scope.descriptionInfo = $.trim($scope.descriptionInfo);
            var saveData = $.extend({},
                {parentId: parentId},
                {name: $scope.orgNameInfo},
                {shortName: $scope.orgShortNameInfo},
                {code: $scope.orgCodeInfo},
                {description: $scope.descriptionInfo}
            );

            $scope.validateRequired = true;

            if(!$scope.form.$valid || $scope.validateOrgError == true || $scope.validateOrgShortError == true || $scope.validateCodeError == true){
                return;
            };

            if($scope.form.$valid){

                if($('button[name="save-org"]').hasClass('detail-save')){
                    var id = $('.dd3-content.active').parent().data('uid');

                    var config = {
                        seatParams:{
                            orgId : id
                        },
                        urlParams: saveData
                    };
                    organizationService.editOrganization(config, function(response){
                        if(response.errorCode == 0){
                            var newId = response.data;
                            $('.dd3-content.active .item-text').text($scope.orgShortNameInfo).parent().data('uid',newId);

                            $scope.validate = false;
                            $scope.validateRequired = false;
                            $scope.show = !$scope.show;
                            $scope.visible = !$scope.visible

                            $scope.orgName = $scope.orgNameInfo;
                            $scope.orgShortName = $scope.orgShortNameInfo;
                            $scope.orgCode = $scope.orgCodeInfo;

                            organizationService.getOrganization(newId, function(data){
                                if(data.errorCode === 0){
                                    $scope.parentId = data.data.parentId;
                                }
                            });

                            $scope.description = $scope.descriptionInfo;

                            $scope.validateOrgError = false;
                            $scope.validateOrgShortError = false;
                            $scope.validateCodeError = false;

                            $('button[name="save-org"]').removeClass('detail-save, add-save').addClass('detail-save');

                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                        }else{
                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                        };
                    });

                }
                else if($('button[name="save-org"]').hasClass('add-save')){
                    var config = {
                        urlParams: saveData
                    };
                    organizationService.saveOrganization(config, function(response){
                        if(response.errorCode == 0){
                            if($('button[name="save-org"]').hasClass('detail-save')){
                                var newId = response.data;
                                $('.dd3-content.active').text($scope.orgShortNameInfo).parent().data('uid',newId);
                            };
                            if($('button[name="save-org"]').hasClass('add-save')){
                                $('input[name="newOrganizationId"]').data('value', response.data);
                                $('#tree').nestable('resetGroup');
                            };
                            $scope.validate = false;
                            $scope.validateRequired = false;
                            $scope.show = !$scope.show;
                            $scope.visible = !$scope.visible

                            $scope.orgName = $scope.orgNameInfo;
                            $scope.orgShortName = $scope.orgShortNameInfo;
                            $scope.orgCode = $scope.orgCodeInfo;
                            //$scope.parentId = $scope.parentIdInfo;
                            $scope.parentId = $scope.orgId;
                            $scope.organizationId = response.data;

                            $scope.description = $scope.descriptionInfo;

                            $scope.validateOrgError = false;
                            $scope.validateOrgShortError = false;
                            $scope.validateCodeError = false;

                            $('button[name="save-org"]').removeClass('detail-save, add-save').addClass('detail-save');

                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                        }else{
                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                        };
                    });

                };
            };

        };

        $scope.focusOrgName = function(){
            $scope.validateOrgError = false;
        };

        /**** 名称唯一 */
        $scope.validateOrgName = function(){
            var name, parentId, orgId;
            name = $scope.orgNameInfo || '';
            if(!name) return;
            if($('.new-nodes').length == 0){
                orgId = $scope.organizationId;
                parentId = $scope.parentId;
            }else{
                orgId = '';
                parentId = $scope.organizationId;
            };


            var config = {
                urlParams:{
                    name : name,
                    parentId : parentId,
                    orgId : orgId
                }
            };
            organizationService.validateName(config, function(response){
                if(response.errorCode != 0){
                    $scope.validateOrgError = true;
                }else{
                    $scope.validateOrgError = false;
                };
            });
        };

        $scope.focusOrgShortName = function(){
            $scope.validateOrgShortError = false;
        };

        /**** 简称唯一 */
        $scope.validateOrgShortName = function(){
            var shortName, parentId, orgId;
            shortName = $scope.orgShortNameInfo || '';
            if(!shortName) return;
            if($('.new-nodes').length == 0){
                orgId = $scope.organizationId;
                parentId = $scope.parentId;
                console.log($scope.parentId)
            }else{
                orgId = '';
                parentId = $scope.orgId;
                console.log($scope.orgId)
            };

            var config = {
                urlParams:{
                    shortName : shortName,
                    parentId : parentId,
                    orgId : orgId
                }
            };
            organizationService.validateShortName(config, function(response){
                if(response.errorCode != 0){
                    $scope.validateOrgShortError = true;
                }else{
                    $scope.validateOrgShortError = false;
                };
            });
        };

        $scope.focusOrgCode = function(){
            $scope.validateCodeError = false;
        };

        /**** 编码唯一 */
        $scope.validateOrgCode = function(){
            var code, orgId;
            code = $scope.orgCodeInfo;
            if(!code) return;
            if($('.new-nodes').length == 0){
                orgId = $scope.organizationId;
            }else{
                orgId = '';
            };

            var config = {
                urlParams:{
                    code : code,
                    orgId : orgId
                }
            };
            organizationService.validateCode(config, function(response){
                if(response.errorCode != 0){
                    $scope.validateCodeError = true;
                }else{
                    $scope.validateCodeError = false;
                };
            });
        };

        /**** 计算输入框数量 */
        $scope.textNumber = 140;
        $scope.showTextNumber = function(){
            $scope.textNumber = 140 - $scope.descriptionInfo.length;
        };
        $scope.visibleTextNumber = function(){
            $scope.textCountVisible = true;
        };
        $scope.hiddenTextNumber = function(){
            $scope.textCountVisible = false;
        };
    }]);
});


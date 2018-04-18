easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tab',
    'public/common/tableController.js'
],function(){
    app.controller('usergroupCtrl', ['$scope', 'usergroupService', 'usergroupView', 'tableService',
        function($scope, usergroupService, usergroupView, tableService){
            $scope.userGroup = {
                main : false,
                edit : false,
                visible : false,
                validate : false,
                validateRequired :false,
                tableUserGroup : '',
                selectedUserGroup : '',
                selectOrgId:'',
                searchSelect : '',
                searchSelected : '',

                getOrgName : '',
                parentId : '',
                orgId : '',
                orgName : '',
                orgNameInfo : '',
                orgShortName : '',
                orgShortNameInfo : '',
                orgCode : '',
                orgCodeInfo : '',
                description : '',
                descriptionInfo : '',

                moveUser:{
                    uncheckedAll : false,
                    unchecked : false,
                    checkedAll : false,
                    checked : false,
                    uncheckedOne : false,
                    checkedOne : false,
                    unSelectValue : '',
                    selectValue : ''
                }
            };

            $scope.tableModel = {
                more: false,
                userWord: '',
                tableHeader: [
                    Lang.getValByKey("common", 'common_thead_number'),
                    Lang.getValByKey("common", 'common_thead_full_name'),
                    Lang.getValByKey("common", 'common_thead_only_code'),
                    Lang.getValByKey("common", 'common_thead_user_org'),
                    Lang.getValByKey("common", 'common_thead_job'),
                    Lang.getValByKey("common", 'common_thead_phone')
                ],
                tableBody: [],
                restURL: "logistics.userTableUrl",
                searchNameAndIdURL:"logistics.searchByNameAndId",
                restData: {
                    q: '',
                    locked: -1,
                    pageIndex: 1,
                    pageSize: 10,
                },
                seatData:{
                    uid:''
                },
                selectNumber: 0,
                selectFlag: false
            };

            $scope.swichEvent = function(index){
                $('.new-nodes').parent().parent().children('.dd3-content').addClass('active');
                $('.new-nodes').remove();
                if(index == 1){
                    getOrgUsers($scope.userGroup.orgId);
                }else{
                    groupDetail($scope.userGroup.orgId);
                };
            };

            //加载树
            $scope.$on('$viewContentLoaded',function(){
                loadTree();
            });

            function loadTree(){
                $('#tree').nestable({
                    isRoot:false,
                    iconOpen        : 'icon-usergroup-Open',       /** 带加号图标 */
                    iconClose       : 'icon-usergroup-Close',      /** 带减号图标 */
                    iconSeat        : 'icon-usergroup',            /** 无展开图标 */
                    addChildNodes   : function(newId){ addUserGroupEvent(newId); },
                    deleteNodes     : function(orgId, childLength, userArr, deleteNode){ deleteNodesEvent(orgId, childLength, userArr, deleteNode); },
                    childUrl        : Interface.getUrlById("logistics.userTreeChildUrl"),
                    newItemUid      : $('input[name=newOrganizationId]'), /** 保存成功时传入保存成功后的回调函数的id */
                    searchUrl       : Interface.getUrlById("logistics.userSearchTreeUrl"),
                    resetNode       : Interface.getUrlById('logistics.getGroupNode'),
                    searchInput     : $('input[name=organization]'),
                    searchTip       : Lang.getValByKey("usergroup", 'usergroup_tree_search'),
                    searchKeyNodes  : function(uid){ clickUserGroupEvent(uid); getOrgUsers(uid); },
                    clickNode       : function(uid){ clickUserGroupEvent(uid, 'clickNode'); getOrgUsers(uid); },
                    loadFirstNode   : function(uid){ clickUserGroupEvent(uid); },
                    treeScrollHeight: $('.tree-scroll-isAdd-box'),
                    newNodeText     : Lang.getValByKey("usergroup", 'usergroup_nestable_seat_tip'),
                    maxDepthText    : Lang.getValByKey("usergroup", 'usergroup_nestable_add_tip'),
                    callback        : function(param){
                        if(!param){
                            $scope.userGroup.tab.exdisable($scope.userGroup.tab.getIndex());
                        }
                    }
                }).on('change',function(){
                    var preId = $('.moving').prev().length == 0 ? 0 : $('.moving').prev().data('uid');
                    var id = $('.moving').data('uid');
                    var parentId = $('li[data-uid='+id+']').parent().parent('.dd-item').data('uid');
                    parentId = parentId == undefined ? 0 : parentId;

                    submitChangeData(id, parentId, preId);
                });
            };

            $scope.disabledEdit = true;
            $.ajax({
                url:Interface.getUrlById("logistics.userTreeChildUrl")+0,
                type: "GET",
                async: true,
                dataType: "json",
                success: function(response){
                    if(response.errorCode == 0){
                        if(response.data.length == 0){
                            $scope.disabledEdit = true;
                        }else{
                            $scope.disabledEdit = false;
                        }
                    };
                }
            });

            /**** 组织移动事件 **/
            function submitChangeData(id, parentId, preId){

                var config = {
                    seatParams:{
                        userGroupId : id
                    },
                    urlParams: {targetparentid:parentId, targetpreid:preId}
                };

                usergroupService.moveGroup(config, function(response){
                    if (response.errorCode == 0) {
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                    $('input[name="newOrganizationId"]').data('value', id);
                    $('#tree').nestable('resetSearchNode');
                });
            };

            /**** 点击获取组织详情事件 **/
            function clickUserGroupEvent(uid, type){

                $scope.getUid = uid;
                $scope.userGroup.tab.enableAll();

                $('.new-nodes').remove();
                groupDetail(uid, type);
                $scope.$apply();
            };

            /**** 点击获取组织用户详情事件 **/
            function getOrgUsers(uid, type){
                $scope.tableModel.restData.pageSize = 10;
                $scope.tableModel.restData.isIncludeSubOrg = true;
                if(type == 'clickNode'){
                    $scope.tableModel.restData.q = '';
                };

                var params = {
                    'urlParams': $scope.tableModel.restData,
                    'seatParams': {'uid':uid}
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
                        height: $('.content-main').height() - 340
                    });
                };
                $scope.$apply();
            };

            /**** 点击编辑组织详情事件 **/
            $scope.editUserGroup = function(){
                $scope.validateOrgError = false;
                $scope.validateOrgShortError = false;
                $scope.validateCodeError = false;

                $('button[name="userGroupEdit"]').addClass('edit').removeClass('save');

                $scope.userGroup.edit = !$scope.userGroup.edit;
                $scope.userGroup.visible = !$scope.userGroup.visible;
                $scope.userGroup.validate = true;
                $scope.userGroup.validateRequired = true;

                $scope.userGroup.orgNameInfo = $scope.userGroup.orgName;
                $scope.userGroup.orgShortNameInfo = $scope.userGroup.orgShortName;
                $scope.userGroup.orgCodeInfo = $scope.userGroup.orgCode;
                $scope.userGroup.descriptionInfo = $.trim($scope.userGroup.description);

                $scope.textNumber = 140 - $scope.userGroup.descriptionInfo.length;
            };

            /**** 点击取消组织详情事件 **/
            $scope.closeUserGroup = function(){
                $scope.userGroup.tab.enableAll();

                $scope.userGroup.edit = false;
                $scope.userGroup.visible = false;
                $scope.userGroup.validate = false;
                $scope.userGroup.validateRequired = false;

                $('.new-nodes').parent().parent().children('.dd3-content').addClass('active');
                $('.new-nodes').remove();


                var uid = $('#tree .dd3-content.active').parent().data('uid');
                if(uid == undefined){
                    $('.dd-item[data-uid="'+$scope.getUid+'"]').children('.dd3-content').addClass('active');
                    groupDetail($scope.getUid);
                }else{
                    groupDetail(uid);
                };
            };

            function groupDetail(uid){
                usergroupService.getGroupDetail(uid, function(response){
                    if (response.errorCode == 0) {
                        if(response.data != null){
                            $scope.userGroup.edit = false;
                            $scope.userGroup.visible = false;
                            $scope.userGroup.validate = false;
                            $scope.userGroup.validateRequired = false;

                            var data = response.data;

                            $scope.userGroup.getOrgName = data.shortName;
                            $scope.userGroup.parentId = data.parentId;
                            $scope.userGroup.orgId = data.id;
                            $scope.userGroup.orgName = data.name;
                            $scope.userGroup.orgShortName = data.shortName;
                            $scope.userGroup.orgCode = data.code;
                            $scope.userGroup.description = data.description;
                        };
                    };
                })
            };

            /**** 点击保存组织详情事件 **/
            $scope.submitUserGroup = function(){

                if(!$scope.userGroup.orgNameInfo){
                    $scope.userGroup.form.orgNameInfo.$setDirty();
                };
                if(!$scope.userGroup.orgShortNameInfo){
                    $scope.userGroup.form.orgShortNameInfo.$setDirty();
                };
                if(!$scope.userGroup.orgCodeInfo){
                    $scope.userGroup.form.orgCodeInfo.$setDirty();
                };

                if(!$scope.userGroup.form.$valid || $scope.validateOrgError == true || $scope.validateOrgShortError == true || $scope.validateCodeError == true){
                    return;
                };

                var parentId;
                if($('button[name="userGroupEdit"]').hasClass('edit')){
                    parentId = $scope.userGroup.parentId;
                }else{
                    parentId = $scope.userGroup.orgId;
                };

                var data = {
                    parentId : parentId,
                    name : $scope.userGroup.orgNameInfo,
                    shortName : $scope.userGroup.orgShortNameInfo,
                    code : $scope.userGroup.orgCodeInfo,
                    description : $scope.userGroup.descriptionInfo,
                };

                if($('button[name="userGroupEdit"]').hasClass('edit')){
                    var userGroupId = $scope.userGroup.orgId;

                    var config = {
                        seatParams:{
                            userGroupId : userGroupId
                        },
                        urlParams: data
                    };

                    usergroupService.saveEditUserGroup(config, function(response){
                        if(response.errorCode == 0){
                            $scope.disabledEdit = false;
                            $scope.validateOrgError = false;
                            $scope.validateOrgShortError = false;
                            $scope.validateCodeError = false;

                            $scope.userGroup.edit = !$scope.userGroup.edit;
                            $scope.userGroup.visible = !$scope.userGroup.visible;
                            $scope.userGroup.validate = false;
                            $scope.userGroup.validateRequired = false;

                            $('input[name="newOrganizationId"]').data('value', response.data);

                            $('#tree .active').attr("title",data.shortName);
                            $('#tree .active').attr("data-name",data.shortName);
                            $('#tree .active').attr("data-orgname",data.shortName);

                            $('.dd3-content.active .item-text').html(data.shortName);
                            groupDetail(response.data);

                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                        }else {
                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                        };
                    });

                }else{
                    var config = {
                        urlParams : data
                    }
                    usergroupService.saveAddUserGroup(config, function(response){
                        if(response.errorCode == 0){
                            $scope.userGroup.tab.enableAll();
                            $scope.disabledEdit = false;
                            $scope.validateOrgError = false;
                            $scope.validateOrgShortError = false;
                            $scope.validateCodeError = false;

                            $scope.userGroup.edit = !$scope.userGroup.edit;
                            $scope.userGroup.visible = !$scope.userGroup.visible;
                            $scope.userGroup.validate = false;
                            $scope.userGroup.validateRequired = false;

                            groupDetail(response.data);

                            var id = response.data;
                            $scope.getUid = id;
                            usergroupService.getGroupDetail(id, function(response){
                                if (response.errorCode == 0) {
                                    if(response.data != null){
                                        if(response.data.parentId == 0){
                                            $('input[name="newOrganizationId"]').data('value', id);
                                            $('#tree').nestable('resetAllGroup');
                                        }else{
                                            $('input[name="newOrganizationId"]').data('value', id);
                                            $('#tree').nestable('resetGroup');
                                        };
                                    };
                                };
                            })


                            $('button[name="userGroupEdit"]').removeClass('save').addClass('edit');

                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                        }else {
                            $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                        };
                    })

                };


            };

            $scope.addUsers = function(){
                $scope.userGroup.tab.exdisable(0);

                $scope.validateOrgError = false;
                $scope.validateOrgShortError = false;
                $scope.validateCodeError = false;

                if($('.seat-node').length > 0){
                    $('.seat-node').remove();
                };
                $('.new-nodes').remove();
                $('#tree .dd3-content').removeClass('active');
                var seatTxet = Lang.getValByKey("usergroup", 'usergroup_nestable_seat_tip')
                $('#tree').children('ol').after('<li class="seat-node new-nodes dd-item dd3-item"><div class="dd3-content active">'+seatTxet+'</div></li>');

                if($('.new-nodes').offset().top - 40 > $('#tree').height()){
                    $('#tree').scrollTop($('#tree .dd-item').length*40);
                }else{
                    $('#tree').scrollTop(0);
                };

                $('button[name="userGroupEdit"]').addClass('save').removeClass('edit');

                $scope.userGroup.edit = true;
                $scope.userGroup.visible = true;
                $scope.userGroup.validate = true;
                $scope.userGroup.validateRequired = true;

                $scope.userGroup.orgNameInfo = '';
                $scope.userGroup.orgShortNameInfo = '';
                $scope.userGroup.orgCodeInfo = '';
                $scope.userGroup.descriptionInfo = '';

                $scope.userGroup.orgId = 0 ;

                $scope.textNumber = 140;

                //清除angular表单脏值检测
                $scope.userGroup.form.$setPristine();
                $scope.userGroup.form.$setUntouched();
            };

            /**** 点击新增组织事件 **/
            function addUserGroupEvent(newId){
                $scope.userGroup.tab.exdisable(0);

                $scope.validateOrgError = false;
                $scope.validateOrgShortError = false;
                $scope.validateCodeError = false;

                $('button[name="userGroupEdit"]').addClass('save').removeClass('edit');

                $scope.userGroup.edit = true;
                $scope.userGroup.visible = true;
                $scope.userGroup.validate = true;
                $scope.userGroup.validateRequired = true;

                $scope.userGroup.orgNameInfo = '';
                $scope.userGroup.orgShortNameInfo = '';
                $scope.userGroup.orgCodeInfo = '';
                $scope.userGroup.descriptionInfo = '';

                $scope.userGroup.orgId = newId;

                $scope.textNumber = 140;

                //清除angular表单脏值检测
                $scope.userGroup.form.$setPristine();
                $scope.userGroup.form.$setUntouched();
                $scope.$apply();
            };

            function deleteNodesEvent(orgId, childLength, userArr, deleteNode){
                clickUserGroupEvent(orgId, 'clickNode');
                getOrgUsers(orgId);

                $scope.userGroup.tab.enableAll();
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("usergroup", 'usergroup_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function () {
                                submitDeleteaNodes(orgId, deleteNode);
                                $scope.$apply();
                            }
                        }
                    ]
                });
            };

            function submitDeleteaNodes(orgId, deleteNode){

                usergroupService.deleteUserGroup(orgId, function(response){
                    if(response.errorCode == 0){
                        $(document).promptBox('closePrompt');
                        loadTree();

                        if($('#tree .dd-item').length == 1){
                            $scope.disabledEdit = true;
                            $scope.userGroup.orgName = '';
                            $scope.userGroup.orgShortName = '';
                            $scope.userGroup.orgCode = '';
                            $scope.userGroup.description = '';
                        };

                        var delId = $('.dd-item[data-uid='+response.data+']').parent().parent().data('uid');
                        $('input[name="newOrganizationId"]').data('value', delId);

                        if(delId == undefined){
                            $('#tree').nestable('resetTreeGroup');
                        }else{
                            $('#tree').nestable('resetDeleteGroup');
                        };

                        $('li[data-uid="'+orgId+'"]').remove();

                        $scope.userGroup.orgNameInfo = '';
                        $scope.userGroup.orgShortNameInfo = '';
                        $scope.userGroup.orgCodeInfo = '';
                        $scope.userGroup.descriptionInfo = '';

                        $scope.userGroup.orgName = '';
                        $scope.userGroup.orgShortName = '';
                        $scope.userGroup.orgCode = '';
                        $scope.userGroup.description = '';

                        $scope.userGroup.orgId = '';
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});

                        //TODO  选中详情 用户列表不让点击 怎么破

                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };


            /**** 新增用户组用户 **/
            $scope.addGroupUser = function(){
                allSelectedUserData = [];
                function loadData(){
                    $scope.userGroup.moveUser.unSelectValue = '';
                    $scope.userGroup.moveUser.selectValue = '';
                    //加载已选择用户
                    $scope.tableModel.restData.isIncludeSubOrg = false;
                    getAddOrgUsers($scope.userGroup.orgId, 'selected');

                    if($('#selectGroup').length == 1){
                        $('#selectGroup').remove();
                        if($('#userGroup .slimScrollDiv').length > 0){
                            $('#userGroup .panel').first().find('.slimScrollDiv').remove();
                        };
                        $('#userGroup .panel').first().append('<div id="selectGroup"></div>');
                    };

                    $('#selectGroup').nestable({
                        iconOpen        : 'icon-organization-Open',       /** 带加号图标 */
                        iconClose       : 'icon-organization-Close',      /** 带减号图标 */
                        iconSeat        : 'icon-organization',            /** 无展开图标 */
                        isMove          :  true,
                        isOperate       :  true,
                        isRoot          :  true,
                        childUrl        :  Interface.getUrlById("logistics.treeChildUrl"),
                        searchUrl       :  Interface.getUrlById("logistics.searchTreeUrl"),
                        searchInput     :  $('input[name=userOrganization]'),
                        searchTip       :  Lang.getValByKey("usergroup", 'usergroup_tree_search'),
                        searchKeyNodes  :  function(uid){ getSelectAddOrgUsers(uid); },
                        clickNode       :  function(uid){ getSelectAddOrgUsers(uid); },
                        loadFirstNode   :  function(uid){ getSelectAddOrgUsers(uid); },
                        treeScrollHeight:$('.select-tree-box')
                    });

                    function getSelectAddOrgUsers(uid) {
                        $scope.tableModel.restData.isIncludeSubOrg = true;
                        $scope.tableModel.restData.pageSize = 10000;
                        $scope.userGroup.selectOrgId = uid;

                        var params = {
                            'urlParams': $scope.tableModel.restData,
                            'seatParams': {'uid' : $scope.userGroup.orgId}
                        };

                        tableService.getTable($scope.tableModel.restURL, params, function(res){
                            if(res.errorCode === 0){
                                $scope.userGroup.moveUser.unchecked = false;
                                $scope.userGroup.moveUser.uncheckedAll = false;
                                $scope.userGroup.moveUser.checked = false;
                                $scope.userGroup.moveUser.checkedAll = false;

                                var newData = [],arr = [];
                                var activeIds = $('.selected input');
                                activeIds.each(function(i){
                                    arr[i] = {};
                                    arr[i].userId = activeIds.eq(i).data('userid');
                                    arr[i].fullName = activeIds.eq(i).data('name');
                                    newData.push(arr[i]);
                                });

                                var length;
                                if(newData.length != 0){
                                    for(var i in newData){
                                        if(res.data.length != 0){
                                            for(var j in res.data){
                                                if(i == j){
                                                    if(res.data[i].userId != newData[i].userId){
                                                        length = true;

                                                    }
                                                }
                                            }
                                        }else{
                                            length = true;
                                        }
                                    }
                                }else{
                                    if(res.data.length != 0){
                                        length = true;
                                    }
                                }
                                if(length){
                                    getAddOrgUsers(uid, 'unselected', newData);
                                }else{
                                    getAddOrgUsers(uid, 'unselected', res.data);
                                };
                            }
                        });

                        $scope.$apply();
                    };

                };

                $(document).promptBox({
                    title: Lang.getValByKey("usergroup", 'usergroup_prompt_add_text_first')
                    +'<span style="color: #42b0d8;">'+ $scope.userGroup.getOrgName +'</span>'
                    +Lang.getValByKey("usergroup", 'usergroup_prompt_add_text_last'),
                    isHidden:true,
                    boxWidth:true,
                    isNest:true,
                    loadData : function(){
                        loadData();
                    },
                    loadTitle: function(){
                        return $scope.userGroup.getOrgName;
                    },
                    content: {
                        nest: $('#userGroup'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_prompt_confirm'),
                            operationEvent: function(){
                                var arr = [];
                                var ids = $('.selected input');
                                ids.each(function(i){
                                    if(ids.eq(i).data('userid') != null){
                                        arr.push(ids.eq(i).data('userid'));
                                    };
                                });

                                var config = {
                                    seatParams:{
                                        userGroupId : $scope.userGroup.orgId
                                    },
                                    urlParams: arr
                                };
                                usergroupService.addTableUser(config, function(response){
                                    if (response.errorCode == 0){
                                        var id = $scope.getUid;
                                        $('input[name="newOrganizationId"]').data('value', id);
                                        $('#tree').nestable('resetSearchNode');

                                        //getOrgUsers($scope.userGroup.orgId);
                                        $(document).promptBox('closeFormPrompt');
                                        $scope.tableModel.restData.q = '';

                                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                                    }else{
                                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            function getAddOrgUsers(uid, type, data){
                $scope.tableModel.restData.pageSize = 10000;
                $scope.userGroup.selectOrgId = uid;

                var params = {
                    'urlParams': $scope.tableModel.restData,
                    'seatParams': {'uid' : uid}
                };

                tableService.getTable($scope.tableModel.searchNameAndIdURL, params, function(res){
                    if(res.errorCode === 0){
                        var resData = res.data;
                        if(type == 'unselected'){
                            if(data != undefined){
                                if(data == 'all'){
                                    for(var j in resData){
                                        resData[j].checked = true;
                                    };
                                    $scope.userGroup.tableUserGroup = resData;
                                }else{
                                    for(var j in resData){
                                        for(var i in data){
                                            if(data[i].userId == resData[j].userId){
                                                resData[j].checked = true;
                                                resData[j].disabled = true;
                                            };
                                        };
                                    };
                                    $scope.userGroup.tableUserGroup = resData;
                                };
                            }else {
                                $scope.userGroup.tableUserGroup = resData;
                            };
                        }else{
                            $scope.userGroup.selectedUserGroup = resData;
                            for(var  i in resData){
                                allSelectedUserData.push(resData[i]);
                            };
                        };
                    }
                });

                setScrollGroup();
                $(window).on("resize",setScrollGroup);

                function setScrollGroup(){
                    $('.selected-user').slimscroll({
                        height: window.innerHeight - 250
                    });
                };

            };

            var allSelectedUserData = [];
            /**** 向已选区移入待选区用户 **/
            $scope.addUnselected = function(){

                var arrData = [],arr = [];
                var ids = $('.unselect input[checked="checked"]');
                ids.each(function(i){
                    arr[i] = {};
                    if(!ids.eq(i).is(':disabled')){
                        arr[i].userId = ids.eq(i).data('userid');
                        arr[i].fullName = ids.eq(i).data('name');
                        ids.eq(i).attr('checked', true);
                        ids.eq(i).attr('disabled', true);
                        ids.eq(i).parent().parent().find('i').addClass('icon-disabled');
                        ids.eq(i).parent().parent().addClass('icon-disabled');
                        arrData.push(arr[i])
                        allSelectedUserData.push(arr[i]);
                    };
                });

                var Arr = [];
                var Ids = $('.selected input');
                Ids.each(function(i){
                    Arr[i] = {};
                    Arr[i].userId = Ids.eq(i).data('userid');
                    Arr[i].fullName = Ids.eq(i).data('name');
                    Ids.eq(i).attr('checked', false);
                });

                var data = arrData.concat(Arr);

                $scope.userGroup.selectedUserGroup = data;

            };

            /**** 取消已选区用户 **/
            $scope.cancelSelected = function(){

                //待选区
                var Arr = [];
                var Ids = $('.unselect input');
                Ids.each(function(i){
                    Arr[i] = {};
                    Arr[i].userId = Ids.eq(i).data('userid');
                    Arr[i].fullName = Ids.eq(i).data('name');
                });

                //已选区已选id
                var arr = [];
                var activeIds = $('.selected input[checked="checked"]');
                activeIds.each(function(i){
                    arr[i] = {};
                    arr[i].userId = activeIds.eq(i).data('userid');
                    arr[i].fullName = activeIds.eq(i).data('name');
                    activeIds.eq(i).parent().parent().remove();
                    allSelectedUserData.removeByValue(arr[i].userId, 'userId');
                });

                var newData = [];
                for(var i in arr){
                    for(var j in Arr){
                        if(arr[i].userId == Arr[j].userId){
                            newData.push(Arr[j]);
                        }
                    }
                }

                //待选区去掉勾选
                var unIds = $('.unselect input[checked="checked"]');
                unIds.each(function(i){
                    for(var j in newData){
                        if(newData[j].userId == unIds.eq(i).data('userid')){
                            unIds.eq(i).removeAttr('checked');
                            unIds.eq(i).removeAttr('disabled');
                            unIds.eq(i).parent().parent().find('i').removeClass('icon-disabled');
                            unIds.eq(i).parent().parent().removeClass('icon-disabled');
                        }
                    }

                });

            };

            Array.prototype.removeByValue = function(val, type) {
                for(var i=0; i<this.length; i++) {
                    if(this[i][type] == val) {
                        this.splice(i, 1);
                        break;
                    }
                }
            }


            /**** 单个选择待选区用户 **/
            $scope.getUnselect = function($event){
                if(!$($event.target).is(':checked')){
                    $($event.target).attr('checked',false);
                    $scope.userGroup.moveUser.uncheckedAll = false;
                }else{
                    $($event.target).attr('checked', 'checked');
                };
            };

            /**** 单个选择取消已选区用户 **/
            $scope.getSelected = function($event){
                if(!$($event.target).is(':checked')){
                    $($event.target).attr('checked',false);
                    $scope.userGroup.moveUser.checkedAll = false;
                }else{
                    $($event.target).attr('checked', 'checked');
                };
            };

            /**** 待选区全选事件 **/
            $scope.unSelectAll = function(){
                var arr = [];
                var ids = $('.selected input');
                ids.each(function(i){
                    arr[i] = {};
                    arr[i].userId = ids.eq(i).data('userid');
                    arr[i].fullName = ids.eq(i).data('name');
                });

                if($scope.userGroup.moveUser.uncheckedAll == true){
                    $scope.userGroup.moveUser.unchecked = false;
                    $scope.userGroup.moveUser.uncheckedAll = false;
                }else{
                    $scope.userGroup.moveUser.unchecked = true;
                    $scope.userGroup.moveUser.uncheckedAll = true;
                };
            };

            /**** 已选区全选 **/
            $scope.selectedAll = function(){
                if($scope.userGroup.moveUser.checkedAll == true){
                    $scope.userGroup.moveUser.checked = false;
                    $scope.userGroup.moveUser.checkedAll = false;
                }else{
                    $scope.userGroup.moveUser.checked = true;
                    $scope.userGroup.moveUser.checkedAll = true;
                };
            };

            /**** 检索待选用户 **/
            $scope.searchUnSelectUser = function(){
                $scope.tableModel.restData.q = $scope.userGroup.moveUser.unSelectValue;
                $scope.tableModel.restData.pageSize = 10000;

                var params = {
                    'urlParams': $scope.tableModel.restData,
                    'seatParams': {'uid' : $scope.userGroup.orgId}
                };

                tableService.getTable($scope.tableModel.searchNameAndIdURL, params, function(res){
                    if(res.errorCode === 0){
                        //
                        $scope.userGroup.moveUser.unchecked = false;
                        $scope.userGroup.moveUser.uncheckedAll = false;
                        $scope.userGroup.moveUser.checked = false;
                        $scope.userGroup.moveUser.checkedAll = false;
                        getAddOrgUsers($scope.userGroup.selectOrgId, 'unselected', res.data);
                        $scope.tableModel.restData.q = '';
                    }
                });
            };

            /**** 检索已选用户 **/
            $scope.searchSelectedUser = function(){

                var arrData = [],arr = [];
                var ids = $('.selected');
                ids.each(function(i){
                    arr[i] = {};
                    if($.trim(ids.find('span').eq(i).text()).indexOf($.trim($scope.userGroup.moveUser.selectValue)) != -1){
                        arr[i].userId = ids.find('input').eq(i).data('userid');
                        arr[i].fullName = ids.find('input').eq(i).data('name');
                        arrData.push(arr[i]);
                    }
                });

                if($scope.userGroup.moveUser.selectValue.length){
                    $scope.userGroup.selectedUserGroup = arrData;
                }else{
                    var data =[];
                    for(var i in allSelectedUserData){
                        if(typeof(allSelectedUserData[i]) != 'function'){
                            data.push(allSelectedUserData[i]);
                        }
                    }
                    $scope.userGroup.selectedUserGroup = data;
                };

            };

            /**** 移除用户组用户 **/
            $scope.deleteGroupUser = function(){
                if($scope.tableModel.selectNumber != 0){
                    var arr = [];
                    var selectedTrs = $('.user-table tbody input[checked="checked"]').parents("tr");
                    selectedTrs.each(function(i,tr){
                        var obj = {}
                        obj.userId=$(tr).data("id");
                        obj.orgId=$(tr).data("orgid");
                        arr.push(obj);
                    });

                    $(document).promptBox({
                        title: Lang.getValByKey("common", 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey("usergroup", 'usergroup_prompt_remove_tip')
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey("common", 'common_prompt_remove'),
                                application : 'delete',
                                operationEvent: function () {
                                    submitDeleteUser(arr);
                                }
                            }
                        ]
                    });
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_prompt_delay_tip'), type: 'errer', manualClose:true});
                };
            };

            function submitDeleteUser(arr){
                var config = {
                    seatParams:{},
                    urlParams: arr
                };
                usergroupService.deleteTableUser(config, function(response){
                    if (response.errorCode == 0){

                        var id = $scope.getUid;
                        $('input[name="newOrganizationId"]').data('value', id);
                        $('#tree').nestable('resetSearchNode');

                        $scope.tableModel.restData.isIncludeSubOrg = true;
                        getOrgUsers($scope.userGroup.orgId);
                        $(document).promptBox('closePrompt');
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    }
                });
            };

            /**** 检索用户 */
            $scope.retrievalUser = function(){
                $scope.q = $scope.tableModel.restData.q;
                $scope.tableModel.restData.isIncludeSubOrg = true;
                $scope.tableModel.restData.pageIndex = 1;

                var params = {
                    'urlParams': $scope.tableModel.restData,
                    'seatParams': {'uid' : $scope.userGroup.orgId}
                };

                tableService.getTable($scope.tableModel.restURL, params, function(data){
                    if(data.errorCode === 0){
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    }
                });

            };

            $scope.focusOrgName = function(){
                $scope.validateOrgError = false;
            };

            /**** 名称唯一 */
            $scope.validateOrgName = function(){
                var name = $scope.userGroup.orgNameInfo || '', parentId, orgId;
                if(!name) return;
                if($('.new-nodes').length == 0){
                    orgId = $scope.userGroup.orgId;
                    parentId = $scope.userGroup.parentId || 0;
                }else{
                    orgId = '';
                    parentId = $scope.userGroup.orgId;
                };

                var config = {
                    urlParams:{
                        name: name,
                        parentId: parentId,
                        userGroupId: orgId
                    }
                };

                usergroupService.validateUserGroupName(config, function(response){
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
                var shortName = $scope.userGroup.orgShortNameInfo || '', parentId, orgId;
                if(!shortName) return;
                if($('.new-nodes').length == 0){
                    orgId = $scope.userGroup.orgId;
                    parentId = $scope.userGroup.parentId || 0;
                }else{
                    orgId = '';
                    parentId = $scope.userGroup.orgId;
                };

                var config = {
                    urlParams:{
                        shortName: shortName,
                        parentId: parentId,
                        userGroupId: orgId
                    }
                };
                usergroupService.validateUserGroupShortName(config, function(response){
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
                var code = $scope.userGroup.orgCodeInfo, orgId;
                if(!code) return;
                if($('.new-nodes').length == 0){
                    orgId = $scope.userGroup.orgId;
                }else{
                    orgId = '';
                };

                var config = {
                    urlParams:{
                        code: code,
                        userGroupId: orgId
                    }
                };
                usergroupService.validateUserGroupCode(config, function(response){
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
                $scope.textNumber = 140 - $scope.userGroup.descriptionInfo.length;
            };
            $scope.visibleTextNumber = function(){
                $scope.textCountVisible = true;
            };
            $scope.hiddenTextNumber = function(){
                $scope.textCountVisible = false;
            };
            $scope.userGroup.tab = usergroupView.tab('#m-tab', $scope.swichEvent);
        }]);
});

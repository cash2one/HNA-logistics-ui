easySpa.require([
    'widget/slimscroll',
    'widget/nestable',
    'widget/prompt',
    'widget/tabTabs',
    'widget/select',
    'public/common/tableController.js'
],function(){
    app.controller('userCtrl', ['$scope', 'userService', 'userView', 'tableService', function($scope, userService, userView, tableService) {
        $scope.tableModel = {
            more: false,
            userWord: '',
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("common", 'common_thead_full_name'),
                Lang.getValByKey("common", 'common_thead_only_code'),
                Lang.getValByKey("common", 'common_thead_department'),
                Lang.getValByKey("common", 'common_thead_job'),
                Lang.getValByKey("common", 'common_thead_phone')
            ],
            tableBody: [],
            restURL: 'logistics.userTableUrl',
            restData: {
                q: '',
                locked: -1,
                pageIndex: 1,
                pageSize: 10,
            },
            selectNumber: 0,
            selectFlag: false
        };
        userShowTree();
        function userShowTree(){
            $('#tree').nestable({
                iconOpen        : 'icon-organization-Open',       /** 带加号图标 */
                iconClose       : 'icon-organization-Close',      /** 带减号图标 */
                iconSeat        : 'icon-organization',            /** 无展开图标 */
                isMove          :  true,
                isOperate       :  true,
                isRoot          :  true,
                userCount       :  '',
                childUrl        :  Interface.getUrlById("logistics.treeChildUrl"),
                searchUrl       :  Interface.getUrlById("logistics.searchTreeUrl"),
                searchInput     :  $('input[name=organization]'),
                searchKeyNodes  :  function(uid){ getOrgUsers(uid); },
                searchTip       :  Lang.getValByKey("user", 'user_tree_search'),
                clickNode       :  function(uid){ getOrgUsers(uid, 'clickNode'); },
                loadFirstNode   :  function(uid){ getOrgUsers(uid); },
                collapseAllNode :  function(uid){ getOrgUsers(uid); },
                treeScrollHeight:$('.tree-scroll-box')
            });
        };

        function getOrgUsers(uid, type){
            $scope.undefinedShow = false;
            $scope.userOrgId = uid;

            var lock = $('input[name="LockUser"]');
            //$scope.LockChecked = false;
            lock.removeClass('active').removeAttr('checked');
            if(lock.hasClass('active')){
                setScrollOpen();
                $(window).on("resize",setScrollOpen);
            }else{
                setScrollClose();
                $(window).on("resize",setScrollClose);
            };
            $scope.tableModel.restData.locked = -1;
            if(type == 'clickNode'){
                $scope.retrievalUser(type);
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
            $scope.$apply();
        };

        function setScrollOpen(){
            $('.table-container tbody').slimscroll({
                height: $('.content-main').height() - 300
            });
        };
        function setScrollClose(){
            $('.table-container tbody').slimscroll({
                height: $('.content-main').height() - 270
            });
        };

        /**** 切换到新增用户面板 */
        $scope.addUser = function(){
            $scope.isSave = true;
            $scope.validateUserCodeError = false;
            $scope.validateEmailError = false;

            $scope.defaultSet = 'null';
            $scope.male = false;
            $scope.female = false;

            $scope.main = !$scope.main;
            $scope.positionInfo = '';

            $scope.editDetail = false;
            $scope.editHide = false;
            $scope.validate = true;
            $scope.validateRequired = false;
            $scope.visible = true;
            $scope.closeEditDetail = false;

            $scope.fullNameInfo = '';
            $scope.codeInfo = '';
            $scope.orgNameInfo = $('#tree .dd3-content.active').text();
            $scope.mobilephoneInfo = '';
            $scope.telephoneInfo = '';
            $scope.emailInfo = '';
            $scope.descriptionInfo = '';
            $scope.avatarPath = '/public/img/avatar2.png';
            $scope.avatarUpdateFile = {};

            $scope.avatarId = '';

            $scope.textNumber = 140;

            //新建去掉工号不可修改
            $scope.codeDisabled = false;
            $('input[name="orgNameInfo"]').attr('disabled', true);
            $('button[name="saveOrEdit"]').removeClass('edit').addClass('save');

            //清除angular表单脏值检测
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        };

        /**** 切换到table面板 */
        $scope.backMainContet = function(){
            if($scope.visible){
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
                                $scope.validate = false;
                                $scope.validateRequired = false;
                                $scope.isPristine = false;
                                $scope.main = !$scope.main;
                                $scope.visible = !$scope.visible;

                                var uid = 0 || $('.dd3-content.active').parent().data('uid');

                                var lock = $('input[name="LockUser"]');
                                lock.removeClass('active').removeAttr('checked');

                                $('#tree').nestable('resetTreeGroup');
                                $(document).promptBox('closePrompt');
                                $scope.$apply();
                            }
                        }
                    ]
                })
            }else{
                $scope.validate = false;
                $scope.validateRequired = false;
                $scope.isPristine = false;
                $scope.main = !$scope.main;
                $scope.visible = !$scope.visible;
                var uid = 0 || $('.dd3-content.active').parent().data('uid');
                var lock = $('input[name="LockUser"]');
                lock.removeClass('active').removeAttr('checked');
                $('#tree').nestable('resetTreeGroup');
            }
        };

        /**** 修改移动上级部门 */
        $scope.moveUserGroup = function(){

            function loadDataEdit(){
                if($('#userSelectGroup').length == 1){
                    $('#userSelectGroup').remove();
                    if($('#userSelectGroupBox .slimScrollDiv').length > 0){
                        $('#userSelectGroupBox').find('.slimScrollDiv').remove();
                    };
                    $('#userSelectGroupBox').append('<div id="userSelectGroup"></div>');
                };

                $('#userSelectGroup').nestable({
                    iconOpen        : 'icon-organization-Open',       /** 带加号图标 */
                    iconClose       : 'icon-organization-Close',      /** 带减号图标 */
                    iconSeat        : 'icon-organization',            /** 无展开图标 */
                    userCount       : '',
                    isMove          : true,
                    isOperate       : true,
                    isRoot          : true,
                    childUrl        : Interface.getUrlById("logistics.treeChildUrl"),
                    isSearch        : false,
                    treeScrollHeight: $('#userSelectGroupBox.user-prompt-box')
                });
            };

            $(document).promptBox({
                title: Lang.getValByKey("user", 'user_prompt_move_tip'),
                isHidden:true,
                isNest:true,
                loadData : function(){
                    loadDataEdit();
                },
                content: {
                    nest: $('#userSelectGroupBox')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_prompt_confirm'),
                        operationEvent: function () {
                            $('input[name=orgNameInfo]').val($('#userSelectGroup .dd3-content.active').data('orgname'));
                            $scope.orgNameInfo = $('#userSelectGroup .dd3-content.active').data('orgname');
                            $scope.orgName = $('#userSelectGroup .dd3-content.active').data('orgname');
                            $scope.orgId = $('#userSelectGroup .dd3-content.active').parent().data('uid');
                            $(document).promptBox('closeFormPrompt');
                            userShowTree();
                        }
                    }
                ]
            });
        };

        $scope.showCarrerList = function() {
            var userEle = selectFactory({
                url: Interface.getUrlById("logistics.getPositionsData"),
                maxHeight: 340,
                minHeight: 34,
                offset: 4,
                id: "carrer-input-text",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    $scope.positionCode = code;
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.positionInfo = name;
                    $scope.$apply();
                }
            });
            userEle.open();
        };

        /**** 获取性别 */
        $scope.getMaleSexInfo = function(){
            $scope.male = 'm';
            $scope.female = false;
            $scope.defaultSet = false;
            $scope.sexInfo = 'm';
        };
        $scope.getFemaleSexInfo = function(){
            $scope.male = false;
            $scope.female = 'f';
            $scope.defaultSet = false;
            $scope.sexInfo = 'f';
        };
        $scope.getDefaultSexInfo = function(){
            $scope.male = false;
            $scope.female = false;
            $scope.defaultSet = 'null';
            $scope.sexInfo = 'null';
        };

        /**** 保存新增或修改 */
        $scope.saveUser = function($event){

            if(!$scope.fullNameInfo){
                $scope.form.fullNameInfo.$setDirty();
            };
            if(!$scope.codeInfo){
                $scope.form.codeInfo.$setDirty();
            };
            if(!$scope.orgNameInfo){
                $scope.form.orgNameInfo.$setDirty();
            };
            if(!$scope.positionInfo){
                $scope.form.positionInfo.$setDirty();
            };
            if(!$scope.mobilephoneInfo){
                $scope.form.mobilephoneInfo.$setDirty();
            };
            if(!$scope.telephoneInfo){
                $scope.form.telephoneInfo.$setDirty();
            };
            if(!$scope.emailInfo){
                $scope.form.emailInfo.$setDirty();
            };

            if($scope.sexInfo == undefined){
                $scope.sexInfo = 0;
            }else if($scope.sexInfo == 'null'){
                $scope.sexInfo = 0;
            }else{
                $scope.sexInfo
            };

            if($scope.validateUserCodeError == true || $scope.validateEmailError == true){
                $scope.form.$valid = false;
            };

            var orgId;

            if($($event.target).hasClass('save')){
                orgId = 0 || $('#tree .dd3-content.active').parent().data('uid');

                var saveData = $.extend({},
                    {fullName: $scope.fullNameInfo},
                    {code: $scope.codeInfo},
                    {sex: $scope.sexInfo},
                    {orgId: orgId},
                    {positionCode: $scope.positionCode},
                    {mobilephone: $scope.mobilephoneInfo},
                    {telephone: $scope.telephoneInfo},
                    {email: $scope.emailInfo},
                    {description: $scope.descriptionInfo},
                    {avatarId: $scope.avatarId}
                );

                if($scope.form.$valid){
                    submitSaveForm(saveData);
                };

            }else if($($event.target).hasClass('edit')){
                var userId = $scope.id;
                orgId = $scope.orgId;

                var editData = $.extend({},
                    {fullName: $scope.fullNameInfo},
                    {code: $scope.codeInfo},
                    {sex: $scope.sexInfo},
                    {orgId: orgId},
                    {positionCode: $scope.positionCode},
                    {mobilephone: $scope.mobilephoneInfo},
                    {telephone: $scope.telephoneInfo},
                    {email: $scope.emailInfo},
                    {description: $scope.descriptionInfo},
                    {avatarId: $scope.avatarId}
                );

                if($scope.form.$valid){
                    submitEditForm(userId, editData);
                };
            };

            function submitSaveForm(saveData){
                var config = {urlParams: saveData};

                userService.userSave(config, function(response){
                    if(response.errorCode == 0){
                        userService.getUserDetail({seatParams : {userId : response.data}}, function(response){
                            if(response.errorCode == 0){
                                $scope.validateUserCodeError = false;
                                $scope.validateEmailError = false;

                                var arr = [];
                                var repdata = response.data;
                                repdata.userId = repdata.id;
                                repdata.userCode = repdata.code;
                                repdata.positionName = $scope.positionInfo;
                                arr.push(repdata);

                                var lock = $('input[name="LockUser"]');
                                //$scope.LockChecked = false;
                                lock.removeClass('active').removeAttr('checked');

                                $scope.tableModel.restData.locked = -1;
                                var params = {
                                    'urlParams': $scope.tableModel.restData,
                                    'seatParams': {'uid':$('#tree .dd3-content.active').parent().data('uid')}
                                };

                                tableService.getTable($scope.tableModel.restURL, params, function(response){
                                    if(response.errorCode === 0){
                                        var data = response.data;

                                        for(var i in data){
                                            if(data[i]['userId'] != arr[0]['userId']){
                                                arr.push(data[i]);
                                            };
                                        };
                                        response.data = arr
                                        $scope.tableModel = tableService.table($scope.tableModel, params, response);

                                        $scope.main = !$scope.main;
                                        $scope.validate = false;
                                        $scope.validateRequired = false;
                                        $scope.visible = !$scope.visible;
                                    }
                                });

                                $scope.main = false;
                                $('#tree').nestable('resetTreeGroup');

                            }else{
                                $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                            };
                        });
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };

            function submitEditForm(userId, editData){
                var config = {
                    seatParams : {userId: userId},
                    urlParams: editData};

                userService.editSave(config, function(response){
                    if(response.errorCode == 0){
                        userService.getUserDetail({seatParams : {userId : response.data}}, function(response){
                            if(response.errorCode == 0){
                                $scope.validateUserCodeError = false;
                                $scope.validateEmailError = false;

                                getUserDetailFun($scope.currentUserId, 'edit');

                            }else{
                                $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                            };
                        });
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };

        };

        /**** 保存并新增下一个 */
        $scope.saveAndNewUser = function(){

            if(!$scope.fullNameInfo){
                $scope.form.fullNameInfo.$setDirty();
            };
            if(!$scope.codeInfo){
                $scope.form.codeInfo.$setDirty();
            };
            if(!$scope.orgNameInfo){
                $scope.form.orgNameInfo.$setDirty();
            };
            if(!$scope.positionInfo){
                $scope.form.positionInfo.$setDirty();
            };
            if(!$scope.mobilephoneInfo){
                $scope.form.mobilephoneInfo.$setDirty();
            };
            if(!$scope.telephoneInfo){
                $scope.form.telephoneInfo.$setDirty();
            };
            if(!$scope.emailInfo){
                $scope.form.emailInfo.$setDirty();
            };

            if($scope.sexInfo == undefined){
                $scope.sexInfo = 0;
            }else if($scope.sexInfo == 'null'){
                $scope.sexInfo = 0;
            }else{
                $scope.sexInfo
            };

            var saveData = $.extend({},
                {fullName: $scope.fullNameInfo},
                {code: $scope.codeInfo},
                {sex: $scope.sexInfo},
                {orgId: $scope.userOrgId},
                {positionCode: $scope.positionCode},
                {mobilephone: $scope.mobilephoneInfo},
                {telephone: $scope.telephoneInfo},
                {email: $scope.emailInfo},
                {description: $scope.descriptionInfo},
                {avatarId: $scope.avatarId}
            );


            if($scope.validateUserCodeError == true || $scope.validateEmailError == true){
                $scope.form.$valid = false;
            };

            var config = {urlParams:saveData};

            if($scope.form.$valid){
                userService.userSave(config, function(response){
                    if(response.errorCode == 0){
                        userService.getUserDetail({seatParams : {userId : response.data}}, function(response){
                            if(response.errorCode == 0){
                                $scope.validateUserCodeError = false;
                                $scope.validateEmailError = false;

                                $scope.male = 'm';
                                $scope.female = false;
                                $scope.defaultSet = false;

                                $scope.positionInfo = '';
                                $scope.fullNameInfo = '';
                                $scope.codeInfo = '';
                                $scope.mobilephoneInfo = '';
                                $scope.telephoneInfo = '';
                                $scope.emailInfo = '';
                                $scope.descriptionInfo = '';

                                $scope.avatarPath = '/public/img/avatar2.png';
                                $scope.avatarUpdateFile = {};
                                $scope.avatarFile = {};
                                $scope.avatarId = '';

                                //清除angular表单脏值检测
                                $scope.form.$setPristine();
                                $scope.form.$setUntouched();
                            };
                        });
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });

            };
        };

        /**** 获取用户详情 */
        $scope.getUserDetails = function($event){
            var id;
            if($($event.target).context.localName == 'span'){
                id = $($event.target).parent().parent().parent().data('id');
            }else{
                id = $($event.target).parent().parent().data('id');
            };
            $scope.currentUserId = id;
            $scope.isSave = false;
            getUserDetailFun(id);

            //清除angular表单脏值检测
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        };

        function getUserDetailFun(id, type){
            userService.getUserDetail({seatParams : {userId : id}}, function(response){
                if(response.errorCode == 0){
                    var value = response.data;

                    if(type == 'edit'){
                        $scope.main = true;
                        $scope.editDetail = true;
                        $scope.editHide = true;
                        $scope.visible = false;
                        $scope.validate = false;
                        $scope.validateRequired = false;
                        $scope.closeEditDetail = false;
                    }else{
                        $scope.main = true;
                        $scope.editDetail = true;
                        $scope.editHide = true;
                        $scope.visible = false;
                        $scope.validate = true;
                        $scope.validateRequired = false;
                        $scope.closeEditDetail = false;
                    };

                    $scope.id = value.id;
                    $scope.fullName = value.fullName;
                    $scope.code = value.code;

                    userService.getPositionsData(function(response){
                        $scope.positions = response.data;
                        $scope.position = false;
                        for(var i in response.data){
                            if(value.positionCode == response.data[i]['code']){
                                $scope.positionName = response.data[i]['name'];
                            };
                        };
                    });

                    $scope.orgName = value.orgName;
                    $scope.orgId = value.orgId;
                    $scope.positionCode = value.positionCode;
                    $scope.mobilephone = value.mobilephone;
                    $scope.telephone = value.telephone;
                    $scope.email = value.email;
                    $scope.description = value.description;
                    $scope.avatarPath = value.avatarPath?value.avatarPath:'/public/img/avatar2.png';
                    $scope.avatarFile = {};
                    $scope.avatarId = value.avatarId;
                    var sex = '';
                    if(value.sex == 'm'){
                        sex = Lang.getValByKey("user", 'user_radio_man');
                        $scope.sexInfo = 'm';
                    }else if(value.sex == 'f'){
                        sex = Lang.getValByKey("user", 'user_radio_woman');
                        $scope.sexInfo = 'f';
                    }else if(value.sex == 0){
                        sex = Lang.getValByKey("user", 'user_radio_no');
                        $scope.sexInfo = 'null';
                    };

                    $scope.sex = sex;

                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                };
            });
        };

        /**** 修改用户详情 */
        $scope.editUser = function(){
            $scope.validateUserCodeError = false;
            $scope.validateEmailError = false;

            if($scope.sexInfo == 'm'){
                $scope.male = 'm';
                $scope.female = false;
                $scope.defaultSet = false;
            }else if($scope.sexInfo == 'f'){
                $scope.male = false;
                $scope.female = 'f';
                $scope.defaultSet = false;
            }else if($scope.sexInfo == 'null'){
                $scope.male = false;
                $scope.female = false;
                $scope.defaultSet = 'null';
            };

            $scope.editDetail = !$scope.editDetail;
            $scope.visible = !$scope.visible;
            $scope.validate = true;
            $scope.validateRequired = false;
            $scope.closeEditDetail = true;

            $scope.fullNameInfo = $scope.fullName;
            $scope.codeInfo = $scope.code;
            $scope.orgNameInfo = $scope.orgName;
            $scope.positionInfo = $scope.positionName;
            $scope.mobilephoneInfo = $scope.mobilephone;
            $scope.telephoneInfo = $scope.telephone;
            $scope.emailInfo = $scope.email;
            $scope.descriptionInfo = $scope.description;

            $scope.textNumber = 140 - $scope.descriptionInfo.length;

            //修改详情工号不可以修改
            $scope.codeDisabled = true;
            $('button[name="saveOrEdit"]').addClass('edit').removeClass('save');
            $('input[name="orgNameInfo"]').attr('disabled', false);
        };

        /**** 取消修改用户详情 */
        $scope.closeEditUser = function(){
            var id = $scope.id;
            userService.getUserDetail({seatParams : {userId :id}},function(response){
                if(response.errorCode == 0){
                    var value = response.data;

                    $scope.editDetail = true;
                    $scope.editHide = true;
                    $scope.visible = false;
                    $scope.validate = false;
                    $scope.validateRequired = false;
                    $scope.closeEditDetail = false;

                    $scope.id = value.id;
                    $scope.fullName = value.fullName;
                    $scope.code = value.code;
                    userService.getPositionsData(function(response){
                        $scope.positions = response.data;
                        $scope.position = false;
                        for(var i in response.data){
                            if(value.positionCode == response.data[i]['positionCode']){
                                $scope.positionName = response.data[i]['positionName'];
                            };
                        };
                    });
                    var sex = '';
                    if(value.sex == 'm'){
                        sex = Lang.getValByKey("user", 'user_radio_man');
                        $scope.sexInfo = 'm';
                    }else if(value.sex == 'f'){
                        sex = Lang.getValByKey("user", 'user_radio_woman');
                        $scope.sexInfo = 'f';
                    }else if(value.sex == 0){
                        sex = Lang.getValByKey("user", 'user_radio_no');
                        $scope.sexInfo = 'null';
                    };
                    $scope.avatarPath = value.avatarPath? value.avatarPath :'/public/img/avatar2.png';
                    $scope.orgName = value.orgName;
                    $scope.orgId = value.orgId;
                    $scope.positionCode = value.positionCode;
                    $scope.mobilephone = value.mobilephone;
                    $scope.telephone = value.telephone;
                    $scope.email = value.email;
                    $scope.description = value.description;

                    $('.sex-radio input').removeAttr('checked');
                    $('input[value="'+value.sex+'"]').prop('checked', true);

                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                };
            });
        };

        /**** 展开高级搜索 */
        $scope.seniorSeach = function($event){
            //$scope.LockChecked = false;
            $('input[name="LockUser"]').removeClass('active').attr('checked', false);
            if($($event.target).hasClass('active')){
                $($event.target).removeClass('active').text(Lang.getValByKey("common", 'common_page_advancedFilter'));
                $('.fade').animate({'height':0},500);
                $('.white-background').animate({'top':50},500);
                setTimeout("$('.fade').hide()",500);
                setScrollClose();
                $(window).on("resize",setScrollClose);
                $scope.tableModel.restData.locked = -1;
                var uid = $('#tree .dd3-content.active').parent().data('uid');
                var params = {
                    'urlParams': $scope.tableModel.restData,
                    'seatParams': {'uid':uid}
                };

                tableService.getTable($scope.tableModel.restURL, params, function(data){
                    if(data.errorCode === 0){
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    }
                });
                $scope.isPageShow = false;
            }else{
                $($event.target).addClass('active').text(Lang.getValByKey("common", 'common_page_ordinaryFilter'));
                $('.fade').show().css('height',0);
                $('.fade').animate({'height':50},500);
                $('.white-background').animate({'top':80},500);
                setScrollOpen();
                $(window).on("resize",setScrollOpen);
                $scope.isPageShow = true;
            };
        };
        function setScrollOpen(){
            $('.table-container tbody').slimscroll({
                height: $('.content-main').height() - 320
            });
        };
        function setScrollClose(){
            $('.table-container tbody').slimscroll({
                height: $('.content-main').height() - 270
            });
        };

        /**** 展开更多 */
        $scope.showMore = function(){
            $scope.tableModel.more = true;
        };

        /**** 收起更多 */
        $scope.hideMore = function(){
            $scope.tableModel.more = false;
        };

        /**** 检索用户 */
        $scope.retrievalUser = function(type){
            $scope.isSeach = true;
            $scope.q = type == 'clickNode' ? '' : $scope.tableModel.restData.q;
            $scope.tableModel.restData.pageIndex = 1;

            var uid = 0 || $('.dd3-content.active').parent().data('uid');

            var lock = $('input[name="LockUser"]');
            if(lock.hasClass('active')){
                $scope.tableModel.restData.locked = 1;
            }else{
                $scope.tableModel.restData.locked = -1;
            };

            var params = {
                'urlParams': $scope.tableModel.restData,
                'seatParams': {'uid':uid}
            };

            tableService.getTable($scope.tableModel.restURL, params, function(data){
                if(data.errorCode === 0){
                    console.log(data.data.length)
                    if(data.data.length == 0){
                        $scope.undefinedShow = true;
                        //$scope.tableModel.restData.q = '';
                    }else{
                        $scope.undefinedShow = false;
                    };
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
            });

        };

        /**** 批量删除用户 */
        $scope.deleteUser = function() {
            if($scope.tableModel.selectNumber != 0 && $('.user-table tbody tr').length != 0){
                var arr = [];
                var ids = $('.user-table tbody input[checked="checked"]');
                ids.each(function(i){
                    arr.push(ids.eq(i).val());
                });

                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("user", 'user_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
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
            var config = {urlParams : arr};
            userService.deleteUsers(config, function(response){
                if(response.errorCode == 0){
                    $(document).promptBox('closePrompt');
                    for(var i in arr){
                        $('tr[data-id="'+arr[i]+'"]').remove();
                    };
                    var uid = $('#tree .dd3-content.active').parent().data('uid');
                    getOrgUsers(uid);
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                }
            });
            $scope.$apply();
        };

        /**** 移动用户 */
        $scope.moveGroup = function(){

            function loadDataMove(){

                if($('#moveUser').length == 1){
                    $('#moveUser').remove();
                    if($('#moveUserBox .slimScrollDiv').length > 0){
                        $('#moveUserBox').find('.slimScrollDiv').remove();
                    };
                    $('#moveUserBox').append('<div id="moveUser"></div>');
                };

                $('#moveUser').nestable({
                    iconOpen        : 'icon-organization-Open',       /** 带加号图标 */
                    iconClose       : 'icon-organization-Close',      /** 带减号图标 */
                    iconSeat        : 'icon-organization',            /** 无展开图标 */
                    userCount       : '',
                    isMove          : true,
                    isOperate       : true,
                    isRoot          : true,
                    childUrl        : Interface.getUrlById("logistics.treeChildUrl"),
                    isSearch        : false,
                    treeScrollHeight:$('#moveUserBox.user-prompt-box')
                });
            };

            if($scope.tableModel.selectNumber != 0){

                $(document).promptBox({
                    isHidden:true,
                    title: Lang.getValByKey("user", 'user_prompt_move_tip'),
                    isNest:true,
                    loadData : function(){
                        loadDataMove();
                    },
                    content: {
                        nest: $('#moveUserBox'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_prompt_confirm'),
                            operationEvent: function(){
                                moveUserGroup();
                            }
                        }
                    ]
                });

            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        };

        function moveUserGroup(){
            var arr = [];
            var ids = $('.user-table tbody input[checked="checked"]');
            ids.each(function(i){
                arr.push(ids.eq(i).val());
            });

            var config = {
                seatParams : { targetorgid : $('#moveUser .dd3-content.active').parent().data('uid')},
                urlParams : arr
            };

            userService.moveUsers(config, function(response){
                if(response.errorCode === 0){
                    var uid = $scope.userOrgId || $('#tree .dd3-content.active').parent().data('uid');
                    getOrgUsers(uid);
                    userShowTree();
                    $(document).promptBox('closeFormPrompt');
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                };
            });

        };

        /**** 批量重置密码 */
        $scope.resetPassword = function(){
            var arr = [],name = [];
            var ids = $('.user-table tbody input[checked="checked"]');
            var names = $('.user-table tbody tr');
            ids.each(function(i){
                arr.push(ids.eq(i).val());
                name.push(names.eq(i).find('td').eq(2).attr('title'));
            });

            if($scope.tableModel.selectNumber != 0){
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("user", 'user_prompt_reset_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function () {
                                resetPasswordEvent();
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_prompt_delay_tip'), type: 'errer', manualClose:true});
            };


            function resetPasswordEvent(){
                var config = {urlParams : arr};
                userService.modifyPassword(config, function(response){
                    if(response.errorCode === 0){
                        var uid = $('#tree .dd3-content.active').parent().data('uid');
                        $(document).promptBox('closePrompt');
                        getOrgUsers(uid);
                        if($scope.isPageShow == true){
                            setScrollOpen();
                        }else{
                            setScrollClose();
                        };
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };

        };

        /**** 批量锁定用户 */
        $scope.lockUser = function(){

            if($scope.tableModel.selectNumber != 0){
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("user", 'user_prompt_lock_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function () {
                                submitLockUser();
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_prompt_delay_tip'), type: 'errer', manualClose:true});
            };

            function submitLockUser(){
                var arr = [];
                var ids = $('.user-table tbody input[checked="checked"]');
                ids.each(function(i){
                    arr.push(ids.eq(i).val());
                });

                var config = {urlParams : arr};
                userService.lockUser(config, function(response){
                    if(response.errorCode === 0){
                        var uid = $('#tree .dd3-content.active').parent().data('uid');
                        getOrgUsers(uid);
                        if($scope.isPageShow == true){
                            setScrollOpen();
                        }else{
                            setScrollClose();
                        };
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                        $(document).promptBox('closePrompt');
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };

        };

        /**** 批量解锁用户 */
        $scope.unlockUser = function(){
            if($scope.tableModel.selectNumber != 0){
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("user", 'user_prompt_unlock_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function (){
                                submitUnlockUser();
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_prompt_delay_tip'), type: 'errer', manualClose:true});
            };

            function submitUnlockUser(){
                var arr = [];
                var ids = $('.user-table tbody input[checked="checked"]');
                ids.each(function(i){
                    arr.push(ids.eq(i).val());
                });

                var config = {urlParams : arr};
                userService.unlockUser(config, function(response){
                    if(response.errorCode === 0){
                        var uid = $('#tree .dd3-content.active').parent().data('uid');
                        getOrgUsers(uid);
                        if($scope.isPageShow == true){
                            setScrollOpen();
                        }else{
                            setScrollClose();
                        };
                        $(document).promptBox('closePrompt');
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'success'});
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:response.msg, type: 'errer', manualClose:true});
                    };
                });
            };

        };

        /**** 获取锁定用户 */
        $scope.getLockUser = function($event){
            //$scope.LockChecked = false;
            if(!$($event.target).hasClass('active')){
                $($event.target).addClass('active');
                //$scope.LockChecked = true;
                $scope.tableModel.restData.locked = 1;
            }else{
                //$scope.LockChecked = false;
                $($event.target).removeClass('active');
                $scope.tableModel.restData.locked = -1;
            };

            var uid = $('#tree .dd3-content.active').parent().data('uid');

            var params = {
                'urlParams': $scope.tableModel.restData,
                'seatParams': {'uid':uid}
            };

            tableService.getTable($scope.tableModel.restURL, params, function(data){
                if(data.errorCode === 0){
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
            });

        };

        /**** 上传用户头像 */
        $scope.getFile = function () {
            var result = userService.uploadFileToUrl($scope.avatarFile);

            if(!result){
                return false;
            }
            if(result.errorlocal){
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("user", result.errorlocal), type: 'errer', manualClose:true});
            }else{
                result.then(function(res){
                    if(res.data.errorCode === 0){
                        $scope.avatarPath = res.data.data.path;
                        $scope.avatarId = res.data.data.id;
                        $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("user", 'user_prompt_upload_tip'), type: 'success'});
                    }
                    else{
                        $(document).promptBox({isDelay:true, contentDelay: res.data.msg , type: 'errer', manualClose:true});
                    }
                });
            };
            $scope.$apply();
        };

        $scope.updateFile = function(){
            var result = userService.uploadFileToUrl($scope.avatarUpdateFile);

            if(!result){
                return false;
            }
            if(result.errorlocal){
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("user", result.errorlocal), type: 'errer', manualClose:true});
            }else{
                result.then(function(res){
                    if(res.data.errorCode === 0){
                        $scope.avatarPath = res.data.data.path;
                        $scope.avatarId = res.data.data.id;
                        $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("user", 'user_prompt_upload_tip'), type: 'success'});
                    }
                    else{
                        $(document).promptBox({isDelay:true, contentDelay: res.data.msg , type: 'errer', manualClose:true});
                    }
                });
            };
            $scope.$apply();
        };

        $scope.focusUserCode = function(){
            $scope.validateUserCodeError = false;
        };

        /**** 工号唯一 */
        $scope.validateUserCode = function(){
            var code = $scope.codeInfo;
            if(!code) return;
            var config = {urlParams : {code : code}};
            userService.validateUserCode(config, function(response){
                if(response.errorCode != 0){
                    $scope.validateUserCodeError = true;
                }else{
                    $scope.validateUserCodeError = false;
                };
            });
        };

        $scope.focusUserEmail = function(){
            $scope.validateEmailError = false;
        };
        /**** 邮箱唯一 */
        $scope.validateUserEmail = function(){
            var email = $scope.emailInfo;
            if(!email) return;
            var userId;
            if(!$scope.isSave){
                userId = $scope.currentUserId;
            }else{
                userId = '';
            };

            var config = {urlParams : {email : email, userId: userId}};
            userService.validateUserEmail(config, function(response){
                if(response.errorCode != 0){
                    $scope.validateEmailError = true;
                }else{
                    $scope.validateEmailError = false;
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

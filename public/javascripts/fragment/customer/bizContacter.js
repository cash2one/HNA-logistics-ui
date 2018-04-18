app.controller("contacterCtrl", ["$scope", "customerService", "tableService", function($scope, customerService, tableService) {
    var userEle ;
    var funcDutyEle ;

    var showFirst = true;

    function setScroll() {
        $(".table-container tbody").slimScroll({
            height: $('.content-main').height() - 250
        });
    }
    function refreshTableData() {
        var params = {
            'urlParams': $scope.tableModel.restData
        };
        tableService.getTable($scope.tableModel.restURL, params, function(data) {


            $scope.q = $scope.tableModel.restData.q;
            $(".table-box").css("zoom", "1.0000001");//刷新表格让其对齐
            if(data.errorCode === 0) {
                //如果联系人从用户组移除，需要提示
                var result = data.data;
                var changePersonList=[];
                var existChangePerson = false;
                for( var index=0;index < result.length;index++ ) {
                    if (result[index].changedForGorup) {
                        changePersonList.push(result[index].userName);
                        existChangePerson = true;
                    }
                }



                if(existChangePerson ) {
                    setTimeout(function() {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: changePersonList.toString() + "的人员信息已发生变化，请及时更新！",
                            type: 'errer',
                            time: 3000,
                            manualClose:true

                        });
                    },500);

                }

                $scope.tableModel = tableService.table($scope.tableModel, params, data);
                setTimeout(function() {
                    setScroll();
                    $(window).on("resize", setScroll);
                    $(".table-box").focus();
                    resizeTable();
                    $(".table-box").css("zoom", "1");
                    $scope.$apply();
                }, 400);
            }
        });
    }
    function initTable() {
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("customer", 'customer_duty'),
                Lang.getValByKey("common", 'common_table_full_name'),
                Lang.getValByKey("common", 'common_thead_only_code'),
                Lang.getValByKey("common", 'common_thead_phone'),
                Lang.getValByKey("common", 'common_table_telephone'),
                Lang.getValByKey("common", 'common_table_remark')
            ],
            tableHeaderSize: [
                '5%',
                '15%',
                '15%',
                '15%',
                '15%',
                '15%',
                '15%'
            ],
            tableBody: [],
            restURL: "logistics.getBizContacter",
            restData: {
                q: '',
                sortName: 'id',
                refCustomerId:$scope.customerId,
                isAsc: false,
                pageIndex: 1,
                pageSize: 10,
            },
            selectNumber: 0,
            selectFlag: false
        };
        refreshTableData();
    }

    function InitForm() {

        $scope.buzCustomer ={};
        $scope.data = {
            description:''
        };
        $scope.IsEdit = false;
        $scope.textareaNumber = 140;
        $scope.BizContacterForm.$setPristine();
    }

    function getSigleDataByName(name, data) {
        var data = data.data;
        for(var index = 0; index < data.length; index++) {
            if(data[index].name == name) {
                return data[index];
            }
        }
    }

    function getSigleDataByfullName(name, data) {
        var data = data.data;
        for(var index = 0; index < data.length; index++) {
            if(data[index].fullName == name) {
                return data[index];
            }
        }
    }

    function rebuildUserName(userList) {
        var data = userList.data;
        for(var index = 0; index < data.length; index++) {
            data[index].fullName = data[index].fullName + " (" + data[index].userCode + ")";
        }
        return userList;
    }

    function  initUsers () {
        userEle.setData({});

        $scope.data.memberName = '';
        $scope.showUserExistTips = false;
        $scope.showUserErrTips = false;

    }

    function setUsers(users) {
        $scope.showUserErrTips = false;
        $scope.showUserExistTips = false;
        $scope.data.memberName = '';
        userEle.setData(users);

    }


    $scope.getBizCustomerData  = function(q,currentPage){

        if(!$scope.buzCustomer.dutyCode){
            return;
        }

        q = q ? q : '';
        var config = {
            'q': q ? q.trim() : "",
            'pageIndex': currentPage ? currentPage : 1,
            'pageSize': 10,
            'orgCode': $scope.buzCustomer.dutyCode
        };


        var users = customerService.getUsersByDutyCode(config);
        users = rebuildUserName(users);

        return users;


    };

    function initSelect() {
        /*初始化职能团队*/

       // data = customerService.getFuncTeam();
       var data = customerService.getBuzCustomerDuty();


        funcDutyEle = selectFactory({
            data: data,
            id  : "duty",
            defaultCount: data.data.length + 1,
            defaultText:Lang.getValByKey("common", "common_select_tips"),
            attrTextModel: function(name, data) {

                $scope.BizContacterForm.customer_user.$setPristine();

                var departmentData;
                if(!name) {
                    departmentData = {};

                } else {

                    departmentData = getSigleDataByName(name, data);
                    $scope.showUserErrTips = false;
                }
                initUsers();


                $scope.buzCustomer.dutyCode = departmentData.code;
                $scope.data.duty = name;


                $scope.$apply();

            }
        });



        userEle = selectFactory({
            data: [],
            showTextField: "fullName",
            id  : "customer_user",
            isSearch: true,
            searchPlaceHoder:"请输入姓名或工号",
            closeLocalSearch: true,
            pagination: true,
            defaultText:Lang.getValByKey("common", "common_select_tips"),
            onSearchValueChange: function(attachEvent, data, currentPage) {

                if(!$scope.buzCustomer.dutyCode){
                    attachEvent.setData({});

                }else{
                    var bizCustomerData = $scope.getBizCustomerData(data, currentPage);
                    attachEvent.setData(bizCustomerData);
                }

                $scope.$apply();

            },
            attrTextModel: function(name, data) {

                var userData;
                if(!name) {
                    userData = {};
                } else {
                    userData = getSigleDataByfullName(name, data);
                }

                if(name != $scope.data.memberName) {
                    $scope.canNotSaveNoExistPerson = false;
                }

                $scope.buzCustomer.userId = userData.userId;
                $scope.data.memberName = name;

                checkUserExist();
                $scope.$apply();
            }

        });

        setTimeout(function(){
            userEle.open();
        },100);
    }

    function checkUserExist() {

        var data = {
            refBussContactId: $scope.buzCustomer.userId,
            refBussGroupCode: $scope.buzCustomer.dutyCode,
            refCustomerId: $scope.customerId,
            description: $scope.data.description,
            id: $scope.modifyTableListId
        };


        customerService.isBuzCustomerExist(data,function (data) {
            if( data.errorCode != 0) {
                $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
            } else {
                if(data.data === true) {
                    console.log('hihi');
                    $scope.showUserExistTips = true;
                    //$scope.BizContacterForm.customer_user.$setDirty();
                    $scope.$apply();

                } else {
                    $scope.showUserExistTips = false;
                    //$scope.BizContacterForm.customer_user.$setPristine();

                }

            }
        });

    }



    // 增加业务联系人
    $scope.addContactPerson = function () {
        $scope.showUserErrTips = false;
        $scope.showUserExistTips = false;
        $scope.showPrompt = true;
        // 添加之前要把用户都先清空
        initUsers();
        $scope.data.duty = '';
        $scope.data.description = '';
        // 修改的时候需要给后端带id，此时设置为空用于校验存在性
        $scope.modifyTableListId = '';

    }

    //  修改业务联系人

    $scope.editBizUser = function (value) {

        console.log(value);

        $scope.showPrompt = true;
        $scope.IsEdit = true;
        $scope.showUserErrTips = false;
        $scope.showUserExistTips = false;


        $scope.canNotSaveNoExistPerson = value.changedForGorup == true;


        // 里面的user 还是要重新获取下
        initUsers();
        getUsersByDutyCode(value.groupCode);



        //如果没有触发，则还是要从表中先保存下，如果点击变化，从回调中取
        $scope.buzCustomer.dutyCode = value.groupCode;
        $scope.buzCustomer.userId = value.userId;
        $scope.modifyTableListId  = value.id;


        // 展示
        $scope.data.duty = value.groupName;
        $scope.data.memberName = value.userName +'('+ value.userCode +')';
        $scope.data.description = value.description;
        $scope.showTextNumber();
    }

    $scope.$on("bizContacterEvent", function(event, data) {

        initTable();
        InitForm();
        initSelect();
        $scope.$apply();
        $scope.showModifyPrompt = false;
        $scope.showPrompt = false;
        $scope.showUserErrTips = false;
        $scope.showUserExistTips = false;
        // 重置了下span的padding－left
        // $scope.resetStyle(133);

    });

    $scope.closePrompt  = function() {
        $scope.showPrompt = false;
        InitForm();
    };
    // 提交前校验表单
    function checkFormBeforeSummit() {
        if(!$scope.data.duty){
            $scope.BizContacterForm.duty.$setDirty();
        };

        if(!$scope.data.memberName ){

            $scope.BizContacterForm.customer_user.$setDirty();
        };


        return $scope.BizContacterForm.$valid ? true:false;
    }



    function summitForm(inputdata, summitFunc, refreshFunc) {

        summitFunc(inputdata, function (data) {
            if (data.errorCode != 0 ) {//服务器异常
                $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
            } else{
                $scope.closePrompt();
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                    type: 'success',
                    time: 3000
                });
                //更新table表数据
                refreshFunc();
            }
        })
    }



    // 保存业务联系人
    $scope.savePrompt  = function(confirm) {
        if(!checkFormBeforeSummit()){
            return;
        }

        if($scope.canNotSaveNoExistPerson) {
            return;
        }

        if($scope.showUserExistTips || $scope.showUserErrTips) {
            return;
        }

        if ($scope.IsEdit) {
            var data = {
                refBussContactId: $scope.buzCustomer.userId,
                refBussGroupCode: $scope.buzCustomer.dutyCode,
                refCustomerId: $scope.customerId,
                description: $scope.data.description,
                id: $scope.modifyTableListId

            };
            summitForm(data, customerService.modifyBizContacter, refreshTableData);

        } else{
            var data = {
                refBussContactId: $scope.buzCustomer.userId,
                refBussGroupCode: $scope.buzCustomer.dutyCode,
                refCustomerId: $scope.customerId,
                description: $scope.data.description,

            };
            summitForm(data, customerService.addBizContacter, refreshTableData);

        }

        InitForm();
        $scope.showPrompt = false;

    };





    $scope.deleteContactPerson = function() {
        var delTips = Lang.getValByKey("customer", 'customer_del_biz_contacter_tips');
        tableService.delTableListById($scope.tableModel,delTips, customerService.deleteBizContacterList, refreshTableData);
    }


    $scope.showTextNumber = function(){
        $scope.textareaNumber = 140 - $scope.data.description.length;
    };

    $scope.checkValidate = function () {
        if(!$scope.data.duty ){
            $scope.showUserErrTips = true;
        } else {
            $scope.showUserErrTips = false;

        }

    }




}]);


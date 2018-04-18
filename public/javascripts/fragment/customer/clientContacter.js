app.controller("customerContacterCtrl", ["$scope", "customerService", "tableService", function($scope, customerService, tableService) {

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
                $scope.tableModel = tableService.table($scope.tableModel, params, data);
                setTimeout(function() {
                    setScroll();
                    $(window).on("resize", setScroll);
                    $(".table-box").focus();
                    resizeTable();
                    $scope.$apply();
                    $(".table-box").css("zoom", "1");
                }, 400);
            }
        });
    }
    function initTable() {
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("common", 'common_table_full_name'),
                Lang.getValByKey("common", 'common_thead_department'),
                Lang.getValByKey("common", 'common_thead_job'),
                Lang.getValByKey("common", 'common_thead_phone'),
                Lang.getValByKey("common", 'common_table_telephone'),
                Lang.getValByKey("common", 'common_table_responsibility'),
                Lang.getValByKey("common", 'common_table_remark')
            ],
            tableBody: [],
            tableHeaderSize: [
                '4%',
                '13%',
                '13%',
                '13%',
                '13%',
                '13%',
                '13%',
                '13%'
            ],
            restURL: "logistics.getClientContacter",
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
        refreshTableData()
    }

    function InitForm() {
        $scope.data = {
            name:'',
            department :'',
            function:'',
            mobilePhone:'',
            phone:'',
            duty:'',
            description:'',
            refCustomerId:$scope.customerId
        };
        $scope.IsEdit = false;
        $scope.textareaNumber = 140;
        $scope.remark = '';

        $scope.ClientContacter.$setPristine();
    }


    $scope.$on("clientContacterEvent", function(event, data) {
        initTable();
        InitForm();
        $scope.resetStyle(0);
        $scope.showPrompt = false;
        $scope.$apply();

    });


    $scope.closePrompt  = function() {
        $scope.showPrompt = false;
        $scope.IsEdit = false;
        InitForm();
    };

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

    function checkFormBeforeSummit() {


        $scope.data.department = ($scope.data.department === undefined) ? "" : $scope.data.department.replace(/(^\s*)|(\s*$)/g, "");
        $scope.data.function = ($scope.data.function === undefined) ? "" : $scope.data.function.replace(/(^\s*)|(\s*$)/g, "");
        $scope.data.duty = ($scope.data.duty === undefined) ? "" : $scope.data.duty.replace(/(^\s*)|(\s*$)/g, "");


        if(!$scope.data.name){
            $scope.ClientContacter.clientUser.$setDirty();
        };
        if(!$scope.data.department){
            $scope.ClientContacter.department.$setDirty();
        };
        if(!$scope.data.function){
            $scope.ClientContacter.function.$setDirty();
        };
        if(!$scope.data.mobilePhone){
            $scope.ClientContacter.mobilePhone.$setDirty();
        };
        if(!$scope.data.duty){
            $scope.ClientContacter.duty.$setDirty();
        };

        if ($scope.ClientContacter.$valid && $scope.data.department && $scope.data.function && $scope.data.duty) {
            return true;
        }

        return false;



    }

    $scope.savePrompt  = function() {
        var data = $scope.data;

        if (!checkFormBeforeSummit()){
            scrollToErrorView($(".client-contacter-switch-list"));
            return;
        }



        if( $scope.IsEdit ) {
            summitForm(data, customerService.modifyClientContacter, refreshTableData);
        } else {
            summitForm(data, customerService.addClientContacter, refreshTableData);
        }

        $scope.showPrompt = false;
        InitForm();

        $scope.IsEdit = false;
    };

    $scope.addContactPerson = function () {
        $scope.showPrompt = true;

    }

    $scope.deleteContactPerson = function () {

        var delTips = Lang.getValByKey("customer", 'customer_prompt_deleteClientCustomer_tip');
        tableService.delTableListById($scope.tableModel,delTips, customerService.deleteClientContacterList, refreshTableData);

    }

    $scope.showTextNumber = function(){
        if($scope.data && $scope.data.description && $scope.data.description.length) {
            $scope.textareaNumber = 140 - $scope.data.description.length;
            if($scope.data.descriptith >= 140) {
                $scope.textareaNumber = 0;
                $scope.data.description = (".remark-info textArea").val().substring(0, 140);
            }
        }
    };
    $scope.editClientUser = function (value) {
        $scope.showPrompt = true;
        $scope.IsEdit = true;
        // 从表中再读取数据
        $scope.data.name = value.name;
        $scope.data.department = value.department;
        $scope.data.function = value.function;
        $scope.data.mobilePhone = value.mobilePhone;
        $scope.data.phone = value.phone;
        $scope.data.duty = value.duty;
        $scope.data.id = value.id;
        $scope.data.description = value.description;
        $scope.showTextNumber();

    }
}]);

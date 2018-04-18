easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    "widget/select",
    'public/common/tableController.js',
    'public/common/calander.js'
], function(){
    app.controller('customerMessageCtrl', ['$scope', 'customerMessageService', 'customerMessageView', 'tableService',function($scope, customerMessageService, customerMessageView,tableService) {
        var userNameElm = {};
        function init() {

            initTable();
            initUserNameSelect();
            initStateSelect();
            initCalander();
            // customerMessageView.initCalander();
            $scope.disableDelBtn = false;

            $scope.stateName = '未解决';
            $scope.status = 2; //0 全部 1 true 2 false
            $scope.userName='';

            $scope.startTime = getBeforeDate(6)+' 00:00:00'
            $scope.endTime = new Date().format('yyyy-MM-dd 23:59:59')


        }
        init();
        function initCalander(){
            Calander.init({
                ele: ["#start-time", "#end-time"]
            });
        }

        function getUserList(data, currentPage) {
            if(!currentPage) {
                currentPage = 1;
            }
            var params = {
                'urlParams': {
                    'q': data || '',
                    "pageIndex": currentPage,
                    "pageSize": 10
                }
            };

            var data = customerMessageService.getCustomerFullNameList(params);
            return data;
        }


        $scope.reSetUserNameList = function () {
            userNameElm.setData($scope.userNameFirstpage);
        }

        function initUserNameSelect() {
            $scope.userNameFirstpage = getUserList('');

            userNameElm = selectFactory({
                data: $scope.userNameFirstpage,
                id: "user-name",
                showTextField: "fullName",
                isSearch: true,
                closeLocalSearch:true,
                searchPlaceHoder: '请输入用户名或姓名',
                isSaveInputVal:true,
                pagination: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    var userList = getUserList(data, currentPage);
                    userNameElm.setData(userList);
                },
                defaultText:Lang.getValByKey("common", "common_select_tips"),
                attrTextModel: function(name, data,currentItem) {
                    if(!name ) {
                        $scope.userNameId = '';
                        $scope.userName = '';

                    } else {
                        $scope.userNameId = currentItem.id;
                        $scope.userName = name;

                    }

                    $scope.$apply();
                }
            });

        }

        function setScroll() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 330
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
                    "序号",
                    "编码",
                    "用户姓名",
                    "最后回复内容",
                    "最后更新时间",
                    "状态"
                ],
                tableHeaderSize: [
                    '5%',
                    '20%',
                    '20%',
                    '20%',
                    '25%',
                    '5%'
                ],
                tableBody: [],
                restURL: "logistics.getMessageBookList",
                restData: {
                    q: '',
                    customerName:'',
                    sortName:'',
                    beginTime:getBeforeDate(6)+' 00:00:00',
                    endTime:new Date().format("yyyy-MM-dd 23:59:59"),
                    status:2, //初始值
                    isAsc: false,
                    pageIndex: 1,
                    pageSize: 10,

                },
                selectNumber: 0,
                selectFlag: false
            };
            refreshTableData();
        }


        function initStateSelect() {
            /*初始化职能团队*/

            var data = {
                data: [
                    {name:'全部',code:0},
                    {name:'已解决',code:1},
                    {name:'未解决',code:2}
                ],
                errorCode:0,
                msg:''
            }

            var stateElm = selectFactory({
                data: data,
                id: "state",
                defaultText:null,
                attrTextModel: function (name, data,currentData) {

                    if(!name) {
                        $scope.status = 0; //未选择默认查全部
                        $scope.stateName = '';
                    } else {
                        $scope.status = currentData.code;
                        $scope.stateName = name;
                    }

                    $scope.$apply();
                }
            });
        }

        $scope.resetData = function () {
            $scope.filterUser = '';
            $scope.userName='';
            $scope.userNameId = '';
            $scope.messageContent='';
            $scope.stateName = '未解决';
            $scope.status=2;
            $scope.startTime='';
            $scope.endTime ='';
            $scope.tableModel.restData.q =''
            // $('#start-time').val("");
            // $('#end-time').val("");

            $scope.startTime = getBeforeDate(6)+' 00:00:00';
            $scope.endTime = new Date().format('yyyy-MM-dd 23:59:59');


            $scope.search();
        };

        $scope.search = function () {
            $scope.filterUser = $scope.tableModel.restData.customerName = $scope.userName;
            $scope.tableModel.restData.status = $scope.status;
            $scope.tableModel.restData.q = $scope.messageContent;
            $scope.tableModel.restData.beginTime = $scope.startTime;
            $scope.tableModel.restData.endTime = $scope.endTime;


            refreshTableData();

        };


        $scope.jumpToCustomMesDetail =function (value) {
            if(value.refCustomerId < 1){
                //匿名用户
                top.location.href =
                    "http://" + location.host +
                    "/#/" + 'customerMessageDetail?id='+value.id +'&status='+value.status +'&userName='+value.customerFullName
                    +'&customerType='+'anony'+'&anonyTel=' +value.anonyTel + '&anonymity=' +value.anonymity+'&refCustomerCode='+value.code;

            }else{
                top.location.href =
                    "http://" + location.host +
                    "/#/" + 'customerMessageDetail?id='+value.id +'&status='+value.status +'&userName='+value.customerFullName
                    +'&customerType='+'login'+'&refCustomerId='+value.refCustomerId+'&refCustomerCode='+value.code;
            }

        };

        $scope.$watch('tableModel',  function(newValue, oldValue) {
            if (newValue === oldValue) {return; }
            tableReData();
        }, true);

        function tableReData() {
            var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

            for(var index=0;index <selectArr.length;index ++){

                if(selectArr[index].status == false) {
                    $scope.disableDelBtn = true;
                    return;
                }

            }
            $scope.disableDelBtn = false;


        }

        $scope.deleteMsg = function() {
            var delTips = "是否确认删除所选留言？";

            tableService.delTableListById($scope.tableModel,delTips, customerMessageService.delCustomerMsg, refreshTableData);
        }
    }]);
});
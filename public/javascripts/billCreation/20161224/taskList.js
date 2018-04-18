easySpa.require([
    'public/common/tableController.js',
    "widget/select"
], function(){
    app.controller("taskList",['$scope','billCreationService','tableService', taskList]);


    function taskList($scope, billCreationService,tableService){
        $scope.search = {};

        billCreationService.nowScope = $scope;

        $scope.unwatcher = [];

        var getLastMonth = billCreationService.getLastMonth();
        $scope.startEffectTime = getLastMonth.start;
        $scope.endEffectTime = getLastMonth.end;
        //$scope.search.startEffectTime = getLastMonth.start;
        //$scope.search.endEffectTime = getLastMonth.end;

        var initTaskTime = billCreationService.initTaskListTime();
        $scope.search.taskStartTime = initTaskTime.start;
        $scope.search.taskEndTime = initTaskTime.end;

        $scope.num = Math.random().toString(36).substring(3, 8);

        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("billCreation", 'billCreation_task_code'),
                $scope.lang.bill_out_start,
                $scope.lang.bill_out_end,
                $scope.lang.process,
                $scope.lang.task_start_time,
                $scope.lang.task_end_time,
                $scope.lang.status
            ],
            tableHeaderSize: ['5%','13%','13%','13%','13%','13%','13%','12%'],
            tableBody: [],
            restURL: "logistics.getTaskList",
            restData: {
                q: '',
                refCombos: '',
                isAsc: false,
                pageIndex: 1,
                pageSize: 10,
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.getTaskDetail = function(code){
            var config = {
                'urlParams':{'taskCode': code},
                'seatParams':{
                    'interType': $scope.interType,
                    'subInterType': $scope.subInterType
                }
            };
            billCreationService.getBillTaskDetail(config, function(res){
                var data = {};
                if(res.errorCode == 0) {
                    if($scope.module == 'trade'){
                        data.msg = '<p>'+ $scope.lang.completeOrderQuantity +': ' + (res.data.completeOrderQty ? res.data.completeOrderQty : 0) + '</p>';
                        data.msg += '<p>' + $scope.lang.skippedOrderQuantity + ': ' + (res.data.skippedOrderQty ? res.data.skippedOrderQty : 0) + '</p>';
                    }else{
                        data.msg = '<p>'+ $scope.lang.completeOrderQuantity +': ' + (res.data.completeOrderQuantity ? res.data.completeOrderQuantity : 0) + '</p>';
                        data.msg += '<p>' + $scope.lang.skippedOrderQuantity + ': ' + (res.data.skippedOrderQuantity ? res.data.skippedOrderQuantity : 0) + '</p>';
                    }
                }
                billCreationService.promptMidBox(code + $scope.lang.task_detail, data,'', angular.noop);
            });
        }

        var searchKey = ['taskStartTime','taskEndTime','taskStatus','startEffectTime','endEffectTime','taskCode'];

        $scope.loadListData = function(){
            var param = angular.copy($scope.tableModel.restData);
            var searchData = billCreationService.getSearchData($scope);

            searchKey.forEach(function(key){
                delete param[key];
            });

            angular.extend(param, searchData);


            var params = {
                'urlParams' : param,
                'seatParams':{
                    'interType':'',
                    'subInterType':''
                }
            };
            if($scope.module == 'trade'){
                params.seatParams.interType = $scope.interType;
            }
            if($scope.module == 'logistics'){
                params.seatParams.interType = '';
            }
            params.seatParams.subInterType = $scope.subInterType;
            $scope.showTable = false;

            tableService.getTable($scope.tableModel.restURL, params, function(data) {
                initListData(data.data);
                $scope.q = $scope.tableModel.restData.q;
                if(data.errorCode == 0) {
                    $scope.count += 1;
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                }
                $scope.$apply();
            });

        };

        function initListData(data){
            data.forEach(function(item){
                var val = 0;
                var types = ['completeOrderQuantity','skippedOrderQuantity','orderQuantity'];

                types.forEach(function(i){
                    if(item[i] == null) item[i] = 0;
                });


                if($scope.module == 'trade'){
                    val = (item.completeOrderQty + item.skippedOrderQty) / item.orderQty;
                }else{
                    val = (item.completeOrderQuantity + item.skippedOrderQuantity) / item.orderQuantity;
                }
                if(isNaN(val)){
                    val = 0;
                }else{
                    val = parseInt(val * 100);
                }
                item.quantityTxt = val;

            });
        }

        $scope.unwatcher.push($scope.$watch('tableModel.pagination.currentPage',function(n,o){
            if(n != o) initListData($scope.tableModel.tableBody);
        }));
        $scope.unwatcher.push($scope.$watch('tableModel.restData.pageSize',function(n,o){
            if(n != o) initListData($scope.tableModel.tableBody);
        }));

        $scope.$watch("count", function(n, o){
            billCreationService.setScroll("#taskTable", $scope);
        });

        $scope.generateBills = function(){
            var data = {msg : $scope.lang.confirm_effect  + ' ' + $scope.startEffectTime + ' - ' + $scope.endEffectTime + ' 的账单？'};

            var config = {
                'urlParams':{
                    'startEffectTime': $scope.startEffectTime,
                    'endEffectTime': $scope.endEffectTime
                },
                'seatParams':{
                    'interType':'',
                    'subInterType':''
                }
            }
     
            if($scope.module == 'trade'){
                config.urlParams.platformIds = $scope.platformValue;
                config.seatParams.interType = $scope.interType;
                if($scope.submodule == 'pay'){
                    config.urlParams.bizCompanyIds = $scope.customerValue;
                }else{
                    config.urlParams.bizCompanyIds = $scope.userListCode;
                }
            }else{
                if($scope.submodule == 'pay'){
                    config.urlParams.customerIds = $scope.customerValue;
                }else{
                    config.urlParams.customerIds = $scope.userListCode;
                }
            }
            config.seatParams.subInterType = $scope.subInterType;
            billCreationService.promptMidBox('', data, $scope.lang.confirm_effect, function(){
                billCreationService.generateBills(config, function(res){
                    billCreationService.promptBox(res);
                    if(res.errorCode === 0){
                        $scope.loadListData();
                    }
                });
            });
        };



        $scope.searchTaskList = function(){
            $scope.loadListData();
        };

        $scope.clearSearch = function(){
            billCreationService.clearSearch($scope);
            $scope.search.taskStartTime = initTaskTime.start;
            $scope.search.taskEndTime = initTaskTime.end;
            $scope.taskStatusName = '全部';
            $scope.search.taskStatus = '';
            $scope.loadListData();
        };

        $scope.deleteTask = function(){
            var data = getSelectedData();

            if(billCreationService.checkData(data)) return;

            var config = {
                'urlParams':data,
                'seatParams':{
                    'interType':'',
                    'subInterType':''
                }
            }
            if($scope.module == 'trade'){
                config.seatParams.interType = $scope.interType;
            }
            if($scope.module == 'logistics'){
                config.seatParams.interType = '';
            }
            config.seatParams.subInterType = $scope.subInterType;
            billCreationService.promptMidBox('',{msg : '确定删除已选任务？'},'', function(){
                billCreationService.deleteTask(config, function(res){
                    billCreationService.promptBox(res);
                    if(res.errorCode == 0) {
                        $scope.loadListData();
                    }
                });
            });
        };

        $scope.repeatGenerateBills = function(){
            var data = getSelectedData(), obj;
            if(billCreationService.checkData(data)) return;
            if($scope.module == 'trade'){
                obj = data;
            }else{
                obj = {
                    "taskCodes":data,
                    "customers":userListResult
                };
            }
            var config = {
                'urlParams':obj,
                'seatParams':{
                    'interType':'',
                    'subInterType':''
                }
            };
            if($scope.module == 'trade'){
                config.seatParams.interType = $scope.interType;
            }
            if($scope.module == 'logistics'){
                config.seatParams.interType = '';
            }
            config.seatParams.subInterType = $scope.subInterType;
            billCreationService.repeatGenerateBills(config, function(res){
                billCreationService.promptBox(res);
                if(res.errorCode == 0) $scope.loadListData();
            });
        }

        $scope.canDel = function(type){
            var selectedData = tableService.getSelectTable($scope.tableModel.tableBody),
                completeItem = 0,
                otherItem = 0;
            if(selectedData.length === 0) return false;
            selectedData.forEach(function(item){
                if(item.taskStatus != type) otherItem++;
                else completeItem++;
            });
            return !(otherItem === 0 && completeItem > 0);
        };

        function getSelectedData(){
            var selectedData = tableService.getSelectTable($scope.tableModel.tableBody);
            selectedData = selectedData.map(function(item){
                return item.taskCode;
            });
            return selectedData;
        }

        if(!billCreationService.statusList) {
            var params = { seatParams: { subInterType: $scope.subInterType } }
            billCreationService.getTaskStatus(params, function(res){
                $scope.statusList = res;
                res.data.unshift({name : '全部',code : ''})
                billCreationService.statusList = res;
            });
        } else {
            $scope.statusList = billCreationService.statusList;
        }

        var originUserList = null;

        $scope.initUserList = function(){
            if($scope.userList){
                return;
            }
            var config = {
                'urlParams': {
                    'q': '',
                    'pageIndex': 1,
                    'pageSize': 10,
                    'isAsc':false,
                    'sortName': '',
                    'userType': $scope.userType
                }
            }
            billCreationService.getCurrentUserVisibleUserList(config, function(res){
                res.data.forEach(function(item){
                    item.name = item.userName + ' (' + item.code + ')';
                });
                $scope.userList = res;
                if(!originUserList) originUserList = res;
            });
        };

        $scope.resetUserList = function(){
            if(billCreationService['userList_' + $scope.num] && originUserList){
                billCreationService['userList_' + $scope.num].setData(originUserList);
            }
        };

        $scope.unwatcher.push($scope.$watch("statusList", function(data,old){
            data.data.forEach(function(item){
                if(item.name === '全部'){
                    $scope.taskStatusName = item.name;
                    $scope.search.taskStatus = item.code;
                }
            });
            if(data)
                setTimeout(function(){
                    selectFactory({
                        data: data,
                        id: 'task_status_' + $scope.num ,
                        offset: -300,
                        attrTextModel: function(name, data, currentData) {
                            if(name == '全部'){
                                delete $scope.taskStatusName;
                                delete $scope.search.taskStatus;
                                delete $scope.tableModel.restData.taskStatus;
                            }
                            $scope.taskStatusName = name;
                            $scope.search.taskStatus = currentData.code;
                            $scope.$apply();
                        }
                    });
                },200);

            $scope.loadListData();
        }));

        var userListResult = [];

        $scope.unwatcher.push($scope.$watch("userList", function(data,old){
            if(data)
            {
                if(billCreationService['userList_' + $scope.num]){
                    billCreationService['userList_' + $scope.num].setData(data);
                }else{
                    billCreationService.createSelect('userList_' + $scope.num, data, function(name, data, currentData) {
                        if(name){
                            var names = name.split("，");
                            data.data.forEach(function(item){
                                names.forEach(function(name){
                                    if(name == item.name){
                                        if(userListResult.indexOf(item.id) === -1) userListResult.push(item.id);
                                    }
                                });
                            });
                            $scope.userListCode = userListResult;

                        }else{
                            delete $scope.userListCode;
                            userListResult = [];
                        }
                        $scope.$apply();
                    }, 'mutile', function(attachEvent, q, currentPage){
                        if(!currentPage) {
                            currentPage = 1;
                        }
                        q = q ? q : '';
                        var config = {
                            'urlParams': {
                                'q': q? q.trim():"",
                                'pageIndex': currentPage,
                                'pageSize': 10,
                                'isAsc':false,
                                'sortName': '',
                                'userType': $scope.userType
                            }
                        };
                        billCreationService.getCurrentUserVisibleUserList(function(res){
                            res.data.forEach(function(item){
                                item.name = item.userName + ' (' + item.code + ')';
                            });
                            $scope.userList = res;
                            $scope.$apply();
                        },config);
                    });
                }}



        }));

        function initCalander(){
            var calander = [["#begin-time","#finish-time"],["#taskStartTime","#taskEndTime"],["#startEffectTime","#endEffectTime"]];
            setTimeout(function(){
                calander.forEach(function(cal, index){
                    var isClear = false;
                    if(index > 0) isClear = true;
                    Calander.init({ele: cal, isClear : isClear});
                });
            },0);
        }

        initCalander();

    }
});
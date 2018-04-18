app.controller("customerMessageNotifyCtrl", ["$scope", "customerService", "tableService", function($scope, customerService, tableService) {

    $scope.IsEdit = false;
    $scope.editMessageNotify = function () {
        $scope.IsEdit = !$scope.IsEdit;
        $(".subContainer input:checkbox").attr('disabled',false);
    }


    function checkSave(sendTypes,refIds) {
        if(sendTypes.length == 0 && refIds.length != 0){
            $(document).promptBox({isDelay: true, contentDelay: "请至少选择一种通知方式！", type: 'errer', manualClose: true});
            return false;
        }

        if(sendTypes.length != 0 && refIds.length == 0){
            $(document).promptBox({isDelay: true, contentDelay: "请至少选择一个通知节点！", type: 'errer', manualClose: true});
            return false;
        }

    }
    $scope.save = function () {

        var sendTypes = [];
        var refIds =[];
        if($scope.notifyMethod[0].selected === true){
            sendTypes.push('sms');
        }
        if($scope.notifyMethod[1].selected === true){
            sendTypes.push('email');
        }


        for(var index=0;index < $scope.notifyNodeType.length ;index++){
            if($scope.notifyNodeType[index].selected === true){
                refIds.push($scope.notifyNodeType[index].id);

            }
        }

        if(checkSave(sendTypes,refIds) === false){
            return;
        }


        var param={
            seatParams:{
                customerId:$scope.customerId
            },
            urlParams:
                [
                    {
                    'refIds': refIds,
                    'sendTypes': sendTypes,
                    'refParentId': 1,
                    }
                ]
        }
        
        customerService.saveMessageNotify(param,function (data) {
            if (data.errorCode != 0 ) {//服务器异常
                $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
            } else{
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: data.msg,
                    type: 'success',
                    time: 3000
                });
                $scope.IsEdit = !$scope.IsEdit;
                $(":checkbox").attr('disabled',true);
            }
            
        })

    }




    $scope.$on("messageNotifyEvent", function(event, data) {
        $scope.IsEdit = false;
        var param={
            seatParams:{
                customerId:$scope.customerId
            }
        }
        customerService.getMessageNotify(param,function (res) {
            $scope.notifyMethod = res.data.messageTypeItems;  
            $scope.notifyNodeType = res.data.children;
            $(":checkbox").attr('disabled',true);
            $scope.$apply();

        })



    });
}]);

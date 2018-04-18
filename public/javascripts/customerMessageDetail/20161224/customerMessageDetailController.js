app.controller('customerMessageDetailCtrl', ['$scope','$route' ,'customerMessageDetailService', 'customerMessageDetailView','$route',
    function($scope, $route,customerMessageDetailService, customerMessageDetailView,$route) {

    $scope.Solved=function () {
        var params={
            'seatParams':{
                id:$scope.id
            }
        };
        customerMessageDetailService.closeLeaveMsg(params,function (returnData) {
            if(returnData.errorCode != 0){
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});

            }else{
                //关闭对话框
                $scope.showDialog = false;
                $('#main').css('height','100%');
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000})
            }
        })
    }



    $scope.loadMore =function () {

        if($scope.id){
            var param={
                'seatParams':{
                    pageSize:10,
                    pageIndex:$scope.index,
                    refAskBoardId:$scope.id
                }
            }
            var div = document.getElementById('messageList');  //滚动条的位置
            $scope.showLoding = true;
            customerMessageDetailService.getMsgHistoryList(param,function (returnData) {
                $scope.showLoding = false;

                if(returnData.errorCode == 0 && returnData.data && $scope.index <= $scope.totalPage){
                    $scope.totalPage = returnData.pagination.totalPage;
                    for(var index=0;index < returnData.data.length;index++){
                        if(returnData.data[index].isModerator){
                            customerMessageDetailView.insertCustomerDialogPre(returnData.data[index]);
                        }else{
                            customerMessageDetailView.insertServiceDialogPre(returnData.data[index]);
                        }
                    }
                    $scope.index++;

                    div.scrollTop = 75;// 加载成功后定位滚动条

                }else{
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});

                    div.scrollTop = 0;
                }

            })
        }

    }

    $scope.goBack = function() {
        if($route.current.params && $route.current.params.fromMenu){
            top.location.href =  "http://" + location.host +
                "/#/" + 'workOrderDetail?id=' +  $route.current.params.workOrderId;
        }else{
            top.location.href =
                "http://" + location.host +
                "/#/" + 'customerMessage';
        }

    }

    $scope.summit = function () {

        if(!$scope.message){
            return;
        }

        var param = {
            urlParams:{
                messageBody:$scope.message,
                refAskBoardId:$scope.id
            }

        }

        customerMessageDetailService.leaveMsg(param,function (returnData) {
            if(returnData.errorCode != 0) {
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});

            }else{
                var msg={
                    time:returnData.data.createTime,//从后台取，显示到界面上
                    content:$scope.message,
                    pic:returnData.data.avatarFilePath,
                    refReplyerFullName:returnData.data.refReplyerFullName,
                    name:''
                };


                if(msg.refReplyerFullName.length > 3){
                    msg.name = msg.refReplyerFullName.substring(0,3)+'...';
                }else{
                    msg.name = msg.refReplyerFullName;
                }

                if(!msg.pic) {
                    var sex = cookie.get('sex');
                    msg.pic = sex=='f'?'/public/img/avatar2.png':'/public/img/avatar1.png';
                }
                customerMessageDetailView.summitMsg(msg);
                $scope.message='';
            }
        })
    }

    function getHistoryList() {
        if($scope.id){
            var param={
                'seatParams':{
                    // pageSize:$scope.showDialog == true? 10:10,
                    pageSize:10,
                    pageIndex:1,
                    refAskBoardId:$scope.id
                }
            }
            customerMessageDetailService.getMsgHistoryList(param,function (returnData) {
                if(returnData.errorCode == 0 && returnData.data){

                    $scope.totalPage = returnData.pagination.totalPage;
                    for(var index=0;index < returnData.data.length;index++){

                        if(returnData.data[index].isModerator){
                            if(!returnData.data[index].avatarFilePath) {
                                returnData.data[index].avatarFilePath = '/public/img/avatar-client.png';
                            }
                            customerMessageDetailView.insertCustomerDialogPre(returnData.data[index]);
                        }else{
                            if(!returnData.data[index].avatarFilePath){
                                var sex = cookie.get('sex');
                                returnData.data[index].avatarFilePath = sex=='f'?'/public/img/avatar2.png':'/public/img/avatar1.png'
                            }


                            if(returnData.data[index].refReplyerFullName.length > 3){
                                returnData.data[index].name = returnData.data[index].refReplyerFullName.substring(0,3)+'...';
                            }else{
                                returnData.data[index].name = returnData.data[index].refReplyerFullName;
                            }
                            customerMessageDetailView.insertServiceDialogPre(returnData.data[index]);
                        }
                    }

                }else{
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }

            })

            var div = document.getElementById('messageList');  //滚动到底部
            div.scrollTop = div.scrollHeight;
        }
    }

    function getRouteParam() {

        $scope.id = $route.current.params.id;
        $scope.showDialog = !($route.current.params.status === 'true');
        $scope.isJustShow = $route.current.params.isJustShow || false;
        if($scope.showDialog == false) {
            $('#main').css('height','100%');
        }
        $scope.userName = $route.current.params.userName;
        $scope.customerType = $route.current.params.customerType;
        if($scope.customerType == 'anony'){
            $scope.anonyTel = ($route.current.params.anonyTel == '' || $route.current.params.anonyTel == 'null') ?'无':$route.current.params.anonyTel;
            $scope.anonymity = ($route.current.params.anonymity == ''|| $route.current.params.anonymity == 'null')? '无':$route.current.params.anonymity;
        }else{
            $scope.refCustomerId = $route.current.params.refCustomerId;
            var param={
                'seatParams':{
                    id:$scope.refCustomerId
                }
            }

            customerMessageDetailService.getCustomerDetailInfo(param,function (returndata) {
                $scope.loginCustomerInfo = returndata.data;
            })
        }
    }

    $scope.inputKeyUp = function (event) {
        var keycode = window.event?event.keyCode:event.which;


        if(event.ctrlKey && event.keyCode==13) {
            $scope.message = $scope.message +'\r';
            console.log($scope.message,"message")
            return;
        }
        if(keycode==13){
            $scope.summit();
            $('.text-legth').css('display','none');
        }


    }

    $scope.CreatOrder = function () {
        var url = "http://" + location.host +
            "/#/" + 'workOrderDetail?fromMenu=' + "customerMessageDetail&askboradid=" +
            $route.current.params.id +
            "&status="+ $route.current.params.status +
            "&refCustomerCode="+ $route.current.params.refCustomerCode +
            "&customerType="+ $route.current.params.customerType +
            "&refCustomerId="+ $route.current.params.refCustomerId +
            "&userName=" + $route.current.params.userName;

        if($route.current.params.anonyTel){
            url += "&anonyTel=" + $route.current.params.anonyTel;
        }
        if($route.current.params.anonymity){
            url += "&anonymity=" + $route.current.params.anonymity;
        }
        top.location.href = url;
    };


    function init() {

        getRouteParam();
        getHistoryList();

        $scope.index = 2; //再次加载从2页开始
        $('#messageList').scroll(function () {
            console.log($('#messageList').scrollTop())

            if($('#messageList').scrollTop() == 0){
                $scope.loadMore();
            }

        });
        reSetMenuCssStatus("#/customerMessage");
    }
    init();
}]);

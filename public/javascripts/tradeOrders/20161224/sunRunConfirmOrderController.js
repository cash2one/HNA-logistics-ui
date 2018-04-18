easySpa.require([
	"service/templateService"
], function(){
    app.controller("sunRunConfirmOrderController",['$scope','tradeOrdersService','tradeOrdersView', 'templateService', sunRunConfirmOrderController]);

// orderStatusCode
// 2 是待发货
// 3 是待收货

    function sunRunConfirmOrderController($scope, tradeOrdersService,tradeOrdersView, templateService){

        $scope.IsEdit = true;
        $scope.template = {};


        function initPaymentClause() {
            if($scope.writeFirstTime){
                $scope.template.paymentClause = "30 days from date of delivery.\nAn interest of 3 percentage per month will apply for any overdue payment";
            }
        }

        //buyer



        $scope.$watch('template.shipName',function () {
            $scope.template.purchaser = 'M/V '+ $scope.template.shipName +
                ' and/or master and/or owners and/or charterers and/or\nmanagers and/or operators and/or '+
                $scope.template.purchaserCompanyName;

        })

        function initPurchase(){

            $scope.template.purchaser =
                ' and/or master and/or owners and/or charterers and/or managers and/or operators and/or '+
                $scope.template.purchaserCompanyName;

        }


        function initRemark() {

            if($scope.writeFirstTime){
                $scope.template.note = 'BARGE FIGURE TO BE FINAL AND BINDING.\nDELIVERY SUBJECT TO WEATHER CONDITIONS.'
            }
        }


        function initCalander() {


            setTimeout(function () {

                Calander.init({
                    ele: "#transportStartTime",
                    isClear: true
                });
                Calander.init({
                    ele: "#transportEndTime",
                    isClear: true
                });

                Calander.init({
                    ele: "#createTime",
                    isClear: true
                });
                Calander.init({
                    ele: "#sailStartTime",
                    isClear: true
                });
                Calander.init({
                    ele: "#sailEndTime",
                    isClear: true
                });

                Calander.init({
                    ele: "#reachStartTime",
                    isClear: true
                });
                Calander.init({
                    ele: "#reachEndTime",
                    isClear: true
                });

            }, 0);

        }




        function init() {

            $scope.pageSize = 1;
            getOrderInfo();

        }

        function getOrderInfo() {
            tradeOrdersService.getOrderConfrmByOrderNo($scope.orderNo,function (res) {

                if(res.errorCode == 0){

                    $scope.writeFirstTime = res.data.jsonData ? false:true; //是否为第一次填写

                    $scope.template = JSON.parse(res.data.jsonData) || {};//自己手动输入的部分来自于jsonData，有交互的还是来自外层
                    $scope.template.purchaserCustomerName = res.data.purchaserCustomerName;
                    $scope.template.businessNo = res.data.businessNo;
                    $scope.template.orderGoods = res.data.orderGoods;
                    $scope.template.orderNo = res.data.orderNo;
                    $scope.template.purchaserCompanyName = res.data.purchaserCompanyName || res.data.purchaserCustomerName;//有可能客户注册的时候不填写

                    // $scope.template.purchaserCompanyName = tradeOrdersView.StringInsertByInterval($scope.template.purchaserCompanyName,'\n',100)//处理itext不能回车的问题，郁闷
                    angular.forEach($scope.template.orderGoods,function (item) {
                        item.goodsName = tradeOrdersView.StringInsertByInterval(item.goodsName,'\n',30);

                    })

                    initData();
                }else{
                    tradeOrdersView.promptBox({msg:res.msg});
                }
            });
        }

        function initOurCompanyAddr() {
            if($scope.writeFirstTime)
            {
                $scope.template.companyAddress = 'Sunrun Bunkering Limited\n4F HNA Tower\nNo. 898 Puming Road\nShanghai, China';
            }
        }

        function initOurCompanyPhoneAndFax() {
            if($scope.writeFirstTime)
            {
                $scope.template.companyPhone = '+862161759009';
                $scope.template.companyFax = '+862161759000';
            }

        }
        
        function initContactEmail() {
            if($scope.writeFirstTime)
            {
                $scope.template.companyEmail = 'wang_ye@hnair.com';
                $scope.template.representativeName = 'Yale Wang';
            }
            
        }


        function initData(){

            initPaymentClause();
            initPurchase();
            //initAgent();
            initRemark();
            initCalander();
            initOurCompanyAddr();
            initOurCompanyPhoneAndFax();
            initContactEmail();
            if($scope.writeFirstTime){
                $scope.template.createTime = tradeOrdersView.DataFormat(new Date().format('yyyy-MM-dd 00:00:00'));
            }

        }

        init();

        // 暂时，监视如果一个填了，就去掉标红
        $scope.$watch('template.transportStartTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#transportStartTime").css('border-color','#BDBDBD');
                $("#transportEndTime").css('border-color','#BDBDBD');
            }

        },true)

        $scope.$watch('template.transportEndTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#transportStartTime").css('border-color','#BDBDBD');
                $("#transportEndTime").css('border-color','#BDBDBD');
            }

        },true)

        $scope.$watch('template.sailStartTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#sailStartTime").css('border-color','#BDBDBD');
                $("#sailEndTime").css('border-color','#BDBDBD');
                $("#reachStartTime").css('border-color','#BDBDBD');
                $("#reachEndTime").css('border-color','#BDBDBD');
            }

        },true)

        $scope.$watch('template.sailEndTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#sailStartTime").css('border-color','#BDBDBD');
                $("#sailEndTime").css('border-color','#BDBDBD');
                $("#reachStartTime").css('border-color','#BDBDBD');
                $("#reachEndTime").css('border-color','#BDBDBD');
            }

        },true)

        $scope.$watch('template.reachStartTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#sailStartTime").css('border-color','#BDBDBD');
                $("#sailEndTime").css('border-color','#BDBDBD');
                $("#reachStartTime").css('border-color','#BDBDBD');
                $("#reachEndTime").css('border-color','#BDBDBD');
            }

        },true)

        $scope.$watch('template.reachEndTime',function (newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if(newValue){
                $("#sailStartTime").css('border-color','#BDBDBD');
                $("#sailEndTime").css('border-color','#BDBDBD');
                $("#reachStartTime").css('border-color','#BDBDBD');
                $("#reachEndTime").css('border-color','#BDBDBD');
            }

        },true)


        function canSubmit() {


            var transportTimeOK = true;
            var sailAndReachTimeOK = true;


            var formCheckField = ['custCompanyNickName','businessNo','custCompanyAddress','shipName','destinationPort','imoCode',
                'paymentClause','purchaser','note','representativeName','representativePhone','companyAddress',
                'companyPhone','companyFax','companyEmail'];

            formCheckField.forEach(function (checkField) {
                if(!$scope.template[checkField]){
                    $scope.sunRunTemplate[checkField].$setDirty();
                }

            })


            if(!$scope.template.transportStartTime && !$scope.template.transportEndTime){
                $("#transportStartTime").css('border-color','rgb(250, 120, 126)'); //红色
                $("#transportEndTime").css('border-color','rgb(250, 120, 126)');
                transportTimeOK = false;
            }

            if(!$scope.template.sailStartTime && !$scope.template.sailEndTime && !$scope.template.reachStartTime && !$scope.template.reachEndTime){
                $("#sailStartTime").css('border-color','rgb(250, 120, 126)');
                $("#sailEndTime").css('border-color','rgb(250, 120, 126)');
                $("#reachStartTime").css('border-color','rgb(250, 120, 126)');
                $("#reachEndTime").css('border-color','rgb(250, 120, 126)');
                sailAndReachTimeOK = false;
            }



            var errorEles = $(".errors");
            for (var index = 0; index < errorEles.length; index++) {
                if (!$(errorEles[index]).hasClass("ng-hide")) {
                    return false;
                }
            }

            return $scope.sunRunTemplate.$valid && transportTimeOK && sailAndReachTimeOK ;
        }

        function InsertInterVal(word) {
            if(!word) return;
            var wordArray = word.split('\n');
            var finalArray = [];

            angular.forEach(wordArray,function (item) {
                var sentence = tradeOrdersView.StringInsertByInterval(item,'\n',90);
                finalArray.push(sentence);
            })
            return finalArray.join('\n');
        }


        $scope.confirm = function () {


            if (canSubmit() == false) {
                scrollToErrorView($("#form-content"))
                return;
            }

            $scope.template.purchaserCompanyName = tradeOrdersView.SectionBreakWord($scope.template.purchaserCompanyName,50)//处理itext不能回车的问题，郁闷
            $scope.template.companyAddress = tradeOrdersView.SectionBreakWord($scope.template.companyAddress,40);
            $scope.template.custCompanyAddress = tradeOrdersView.SectionBreakWord($scope.template.custCompanyAddress,40);
            $scope.template.paymentClause = tradeOrdersView.SectionBreakWord($scope.template.paymentClause,90);
            $scope.template.agent = tradeOrdersView.SectionBreakWord($scope.template.agent,90);
            $scope.template.note = tradeOrdersView.SectionBreakWord($scope.template.note,90);


            tradeOrdersView.promptMidBox('', {msg: '确定提交信息？'}, '', function () {
                tradeOrdersService.saveOrderConfirm($scope.template,function (res) {
                    if (res.errorCode == 0) {
                        var param = {
                            urlParams:encodeURIComponent($("#sunRunConfirmOrder").html()),

                            seatParams: {
                                "orderNo": $scope.template.orderNo,
                                "type": 1
                            }
                        }

                        tradeOrdersService.exportPDFByOrderNo(param, function (returnData) {
                            tradeOrdersView.promptBox(returnData);
                            $scope.fileUrl = returnData.data.fileUrl;
                            $scope.pageSize = returnData.data.pageSize;
                            $scope.IsEdit = false;
                            $scope.$apply();

                        })

                    }else{
                        tradeOrdersView.promptBox(res);
                    }
                })

            });

        }

        $scope.goodsNum = function (goodsNum) {
            if(!goodsNum){return null}
            var num = Number(goodsNum).toFixed(4);
            return num;

        }

        $scope.goodsPrice = function (goodsPrice) {
            var price = Number(goodsPrice).toFixed(2);
            return price;
        }

        $scope.createTimeFormat = function (dateInput) {
            $scope.template.createTime = tradeOrdersView.DataFormat(dateInput);

        }

        $scope.transportStartTimeFormat = function (dateInput) {
            $scope.template.transportStartTime = tradeOrdersView.DataFormat(dateInput);
        }

        $scope.transportEndTimeFormat = function (dateInput) {
            $scope.template.transportEndTime = tradeOrdersView.DataFormat(dateInput);
        }

        $scope.sailStartTimeFormat = function (dateInput) {
            $scope.template.sailStartTime = tradeOrdersView.DataFormat(dateInput);
        }

        $scope.sailEndTimeFormat = function (dateInput) {
            $scope.template.sailEndTime = tradeOrdersView.DataFormat(dateInput);

        }

        $scope.reachStartTimeFormat = function (dateInput) {
            $scope.template.reachStartTime = tradeOrdersView.DataFormat(dateInput);

        }

        $scope.reachEndTimeFormat = function (dateInput) {
            $scope.template.reachEndTime = tradeOrdersView.DataFormat(dateInput);
        }
    }
});
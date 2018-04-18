easySpa.require([
	'widget/slimscroll',
	'widget/prompt',
	'widget/parseUrl',
	'public/javascripts/billCreation/20161224/taskList.js',
	'public/javascripts/billCreation/20161224/billList.js',
	'public/javascripts/billCreation/20161224/dateTime.js',
	'public/common/calander.js'
], function(){
    app.controller('billCreationCtrl',['$scope','billCreationService','billCreationView','$compile', BillCreationCtrl]);
    function BillCreationCtrl($scope, billCreationService, billCreationView, $compile) {
        var route = location.hash.indexOf("from=billCreation");
        $scope.parameter = window.parseUrl.getParams();
        $scope.module = $scope.parameter.module ? $scope.parameter.module : 'logistics';
        $scope.submodule = $scope.parameter.submodule;
        //物流和贸易接口区分。
        $scope.interType = $scope.module == 'trade' ? 'trd' : '';
        //贸易的有应收应付。物流的暂时没有。
        // $scope.subInterType = $scope.module == 'trade' ? $scope.submodule : '';
        // $scope.subInterType = $scope.module;
        if ($scope.module == 'trade') {
            $scope.subInterType = $scope.submodule;
        }
        if ($scope.module == 'logistics') {
            $scope.subInterType = $scope.submodule == 'pay' ? '1' : '2';
        }
        $scope.userType = $scope.module == 'trade' ? 2 : 1;

        if(route === -1){
            route = 'taskList';
        }else{
            route = 'billList';
        }

        billCreationService.bill = $("#bill");

        $scope.switchTab = function(e, name){
            if(billCreationService.nowScope){
                billCreationService.nowScope.unwatcher.forEach(function(watcher){ watcher() });
                billCreationService.nowScope.$destroy();
            }
            $scope.cname = name;
            billCreationService.getTpl(name).then(function(tpl){
                billCreationService.bill.html($compile(tpl)($scope.$new()));
            });
            $scope.platform = '';
            $scope.customerName = '';
            if(name == 'taskList'){
                $scope.platformValue = [];
                $scope.customerValue = [];
            }else{
                $scope.platformValue = '';
                $scope.customerValue = '';
            }
        };

        $scope.count = 0;

        $scope.lang = Lang.dataPool['billCreation'];

        $scope.switchTab(null, route);

        $scope.clear = function(){
            $scope.platform = $scope.platformValue = '';
            $scope.customerIds = $scope.customerName = $scope.customerValue = '';
            $(".customerName").val('');
        };

        /**
         * 显示平台实体下拉框
         */
        var platformEle;
        if($scope.cname == 'billList'){
            $scope.platformValue = '';
        }else{
            $scope.platformValue = [];
        }
        $scope.getPlatform = function(){
            Select.sharePool['select-platform'] = null;
            $scope.platformData = billCreationService.getPlatformData();
            var selectConfig = {
                data: $scope.platformData,
                defaultText: '全部',
                id: "select-platform",
                multipleSign: ",",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                attrTextModel: function(name){
                    $scope.platform = name;
                    $scope.$apply();
                }
            };
            if($scope.cname == 'billList'){
                selectConfig.attrTextId = function(id){
                    if(id){
                        $scope.platformValue = $scope.platformValue ?  ($scope.platformValue + ',' + id) : id;
                    }else{
                        $scope.platformValue = '';
                    }
                    $scope.$apply();
                }
            }else{
                selectConfig.attrTextId = function(id){
                    if(id){
                        $scope.platformValue.push(id);
                    }else{
                        $scope.platformValue = [];
                    }
                    $scope.$apply();
                }
            }

            platformEle = selectFactory(selectConfig);
            platformEle.open();
            $('#select-platform').val($scope.platform);
        };
        $scope.$watch('platformValue',  function(newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if($scope.cname == 'billList'){
                if(!newValue){
                    $scope.platformValue = '';
                }
            }else{
                if(!newValue.length){
                    $scope.platformValue = [];
                }
            }
        }, true);

        //供应商
        if($scope.cname == 'billList'){
            $scope.customerValue = '';
        }else{
            $scope.customerValue = [];
        }
        $scope.getSupplierListData = function(q, currentPage){
            q = q ? q : '';
            var config = {
                'urlParams': {
                    'q': q,
                    'pageIndex':currentPage,
                    'pageSize':10
                },
                'seatParams':{
                    'intertype':$scope.module
                }
            };
            var data = billCreationService.getSupplierList(config);
            angular.forEach(data.data, function(value, key){
                value.name += "(" + value.code + ")";
            });
            return data;
        };
        $scope.getSupplier = function(){
            Select.sharePool['select-supplier'] = null;
            //$scope.supplierData = $scope.getSupplierListData();

            var selectConfig = {
                data: [],
                isSearch:true,
                isUsePinyin:true,
                multipleSign: ",",
                searchPlaceHoder:"请输入供应商名称或编码",
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-supplier",
                showTextField: "name",
                pagination:true,
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.supplierData = $scope.getSupplierListData(data, currentPage);
                    attachEvent.setData($scope.supplierData);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    $scope.customerValue = $scope.customerValue ?  ($scope.customerValue + ',' + id) : id;

                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.customerName = name;
                    $scope.$apply();
                }
            };
            if($scope.cname == 'billList'){
                selectConfig.attrTextId = function(code){
                    if(code){
                        $scope.customerValue = $scope.customerValue ?  ($scope.customerValue + ',' + code) : code;
                    }else{
                        $scope.customerValue = '';
                    }
                    $scope.$apply();
                }
            }else{
                selectConfig.attrTextId = function(code){
                    if(code){
                        $scope.customerValue.push(code);
                    }else{
                        $scope.customerValue = [];
                    }
                    $scope.$apply();
                }
            }
            var supplierEle = selectFactory(selectConfig);
            supplierEle.open();
            //$('#select-supplier').val($scope.customerName);
        };

        $scope.$watch('customerName',  function(newValue, oldValue) {
            if (newValue === oldValue) {return; }
            if($scope.cname == 'billList'){
                if(!newValue){
                    $scope.customerValue = '';
                }
            }else{
                if(!newValue.length){
                    $scope.customerValue = [];
                }
            }
        }, true);
    }
});
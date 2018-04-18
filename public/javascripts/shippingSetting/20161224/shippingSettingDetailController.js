app.controller("shippingSettingDetailCtrl", ["$scope", "shippingSettingService", "tableService", function($scope, shippingSettingService, tableService) {

    $scope.data={};
    $scope.showShippingSettingDetail = false;
    var DATE_FORMAT = /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/;

    //////////////////////////////////更新详情表 start

    function setScroll() {
        $(".table-container tbody").slimScroll({
            height: $('.content-main').height() - 250
        });
    }

    function refreshShippingSettingDetailTable() {
        var params = {
            'urlParams': $scope.tableModel.restData,
            'seatParams':{'id':$scope.data.shippingLineId}
        };
        tableService.getTable($scope.tableModel.restURL, params, function(data) {
            $scope.q = $scope.tableModel.restData.q;
            $(".table-box").css("zoom", "1.0000001");//刷新表格让其对齐
            if(data.errorCode === 0) {
                $scope.tableModel = tableService.table($scope.tableModel, params, data);
                setTimeout(function() {
                    //setScroll();
                    $(window).on("resize", setScroll);
                    $("#detailTable .table-box").focus();
                    resizeTable();
                    $scope.$apply();
                    $("#detailTable .table-box").css("zoom", "1");
                }, 400);
            }
        });
    }

    $scope.tableModel = {
        tableHeader: ['港口', '到港时间','截关时间', '截货时间', '离港时间'],
        tableHeaderSize: ['20%', '20%', '20%', '20%', '20%'],
        tableBody: [],
        restURL: 'logistics.getShippingLineDetail',
        restData: {
            q: '',
            refCombos: '',
            isAsc: false,
            pageIndex: 1,
            pageSize: 100
        },
        selectNumber: 0,
        selectFlag: false
    };

    //////////////////////////////////更新详情表 end
    
    //////////////////////////////////检查海运航班航次号是否唯一 start
    $scope.checkShippingVesselUnique = function () {
        if(!$scope.data.shippingVessel) return;
        var param={
            seatParams:{
                'id':$scope.id ? $scope.id:'',
                'code':$scope.data.shippingVessel
            }
        };
        shippingSettingService.checkShippingVesselUnique(param,function (rtn) {
            if(rtn.errorCode != 0){
                $("#shippingVessel").addClass("errors");
                $scope.showShippingVesselUniqueError = true;
            }else{
                $("#shippingVessel").removeClass("errors");
                $scope.showShippingVesselUniqueError = false;
            }

        })
    };

    $scope.clearUniqueError = function () {
        $scope.showShippingVesselUniqueError = false;
    };

    //////////////////////////////////检查海运航班航次号是否唯一 end


    //////////////////////////////////船名称select框 start

    function getShippingShort(q, currentPage){
        q = q ? q : '';
        var config = {
            'q': q? q.trim():"",
            'pageIndex': currentPage? currentPage:1,
            'pageSize': 10
        };
        return shippingSettingService.getShippingShort(config);
    }

    function reBuildShipName(data) {
        angular.forEach(data, function(value, key){
            value.name = value.nameEn + "(" + value.imo + ")";
        });
    }


    $scope.getShippingName = function(){

        var select = selectFactory({
            data: [],
            isSearch:true,
            isUsePinyin:true,
            pagination: true,
            id: "shippingName",
            showTextField: "name",
            defaultText:"请选择",
            searchPlaceHoder:"请输入船名或编码",
            attrTextField: {
                "ng-value": "id"
            },
            closeLocalSearch: true,
            onSearchValueChange: function(attachEvent, data,currentPage) {
                $scope.shippingName = getShippingShort(data,currentPage);
                reBuildShipName($scope.shippingName.data);
                attachEvent.setData($scope.shippingName);
                $scope.$apply();
            },
            attrTextId: function(id){
                if(!id){
                    $scope.data.shippingNameId = '';
                }else{
                    $scope.data.shippingNameId = id;
                }
                $scope.$apply();
            },
            attrTextModel: function(name){
                $scope.data.shippingName = name.split('(')[0];
                $scope.$apply();
            }
        });

        // select.setData($scope.shippingName);
        select.open();
    };

    //////////////////////////////////船名称select框 end


    /////////////////////////////////航线select框 start

    function getShippingLineShort(q, currentPage){
        q = q ? q : '';
        var config = {
            'q': q? q.trim():"",
            'pageIndex': currentPage? currentPage:1,
            'pageSize': 10
        };
        return shippingSettingService.getShippingLineShort(config);
    }

    function reBuildName(data) {
        angular.forEach(data, function(value, key){
            value.name = value.name + "(" + value.code + ")";
        });
    }



    $scope.getShippingLine = function(){
        var select = selectFactory({
            data: [],
            isSearch:true,
            isUsePinyin:true,
            pagination: true,
            id: "shippingLine",
            showTextField: "name",
            defaultText:"请选择",
            searchPlaceHoder:"请输入航线名或编码",
            attrTextField: {
                "ng-value": "id"
            },
            closeLocalSearch: true,
            onSearchValueChange: function(attachEvent, data,currentPage) {
                $scope.shippingLine = getShippingLineShort(data,currentPage);
                reBuildName($scope.shippingLine.data);
                attachEvent.setData($scope.shippingLine);
                $scope.$apply();
            },
            attrTextId: function(id){
                if(!id){
                    $scope.data.shippingLineId = '';
                }else{
                    $scope.data.shippingLineId = id;
                    refreshShippingSettingDetailTable();
                    InitTimeSelect();

                }
                $scope.$apply();
            },
            attrTextModel: function(name){
                $scope.data.shippingLineName = name.split('(')[0];
                $scope.$apply();
            }
        });

        select.open();
    };
    /////////////////////////////////航线select框 start

    /////////////////////////////////时间部分 start
    $scope.TimeFormat = function (value) {
        var formatDate = value.split(' ')[0];
        return formatDate;
    };

    function InitTimeSelect () {
        setTimeout(function () {
            for(var index=0;index < $scope.tableModel.tableBody.ports.length;index++){
                Calander.init({
                    ele: "#eta-"+index,
                    isClear: true,
                    showHour:false,
                    showMinute:false,
                    showSecond:false,
                    showTime:false
                });
                Calander.init({
                    ele: "#etd-"+index,
                    isClear: true,
                    showHour:false,
                    showMinute:false,
                    showSecond:false,
                    showTime:false
                });
                Calander.init({
                    ele: "#cargoDeadTime-"+index,
                    isClear: true,
                    showHour:false,
                    showMinute:false,
                    showSecond:false,
                    showTime:false
                });
                Calander.init({
                    ele: "#portDeadTime-"+index,
                    isClear: true,
                    showHour:false,
                    showMinute:false,
                    showSecond:false,
                    showTime:false
                });
            }
        }, 0);
    }

    /////////////////////////////////时间部分 end
    function checkSave() {
        var formCheckField = ['shippingVessel','shippingLineName','shippingName'];
        formCheckField.forEach(function (checkField) {
            if(!$scope.data[checkField]){
                $scope.shippingSettingsDetail[checkField].$setDirty();
            }
        });

        var errorEles = $(".errors");

        for (var index = 0; index < errorEles.length; index++) {
            if (!$(errorEles[index]).hasClass("ng-hide")) {
                return false;
            }
        }

        return $scope.shippingSettingsDetail.$valid ;
    }

    $scope.saveDetail = function () {
        var ports =  $scope.tableModel.tableBody.ports;
        var len =  ports.length -1,flag=false;
        var etaId = "#eta-"+ len;
        var etdId = "#etd-0";
        if(!$(etaId).val()){
            $(etaId).css("border-color","#FA787E");
            flag = true
        }
        if(!$(etdId).val()){
            $(etdId).css("border-color","#FA787E");
            flag = true
        }
        // 新增保存
        if(!checkSave()) return;
        if(flag){return;}

        var params = {
            'code':$scope.data.shippingVessel.trim(),
            'shipId':$scope.data.shippingNameId,
            'shipName':$scope.data.shippingName,
            'shippingLineId':$scope.data.shippingLineId,
            'shippingLineName':$scope.data.shippingLineName,
            'ports':$scope.tableModel.tableBody.ports
        };

        if(!$scope.id){ //新增
            shippingSettingService.addShipingLineSettingsDetail(params,function (rtn) {
                if(rtn.errorCode != 0) {
                    $(document).promptBox({isDelay: true, contentDelay: rtn.msg, type: 'errer', manualClose: true});
                }else{
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: rtn.msg,
                        type: 'success',
                        time: 3000
                    });
                    $scope.id = rtn.data; //新增后返回创建的id
                    $scope.closeDetailPage();
                }
            })
        }else{
            var modifyParams = {
                'urlParams':params,
                'seatParams':{
                    id:$scope.id
                }
            };

            shippingSettingService.modifyShipingLineSettingsDetail(modifyParams,function (rtn) {
                if(rtn.errorCode != 0) {
                    $(document).promptBox({isDelay: true, contentDelay: rtn.msg, type: 'errer', manualClose: true});
                }else{
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: rtn.msg,
                        type: 'success',
                        time: 3000
                    });
                    $scope.closeDetailPage();
                }
            })
        }
    };


    //新增一条数据

    $scope.$on("addshippingSettingDetail", function(event, data) {
        $scope.isEdit = true;
        $scope.shippingSettingsDetail.$setPristine();
        $scope.tableModel.tableBody.ports={};

        $scope.data.shippingVessel= ''; //航次号
        $scope.data.shippingNameId = '';
        $scope.data.shippingName = '';
        $scope.data.shippingLineId = '';
        $scope.data.shippingLineName = '';

        $scope.clearUniqueError();
        $scope.id = undefined;
    });

    $scope.$on("editshippingSettingDetail", function(event, value) {
        $scope.isEdit = false;
        $scope.shippingSettingsDetail.$setPristine();
        $scope.clearUniqueError();
        // 添值
        $scope.data.shippingVessel= value.code.trim();//航次号
        $scope.data.shippingNameId = value.shipId;
        $scope.data.shippingName = value.shipEnglishName;
        $scope.data.shippingLineId = value.shippingLineId;
        $scope.data.shippingLineName = value.shippingLineName;
        $scope.tableModel.tableBody.ports = JSON.parse(JSON.stringify(value.ports));
        $scope.id = value.id;
        InitTimeSelect();
    });

    $scope.edit=function(){
        $scope.isEdit = true;
        //深度拷贝
        $scope.dataKeep = JSON.parse(JSON.stringify($scope.data ));
        $scope.portsKeep = JSON.parse(JSON.stringify($scope.tableModel.tableBody.ports ));
        //点击编辑，记录页面值，返回时复原
    };

    $scope.cancelDetail = function () {
        if($scope.id){
            $scope.isEdit = !$scope.isEdit;
            $scope.tableModel.tableBody.ports =  $scope.portsKeep;

            $scope.data.shippingVessel= $scope.dataKeep.shippingVessel; //航次号
            $scope.data.shippingNameId = $scope.dataKeep.shippingNameId;
            $scope.data.shippingName = $scope.dataKeep.shippingName;
            $scope.data.shippingLineId = $scope.dataKeep.shippingLineId;
            $scope.data.shippingLineName = $scope.dataKeep.shippingLineName;
            $scope.showShippingVesselUniqueError = false;
        }else{
            $scope.closeDetailPage();
            $scope.$apply();
            $(document).promptBox('closePrompt');
        }
    };

    $scope.checkEtaTime = function (index) {
        var ports =  $scope.tableModel.tableBody.ports;
        var len =  ports.length -1;
        var etaId = "#eta-" + len;
        if(!DATE_FORMAT.test($scope.tableModel.tableBody.ports[index].etaStr)){
            $scope.tableModel.tableBody.ports[index].etaStr = '';
            if(index == len) {
                $(etaId).css("border-color", "#FA787E");
            }
        }else{
            if(index == len) {
                $(etaId).css("border-color", "#BDBDBD");
            }
        }
    };

    $scope.checkPortDeadTimeTime = function (index) {
        if(!DATE_FORMAT.test($scope.tableModel.tableBody.ports[index].portDeadTimeStr)){
            $scope.tableModel.tableBody.ports[index].portDeadTimeStr = '';
        }
    };

    $scope.checkCargoDeadTimeTime = function (index) {
        if(!DATE_FORMAT.test($scope.tableModel.tableBody.ports[index].cargoDeadTimeStr)){
            $scope.tableModel.tableBody.ports[index].cargoDeadTimeStr = '';
        }
    };

    $scope.checkEtdTime = function (index) {
        var etdId = "#etd-0";
        if(!DATE_FORMAT.test($scope.tableModel.tableBody.ports[index].etdStr)){
            $scope.tableModel.tableBody.ports[index].etdStr = '';
            if(index == 0){
                $(etdId).css("border-color","#FA787E");
            }
        }else{
            if(index == 0){
                $(etdId).css("border-color","#BDBDBD");
            }
        }
    };

    
    $scope.keyDownFn = function () {
        if(event.keyCode)

        $scope.keyCode = event.keyCode;
    };

    $scope.goback = function () {
        if(!$scope.isEdit) {
            $scope.closeDetailPage();
        }else{
            $(document).promptBox({
                title: Lang.getValByKey('common', 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey('common', 'common_back_confirm')
                },
                cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                operation: [
                    {
                        type: 'submit',
                        application: 'delete',
                        description: Lang.getValByKey('common', 'common_back_yes'),
                        operationEvent: function () {
                            $scope.closeDetailPage();
                            $scope.$apply();
                            $(document).promptBox('closePrompt');
                        }
                    }
                ]
            });
        }
    }
}]);

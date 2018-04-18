easySpa.require([
    'public/common/tableController.js',
    "widget/select",
    "widget/prompt",
    'public/common/calander.js',
    "public/javascripts/tradeOrders/20161224/detailController.js",
    "public/javascripts/tradeOrders/20161224/sdetailController.js",
    "public/javascripts/tradeOrders/20161224/simulateController.js",
    'public/common/uploadFile/uploadFile.js',
    "public/javascripts/tradeOrders/20161224/sunRunConfirmOrderController.js",
    "public/javascripts/tradeOrders/20161224/sunRunDeliveryConfirmController.js",
    "public/javascripts/tradeOrders/20161224/normalConfirmOrderController.js",
    "public/javascripts/tradeOrders/20161224/normalDeliveryConfirmController.js"
], function(){
    app.controller("tradeOrdersCtrl",['$scope', '$route','tradeOrdersService','tradeOrdersView','tableService','$compile', tradeOrdersCtrl]);
    function tradeOrdersCtrl($scope, $route, tradeOrdersService,tradeOrdersView,tableService,$compile){
        if($route.current.params.orderFrom === 'cockpit'){
           $scope.fromCockpit = true;
        }
        var Goods ={};
        $scope.orderType = location.hash.split("?")[1].split("&")[1].split("=")[1].toUpperCase();

        $scope.activeTab = 'DRAFT';

        $scope.activeTabs = function(type){
            if(type === $scope.activeTab) return 'active';
            return '';
        };

        $scope.switch = function(type){
            if(type === $scope.activeTab) return;
            $scope.activeTab = type;
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.pageSize = 10;

            $scope.clearSearch();
        };

        $scope.search = {};

        $scope.tableModel = {
            tableHeader: [
                "序号",
                "订单号",
                "业务单号",
                "商品信息",
                "项目",
                "销售方",
                "采购方",
                "创建时间",
                "操作"
            ],
            tableHeaderSize: ['5%','12%','10%','10%','10%','13%','12%','13%','10%'],
            tableBody: [],
            restURL: "logistics.getTrdOrderList",
            restData: {
                q: '',
                refCombos: '',
                startTime:getBeforeDate(6)+' 00:00:00',
                endTime:new Date().format("yyyy-MM-dd 23:59:59"),
                isAsc: false,
                pageIndex: 1,
                pageSize: 10,
                customerId:$scope.search.customerId,
                goodsId:$scope.goodsId,
                orderType : $scope.orderType,
                orderStatus : $scope.activeTab
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.closePDF = function(){
            $("div.media").remove();
            $(".closePDF").hide();
        };

        $scope.orderGoodsMsg = function(data){
            var title = '';
            title += '名称: ' + data.goodsName + '\n';
            if(data.goodsNum){
                title += '数量: ' + data.goodsNum + ' ' + data.goodsUnit + '\n';
            }else{
                title += '数量: ' + data.minLimit + ' - ' + data.maxLimit + ' ' + data.goodsUnit + '\n';
            }
            title += '单价: ' + data.goodsPrice + ' ' + data.goodsCurrencyType;

            return title;
        };
        //批量提交
        $scope.submitOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }

            tradeOrdersView.promptMidBox('', {msg:'确定提交所选订单？'}, '', function(){
                tradeOrdersService.trdOrderListSubmit(ids)
                    .then(function(res){
                        tradeOrdersView.promptBox(res);
                        if(res.errorCode == 0)   $scope.loadListData();
                    });
            });
        };

        $scope.comfirmOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }

            tradeOrdersView.promptMidBox('', {msg:'确定进行订单确认？'}, '', function(){
                tradeOrdersService.trdOrderListConfirms(ids)
                    .then(function(res){
                        tradeOrdersView.promptBox(res);
                        if(res.errorCode == 0)   $scope.loadListData();
                    });
            });
        };

        $scope.deliveryOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }

            tradeOrdersView.promptMidBox('', {msg:'确认发货？'}, '', function(){
                tradeOrdersService.trdOrderListDeliverys(ids)
                    .then(function(res){
                        tradeOrdersView.promptBox(res);
                        if(res.errorCode == 0)   $scope.loadListData();
                    });
            });
        };

        $scope.$watch('tableModel', function(newValue, oldValue) {
            if (newValue === oldValue) {return;}
            $scope.canOutComfirmOrder = false;
            $scope.selectData = tableService.getSelectTable($scope.tableModel.tableBody);
            $scope.selectDataLen = $scope.selectData.length;
            angular.forEach($scope.selectData, function(value, key){
                if($scope.selectDataLen > 1){
                    $scope.canOutComfirmOrder = true;
                }
                if($scope.orderType === 'SALE' && value.sellerId !== 2){
                    $scope.canOutComfirmOrder = true;
                }
                if($scope.orderType === 'PURCHASE' && value.purchaserId !== 2){
                    $scope.canOutComfirmOrder = true;
                }
            });
        }, true);

        $scope.outComfirmOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }
            var companyName = $scope.selectData[0].sellerId;
            if( $scope.orderType === 'SALE'){
                if(companyName === 2){ // sunrun的单子
                    $scope.getDetail('sunRunOrderConfirm',ids[0]);
                }
            }else{
                $scope.getDetail('simulate',ids[0])
            }
        };

        $scope.signedOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }
            var sunrunFlag = false;
            var companyName = $scope.selectData[0].sellerId;
            var pCompanyName = $scope.selectData[0].purchaserId;
            if($scope.selectDataLen > 1){

                tradeOrdersView.promptBox({msg:'不支持批量签收，请选择一条数据!'});
                return;

            }else{
                if($scope.orderType === 'SALE'){
                     if(companyName === 2){// sunrun的单子
                         $scope.getDetail('sunRunDeliveryConfirm',ids[0]);
                     }else{
                         $scope.getDetail('normalDeliveryConfirm',ids[0]);

                     }
                }else{
                    if(pCompanyName === 2){// sunrun的单子 目前暂时维持现状
                        $scope.getDetail('simulate',ids[0])
                    }else{
                        $scope.getDetail('normalDeliveryConfirm',ids[0]);

                    }
                }
            }
        };

        function loadPDFJS(type,orderNo){
            if(typeof $.fn.media === 'undefined'){
                var script = document.createElement("script");
                script.src = 'public/lib/jquery.media.js';
                script.onload = function(status){
                    loadPDF(type,orderNo);
                };
                document.body.append(script);
            }else{
                loadPDF(type,orderNo);
            }

        }

        var host = [location.protocol,'//',location.hostname,':',location.port].join("");

        function loadPDF(type,orderNo){
            $('a.media').remove();
            var a = document.createElement("a");
            a.className = 'media';
            if(type === 'OUT') type = 1;
            else if(type === 'IN') type = 2;
            tradeOrdersService.exportPDF(orderNo,type).then(function(res){
                if(res.errorCode == 0 && res.data){
                    a.href = host+res.data;
                    document.body.append(a);
                    $('a.media').media({width:800, height:600});
                    $(".closePDF").show().click(function(){
                        $("div.media").remove();
                        $(this).remove();
                    });

                }else{
                    tradeOrdersView.promptBox({msg:"尚未生成订单确认单!"});
                }
            });

        }

        $scope.outSignedOrder = function(){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }
            if(ids.length > 1){
                tradeOrdersView.promptBox({msg:'只能选择一条数据!'});
                return;
            }
            loadPDFJS('IN',ids[0]);
        };

        $scope.loadListData = function(){
            var param = angular.copy($scope.tableModel.restData);
            tradeOrdersView.resetKeys(param, $scope.search);
            $.extend(param, $scope.search);
            for(var i in param) if(param[i] === '') delete param[i];
            param.orderType = $scope.orderType;
            param.orderStatus = $scope.activeTab;
            param = {"urlParams" :param};
            tableService.getTable($scope.tableModel.restURL, param, function(data) {
                $scope.tableModel = tableService.table($scope.tableModel, param, data);
                $scope.$apply();
            });

        };

        setTimeout(function(){
            $("#sstartDate").val(getBeforeDate(6)+' 00:00:00');
            $("#sendDate").val(new Date().format("yyyy-MM-dd 23:59:59"));
            $scope.loadListData();
        },0);

        $scope.search = function(){
            $scope.tableModel.restData.pageIndex = 1;
            $scope.loadListData();
        };

        $scope.clearSearch = function(){
            for(var i in $scope.search){
                $scope.search[i] = '';
                $scope[i] = '';
            }
            $scope.isEnabled = '全部';
            $scope.purchaserLimit = '全部';
            $scope.projectLimit = '全部';
            $scope.goods = "";
            $scope.search.startTime = getBeforeDate(6)+' 00:00:00';
            $scope.search.endTime = new Date().format("yyyy-MM-dd 23:59:59");
            $("#sstartDate").val(getBeforeDate(6)+' 00:00:00');
            $("#sendDate").val(new Date().format("yyyy-MM-dd 23:59:59"));
            $('#goods').val('');
            $('#supplierName').val('');
            $("#likedusernamelist").val('');
            $scope.tableModel.restData.pageIndex = 1;
            $scope.loadListData();
        };

        $scope.enabledGoods = function(type){
            var ids = getSelectIds(),msg = '确定启用该商品?';
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }
            if(!type){
                msg = '确定停用该商品?';
            }
            tradeOrdersView.promptMidBox('', {msg:msg}, '', function(){
                tradeOrdersService.enabledGoods({ids:ids,isEnabled:type})
                    .then(function(res){
                        tradeOrdersView.promptBox(res);
                        if(res.errorCode == 0)   $scope.loadListData();
                    });
            });

        };

        function getUploadFileParam(flag,append,orderNo,orderStatus){
            var param = {
                system:'tradeOrder',
                edit:flag,
                btnHandle:false,
                orderStatus:orderStatus,
                append:append,
                orderNo:orderNo,
                orderFileType:{
                    url:'/api/v1/trd/order/file/type',
                    type:'GET'
                },
                getOrderFile:{
                    url:'/api/v1/trd/order/files',
                    type:'GET',
                    param:{
                        pageIndex:1,
                        pageSize:50,
                        orderNo:orderNo
                    }
                },
                delOrderFile:{
                    url:'',
                    type:'POST',
                    param:{
                        orderNo:orderNo
                    }
                },
                addOrderFile:{
                    url:'/api/v1/trd/order/files/'+orderNo+'/orderFiles',
                    type:'POST',
                    param:{
                        orderNo:orderNo
                    }
                },
                ckeckFileName:{
                    url:'/api/v1/trd/order/files/files/name/check',
                    type:'GET',
                    param:{
                        orderNo:orderNo
                    }
                }
            };
            return param;
        }

        $scope.uploadFile = function(){
            $('.detail').html('');
            var ids = getSelectIds();
            if(ids.length !== 1){
                tradeOrdersView.promptBox({msg:'请先选择一条数据!'});
                return false;
            }
            $scope.showUploadFile =true;

            var param = getUploadFileParam(true,'#tradeOrderUploadFileContent',ids[0],'DRAFT');
            $(document).uploadBox(param);
        };

        $scope.detailTradeOrdersUploadfile = function(flag,append,orderNo,orderStatus){
            $('#tradeOrderUploadFileContent').html('');
            var param = getUploadFileParam(flag,append,orderNo,orderStatus);
            $scope.result = $(document).uploadBox(param);
        };

        $scope.getDetail = function(page, orderNo){
            tradeOrdersView.getTpl(page).then(function(tpl){
                $scope.child = $scope.$new();
                $scope.child.orderNo = orderNo;
                $scope.presentOrderNo = orderNo;
                $("#detail").html($compile(tpl)($scope.child));
                if(page === "detail"){
                    if(!orderNo){
                        $scope.detailTradeOrdersUploadfile(true,'#detailFileContent','','');
                    }else{
                        $scope.detailTradeOrdersUploadfile(false,'#detailFileContent',orderNo,'');
                    }
                }
                if(page === "sdetail"){
                    $scope.detailTradeOrdersUploadfile(false,'#sdetailFileContent',orderNo);
                }
            });
        };

        $scope.goBack = function(fresh){
            if($route.current.params.orderFrom === 'cockpit'){
                window.location.href = '#/cockpit?from=purchaseOrder';
            }else{
                $scope.child.$destroy();
                $("#detail").html('');
                if(fresh)  $scope.loadListData();
            }
        };

        $scope.deleteOrder = function(ids){
            var ids = getSelectIds();
            if(!ids.length){
                tradeOrdersView.promptBox({msg:'请先选择数据!'});
                return;
            }
            tradeOrdersView.promptMidBox('', {msg:'确定删除已选订单?'}, Lang.getValByKey("common", 'common_page_delete'), function(){
                tradeOrdersService.deleteTrdOneOrder(ids, function(res){
                    tradeOrdersView.promptBox(res);
                    if(res.errorCode == 0)  $scope.loadListData();
                });
            },'warning','delete');

        };

        $scope.getAmoutTotal = function(data){
            var total = 0;
            data.forEach(function(item){
                var num = Number(item.amountDue);
                if(!isNaN(num)) total += num;
            });
            return total.toFixed(2);
        };

        function getSelectIds(){
            var ids = [];
            $scope.selectData.forEach(function(item){
                ids.push(item.orderNo);
            });
            return ids;
        }

        // 商品下列菜单
        $scope.getSalesGoods = function (q,currentPage) {
            q = q ? q : '';
            var config = {
                'q': q? q.trim():"",
                'pageIndex': currentPage? currentPage:1,
                'pageSize': 10,
                'isAsc':false,
                'orderType':$scope.orderType,
                'sellId':$scope.orderType === 'SALE'? undefined: $scope.search.customerId //供应商Id
            };
            return tradeOrdersService.getTrdGoodsShortList(config);
        };

        $scope.initGoods = function () {
            Goods = selectFactory({
                data: [],
                isSearch:true,
                isSaveInputVal:true,
                pagination: true,
                id: "goods",
                showTextField: "userName",
                defaultText:'请选择',
                searchPlaceHoder:"请输入名称或编码",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.Goods = $scope.getSalesGoods(data, currentPage);
                    angular.forEach($scope.Goods.data, function(value, key){
                        value.userName = value.name + "(" + value.code + ")";
                    });
                    attachEvent.setData($scope.Goods);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    if(!id){
                        $scope.search.goodsId = '';
                    }else{
                        $scope.search.goodsId = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(userName){
                    $scope.goods = userName;
                    $scope.$apply();
                }
            });
            Goods.open();
        };

        $scope.clearGoods = function () {
            if(!Goods.allData){
                return;
            }
            Goods.setData({});
            $('#goods').val('');
            $scope.goods = '';
        };

        $scope.getProjectShortData = function(q,currentPage){
            q = q ? q : '';
            var config = {
                'project': q? q.trim():"",
                'pageIndex': currentPage? currentPage:1,
                'pageSize': 10,
                'isAsc':false,
                'includeClosed':true
            };
            return tradeOrdersService.trdProjectsShort(config);
        };

        //项目及编号下拉菜单
        $scope.initProjectShort = function(){
            var select = selectFactory({
                data: [],
                isSearch:true,
                isSaveInputVal:true,
                pagination: true,
                isUsePinyin:true,
                id: "projectId",
                showTextField: "userName",
                defaultText:'请选择',
                searchPlaceHoder:"请输入名称或编码",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getProjectShortData(data, currentPage);
                    angular.forEach($scope.customerData.data, function(value, key){
                        value.userName = value.name + "(" + value.code + ")";
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    if(!id){
                        $scope.search.projectId = '';
                    }else{
                        $scope.search.projectId = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(userName){
                    $scope.projectId = userName;
                    $scope.$apply();
                }
            });

            select.open();
            // setTimeout(function(){
            //     select.setData($scope.projectData);
            //     select.open();
            //     $('#projectId').val($scope.projectId);
            // },100);
        };

        $scope.getCustomerIdData = function(q, currentPage){
            q = q ? q : '';
            var config = {
                'q': q? q.trim():"",
                'pageIndex': currentPage? currentPage:1,
                'pageSize': 10,
                'isAsc':false,
                'sortName': '',
                'userType' : '2'
            };
            return tradeOrdersService.getEnterpriseNameTradeCustomer(config);
        };

        $scope.initCustomerId = function(){
            $scope.customerIdData = $scope.getCustomerIdData();
            angular.forEach($scope.customerIdData.data, function(value, key){
                value.userName = value.name + "(" + value.code + ")";
            });

            var select = selectFactory({
                data: $scope.customerIdData,
                isSearch:true,
                isUsePinyin:true,
                pagination: true,
                id: "customerId",
                showTextField: "userName",
                defaultText:"请选择",
                searchPlaceHoder:"请输入账户名或编码",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data,currentPage) {
                    $scope.customerData = $scope.getCustomerIdData(data,currentPage);
                    angular.forEach($scope.customerData.data, function(value, key){
                        value.userName = value.name + "(" + value.code + ")";
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    if(!id){
                        $scope.search.customerId = '';
                        $scope.likedusernamelist = '';
                    }else{
                        if($scope.search.customerId != id){
                            $scope.likedusernamelist = '';
                        }
                        $scope.search.customerId = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.customerId = name;
                    $scope.$apply();
                }
            });

            select.setData($scope.customerIdData);
            select.open();
            $('#customerId').val($scope.customerId);
        };

        //商品类别列表下拉
        var goodsTypeSelect;
        $scope.initBusinessType = function(){
            if(goodsTypeSelect) return;
            $scope.goodsTypeData = tradeOrdersService.trdGoodTypeList();

            goodsTypeSelect = selectFactory({
                data: $scope.goodsTypeData,
                id: "goodsType",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function(code){
                    if(!code){    //全部
                        $scope.statusValue = 'AUDITING';
                    }else{
                        $scope.statusValue = code;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name){
                    $scope.status = name;
                    $scope.$apply();
                }
            });
            goodsTypeSelect.setData($scope.goodsTypeData);
        };

        Calander.init({ele: ['#sstartDate','#sendDate'], isClear : true});

        // 供应商列表下拉菜单
        $scope.getSuppelierData = function(q,currentPage){
            q = q ? q : '';
            var config = {
                'q': q? q.trim():"",
                'pageIndex': currentPage? currentPage:1,
                'pageSize': 10,
                'isAsc':false,
                'sortName': ''
            };
            return tradeOrdersService.trdSuppelyList(config);
        };

        $scope.initSupplier = function(){
            var select = selectFactory({
                data: [],
                isSearch:true,
                defaultText : '请选择',
                pagination: true,
                id: "supplierName",
                showTextField: "userName",
                attrTextField: {
                    "ng-value": "id"
                },
                searchPlaceHoder:'请输入名称或编码',
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.suppelierData = $scope.getSuppelierData(data,currentPage);
                    angular.forEach($scope.suppelierData.data, function(value, key){
                        value.userName = value.name + " (" + value.code + ")";
                    });
                    attachEvent.setData($scope.suppelierData);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    if(!id){
                        $scope.search.customerId = '';
                    }else{
                        $scope.search.customerId = id;
                    }
                    //清空商品信息
                    $scope.clearGoods();
                    $scope.$apply();
                },
                attrTextModel: function(userName,list, present){
                    $scope.supplierName = userName;
                    $scope.$apply();
                }
            });

            select.open();
        };

        $scope.getLikedusernamelistData = function(q,currentPage){
            q = q ? q : '';
            var config = {
                'q': q? q.trim():"",
                'pageIndex': currentPage? currentPage:1,
                'pageSize': 10,
                'isAsc':false,
                'sortName': '',
                'userType' : 2,
                'refCustomerId' : $scope.search.customerId
            };
            return tradeOrdersService.trdLikedusernamelist(config);
        };

        $scope.initLikedusernamelist = function(){

            $scope.suppelierData = $scope.getLikedusernamelistData();

            angular.forEach($scope.suppelierData.data, function(value, key){
                value.name = value.userName + " (" + value.fullName + ")";
            });

            var select = selectFactory({
                data: $scope.suppelierData,
                isSearch:true,
                isUsePinyin:true,
                pagination: true,
                defaultText : '请选择',
                searchPlaceHoder:'请输入姓名或用户名',
                id: "likedusernamelist",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    $scope.suppelierData = $scope.getLikedusernamelistData(data, currentPage);
                    angular.forEach($scope.suppelierData.data, function(value, key){
                        value.name = value.fullName + " (" + value.userName + ")";
                    });
                    attachEvent.setData($scope.suppelierData);
                    $scope.$apply();
                },
                attrTextId: function(id){
                    if(!id){
                        $scope.search.cusUserId = '';
                    }else{
                        $scope.search.cusUserId = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function(name,list, present){
                    $scope.likedusernamelist = name;
                    $scope.$apply();
                }
            });

            select.setData($scope.suppelierData);
            select.open();
            $('#likedusernamelist').val($scope.likedusernamelist);


        };

        $scope.checkConfirmOrderUrl = function (data) {
            if(!data.orderConfirmUrl){
                tradeOrdersView.promptBox({msg:"尚未生成订单确认单!"});
            }else{
                $("#confirmOrder-" + data.orderNo).attr('href',data.orderConfirmUrl);
            }
        };

        $scope.checkDeliveryOrderUrl = function (data) {
            if(!data.orderDeliverUrl){
                tradeOrdersView.promptBox({msg:"尚未生成发货确认单!"});
            }else{
                $("#deliveryOrder-" + data.orderNo).attr('href',data.orderDeliverUrl);
            }

        };

        if($route.current.params.orderFrom === 'cockpit'){
            var pages = $route.current.params.cockpitPage;
            var orderNos = $route.current.params.orderNo;
            $scope.getDetail(pages,orderNos);
        }
    }
});
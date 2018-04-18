app.controller("sdetail",['$scope','tradeOrdersService','tradeOrdersView', sdetail]);
function sdetail($scope, tradeOrdersService,tradeOrdersView){

	$scope.data = {};

    $scope.button1Txt = '查看订单确认单';
    $scope.button2Txt = '查看收货确认单';

    if($scope.orderType === 'SALE'){
        customerType = 1;
    }else{
        customerType = 2;
    }

    if($scope.orderNo){
        tradeOrdersService.getOrderStatusByOrderNo($scope.orderNo,customerType).then(function(res){
            if(res.errorCode == 0){
                $scope.data = res.data;
                //暂时打桩
                // $scope.data.orderConfirmUrl = "files/M00/00/0F/rB8B51mRCdaAALliAAB69yfB7yI666.pdf";
                // $scope.data.orderDeliverUrl  = 'files/M00/00/0F/rB8B51mRCdaAALliAAB69yfB7yI666.pdf';
                
                $scope.statusList && initStatus();
            }
        });

        tradeOrdersService.getOrderStatus().then(function(data){
        	$scope.statusList = data;

        	$scope.data.id && initStatus(data);

        });	
    }

    var svg = {
    	'DRAFT' : 'icon-draft',
        'CONFIRMING' : 'icon-examine',
    	'DELIVERY' : 'icon-solicitation',
    	'TRANSPORT' : 'icon-transport',
    	'SIGNED' : 'icon-receive'
    };


    function initStatus(){
    	
    	var keys = Object.keys(svg);
    	var now = keys.indexOf($scope.data.orderStatus);
    	$scope.statusList.forEach(function(item){
    		if(keys.indexOf(item.code) <= now) item.svg = svg[item.code] + '-s';
    		else item.svg = svg[item.code];
    	});
        $scope.status = $scope.data.orderStatus;
    }

    $scope.loadSource = function(type){
        var status = $scope.status;

        if(status === 'DRAFT') return;

        if(type === 'OUT'){
            if(status === 'DELIVERY'){  // 去填发货确认单
                $scope.getDetail('simulate',$scope.orderNo);
            }else if(status === 'TRANSPORT' || status === 'SIGNED'){   //显示发货PDF
                loadPDFJS(type);
            }
        }else if(type === 'IN'){
            if(status === 'TRANSPORT'){ //去填写收货确认单
                $scope.getDetail('simulate',$scope.orderNo);
            }else if(status === 'SIGNED'){  //显示收货PDF
                loadPDFJS(type)
            }
        }
    };



    function loadPDFJS(type){

        if(typeof $.fn.media === 'undefined'){
            var script = document.createElement("script");
            script.src = 'public/lib/jquery.media.js';
            script.onload = function(status){
                loadPDF(type);
            };
            document.body.append(script);
        }else{
            loadPDF(type);
        }
        
    }

    $scope.loadPDFJS = loadPDFJS;

    var host = [location.protocol,'//',location.hostname,':',location.port].join("");

    function loadPDF(type){
        $('a.media').remove();
        var a = document.createElement("a");
        a.className = 'media';
        if(type === 'OUT') type = 1;
        else if(type === 'IN') type = 2; 
        tradeOrdersService.exportPDF($scope.orderNo,type).then(function(res){
            if(res.errorCode == 0 && res.data){
                a.href = host+res.data;
                document.body.append(a);
                $('a.media').media({width:800, height:600});
                $(".closePDF").show().click(function(){
                    $("div.media").remove();
                    $(".closePDF").hide();
                    $(this).remove();
                });
            }else{
                tradeOrdersView.promptBox({msg:"尚未生成订单确认单!"});
            }
        });
        
    }
    
    function loadConfirmOrderPDF() {

        if(!$scope.data.orderConfirmUrl){
            tradeOrdersView.promptBox({msg:"尚未生成订单确认单!"});
            return;
        }
        var host= [location.protocol,'//',location.hostname,'/',location.port].join("");

        $('a.media').remove();
        var a = document.createElement("a");
        a.className = 'media';
        a.href = host+$scope.data.orderConfirmUrl
        document.body.append(a);
        $('a.media').media({width:800, height:600});
        $(".closePDF").show().click(function(){
            $("div.media").remove();
            $(".closePDF").hide();
            $(this).remove();
        });
        
    }

    function loadDeliveryOrderPDF() {

        if(!$scope.data.orderDeliverUrl){
            tradeOrdersView.promptBox({msg:"尚未生成发货确认单!"});
            return;
        }
        var host= [location.protocol,'//',location.hostname,'/',location.port].join("");

        $('a.media').remove();
        var a = document.createElement("a");
        a.className = 'media';
        a.href = host+$scope.data.orderDeliverUrl
        document.body.append(a);
        $('a.media').media({width:800, height:600});
        $(".closePDF").show().click(function(){
            $("div.media").remove();
            $(".closePDF").hide();
            $(this).remove();
        });

    }

    
    $scope.previewConfirmOrder = function () {
        if(typeof $.fn.media === 'undefined'){
            var script = document.createElement("script");
            script.src = 'public/lib/jquery.media.js';
            script.onload = function(status){
                loadConfirmOrderPDF();
            };
            document.body.append(script);
        }else{
            loadConfirmOrderPDF();
        }
        
    }

    $scope.previewDeliveryOrder = function () {
        if(typeof $.fn.media === 'undefined'){
            var script = document.createElement("script");
            script.src = 'public/lib/jquery.media.js';
            script.onload = function(status){
                loadDeliveryOrderPDF();
            };
            document.body.append(script);
        }else{
            loadDeliveryOrderPDF();
        }
    }

    $scope.checkConfirmOrderUrl = function () {
        if(!$scope.data.orderConfirmUrl){
            tradeOrdersView.promptBox({msg:"尚未生成订单确认单!"});
        }else{
            $("#confirmOrder").attr('href',$scope.data.orderConfirmUrl);
        }
        
    }

    $scope.checkDeliveryOrderUrl = function () {
        if(!$scope.data.orderDeliverUrl){
            tradeOrdersView.promptBox({msg:"尚未生成发货确认单!"});
        }else{
            $("#deliveryOrder").attr('href',$scope.data.orderDeliverUrl);
        }

    }


  
	
}
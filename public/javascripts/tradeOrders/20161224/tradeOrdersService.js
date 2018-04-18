app.factory('tradeOrdersService', ['easyHttp','$http', function(easyHttp,$http) {
    var tradeOrdersService = {};
     tradeOrdersService.getTrdGoodList = function(params,cb){

        return easyHttp.get("logistics.trdGoodList", {"urlParams" : params}, cb);
     };
     //采购企业列表
     tradeOrdersService.getCustomerShortList = function(params){
        return easyHttp.get("logistics.getCustomerShortList", {"urlParams" : params});
     };
     //商品类别
     tradeOrdersService.trdGoodTypeList = function(){
        //return easyHttp.get("logistics.trdGoodTypeList", cb);
        return $http.get("/api/v1/trade/goodstype/list").then(function(res){
        	return res.data.data
        });
     };

     tradeOrdersService.getOrderStatus = function(){
        return $http.get("/api/v1/trd/order/orderStatus").then(function(res){
            return res.data.data;
        })
     };

     // 销售方 -- 平台公司
     tradeOrdersService.platcompanys = function(){
        return $http.get("/api/v1/trade/projects/platcompanys").then(function(res){
            return res.data.data;
        });
     };

    //保存订单
     tradeOrdersService.saveOrder = function(params){
        return $http.post("/api/v1/trd/order/save",params).then(function(res){
            return res.data;
        });
     };
     //修改订单
     tradeOrdersService.updateOrder = function(params){
        return $http.post("/api/v1/trd/order/update",params).then(function(res){
            return res.data;
        });
     };
     //根据订单号查询一条定单
     tradeOrdersService.getOneOrder = function(id,customerType){
        return $http.get("/api/v1/trd/order/orderNo?orderNo="+ id+"&customerType="+customerType).then(function(res){
            return res.data;
        });
     };   

     // 订单类型
     tradeOrdersService.orderType = function(){
        return $http.get("/api/v1/trd/order/orderType").then(function(res){
            return res.data.data;
        });
     };

     //商品列表,返回订单需要字段
     tradeOrdersService.getGoodsOrderById = function(id){
        return $http.get("/api/v1/trd/goods/"+id+"/order").then(function(res){
            return res.data;
        });
     };

     tradeOrdersService.getTrdGoodsShortList = function(params){
        return easyHttp.get("logistics.getTrdGoodsShortList",{"urlParams":params});
     };
     
     tradeOrdersService.trdSuppelyList = function(params){
        return easyHttp.get("logistics.trdSuppelyList",{"urlParams":params});
     };

     tradeOrdersService.trdProjectsShort = function(params){
        return easyHttp.get("logistics.trdProjectsShort",{"urlParams": params});
     };

     tradeOrdersService.trdSuppelyItem = function(q){
     	return $http.get("/api/v1/sup/suppliers/trade/list",{q:q}).then(function(res){ // 33333333
     		console.log(res, ' suppliers')
     	})
     };

     tradeOrdersService.getEnterpriseNameTradeSupplier = function(params) {
        return easyHttp.get("logistics.getEnterpriseNameTradeSupplier",{"urlParams":params});
     };

     tradeOrdersService.getOneGoods = function(id){
     	return $http.get("/api/v1/trd/goods/"+id).then(function(res){
     		if(res.status == 200 && res.data){
     			return res.data.data;
     		}
     	});
     };

     tradeOrdersService.enabledGoods = function(param){
     	return $http.post("/api/v1/trd/goods/enabled",param).then(function(res){
     		if(res.status == 200 && res.data){
     			return res.data;
     		}
     	});
     };
     //批量确认，在待确认里面
     tradeOrdersService.trdOrderListConfirms = function(param){
        return $http.post("/api/v1/trd/order/confirm",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
     };

     //批量发货，在待发货里面
     tradeOrdersService.trdOrderListDeliverys = function(param){
        return $http.post("/api/v1/trd/order/delivery",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
     };

     //批量提交
     tradeOrdersService.trdOrderListSubmit = function(param){
        return $http.post("/api/v1/trd/order/submit",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
     };

     tradeOrdersService.weight = function(){
     	return $http.get("/api/v1/dict/unit/weight/trade").then(function(res){
     		if(res.status == 200 && res.data){
     			return res.data;
     		}
     	});
     };

     tradeOrdersService.currency = function(){
     	return $http.get("/api/v1/biz/currency/list").then(function(res){
     		if(res.status == 200 && res.data){
     			return res.data;
     		}
     	});
     };

     tradeOrdersService.exportPDF = function(orderNo,type){
        return $http.get("/api/v1/trd/order/export/pdf/"+orderNo+"?orderNo="+orderNo+"&type="+type).then(function(res){
            return res.data;
        });
     };

     tradeOrdersService.deleteTrdOneOrder = function(ids, fn){
        return easyHttp.post("logistics.deleteTrdOneOrder",{"urlParams" : ids},fn);
     };

     tradeOrdersService.getEnterpriseNameTradeCustomer = function(params){
        return easyHttp.get("logistics.getEnterpriseNameTradeCustomer",{"urlParams": params});
     };

     tradeOrdersService.getTradeCustomerUsernamelist = function(params){
        return easyHttp.get("logistics.getTradeCustomerUsernamelist",{"urlParams": params});
     };

     tradeOrdersService.saveOneGoods = function(data){
     	return $http.post("/api/v1/trd/goods/save",data).then(function(res){
     		return res.data;
     	});
     };

     tradeOrdersService.updateOneGoods = function(data){
     	return $http.post("/api/v1/trd/goods/update", data).then(function(res){
     		return res.data;
     	});
     };

     tradeOrdersService.getCurrencyList = function(callback) {
        return easyHttp.get('logistics.getAllCurrencyList', {}, callback);
    };

    
    tradeOrdersService.trdLikedusernamelist = function(params) {
        return easyHttp.get('logistics.trdLikedusernamelist',{"urlParams":params});
    };

    // 订单确认单
    tradeOrdersService.confirmTrdOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/confirmation", params);
    };

    // 订单发货确认单
    tradeOrdersService.confirmTrdOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/confirmation", params).then(function(res){
            return res.data;
        })
    };

    // 订单收货确认单
     tradeOrdersService.confirmTrdDeliveryOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/delivery", params).then(function(res){
            return res.data;
        })
    };

    // 根据订单号查询
     tradeOrdersService.getOrderStatusByOrderNo = function(orderNo,customerType){
        return $http.get("/api/v1/trd/order/orderNo?orderNo="+ orderNo+"&customerType="+customerType).then(function(res){
            return res.data;
        });
     };

    //根据订单号获取订单确认单 sunrun
    tradeOrdersService.getOrderConfrmByOrderNo = function(orderNo,callback){
        return  easyHttp.get('logistics.getOrderConfrmByOrderNo',{"seatParams":{"orderNo":orderNo}}, callback)
    };

    //保存订单确认单 sunrun
    tradeOrdersService.saveOrderConfirm = function(params,callback){
        easyHttp.post('logistics.saveOrderConfirm', {"urlParams":params}, callback);
    };

    //根据SellId获取账户等信息，本单是sunrun
    tradeOrdersService.getAccountNoBySellId = function (params,callback) {
        return easyHttp.get('logistics.getAccountNoBySellId', {"seatParams":{"platformCompanyId":params}}, callback);
    };

     //根据订单号导出pdf文件
    tradeOrdersService.exportPDFByOrderNo = function (params,callback) {
        return easyHttp.post('logistics.exportPDFByOrderNo', params, callback);
    };

    //普通订单部分
    //根据订单号获取订单确认单 normal
    tradeOrdersService.getNormalOrderConfrmByOrderNo = function(orderNo,callback){
        return  easyHttp.get('logistics.getNormalOrderConfrmByOrderNo',{"seatParams":{"orderNo":orderNo}}, callback)
    };

    //保存订单确认单 normal
    tradeOrdersService.saveNormalOrderConfirm = function(params,callback){
        easyHttp.post('logistics.saveNormalOrderConfirm', {"urlParams":params}, callback);
    };

    tradeOrdersService.trdOrderSigned = function(params,callback){
        easyHttp.post('logistics.trdOrderSigned', {"urlParams":params}, callback);
    };


    // 根据订单号查询订单详情－－普通
    tradeOrdersService.getOrderInfoByOrderNoNormal = function(orderNo,callback){
        return  easyHttp.get('logistics.getOrderInfoByOrderNoNormal',{"seatParams":{"orderNo":orderNo}}, callback)
    };

    // 普通的流程，发货确认
    tradeOrdersService.confirmTrdDeliveryOrderNormal = function(params,callback) {
        easyHttp.post('logistics.confirmTrdDeliveryOrderNormal', {"urlParams":params}, callback);
    };

    return tradeOrdersService;
}]);
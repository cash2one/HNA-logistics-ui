app.factory('tradeOrderSearchService', ['easyHttp','$http', function(easyHttp,$http) {
    var tradeOrderSearchService = {};

    tradeOrderSearchService.getTrdGoodList = function(params,cb){

        return easyHttp.get("logistics.trdGoodList", {"urlParams" : params}, cb);
    };
    //采购企业列表
    tradeOrderSearchService.getCustomerShortList = function(params){
        return easyHttp.get("logistics.getCustomerShortList", {"urlParams" : params});
    };
    //商品类别
    tradeOrderSearchService.trdGoodTypeList = function(){
        //return easyHttp.get("logistics.trdGoodTypeList", cb);
        return $http.get("/api/v1/trade/goodstype/list").then(function(res){
            return res.data.data
        });
    };



    tradeOrderSearchService.getOrderStatus = function(){
        return $http.get("/api/v1/trd/order/orderStatus").then(function(res){
            return res.data.data;
        })
    };



    // 销售方 -- 平台公司
    tradeOrderSearchService.platcompanys = function(){
        return $http.get("/api/v1/trade/projects/platcompanys").then(function(res){
            return res.data.data;
        });
    };

    //保存订单
    tradeOrderSearchService.saveOrder = function(params){
        return $http.post("/api/v1/trd/order/save",params).then(function(res){
            return res.data;
        });
    };
    //修改订单
    tradeOrderSearchService.updateOrder = function(params){
        return $http.post("/api/v1/trd/order/update",params).then(function(res){
            return res.data;
        });
    };
    //根据订单号查询一条定单
    tradeOrderSearchService.getOneOrder = function(id,customerType){
        return $http.get("/api/v1/trd/order/orderNo?orderNo="+ id+"&customerType="+customerType).then(function(res){
            return res.data;
        });
    };




    // 订单类型
    tradeOrderSearchService.orderType = function(){
        return $http.get("/api/v1/trd/order/orderType").then(function(res){
            return res.data.data;
        });
    };



    //商品列表,返回订单需要字段
    tradeOrderSearchService.getGoodsOrderById = function(id){
        return $http.get("/api/v1/trd/goods/"+id+"/order").then(function(res){
            return res.data;
        });
    };

    tradeOrderSearchService.getTrdGoodsShortList = function(params){
        return easyHttp.get("logistics.getTrdGoodsShortList",{"urlParams":params});
    };


    tradeOrderSearchService.trdSuppelyList = function(params){
        return easyHttp.get("logistics.trdSuppelyList",{"urlParams":params});
    };

    tradeOrderSearchService.trdProjectsShort = function(params){
        return easyHttp.get("logistics.trdProjectsShort",{"urlParams": params});
    };


    tradeOrderSearchService.trdSuppelyItem = function(q){
        return $http.get("/api/v1/sup/suppliers/trade/list",{q:q}).then(function(res){ // 33333333
            console.log(res, ' suppliers')
        })
    };

    tradeOrderSearchService.getEnterpriseNameTradeSupplier = function(params) {
        return easyHttp.get("logistics.getEnterpriseNameTradeSupplier",{"urlParams":params});
    }


    tradeOrderSearchService.getOneGoods = function(id){
        return $http.get("/api/v1/trd/goods/"+id).then(function(res){
            if(res.status == 200 && res.data){
                return res.data.data;
            }
        });
    };

    tradeOrderSearchService.enabledGoods = function(param){
        return $http.post("/api/v1/trd/goods/enabled",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };
    //批量确认，在待确认里面
    tradeOrderSearchService.trdOrderListConfirms = function(param){
        return $http.post("/api/v1/trd/order/confirm",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };
    //批量发货，在待发货里面
    tradeOrderSearchService.trdOrderListDeliverys = function(param){
        return $http.post("/api/v1/trd/order/delivery",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };
    //批量提交
    tradeOrderSearchService.trdOrderListSubmit = function(param){
        return $http.post("/api/v1/trd/order/submit",param).then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };


    tradeOrderSearchService.weight = function(){
        return $http.get("/api/v1/dict/unit/weight/trade").then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };



    tradeOrderSearchService.currency = function(){
        return $http.get("/api/v1/biz/currency/list").then(function(res){
            if(res.status == 200 && res.data){
                return res.data;
            }
        });
    };

    tradeOrderSearchService.exportPDF = function(orderNo,type){
        return $http.get("/api/v1/trd/order/export/pdf/"+orderNo+"?orderNo="+orderNo+"&type="+type).then(function(res){
            return res.data;
        });
    };



    tradeOrderSearchService.deleteTrdOneOrder = function(ids, fn){
        return easyHttp.post("logistics.deleteTrdOneOrder",{"urlParams" : ids},fn);
    };

    tradeOrderSearchService.getEnterpriseNameTradeCustomer = function(params){
        return easyHttp.get("logistics.getEnterpriseNameTradeCustomer",{"urlParams": params});
    };

    tradeOrderSearchService.getTradeCustomerUsernamelist = function(params){
        return easyHttp.get("logistics.getTradeCustomerUsernamelist",{"urlParams": params});
    };


    tradeOrderSearchService.saveOneGoods = function(data){
        return $http.post("/api/v1/trd/goods/save",data).then(function(res){
            return res.data;
        })
        //return easyHttp.post("logistics.saveOneGoods",{"urlParams" : data},fn);
    };

    tradeOrderSearchService.updateOneGoods = function(data){
        return $http.post("/api/v1/trd/goods/update", data).then(function(res){
            return res.data;
        })
        // return easyHttp.post("logistics.updateOneGoods",{"urlParams" : data},fn);
    };

    tradeOrderSearchService.getCurrencyList = function(callback) {
        return easyHttp.get('logistics.getAllCurrencyList', {}, callback);
    };


    tradeOrderSearchService.trdLikedusernamelist = function(params) {
        return easyHttp.get('logistics.trdLikedusernamelist',{"urlParams":params});
    };

    // 订单确认单
    tradeOrderSearchService.confirmTrdOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/confirmation", params);
    };
    // 订单发货确认单
    tradeOrderSearchService.confirmTrdOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/confirmation", params).then(function(res){
            return res.data;
        })
    };
    // 订单收货确认单
    tradeOrderSearchService.confirmTrdDeliveryOrder = function(params) {
        return $http.post("/api/v1/trd/order/save/delivery", params).then(function(res){
            return res.data;
        })
    };

    // 根据订单号查询
    tradeOrderSearchService.getOrderStatusByOrderNo = function(orderNo,customerType){
        return $http.get("/api/v1/trd/order/orderNo?orderNo="+ orderNo+"&customerType="+customerType).then(function(res){
            return res.data;
        });
    };

    //根据订单号导出pdf文件

    tradeOrderSearchService.exportPDFByOrderNo = function (params,callback) {
        return easyHttp.post('logistics.exportPDFByOrderNo', params, callback);
    };

    // 获取订单状态
    tradeOrderSearchService.getTradeOrderStatus = function () {
        return easyHttp.get('logistics.getTradeOrderStatus');
    }

    return tradeOrderSearchService;
}]);
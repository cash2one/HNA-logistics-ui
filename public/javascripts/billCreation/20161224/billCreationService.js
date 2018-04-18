app.factory('billCreationService', ['$http','$templateCache','$timeout','easyHttp', function($http,$templateCache, $timeout,easyHttp) {

    var billCreationService = {},
    	TPL_URL = "/tpl/fragment/billCreation/",
        selects = {},
    	TPL_TYPE = '.html';


    billCreationService.getTpl = function(name){
    	//var tpl = $templateCache.get(name + TPL_TYPE);
    	//if(!tpl){
    		return $http.get(TPL_URL + name + TPL_TYPE + nocache()).then(function(res){
	    		if(res.data){
	    			$templateCache.put(name + TPL_TYPE, res.data);
	    			return res.data;
	    		}
	    	});
    	//}else{
    	//	return { then : function(fn){ fn(tpl) }}
    	//}

    };

    billCreationService.getTaskStatus = function(params, cb){
        return easyHttp.get('logistics.getTaskStatus', params, cb);
    };

    billCreationService.billingStatus = function(params, cb){
        return easyHttp.get('logistics.getBillingStatus', params, cb);
    };

    billCreationService.getCurrentUserVisibleUserList = function(cb, config){
        if(!config) config = {'urlParams' : ''};
        return easyHttp.get('logistics.getPrimaryaccountlist',config, cb);
    };

    billCreationService.generateBills = function(config, cb){
        return easyHttp.post('logistics.generateBills', config, cb);
    };

    billCreationService.deleteTask = function(config, cb){
        return easyHttp.post("logistics.deleteTask", config, cb);
    };

    billCreationService.repeatGenerateBills = function(config, cb){
        return easyHttp.post('logistics.repeatGenerateBills', config, cb);
    };

    billCreationService.getAllBillList = function(cb){
        return easyHttp.get('logistics.getAllBillList',cb);
    };

    billCreationService.getBillTaskDetail = function(config,cb){
        return easyHttp.get("logistics.getBillTaskDetail", config, cb);
    };

    billCreationService.deleteBillByNumber = function(config, cb){
        return easyHttp.post('logistics.deleteBillByNumber', config, cb);
    };

    billCreationService.submitBillInBilllist = function(config, cb){
        return easyHttp.post('logistics.submitBillInBilllist', config, cb);
    };

    billCreationService.getPlatformData = function(config){
        return easyHttp.get('logistics.getEnterpriseNameTradePlatform', config);
    };

    billCreationService.getSupplierList = function(config){
        return easyHttp.get("logistics.retrievalSupplierList", config);
    };

    billCreationService.setScroll = function(selector,scope){
        var bills = this.bill.find(".bills"),
            offset = bills.offset().top,
            height = bills.height();
        $timeout(function(){
            $(selector).slimScroll({height: height - $(selector).offset().top + offset - 60 + 'px' });
            scope.showTable = true;
        },100);
    };

    billCreationService.createSelect = function(id,data,fn, mutile, onSearchValueChange){
      var config = {
                data: data,
                id: id,
                offset: -300,
                attrTextModel: fn
          };
      if(mutile) {
          config.isSearch = true;
          config.multipleSign = ',';
          config.defaultText = '请选择';
          config.isSaveInputVal = true;
          config.isUsePinyin = true;
          config.closeLocalSearch = true;
      }else{
          config.defaultText = '全部';
      }
      if(onSearchValueChange) config.onSearchValueChange = onSearchValueChange;

      if(billCreationService[id]){
        billCreationService[id].setData(data);
        billCreationService[id].open();
        return;
      }
      if(onSearchValueChange){
          config.pagination = true;
          config.searchPlaceHoder = Lang.getValByKey("common", 'common_select_search_account_tips');
          billCreationService[id] = selectFactory(config);
      }else
            selectFactory(config);

    };

    var doc = $(document);

    billCreationService.promptBox = function(data){
        var config = {
                isDelay:true,
                contentDelay: data.msg,
                time : 3000
            };

        if(data.errorCode == 0) {
            config.type = 'success';
        }else{
           config.manualClose = true;
           config.type = 'errer';
        }
        doc.promptBox(config);
        !config.time || doc.promptBox('closePrompt');

    };

    billCreationService.checkData = function(data){
        if(data.length === 0){
            this.promptBox({msg : '请先选择数据！'});
            return true;
        }
    }

    billCreationService.promptMidBox = function(title, data, btnText, fn){
        doc.promptBox({
            title : title ? title : '提示信息',
            type : 'success',
            width : '400px',
            content: {
                tip: data.msg
            },
            operation: [
                {
                    type: 'submit',
                    description : btnText || Lang.getValByKey("common", 'common_pagination_confirm'),
                    operationEvent: function () {
                        fn();
                         $(document).promptBox('closePrompt');
                         return false;
                    }
                }
            ]
        });
    };

    billCreationService.getSearchData = function(scope){
        var search = {};
        for(var i in scope.search){
            if(scope.search[i]){
                search[i] = scope.search[i];
            }
        }
        return search;
    };

    billCreationService.clearSearch = function(scope){
        var search = scope.search,
            restData = scope.tableModel.restData;
        for(var i in search){
           if(restData[i]) delete restData[i];
           delete search[i];
        }
        delete scope.taskStatusName;
    };

    billCreationService.getDate = function(){
        var time = new Date();
        return [time.getFullYear(),time.getMonth() + 1,time.getDate()].map(function(item){ return formate(item)}).join("-")
                + ' '
                + [time.getHours(),time.getMinutes(),time.getSeconds()].map(function(item){ return formate(item)}).join(":");
    };

    billCreationService.getLastMonth = function(){
        var date = billCreationService.getDate().split(" ")[0].split('-'), start, end;
        if(date[1] == 1){
            date[0] = date[0] - 1;
            date[1] = 12;
        }else{
            date[1] = date[1] - 1;
        }

        date[2] = 1;
        date[1] = formate(date[1]);
        date[2] = formate(date[2]);
        start = date.join("-");
        date[2] = (new Date(date[0], date[1],0)).getDate();
        end = date.join("-");

        return {
            'start' : start + [' 00','00','00'].join(':'),
            'end' : end + [' 23','59','59'].join(':')
        }
    }

    billCreationService.initTaskListTime = function(){
        function fix(num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        }

        var nowdate = new Date();
        var oneweekdate = new Date(nowdate-6*24*3600*1000);
        var y = oneweekdate.getFullYear();
        var m = fix(oneweekdate.getMonth()+1,2);
        var d = fix(oneweekdate.getDate(),2);
        return {
            'start' : y+'-'+m+'-'+d + ' '+'00:00:00',
            'end' : new Date(new Date(nowdate.toLocaleDateString()).getTime()+24*60*60*1000-1).format('yyyy-MM-dd hh:mm:ss')
        }
    };

    billCreationService.getPayWayData = function (config) {
        return easyHttp.get('logistics.getAccountTable', config);
    };

    return billCreationService;

    function nocache(){
    	return '?a=' + Math.random();
    }



    function formate(number){
        if(number < 10) number = '0' + number;
        return number;
    }

}]);

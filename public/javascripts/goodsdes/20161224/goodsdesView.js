app.factory('goodsdesView', ['$http','$templateCache',function($http,$templateCache) {
  
    var goodsdesView = {},
    	TPL_URL = "/tpl/fragment/goodsdes/",
    	TPL_TYPE = '.html';

    goodsdesView.getTpl = function(name){
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

    goodsdesView.createSelect = function(id,data,fn, mutile, onSearchValueChange){
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
      }
      if(onSearchValueChange) config.onSearchValueChange = onSearchValueChange;

      if(billCreationService[id]){
        billCreationService[id].setData(data);
        billCreationService[id].open();
        return;
      }
      if(onSearchValueChange){
        
           billCreationService[id] = selectFactory(config);
      }else
        console.log(config);
            selectFactory(config);

    };

    goodsdesView.promptBox = function(data){
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

    goodsdesView.promptMidBox = function(title, data, btnText, fn){
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


    function nocache(){
    	return '?a=' + Math.random(); 
    }




    return goodsdesView;
}]);
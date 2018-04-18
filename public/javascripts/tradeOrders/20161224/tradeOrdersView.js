
app.factory('tradeOrdersView', ['$http','$templateCache','$compile',function($http,$templateCache,$compile) {
  
    var tradeOrdersView = {},
    	TPL_URL = "/tpl/fragment/tradeOrders/",
    	TPL_TYPE = '.html';

    tradeOrdersView.getTpl = function(name){
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

    var doc = $(document);

    tradeOrdersView.promptBox = function(data){

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

    tradeOrdersView.promptMidBox = function(title, data, btnText, fn,type,opr,cancelDes){
        doc.promptBox({
            title : title ? title : '提示信息',
            type : type || 'success',
            width : '400px',
            content: {
                tip: data.msg
            },
            cancelDescription: cancelDes,
            operation: [
                {
                    type: 'submit',
                    application : opr,
                    description : btnText || Lang.getValByKey("common", 'common_pagination_confirm'),
                    operationEvent: function () {
                        fn();
                        //$(document).promptBox('closePrompt');
                         return false;
                    }
                }
            ]
        });
    };

    tradeOrdersView.resetKeys = function(result, obj){
        for(var i in obj) delete result[i];
    };

    // tradeOrdersView.setTableHeight = function(){
    //     var ah = $("#commodityList .bills").height(),
    //         tableWrap = $("#tableWrap");
    //     tableWrap.height(ah - tableWrap.offset().top + 100 + 'px');
    // };

    tradeOrdersView.goodsTypes = function(list,$scope,data,cb){
        var gname,gid;
        

        if(data.id){
            $scope.goodType = gid = data.id;
        }
        if(data.name){
            gname = data.name;
        } 
       
        var html = '<div class="good-type" id="goodTypeDiv">'+
               '<div><strong>选择商品类别</strong><div class="good-type-div">' +
                goodItem(list,0) + 
               '</div><div class="good-type-btn"><button class="btn btn-primary btn-bill" ng-click="gconfirm()">确定</button><button class="btn btn-primary btn-bill" ng-click="gcancel()">取消</button></div></div></div>';

        var method = {
            gconfirm : function(){
               cb(gname,gid);
               $scope.gcancel();
            },
            gcancel : function(){
              $("#goodTypeDiv").remove();
            },
            gchange : function(name,id){
              gname = name;
              gid = id;
            }
        };
        if(!$scope.gconfirm) $.extend($scope,method);

          function goodItem(data,layer){
              var html = '<ul>';
              data.forEach(function(item){
                    html += '<li><p><input type="radio" style="left:' + (-30 - layer*15) + 'px" name="goodType" ng-click="gchange(\''+ item.name+'\',\''+item.id+'\')" ng-model="goodType" value="'+item.id+'" /><span>'+item.name +'</span></p></li>';
                    if(item.children && item.children.length > 0) html += goodItem(item.children,layer+1);
                });
              html += '</ul>';
              return html;
          }

          $("#commodityList").append($compile(html)($scope));
    };

    tradeOrdersView.initNgSelect = function($scope,selector,data, cb){

    	var html = '<ul class="hide">',selector = $(selector), child = $scope.$new();
    	data.forEach(function(item){
    		html += '<li ng-click=\'selectOne('+JSON.stringify(item)+',$event)\'>'+item.name+'</li>';
    	});
    	html += '</ul>';
    	child.selectOne = function(item,e){
    		e.stopPropagation();
    		selector.find("ul").hide();
    		cb(item);
    	}
    	if(selector.find("ul").length === 0){
    		selector.append($compile(html)(child));
    	}

    	selector.find("input").unbind('click').bind("click",function(e){
    		e.stopPropagation();
    		var ul = selector.find("ul");
    		if(ul.is(":hidden")){
    			ul.show();
    		}else{
    			ul.hide();
    		}
    	});

    	if(!window.initNgSelect){
    		$(document.body).click(function(){
    			$(".ng-select ul").hide();
    		});
    		window.initNgSelect = true;
    	}
    };




    function nocache(){
    	return '?a=' + Math.random(); 
    }

    // 时间部分的格式化
    // 01-jul-2017

    tradeOrdersView.DataFormat = function (dateInput) {
        var formatDate = dateInput.split(' ')[0].split('-');
        var year  = formatDate[0];
        var month = formatDate[1];
        var date  = formatDate[2];

        var mounthDes = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        return date+'-'+mounthDes[parseInt((month-1),10)]+'-'+year;

    }


    // 01 Auguset,2017
    tradeOrdersView.DataFormat2 = function(dateInput) {

        var formatDate = dateInput.split(' ')[0].split('-');
        var year  = formatDate[0];
        var month = formatDate[1];
        var date  = formatDate[2];

        var mounthDes = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        return date+' '+mounthDes[parseInt((month-1),10)]+', '+year;

    }

    // 处理itext 不能换行的问题 每隔re个字符，用ic换行 暴力换行
    tradeOrdersView.StringInsertByInterval = function(oc,ic,re){
        if(!oc) return;

        var reStr = "(.{"+re+"}|.*)";

        var reg = new RegExp(reStr,"g");

        var ocArray = oc.match(reg) ;
        ocArray.pop();

        var arrLength = ocArray.length+1;

        for(var element=0;element<ocArray.length;element+=2){

            ocArray.splice(element+1,0,ic);

        }
        ocArray.pop();
        var str = ocArray.join('');
        return str;
    }


    //单词换行不截断


    tradeOrdersView.SectionBreakWord = function(word,length) {
        if(!word) return;
        if(!length) length = 90; //默认90字符截断
        var wordArray = word.split('\n');
        var finalArray = [];

        //用户手动输入的回车要截断，然后分次处理
        angular.forEach(wordArray,function (item) {
            var sentence = tradeOrdersView.SentenceBreakWord(item,length);
            finalArray.push(sentence);
        })
        return finalArray.join('\n');
    }


    //单句断词不换行
    tradeOrdersView.SentenceBreakWord = function (sentence,length) {
        if(!sentence) return;
        if(!length) {
            length = 90;
        }

        var str = sentence.split(' ');
        var buff=[];
        var len =0;
        var i =0;


        for(i = 0;i< str.length;i++){


            //如果有长单词，强行截断
            if(str[i].length  > length){
                var longWords = tradeOrdersView.StringInsertByInterval(str[i],'\n',length);
                var longWordsArray = longWords.split("\n");

                angular.forEach(longWordsArray,function (item,index) {
                    if(item.length === length){
                        buff.push(item+"\n");
                    }else{
                        buff.push(item+" ");
                        len += item.length +1; //包括空格，如果长单词截断为比如2部分，一行长度的加空格，未超过一行的，继续计数
                    }
                });// 这里最后一个回车可以不添加，回头考虑
                continue;
            }

            //超过特定长度，回车换行，否则添加单词之间的空格
            len += str[i].length;
            if(len > length){
                buff.push('\n'+str[i]+" ");
                len = str[i].length+1;
            }else {
                buff.push(str[i]+" ");
                len++;
            }
        }

        //链接单词
        return buff.join('');

    }

    return tradeOrdersView;
}]);


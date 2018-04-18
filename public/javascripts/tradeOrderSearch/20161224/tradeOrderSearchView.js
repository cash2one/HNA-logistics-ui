app.factory('tradeOrderSearchView', ['$http','$templateCache','$compile',function($http,$templateCache,$compile) {
    var tradeOrderSearchView = {},
        TPL_URL = "/tpl/fragment/tradeOrders/",
        TPL_TYPE = '.html';

    tradeOrderSearchView.initCalander = function($scope){
        Calander.init({
            ele: ['#startTime', '#endTime'], isClear: true
        });

        $scope.search.startTime = getBeforeDate(6)+' 00:00:00';    //起始时间
        $scope.search.endTime = new Date().format("yyyy-MM-dd 23:59:59");    //截止时间
    };

    tradeOrderSearchView.getTpl = function(name){
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

    tradeOrderSearchView.promptBox = function(data){

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

    tradeOrderSearchView.promptMidBox = function(title, data, btnText, fn,type,opr,cancelDes){
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

    tradeOrderSearchView.resetKeys = function(result, obj){
        for(var i in obj) delete result[i];
    };

    // tradeOrderSearchView.setTableHeight = function(){
    //     var ah = $("#commodityList .bills").height(),
    //         tableWrap = $("#tableWrap");
    //     tableWrap.height(ah - tableWrap.offset().top + 100 + 'px');
    // };

    tradeOrderSearchView.goodsTypes = function(list,$scope,data,cb){
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

    tradeOrderSearchView.initNgSelect = function($scope,selector,data, cb){

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

    return tradeOrderSearchView;

}]);
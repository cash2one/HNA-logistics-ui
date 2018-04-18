app.directive("tabTabs", function () {
    return{
        restrict:"EA",
        transclude: true,
        widgetName: "tabTabs",
        scope:{
            navjustified:'@'
        },
        templateUrl:"tabTabs.html",
        controller:["$scope", function ($scope) {//使用controller让最内层指令来继承外层指令，这样内层就可以通过scope的传导，来与外层指令进行数据之间的传递
            var panes = $scope.scopes = [];
            $scope.tab = {};
            $scope.tab.select= function (pane,isundefined) {//实现tabs功能
                angular.forEach(panes, function (scope) { //遍历所有内存指令scope，统一隐藏内容。
                    scope.selected=false;
                });
                pane.selected=true;
                if(typeof pane.callback == "function" && isundefined == undefined) {
                    pane.callback();
                }
            };

            this.addScope= function (scope) {//由内层指令来继承，把内层指令的scope，传到进外层指令进行控制
                if(panes.length===0){    //默认加载第一项
                    $scope.tab.select(scope,false);
                }
                panes.push(scope);//把内层指令数组，传入外层指令scope数组。
            };
        }]
    }
})
.directive("tabPane", function () {
    return{
        restrict:'EA',
        scope:{
            title:'@',
            callback:'&'
        },
        transclude: true,
        widgetName: "tabTabs",
        isChild:true,
        require:'^tabTabs',//继承外层指令
        templateUrl:"tabPane.html",
        link: function (scope, elemenet,attrs,ctrl) {
            ctrl.addScope(scope);//把内层指令的scope存入到外层指令中，让外层遍历。
        }
    }
});
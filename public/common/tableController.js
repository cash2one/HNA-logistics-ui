easySpa.use([
    'public/common/tableService.js',
    'public/common/Event.js'
], function() {
    app.controller('tableController', ["$scope", "tableService", function($scope, tableService){

        $scope.table = {};

        /**
         * 复选框全选按钮 全选与反选
         */
        $scope.table.selectAll = function(tableModel){
            if(tableModel.selectFlag) {
                tableModel.tableBody = tableService.selectAll(tableModel.tableBody);
                var number = tableService.selectNumberCount(tableModel.tableBody);
                tableModel.selectNumber = number.select;
            } else {
                tableModel.tableBody = tableService.cancelAll(tableModel.tableBody);
                tableModel.selectNumber = 0;
            }
        };

        /**
         * 点击列表复选框
         * @param tableModel  :  数据Model
         * @param selectId  :  勾选复选框checkboxID
         */
        $scope.table.selectOne = function(tableModel, selectId, event){
            event && event.stopPropagation();
            tableModel.tableBody = tableService.selectOne(tableModel.tableBody, selectId);
            var number = tableService.selectNumberCount(tableModel.tableBody);
            tableModel.selectNumber = number.select;
            if(number.select == number.count){    //全选
                tableModel.selectFlag = true;
            }else if(number.noselect == number.count){    //全不选
                tableModel.selectFlag = false;
            }else{    //半选
                tableModel.selectFlag = false;
            }
        };

        /**
         * 首页
         * @param tableModel  :  数据Model
         */
        $scope.table.first = function(tableModel){
            tableModel.pagination.currentPage = 1;
            tableModel.restData.pageIndex = tableModel.pagination.currentPage;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;

            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };
        /**
         * 尾页
         * @param tableModel  :  数据Model
         */
        $scope.table.last = function(tableModel){
            tableModel.pagination.currentPage = tableModel.pagination.totalPage;

            tableModel.restData.pageIndex = tableModel.pagination.currentPage;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;

            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };

        /**
         * 上一页
         * @param tableModel  :  数据Model
         */
        $scope.table.previous = function(tableModel){
            tableModel.pagination.getPage = tableModel.pagination.currentPage = tableModel.pagination.currentPage - 1;

            tableModel.restData.pageIndex = tableModel.pagination.currentPage;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;
            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };
        /**
         * 下一页
         * @param tableModel  :  数据Model
         */
        $scope.table.nexts = function(tableModel){
            tableModel.pagination.getPage = tableModel.pagination.currentPage = tableModel.pagination.currentPage + 1;
            tableModel.restData.pageIndex = tableModel.pagination.currentPage;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;
            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data) {
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };

        /**
         * 点击页码
         * @param tableModel  :  数据Model
         * @param currentPage  :  当前页码
         */
        $scope.table.selectPage = function(tableModel, currentPage){
            if(currentPage == tableModel.pagination.currentPage){
                return;
            }
            tableModel.pagination.getPage = currentPage;
            tableModel.pagination.currentPage = currentPage;
            tableModel.restData.pageIndex = currentPage;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;
            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };

        /**
         * 输入跳转页码
         * @param tableModel  :  数据Model
         * @param currentPage  :  当前页码
         */
        $scope.table.goPage = function(tableModel){
            var currentPage = tableModel.pagination.getPage;

            if(!currentPage || currentPage == tableModel.pagination.currentPage){
                return;
            }
            if(currentPage < 1 || currentPage > tableModel.pagination.totalPage){
                tableModel.pagination.getPage = tableModel.pagination.currentPage;
                return;
            }

            if(!isNaN(currentPage)){

                if(currentPage > tableModel.pagination.totalPage){
                    currentPage = tableModel.pagination.totalPage;
                }

                tableModel.pagination.currentPage = currentPage;
                tableModel.restData.pageIndex = currentPage;
                tableModel.restData.pageSize = tableModel.pagination.pageSize;

                tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                    tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
                    tableModel.pagination.getPage =tableModel.pagination.currentPage;
                });
            }else{
                tableModel.pagination.getPage = tableModel.pagination.currentPage;
            }
        };

        /**
         *
         */
        $scope.table.pageSize = function(tableModel, pageSize){
            tableModel.pagination.pageSize = pageSize;
            tableModel.restData.pageIndex = 1;
            tableModel.restData.pageSize = tableModel.pagination.pageSize;

            tableService.getTable(tableModel.restURL, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, function(data){
                tableModel = tableService.table(tableModel, {'urlParams':tableModel.restData, 'seatParams':tableModel.seatData}, data);
            });
        };
        $scope.renderFinish = function($last) {
            var thEles,
                trEles,
                tdEles,
                tableEles,
                sizeList = [];
            if($last) {
                tableEles = $("table");
                setTimeout(function() {
                    for(var k = 0; k < tableEles.length; k++) {
                        var tableWidth = $(tableEles[k]).outerWidth();
                        if(!$(tableEles[k]).is(':visible')) {
                            continue;
                        }
                        sizeList = [];
                        thEles = $("th", $(tableEles[k]));
                        for (var i = 0; i < thEles.length; i++) {
                            var widthStr = $(thEles[i])[0].style.width.split("%");
                            var tdWidth = 0;
                            var rate = 1;
                            if(widthStr.length > 1) {
                                rate = parseInt(widthStr[0]);
                                tdWidth = tableWidth * rate / 100;
                            } else {
                                tdWidth = $(thEles[i]).outerWidth();
                            }
                            $(thEles[i]).outerWidth(Math.floor(tdWidth));
                            $(thEles[i]).css({
                                "min-width": "20px",
                                "max-width": Math.floor(tdWidth) + "px",
                                "width": Math.floor(tdWidth) + "px",
                                "word-wrap": "no-wrap",
                                "text-overflow": "ellipsis"
                            });
                            sizeList.push(Math.floor(tdWidth));
                        }
                        trEles = $("tr", $(tableEles[k]));
                        for (var index = 1; index < trEles.length; index++) {
                            tdEles = $("td", trEles[index]);
                            for (var jndex = 0; jndex < tdEles.length; jndex++) {
                                $(tdEles[jndex]).css({
                                    "min-width": "20px",
                                    "max-width": Math.floor(sizeList[jndex]) + "px",
                                    "width": Math.floor(sizeList[jndex]) + "px",
                                    "word-wrap": "no-wrap",
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis"
                                });
                            }
                        }
                        $(tableEles[k]).css("visibility", "visible");
                    }
                }, 200);
            } else {
                tableEles = $("table");
                for(var k = 0; k < tableEles.length; k++) {
                    if($(tableEles[k]).is(':visible')) {
                        //$(tableEles[k]).css("visibility", "hidden");
                    }
                }
            }
        }
        var t = null;
        Event.onResizend(function(){
            if(!t) {
                t = setTimeout(function () {
                    $scope.renderFinish(true);
                    t = null;
                }, 100);
            }
        });
        window.resizeTable = function() {
            $scope.renderFinish(true);
        };
    }]);
});
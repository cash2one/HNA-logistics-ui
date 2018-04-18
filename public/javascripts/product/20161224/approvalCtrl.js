var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function($scope) {//配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            isTabList: true,
            isShowCheckBox: false
        });
    },
    setDateToWaitVerify: function(status, text) {
        var $scope = this.$scope;
        $scope.state = text;
        $scope.statusId = status;
        if(status == 2){
            $scope.tableModel.restData.orderby = 'submittime';
            delete $scope.tableModel.restData.asc;
        }else if(status == 3){
            $scope.tableModel.restData.orderby = 'submittime';
            $scope.tableModel.restData.asc = false;
        }
        $scope.search();
    },
    bindEvent: function() {
        var self = this;
        var $scope = this.$scope;
        $scope.switchTab = function(ev, type) {
            var currentEle = $(ev.target);
            if(currentEle.hasClass("tab-active")) {
                return;
            }
            $scope.resetData();
            $(".tab-active").removeClass("tab-active");
            currentEle.addClass("tab-active");

            if(type == 1) {
                self.setDateToWaitVerify(2, Lang.getValByKey("product", 'product_state_unAudit'));
                $scope.showSelectStatus = false;
            } else {
                self.setDateToWaitVerify(3, Lang.getValByKey("product", 'product_state_audit'));
                $scope.showSelectStatus = true;
            }
        }
    },
    initPageData: function() {
        this.setDateToWaitVerify(2, Lang.getValByKey("product", 'product_state_unAudit'));
    },
    setTabActive: function() {
        var $scope = this.$scope;
        var type = easySpa.queryUrlValByKey("type");
        if(!type) {
            return;
        }
        if(type == "1") {
            $scope.switchTab({
                target: $(".tab-list a")[0]
            }, 1);
        } else if(type == "2") {
            $scope.switchTab({
                target: $(".tab-list a")[1]
            }, 2);
        }
    },
    init: function($scope, service, tableService) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;
        this.tableService = tableService;
        this.bindEvent();
        this.initPageData();
        this.setTabActive();
    }
}
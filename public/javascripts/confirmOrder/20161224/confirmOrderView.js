app.factory('confirmOrderView', [function() {
    var confirmOrderView = {
        //物品明细提示信息
        questionMarkHover:function(){
            $("#questionMark").hover(function () {
                $("#questionMark_div").css("display", "block");
            }, function () {
                $("#questionMark_div").css("display", "none");
            });
        },
        //設置toggle
        switchList:function(){
            $('.label-text').on("click", function () {
                var menu = {
                    "none": "block",
                    "block": "none"
                };
                var flag = $(this).siblings().css("display");
                $(this).siblings().css("display", menu[flag]);
                if (menu[flag] == "block") {
                    $(this).find("i").css("transform", 'rotate(-90deg)');
                } else {
                    $(this).find("i").css("transform", 'rotate(90deg)');
                }
            });

        },
        switchStatus : function($scope,str, flag){
            var menu = {
                "origin": "oPlace",
                "destination": "dPlace",
                "accept": "aPlace"
            };
            var oDivs = $("#" + menu[str]).find(".address");

            if (flag) {
                $scope[menu[str] + "ListShow"] = false;
                $("#" + menu[str] + "Btn").html(Lang.getValByKey("confirmOrder", 'confirmOrder_page_oPlaceContracts_open'));
                $(oDivs).css("display", "none");
                $($(oDivs)[$scope[menu[str] + "Index"]]).css("display", "inline-block");
                return;
            }

            $scope[menu[str] + "ListShow"] = !$scope[menu[str] + "ListShow"];
            if ($scope[menu[str] + "ListShow"]) {
                $(oDivs).css("display", "inline-block");
                $("#" + menu[str] + "Btn").html(Lang.getValByKey("confirmOrder", 'confirmOrder_page_oPlaceContracts_close'))
            } else {
                $("#" + menu[str] + "Btn").html(Lang.getValByKey("confirmOrder", 'confirmOrder_page_oPlaceContracts_open'));
                $(oDivs).css("display", "none");
                $($(oDivs)[$scope[menu[str] + "Index"]]).css("display", "inline-block");
            }
        },
        toggleList:function($scope,index){
            $scope.orderInfo.orderLogistics[index].isShow = !($scope.orderInfo.orderLogistics[index].isShow);
            if ($scope.orderInfo.orderLogistics[index].isShow) {
                $("#icon" + index).removeClass("icon_open").addClass("icon_close");
            } else {
                $("#icon" + index).removeClass("icon_close").addClass("icon_open");
            }
        },
        remainWord:function($scope){
            $scope.remainWords = 140 - $("#customerMessageBox").val().length;
        },
        bindEvent :function(){
            this.questionMarkHover();
            this.switchList();
        }
    };
    return confirmOrderView;
}]);

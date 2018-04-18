app.factory('productView', [function() {
    var productView = {};
    productView.lockBtn = function() {
        $("#delete").attr("disabled", "true");
        $("#submitVerify").attr("disabled", "true");
        $("#delete").addClass("disabled");
        $("#submitVerify").addClass("disabled");
    }
    productView.unlockBtn = function() {
        $("#delete").removeAttr("disabled");
        $("#submitVerify").removeAttr("disabled");
        $("#delete").removeClass("disabled");
        $("#submitVerify").removeClass("disabled");
    }
    productView.check = function() {
        var isLimit = false;
        var checkBoxEles = $(".checkbox");
        for(var index = 0; index < checkBoxEles.length; index++) {
            if(checkBoxEles[index].checked) {
                var status = $(checkBoxEles[index]).attr("data-status");
                if(status != Lang.getValByKey("product", "product_state_draft")) {
                    isLimit = true;
                    productView.lockBtn();
                    break;
                }
            }
        }
        if(!isLimit) {
            productView.unlockBtn();
        }
    }
    productView.bindEvent = function() {
        var time = setInterval(function() {
            if($(".tbody").length > 0) {
                clearInterval(time);
                time = null;
                $(".tbody").delegate(".checkbox", "change", function() {
                    productView.check();
                });
                $("#select-all").on("change", function() {
                    productView.check();
                });
            }
        }, 100);
    }
    return productView;
}]);
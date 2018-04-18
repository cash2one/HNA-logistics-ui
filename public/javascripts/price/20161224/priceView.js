app.factory('priceView', [function() {
    var priceView = {};
    priceView.lockBtn = function() {
        $("#delete").attr("disabled", "true");
        $("#submitVerify").attr("disabled", "true");
        $("#delete").addClass("disabled");
        $("#submitVerify").addClass("disabled");
    }
    priceView.unlockBtn = function() {
        $("#delete").removeAttr("disabled");
        $("#submitVerify").removeAttr("disabled");
        $("#delete").removeClass("disabled");
        $("#submitVerify").removeClass("disabled");
    }
    priceView.check = function() {
        var isLimit = false;
        var checkBoxEles = $(".checkbox");
        for(var index = 0; index < checkBoxEles.length; index++) {
            if(checkBoxEles[index].checked) {
               var status = $(checkBoxEles[index]).attr("data-status");
               if(status != Lang.getValByKey("price", "price_draft")) {
                   isLimit = true;
                   priceView.lockBtn();
                   break;
               }
            }
        }
        if(!isLimit) {
            priceView.unlockBtn();
        }
    }
    priceView.bindEvent = function() {
        var time = setInterval(function() {
            if($(".tbody").length > 0) {
                clearInterval(time);
                time = null;
                $(".tbody").delegate(".checkbox", "change", function() {
                    priceView.check();
                });
                $("#select-all").on("change", function() {
                    priceView.check();
                });
            }
        }, 100);
    }
    return priceView;
}]);
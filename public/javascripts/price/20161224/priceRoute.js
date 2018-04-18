(function loadModule() {
    var module= easySpa.queryUrlValByKey("module");
    easySpa.isTopReload = true;
    switch(module) {
        case "costPrice" : {
            easySpa.use([
                "public/javascripts/price/20161224/costPriceService.js",
                "public/javascripts/price/20161224/costPriceCtrl.js"
            ]);
            break;
        }
        case "costPriceApproval": {
            easySpa.use([
                "public/javascripts/price/20161224/costPriceApprovalService.js",
                "public/javascripts/price/20161224/costPriceApprovalCtrl.js"
            ]);
            break;
        }
        case "salesPrice": {
            easySpa.use([
                "public/javascripts/price/20161224/salesPriceService.js",
                "public/javascripts/price/20161224/salesPriceCtrl.js"
            ]);
            break;
        }
        case "salesPriceApproval": {
            easySpa.use([
                "public/javascripts/price/20161224/salesPriceApprovalService.js",
                "public/javascripts/price/20161224/salesPriceApprovalCtrl.js"
            ]);
            break;
        }
    }
})();
window.onhashchange = function() {
    $(".content-main").remove();
    //if(easySpa.isTopReload) {
       //top.location.reload();
    //} else {
        window.location.reload();
    //}
}
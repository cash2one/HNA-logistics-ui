(function loadModule() {
    var module= easySpa.queryUrlValByKey("module");
    switch(module) {
        case "costPrice" : {
            easySpa.use([
                "public/javascripts/priceDetail/20161224/costPriceService.js",
                "public/javascripts/priceDetail/20161224/costPriceCtrl.js"
            ]);
            break;
        }
        case "costPriceApproval": {
            easySpa.use([
                "public/javascripts/priceDetail/20161224/costPriceApprovalService.js",
                "public/javascripts/priceDetail/20161224/costPriceApprovalCtrl.js"
            ]);
            break;
        }
        case "salesPrice": {
            easySpa.use([
                "public/javascripts/priceDetail/20161224/salesPriceService.js",
                "public/javascripts/priceDetail/20161224/salesPriceCtrl.js"
            ]);
            break;
        }
        case "salesPriceApproval": {
            easySpa.use([
                "public/javascripts/priceDetail/20161224/salesPriceApprovalService.js",
                "public/javascripts/priceDetail/20161224/salesPriceApprovalCtrl.js"
            ]);
            break;
        }
    }
})();
window.onhashchange = function() {
    location.reload();
}
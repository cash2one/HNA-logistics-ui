(function loadModule() {
    var module= easySpa.queryUrlValByKey("module");
    switch(module) {
        case "new" : {
            easySpa.use([
                "public/javascripts/product/20161224/newService.js",
                "public/javascripts/product/20161224/newCtrl.js"
            ]);
            break;
        }
        case "approval": {
            easySpa.use([
                "public/javascripts/product/20161224/approvalService.js",
                "public/javascripts/product/20161224/approvalCtrl.js"
            ]);
            break;
        }
    }
})();
window.onhashchange = function() {
    $(".content-main").remove();
    location.reload();
}
app.factory('carrierMaritimeView', [function() {
    var carrierMaritimeView = {};

    carrierMaritimeView.propmtCostEvent = function(elm){
        elm.on('click', function(){
            if($(this).next().is(':visible')){
                $(this).next().hide();
                $(this).children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
                return false;
            }else{
                elm.next().hide();
                elm.children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
                $(this).next().show();
                $(this).children('.icon-more-down').removeClass('icon-angle-right').addClass('icon-angle-down');
                return false;
            }
        });
    };

    carrierMaritimeView.promptBox = function(opt){
        $(document).promptBox(opt);
    };

    carrierMaritimeView.loadBarEvent = function(elm){
        elm.next().hide();
        elm.children('.icon-more-down').removeClass('icon-angle-down').addClass('icon-angle-right');
        if(!elm.next('ul').eq(0).is(':visible')){
            elm.next('ul').eq(0).show(10, function(){
                $(this).css('height', 400 - elm.length*40).scrollTop(0);
            });
            elm.eq(0).children('.icon-more-down').removeClass('icon-angle-right').addClass('icon-angle-down');
        }

        elm.next('.switch-list').css('height', 400 - elm.length*40);
    };

    carrierMaritimeView.displayErrorBox = function(elm){
        if(elm.eq(0).next('.switch-list').is(":hidden")){
            carrierMaritimeView.loadBarEvent(elm);
        }
    };

    return carrierMaritimeView;
}]);
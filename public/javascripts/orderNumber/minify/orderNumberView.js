app.factory("orderNumberView",[function(){var e={};return e.initCalander=function(){Calander.init({ele:["#invertory-begin-time","#invertory-end-time"]})},e.promptBox=function(e){$(document).promptBox(e)},e.rebuildServiceName=function(e){for(var e=e.data,n=0;n<e.length;n++)e[n].name=e[n].name+"("+e[n].code+")"},e.rebuildClienteleName=function(e){for(var e=e.data,n=0;n<e.length;n++)e[n].userName=e[n].userName+"("+e[n].code+")"},e}]);
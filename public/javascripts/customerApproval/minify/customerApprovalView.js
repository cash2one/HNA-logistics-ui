app.factory("customerApprovalView",[function(){var e={};return e.tab=function(e,t){return $(e).tab({callback:t})},e.promptBox=function(e){$(document).promptBox(e)},e.height=function(e){var t=0;switch(e){case"getResources":t=$(".layout-right").height()-$(".layout-right ul").outerHeight()-160;break;case"getSeniorResources":t=$(".layout-right").height()-$(".layout-right ul").outerHeight()-195;break;case"getRoleUser":t=$(".layout-right").height()-320;break;case"getSeniorRoleUser":t=$(".layout-right").height()-354;break;case"getGroupCandidate":t=window.innerHeight-252;break;default:t=0}return t},e}]);
easySpa.require(["public/lib/echarts.min.js","public/javascripts/fragment/cockpit/cumulativeStatics.js","public/javascripts/fragment/cockpit/staticsRank.js","public/javascripts/fragment/cockpit/weeklyStatics.js","public/javascripts/fragment/cockpit/tradeIndicator.js","public/javascripts/fragment/cockpit/latestOrder.js","widget/select","public/common/calander.js"],function(){app.controller("cockpitCtrl",["$scope","$route","cockpitService","cockpitView",function(s,t,c,i){s.businessStatics=!t.current.params.from;var a=0;s.switchTab=function(t){if(s.businessStatics&&"businessStatics"!==t)s.businessStatics=!1,0===a&&(a=1,s.$broadcast("changeToIndicator",{}));else{if(s.businessStatics||"businessStatics"!==t)return;s.businessStatics=!0}}}])});
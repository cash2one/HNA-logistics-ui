app.directive("tabTabs",function(){return{restrict:"EA",transclude:!0,widgetName:"tabTabs",scope:{navjustified:"@"},templateUrl:"tabTabs.html",controller:["$scope",function(t){var e=t.scopes=[];t.tab={},t.tab.select=function(t,a){angular.forEach(e,function(t){t.selected=!1}),t.selected=!0,"function"==typeof t.callback&&void 0==a&&t.callback()},this.addScope=function(a){0===e.length&&t.tab.select(a,!1),e.push(a)}}]}}).directive("tabPane",function(){return{restrict:"EA",scope:{title:"@",callback:"&"},transclude:!0,widgetName:"tabTabs",isChild:!0,require:"^tabTabs",templateUrl:"tabPane.html",link:function(t,e,a,c){c.addScope(t)}}});
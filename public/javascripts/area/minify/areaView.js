app.factory("areaView",[function(){return{initTab:function(a){$(".no-result").addClass("hidden");$("#m-tab").tab({callback:a})}}}]);
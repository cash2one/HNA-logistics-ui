app.factory('areaView', [function() {
    var areaView = {
      initTab: function(callback) {
          $(".no-result").addClass("hidden");
          var tab = $("#m-tab").tab({
           callback:callback
          });
      }
    };
    return areaView;
}]);
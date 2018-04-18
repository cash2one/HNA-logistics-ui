easySpa.require([
    "widget/select"
], function() {
    app.controller("detail",['$scope','goodsdesService','goodsdesView', detail]);
    function detail($scope, goodsdesService,goodsdesView){
        $scope.name = 'detail';
        $scope.descriptions = [{name : 'a1'},{name : 'a2'}];
        $scope.save = function(){
            checkValue();
        };
        function checkValue(){
            var keyArray = ['name1','name2','name3','name4','reply1','reply2'];
            var canSubmit = true;
            keyArray.forEach(function(key){
                if(!$scope[key]){
                    $scope.customerForm[key].$setDirty();
                    canSubmit = false;
                }
            });
        }
        function generalCallback(data){
            if(data.errorCode == 0) {
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                $(document).promptBox('closePrompt');
            }else{
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
            }
        }
    }
});
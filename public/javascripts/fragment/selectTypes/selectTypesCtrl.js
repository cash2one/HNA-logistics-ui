app.controller('selectTypesCtrl', ['$scope', function($scope) {

    $scope.selectTypesModel.selectedGoods = [];

    var updateGoodsSelected = function(action,id){
        if(action == 'add' && $scope.selectTypesModel.selectedGoods.indexOf(id) == -1){
            $scope.selectTypesModel.selectedGoods.push(id);
        }

        if(action == 'remove' && $scope.selectTypesModel.selectedGoods.indexOf(id)!=-1){
            var idx = $scope.selectTypesModel.selectedGoods.indexOf(id);
            $scope.selectTypesModel.selectedGoods.splice(idx,1);
        }
    };

    /** 选择添加类型 */
    $scope.obtainGoodsTypes = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        if(checkbox.checked){
            $(checkbox).addClass('active');
        }else{
            $(checkbox).removeClass('active');
        }
        updateGoodsSelected(action,id,checkbox.name);
    };

    $scope.isCheckGoodsType = function(id){
        return $scope.selectTypesModel.selectedGoods.indexOf(id)>=0;
    };

}]);


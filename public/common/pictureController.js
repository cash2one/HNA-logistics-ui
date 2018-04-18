easySpa.use(['public/common/pictureService.js']);

app.controller('pictureController', ['$scope', 'pictureService', function($scope, pictureService){
	$scope.picture = {};

	$scope.picture.maxUpload = pictureService.maxUpload;

	$scope.picture.del = function(pictureModel, index){
		var ret = [];
		var length = pictureModel.picture.length;
		for(var i=0; i<length; i++){
			if(i != index){
				ret.push(pictureModel.picture[i]);	
			}
		}
		pictureModel.picture = ret;

		pictureModel.uploadShow = true;
		var length = pictureModel.picture.length;
		for(var i=0; i<length; i++){
			pictureModel.picture[i].picUrlID = typeof (pictureModel.picture[i].picUrlID) == 'object' ? pictureModel.picture[i].picUrlID.id : pictureModel.picture[i].picUrlID;
		}

		return ret;
	};

	$scope.picture.mouseover = function(pictureModel, index, $event){
		if(!pictureModel.edit){
			return false;
		}
		var length = pictureModel.picture.length;
		for(var i=0; i<length; i++){
			if(i == index){
				pictureModel.picture[i].delshow = true;	
			}else{
				pictureModel.picture[i].delshow = false;	
			}
		}
		return pictureModel;
	};

	$scope.picture.mouseleave = function(pictureModel, index, $event){
		for(var i in pictureModel.picture){
			pictureModel.picture[i].delshow = false;
		};

		return pictureModel;
	};
}]);
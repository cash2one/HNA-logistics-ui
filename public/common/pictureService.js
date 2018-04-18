app.factory('pictureService', ['$http', function ($http) {
	var pictureService = {};

	pictureService.maxUpload = 9;    //最大上传值
	pictureService.picPreUrl = '';  //图片地址前缀地址。图片地址=picPreUrl + picUrlId
	pictureService.uploadUrl = Interface.getUrlById("logistics.uploadFileToUrl"); //上传地址

	pictureService.init = function(pictureModel, type){
		var length = pictureModel.picture.length;
		if(length >= pictureService.maxUpload || pictureModel.edit == false){
			pictureModel.uploadShow = false;
		}else{
			pictureModel.uploadShow = true;
		}

		for(var i=0; i<length; i++){
			pictureModel.picture[i].picUrl = pictureService.picPreUrl + pictureModel.picture[i].picUrlID.path;
			pictureModel.picture[i].name = pictureModel.picture[i].picUrlID.name;

			if(pictureModel.picture[i].picUrlID.type.indexOf('image') != -1){

				pictureModel.picture[i].typeImage = true;
				pictureModel.picture[i].typePdf = false;
				pictureModel.picture[i].suffix = pictureService.getImageSuffix(pictureModel.picture[i].picUrlID.type);

			}else if(pictureModel.picture[i].picUrlID.type.indexOf('application') != -1){

				pictureModel.picture[i].typeImage = false;
				pictureModel.picture[i].typePdf = true;
				pictureModel.picture[i].suffix = 'pdf';

			}
		}

		return pictureModel;	
	};

	pictureService.uploadFile = function(pictureModel, file){
		var ifPicUrl,fCode;
		// var _maxSize = 10 * 1024 * 1024;    //最大支持上传10M。
		var _maxSize = 10 * 1000 * 1000;    //最大支持上传10M。
        var res = {};

        if(file == undefined){
            return false;
        }

        if (file.size > _maxSize) {
            res.errorlocal = Lang.getValByKey("common", 'common_prompt_upload_too_large');
            return res;
        }
        if (file.size == 0) {
            res.errorlocal = Lang.getValByKey("common", 'common_prompt_upload_zero');
            return res;
        }
		if(file.name){
			var idx = file.name.lastIndexOf('.');
			fCode= file.name.substr(idx + 1);
			//fCode= file.name.split(".")[1];
		}
		if(pictureModel.accept && file.name && pictureModel.accept.indexOf(fCode) == -1){
			res.errorlocal = "文件格式不正确，无法上传！";
			return res;
		}
		if(pictureModel.accept && fCode && pictureModel.accept.indexOf(fCode) == -1){
			res.errorlocal = "文件格式不正确，无法上传！";
			return res;
		}
		if(file.type.indexOf('image') != -1){
			ifPicUrl = pictureService.uploadUrl + 'pic';
		}else{
			ifPicUrl = pictureService.uploadUrl + 'file';
		}
        var fd = new FormData();
        fd.append('file', file);
        var args = {
            method: 'POST',
            url: ifPicUrl,
            data: fd,
            headers: {'Content-Type': undefined, 'x-token': cookie.get("token")},
            transformRequest: angular.identity
        };
        return $http(args);
	};

	pictureService.updateModel = function(pictureModel, picUrlID, file){
		var picUrlType = picUrlID;
		var map = {};

		if(picUrlType.type.indexOf('image') != -1){
			var suffix = pictureService.getImageSuffix(picUrlType.type);
			map = {
				'picUrlID': picUrlID,
				'delshow': false,
				'name': picUrlID.name,
				'picUrl': pictureService.picPreUrl + picUrlID.path,
				'typeImage' : true,
				'suffix' : suffix,
				'typePdf' : false
			};
		}else if(picUrlType.type.indexOf('application') != -1){
			map = {
				'picUrlID': picUrlID,
				'delshow': false,
				'name': picUrlID.name,
				'picUrl': pictureService.picPreUrl + picUrlID.path ,
				'typeImage' : false,
				'suffix' : 'pdf',
				'typePdf' : true
			};
		}

		pictureModel.picture.push(map);

		var length = pictureModel.picture.length;
		if(length >= pictureService.maxUpload){
			pictureModel.uploadShow = false;
		}else{
			pictureModel.uploadShow = true;
		}
		return pictureModel;
	};

	/**
	 * 获取图片后缀类型
	 * @param type image/png, image/tiff …………
	 * @returns {*}
	 */
	pictureService.getImageSuffix = function(type){
		if(!type || (type && type.indexOf('/') == -1)){ return type; }

		return type.split('/')[1];
	};

	return pictureService;
}]);
easySpa.require([
    'widget/starRating',
    'public/common/pictureController.js',
    'widget/slides'
], function() {
    app.controller("companyCtr", ["$scope", "customerService", "tableService", "pictureService", function($scope, customerService, tableService, pictureService) {
        var countryEle;
        var cityEle;
        var countryCode = "CN";
        $scope.pictureModel = {
            'edit': true,    //是否编辑状态
            'uploadShow': false,    //是否显示上传按钮图标
            'picture': [],   //图片存放地址
            'accept':'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
        };
        function getSigleDataByName(name, data) {
            var data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].name == name) {
                    return data[index];
                }
            }
        }
        function clearNextAddress(currentEle) {
            var nextEle = currentEle.next;
            if(nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNextAddress(nextEle);
        }
        /** 新建素有营业执照id数组 */
        function pictureArr(picture){
            var length = picture ? picture.length : 0;
            var ret = [];
            for(var i=0; i<length; i++){
                picture[i].picUrlID = typeof (picture[i].picUrlID) == 'object' ? picture[i].picUrlID.id : picture[i].picUrlID;
                ret.push(picture[i].picUrlID);
            }
            return ret;
        }
        /** 编辑素有营业执照id数组 */
        function pictureEdit(picture){
            var length = picture ? picture.length : 0;
            var map = {}, ret = [];
            for(var i=0; i<length; i++){
                map = {
                    'picUrlID': picture[i],
                    'delshow': false
                }
                ret.push(map);
            }
            return ret;
        }
        $scope.$on("companyEvent", function() {//接受初始化
            $scope.init();
            $scope.$apply();
        });
        $scope.initSelect = function() {
            /*初始化国家start*/
            countryEle = selectFactory({
                data: {data:[]},
                id: "country",
                isSearch: true,
                isUsePinyin: true,
                defaultText:Lang.getValByKey("common", "common_select_tips"),
                defaultCount: 11,
                pagination: true,
                closeLocalSearch: true,
                maxHeight: 170,
                onSearchValueChange:function(attachEvent, data, currentPage) {
                    data = customerService.getCountry({urlParams: {
                        pageIndex: currentPage,
                        q: data
                    }});
                    angular.forEach( data.data , function(value, key) {
                        value.name += "(" + value.figureCode + ")";
                    });
                    attachEvent.setData(data);
                },
                attrTextModel: function(name, data, currentData) {
                    $scope.country = name;
                    $scope.countryId  = currentData.figureCode;
                    $scope.city = "";
                    $scope.cityId = "";
                    var cityConfig = {
                        urlParams: {
                            countryCode: $scope.countryId,
                            q: ''
                        },
                        isAsync: true
                    };
                    $scope.figureCode = currentData.figureCode;
                    $scope.$apply();
                    clearNextAddress(countryEle);
                    var cityData = customerService.getCity(cityConfig);
                    if(!cityData.data.length) {
                        cityEle.setData({data: []});
                    } else {
                        cityEle.setData(cityData);
                    }
                }
            });
            /*初始化市区start*/
            cityEle = selectFactory({
                data: {data: []},
                id: "city",
                isSearch: true,
                pagination: true,
                closeLocalSearch: true,
                isSearch: true,
                maxHeight: 170,
                onSearchValueChange:function(attachEvent, data, currentPage) {
                    var cityData = customerService.getCity({
                        urlParams: {
                            countryCode: $scope.countryId || $scope.figureCode,
                            pageIndex: currentPage,
                            q: data
                        }
                    });
                    attachEvent.setData(cityData);
                },
                attrTextModel: function(name, data, currentData) {
                    $scope.city = name;
                    $scope.cityId = currentData.id;
                    $scope.$apply();
                }
            });
            countryEle.next = cityEle;
            /*初始化市区end*/
        }
        $scope.initStar = function() {
            /** 初始加载星级评价 */
            $('#stars').rating('update', 0);
            $('#stars').rating('refresh',
                {min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    animate: true,
                    displayOnly: false,
                    showClear: false,
                    showCaption: false
                });

            /** 获取星级评价 */
        }
        function changeRateStat(state) {
            $('#stars').rating('refresh',
                {min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    animate: true,
                    displayOnly: state,
                    showClear: false,
                    showCaption: false
                });
            /** 获取星级评价 */
            $('#stars').on('rating.change', function(event, value, caption) {
                $scope.rankInfo = $(event.target).val();
                if(!$scope.rankInfo){
                    $scope.validateRankError = true;
                }else{
                    $scope.validateRankError = false;
                };
                $scope.$apply();
            });
        }
        function bindEvent() {
            /** 营业执照预览 */
            $scope.getPictureUrl = function(fileid) {
                $('#slides').picturePreview({pictureId : fileid}, $scope.pictureModel.picture);
            };
            /** 营业执照上传 */
            $scope.getFile = function(files){
                var length = files.length;
                var picLength = $scope.pictureModel.picture.length;
                if((length + picLength) > pictureService.maxUpload){
                    $(document).promptBox({isDelay:true, contentDelay: Lang.getValByKey("supplier", 'supplier_prompt_tip_picture_one')+ pictureService.maxUpload +Lang.getValByKey("supplier", 'supplier_prompt_tip_picture_two'), type: 'errer', manualClose:true});
                    return false;
                }
                for(var i=0; i<length; i++){

                    var result = pictureService.uploadFile($scope.pictureModel, files[i]);

                    if(!result){
                        return false;
                    }
                    if(result.errorlocal){
                        $(document).promptBox({isDelay:true, contentDelay:result.errorlocal, type: 'errer', manualClose:true});
                    }else{
                        result.then(function(res){
                            if(res.data.errorCode === 0){
                                //res.data.data为图片对应的 picUrlID
                                $scope.validatePictureError = false;
                                $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);

                                $(document).promptBox({isDelay:true, contentDelay: res.data.msg, type: 'success'});
                            }else{
                                $(document).promptBox({isDelay:true, contentDelay: res.data.msg , type: 'errer', manualClose:true});
                            }
                        });
                    }
                }
            };
            $scope.cancelCustomer = function() {
                $scope.initPage(function() {
                    $scope.isEdit = true;
                    $scope.isCanEdit = false;
                    $scope.pictureModel.edit = false;
                    $scope.pictureModel.uploadShow = false;
                });
            }
            $scope.saveCompany = function() {
                var pictures = pictureArr($scope.pictureModel.picture);
                if(!pictures.length){
                    $scope.validatePictureError = true;
                }else{
                    $scope.validatePictureError = false;
                };
                if(!$scope.companyFullName){
                    $scope.companyForm.companyFullName.$setDirty();
                };
                if(!$scope.country){
                    $scope.companyForm.country.$setDirty();
                };
                if(!$scope.city){
                    $scope.companyForm.city.$setDirty();
                };
                if(!$scope.home){
                    $scope.companyForm.home.$setDirty();
                };
                if(!$scope.legalPerson){
                    $scope.companyForm.legalPerson.$setDirty();
                };
                if(!$scope.creditCode){
                    $scope.companyForm.creditCode.$setDirty();
                };
                if(!$scope.companyBank){
                    $scope.companyForm.companyBank.$setDirty();
                };
                if(!$scope.companyBankId){
                    $scope.companyForm.companyBankId.$setDirty();
                };
                if(!$scope.companyTel){
                    $scope.companyForm.companyTel.$setDirty();
                };
                if(!$scope.companyForm.$valid || $scope.validatePictureError){ //|| $scope.validateRankError == true
                    scrollToErrorView($(".tab-content"));
                    return;
                };
                customerService.submitCompany({
                    "attachFileIds": pictures,
                    "mainBusiness": $scope.mainBiz,
                    "fullName": $scope.companyFullName,
                    "locationCountryCode": $scope.figureCode,
                    "locationCityCode": $scope.cityId,
                    "webUrl": $scope.website,
                    //"evaluateLeval": $scope.rankInfo,
                    "depositBank": $scope.companyBank,
                    "bankAccountNo": $scope.companyBankId,
                    "taxCode" : $scope.creditCode,
                    "legalPerson": $scope.legalPerson,
                    "residence" : $scope.home,
                    "telNo": $scope.companyTel,
                    "refCustomerId": $scope.customerId,
                    "id": $scope.id ? $scope.id : 0
                }, function(data) {
                    if (data.errorCode != 0) {//服务器异常
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'errer',
                            manualClose: true
                        });

                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        $scope.id = data.data.id

                    }
                    $scope.creator = data.data.creator;
                    $scope.createDate = data.data.createTime;

                    $scope.isEdit = true;
                    $scope.pictureModel.edit = false;
                    $scope.pictureModel.uploadShow = false;
                    $scope.initPage();
                    //changeRateStat(true);
                });

                $scope.setSingleCustomerAuditBtn()
            }
            $scope.editCompany = function() {
                $scope.isCanEdit = false;
                $scope.isEdit = false;
                $scope.pictureModel.edit = true;
                $scope.pictureModel.uploadShow = true;
            }
            $scope.$watch('isEdit', function(newVal, oldVal){
                $scope.$parent.isEdit = newVal;
            });
        }
        $scope.initPage = function(callback) {
            $scope.validatePictureError = false;
            //清除angular表单脏值检测
            $scope.companyForm.$setPristine();
            $scope.companyForm.$setUntouched();

            customerService.getCompanyInfo({
                "costomerid": $scope.customerId
            }, function(res) {
                var data = res.data;
                if(data) {
                    $scope.id = data.id;
                    $scope.isEdit = true;
                    $scope.companyFullName = data.fullName;
                    $scope.country = data.locationCountryName;
                    $scope.city = data.locationCityName;
                    $scope.figureCode = data.locationCountryCode;
                    $scope.cityId = data.locationCityCode;
                    $scope.home = data.residence;
                    $scope.legalPerson = data.legalPerson;
                    $scope.creditCode = data.taxCode;
                    $scope.companyBank = data.depositBank;
                    $scope.companyBankId = data.bankAccountNo;
                    $scope.companyTel = data.telNo;
                    $scope.website = data.webUrl;
                    $scope.mainBiz = data.mainBusiness;
                    //$scope.rankInfo = data.evaluateLeval;
                    $scope.pictureModel.edit = false;
                    $scope.pictureModel.uploadShow = false;
                    $scope.pictureModel.picture = pictureEdit(data.files);
                    $scope.creator = data.creator;
                    $scope.createDate = data.createTime;
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
                    if(callback) {
                        callback
                    }
                    //$('#stars').rating('update', parseInt($scope.rankInfo));
                    //changeRateStat(true);
                } else {
                    $scope.id = 0;
                    $scope.isEdit = false;
                    $scope.companyFullName = "";
                    $scope.country = "";
                    $scope.city = "";
                    $scope.figureCode = "";
                    $scope.cityId = "";
                    $scope.home = "";
                    $scope.legalPerson = "";
                    $scope.creditCode = "";
                    $scope.companyBank = "";
                    $scope.companyBankId = "";
                    $scope.companyTel = "";
                    $scope.website = "";
                    $scope.mainBiz = "";
                    //$scope.rankInfo = "";
                    $scope.pictureModel.edit = true;
                    $scope.pictureModel.uploadShow = true;
                    $scope.pictureModel.picture = pictureEdit([]);
                    $scope.pictureModel = pictureService.init($scope.pictureModel);
                    $('#stars').rating('update', 0);
                    //changeRateStat(false);
                }
            });
        }
        $scope.init = function() {
            $scope.isEdit = false;
            $scope.initSelect();
            //$scope.initStar();
            $scope.initPage();
            bindEvent();
        }
    }]);
})
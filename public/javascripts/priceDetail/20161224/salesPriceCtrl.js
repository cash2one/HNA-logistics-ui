var controller = {
    $scope: null,
    service: null,
    initViewButton: function($scope) {//配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            submit:true,
            submitDisabled:true,
            isSalesPrice:true
        });
    },
    init: function($scope, service) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;

        this.scopeEvent();
    },
    scopeEvent: function(){
        var _this = this;
        var $scope = _this.$scope, service = _this.service;

        /**
         * 价格复制
         */
        $scope.infoCopy = function(){
            $scope.getInfo();
            //修改价格方案名称
            $scope.iPriceName = $scope.iInputPriceName = $scope.iInputPriceName + Lang.getValByKey("priceDetail", "priceDetail_code_priceCopy");

            var id = 0;

            $scope.copyPriceDetailList = [];

            for(var m=0,len=$scope.serviceTypeList.length; m<len; m++){
                $scope.copyPriceDetailList[m] = [];

                var sets = $scope.serviceTypeList[m].sets || [];
                for(var n=0,l=sets.length; n<l; n++){
                    id = sets[n].id ?  sets[n].id : 0;
                    $scope.copyPriceDetailList[m][n] = $scope.getOnePriceDetails(id);
                    // //调整价格
                    angular.forEach($scope.copyPriceDetailList[m][n].freightItems, function(value, key){
                        if(value.price === -1){
                            $scope.copyPriceDetailList[m][n].freightItems[key].price = '';
                        }else{
                            var price = value.price == -1 ? 0 :  value.price;
                            if($scope.urlData.adjustTypeId == 1){    //上调
                                if($scope.urlData.adjustUnitId == 1){    //百分比
                                    price = parseFloat(price) + parseFloat(price*($scope.urlData.adjustVal/100));
                                }else if($scope.urlData.adjustUnitId == 2){    //金额
                                    price = parseFloat(price) + parseFloat($scope.urlData.adjustVal);
                                }
                            }else if($scope.urlData.adjustTypeId == 2){    //下调
                                if($scope.urlData.adjustUnitId == 1){    //百分比
                                    price = parseFloat(price) - parseFloat(price*($scope.urlData.adjustVal/100));
                                }else if($scope.urlData.adjustUnitId == 2){    //金额
                                    price = parseFloat(price) - parseFloat($scope.urlData.adjustVal);
                                }
                            }
                            price = price >= 0 ? price : 0;
                            $scope.copyPriceDetailList[m][n].freightItems[key].price = parseFloat(price.toFixed(3));
                        }
                    });

                    sets[n].id = '';
                }
            }
            $scope.savePriceDetailCache = [];
            $.extend(true, $scope.savePriceDetailCache, $scope.copyPriceDetailList);


            for (var m = 0, ml = $scope.savePriceDetailCache.length; m < ml; m++) {
                for (var n = 0, nl = $scope.savePriceDetailCache[m].length; n < nl; n++) {
                    $scope.savePriceDetailCache[m][n].id = null;    // 复制id设为空。
                }
            }
        };

        /**
         * 子Controller初始化
         */
        $scope.childInit = function(){
            if($scope.uid){
                $scope.getInfo();

                //设置viewButton按钮状态
                if($scope.status == 1){    //草稿状态
                    $scope.isHidenEditBtn = false;    //编辑按钮显示
                    $scope.viewButton.submitDisabled = false;    //草稿状态，可进行提交审核操作
                    $scope.viewButton.isShowCancelBtn = true;    //显示取消按钮
                }else{
                    $scope.isHidenEditBtn = true;    //编辑按钮隐藏
                }
            }else{
                if($scope.parameter.data){    //复制价格
                    $scope.urlData = JSON.parse(decodeURIComponent($scope.parameter.data));
                    $scope.uid = $scope.urlData.uid;

                    $scope.viewButton.isCopy = true;
                    $scope.infoCopy();    //复制
                    $scope.uid = 0;

                    if($scope.urlData.priceType == 2){    //从销售价复制为销售价
                        $scope.viewButton.isSalesPrice = true;
                    }else{    //从销售价复制为成本价
                        $scope.viewButton.isSalesPrice = false;
                        $scope.iInputServices = $scope.iInputServicesValue = '';   //置空服务
                    }
                }

                $scope.title = Lang.getValByKey("priceDetail", "priceDetail_code_addPriceMethod");
            }
        };
        $scope.childInit();

        /**
         * 提交审核
         */
        $scope.submitAudit = function(){
            $(document).promptBox({
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: Lang.getValByKey("priceDetail", "priceDetail_code_priceAddConfirm")
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                        operationEvent: function (){
                            $(document).promptBox('closePrompt');

                            var config = {
                                'urlParams':[$scope.uid]
                            };

                            service.audit(config, function(res){
                                if(res.errorCode === 0){
                                    $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});

                                    $scope.isHidenEditBtn = true;
                                    $scope.viewButton.submitDisabled = true;

                                    //提交审核之后进行跳转
                                    setTimeout(function(){$scope.goBack()}, $scope.jumpTime);
                                }else{
                                    $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                                }
                            });
                        }
                    }
                ]
            });
        };
    }
};
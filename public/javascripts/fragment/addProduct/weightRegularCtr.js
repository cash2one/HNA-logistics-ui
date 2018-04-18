app.controller('weightRegularCtr', [
    '$scope',
    'addProductService',
    function ($scope, addProductService) {
        $scope.$on('weightRegularEvent', function () {
            // 接受初始化
            $scope.isEdit = false;
            $scope.init();
            $scope.$apply();
        });

        $scope.editWeightInfo = function () {
            $scope.isEdit = true;
            $scope.$parent.isEdit = true;
            sessionStorage.setItem('isEdit', 1);
            $scope.canEditWeight = false;
        };

        function reSetWeightDataFromDataBase() {
            $scope.data.remarkVolume = $scope.dataOld.remarkVolume;
            $scope.data.valueMode = $scope.dataOld.valueMode;
            $scope.data.valueModeCode = $scope.dataOld.valueModeCode;
            $scope.data.volumeFactor = $scope.dataOld.volumeFactor;
        }

        $scope.cancel = function () {
            $scope.isEdit = false;
            $scope.$parent.isEdit = false;
            sessionStorage.setItem('isEdit', '');
            $scope.canEditWeight = true;
            reSetWeightDataFromDataBase();
            $scope.showVolumeDetail = $scope.dataOld.remarkVolume == 'true';
        };

        $scope.SetIsConsiderVolume = function () {
            if ($scope.data.remarkVolume == 'false') {
                $scope.showVolumeDetail = false;
            } else {
                $scope.showVolumeDetail = true;
                if($scope.dataOld.valueModeCode){
                    $scope.data.valueMode = $scope.dataOld.valueMode;
                    $scope.data.valueModeCode = $scope.dataOld.valueModeCode;
                }else {
                    $scope.data.valueMode = '实重和体积重取最大';
                    $scope.data.valueModeCode = 'max';
                }
                $scope.data.volumeFactor = $scope.dataOld.volumeFactor;
            }
            $scope.weightRegularForm.$setPristine();
        };

        function initSelect() {
            var data = addProductService.getWeightValueMode();

            var weightValueMode = selectFactory({
                data: data,
                id: 'type-select-input',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                attrTextModel: function (name, data, currentItem) {
                    if (!name) {
                        $scope.data.valueMode = '';
                        $scope.data.valueModeCode = '';
                    } else {
                        $scope.data.valueModeCode = currentItem.code; // 给后台
                        $scope.data.valueMode = name;
                        $scope.weightRegularForm.valueMode.$setPristine();
                    }

                    $scope.$apply();
                },
            });
        }

        function getWeightData() {
            $scope.data = {
                remarkVolume: 'false',
                // remarkVolumeOld:'false',
                volumeFactor: '',
                valueMode: '',
                valueModeCode: '',
            };

            $scope.showVolumeDetail = false;

            addProductService.getWeightRule($scope.id, function (data) {
                var weight = data.data;

                if (weight.isVolume) {
                    $scope.data.remarkVolume = 'true';
                    $scope.data.volumeFactor = weight.volumeFactor;

                    $scope.data.valueModeCode = weight.weightValueTye;
                    if (weight.weightValueTye == 'max') {
                        $scope.data.valueMode = '实重和体积重取最大';
                    } else {
                        $scope.data.valueMode = '实重和体积重取最小';
                    }

                    $scope.showVolumeDetail = true;
                }

                // addProductService.getProductAllInfo($scope.id,function (data) {
                //
                //     var weight = data.data;
                //
                //     if (weight.isVolume) {
                //
                //         $scope.data.remarkVolume = 'true';
                //         // $scope.data.remarkVolumeOld = 'true';
                //         $scope.data.volumeFactor = weight.volumeFactor;
                //
                //         $scope.data.valueModeCode = weight.weightValueTye;
                //         if(weight.weightValueTye == 'max' ) {
                //             $scope.data.valueMode = "实重和体积重取最大";
                //         } else {
                //             $scope.data.valueMode = "实重和体积重取最小";
                //         }
                //
                //         $scope.showVolumeDetail = true;
                //     }

                $scope.dataOld = $.extend(true, $scope.dataOld, $scope.data);

                $scope.$apply();
                $scope.weightRegularForm.volumeFactor.$setPristine();
            });

            SetRemarkVolume();
        }

        $scope.init = function () {
            initSelect();
            getWeightData();
            var backId = sessionStorage.getItem('backPricePath');
            if (backId) {
                $scope.canEditWeight = false;
            } else {
                if ($scope.isAudit) {
                    if ($scope.IsDraftStatus || $scope.isOffline) {
                        $scope.canEditWeight = true;
                    }
                } else {
                    if ($scope.IsDraftStatus) {
                        $scope.canEditWeight = true;
                    }
                }
            }
        };

        function SetRemarkVolume() {
            if ($scope.data.remarkVolume == 'true') {
                $scope.isremarkVolume = '是';
            } else {
                $scope.isremarkVolume = '否';
            }
        }

        function summitForm(inputdata, summitFunc) {
            summitFunc(inputdata, function (data) {
                if (data.errorCode != 0) {
                    // 服务器异常
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                } else {
                    // 保存成功后重新获取一次

                    getWeightData();
                    $scope.$parent.isEdit = false;
                    // $scope.closePrompt();
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: data.msg, // Lang.getValByKey("rate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000,
                    });
                }
            });
        }
        function checkBeforeSave() {
            if (!$scope.data.volumeFactor) {
                $scope.weightRegularForm.volumeFactor.$setDirty();
            }

            if (!$scope.data.valueMode) {
                $scope.weightRegularForm.valueMode.$setDirty();
            }

            return !!$scope.weightRegularForm.$valid;
        }

        $scope.saveDraft = function () {

            if ($scope.data.remarkVolume == 'true' && !checkBeforeSave()) {
                return;
            }

            var data = {
                urlParams: {
                    isVolume: $scope.data.remarkVolume == 'true',
                    volumeFactor: $scope.data.volumeFactor,
                    weightValueTye: $scope.data.valueModeCode,
                },
                seatParams: {
                    uid: $scope.uid,
                },
            };

            $scope.isEdit = false;
            sessionStorage.setItem('isEdit', '');
            $scope.canEditWeight = true;

            summitForm(data, addProductService.addProductServiceWeight);
        };
    },
]);

window.onbeforeunload = function () {
    sessionStorage.setItem('isEdit', '');
};